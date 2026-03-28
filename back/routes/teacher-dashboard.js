const express = require('express');
const db = require('../db');
const router = express.Router();

// GET teacher's subjects/classes
// /api/teacher-dashboard/:teacherId/my-classes
router.get('/:teacherId/my-classes', async (req, res) => {
    const teacherId = parseInt(req.params.teacherId);
    try {
        const [rows] = await db.query(
            `SELECT 
        cl.ClassID,
        c.CourseID,
        c.CourseName,
        c.BranchCode,
        c.Year,
        cl.CalendarYear,
        b.BranchName
       FROM teaches te
       JOIN class cl ON te.ClassID = cl.ClassID
       JOIN course c ON cl.CourseID = c.CourseID
       JOIN branch b ON c.BranchCode = b.BranchCode
       WHERE te.TeacherID = ?
       ORDER BY c.Year, c.CourseName`,
            [teacherId]
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET students in teacher's department and year levels they teach
// /api/teacher-dashboard/:teacherId/my-students
router.get('/:teacherId/my-students', async (req, res) => {
    const teacherId = parseInt(req.params.teacherId);
    try {
        const [rows] = await db.query(
            `SELECT DISTINCT 
        s.StudentID,
        s.Name,
        s.RollNo,
        s.BranchCode,
        s.Year
       FROM student s
       WHERE s.BranchCode = (SELECT Department FROM teacher WHERE TeacherID = ?)
       AND s.Year IN (
         SELECT DISTINCT c.Year 
         FROM teaches te
         JOIN class cl ON te.ClassID = cl.ClassID
         JOIN course c ON cl.CourseID = c.CourseID
         WHERE te.TeacherID = ?
       )
       ORDER BY s.Year, s.RollNo`,
            [teacherId, teacherId]
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET attendance history for a specific class taught by teacher
// /api/teacher-dashboard/:teacherId/class/:classId/attendance-history
router.get('/:teacherId/class/:classId/attendance-history', async (req, res) => {
    const teacherId = parseInt(req.params.teacherId);
    const classId = parseInt(req.params.classId);

    try {
        // Verify teacher teaches this class
        const [verify] = await db.query(
            'SELECT * FROM teaches WHERE TeacherID = ? AND ClassID = ?',
            [teacherId, classId]
        );

        if (verify.length === 0) {
            return res.status(403).json({ error: 'Access denied' });
        }

        // Get attendance records with teacher name
        // Check if TeacherID column exists
        const [columns] = await db.query(
            `SHOW COLUMNS FROM attendance LIKE 'TeacherID'`
        );

        let query;
        if (columns.length > 0) {
            // TeacherID column exists
            query = `SELECT 
                DATE_FORMAT(a.Date, '%Y-%m-%d') as Date,
                s.StudentID,
                s.Name,
                s.RollNo,
                a.Status,
                t.Name as TeacherName
            FROM attendance a
            JOIN student s ON a.StudentID = s.StudentID
            LEFT JOIN teacher t ON a.TeacherID = t.TeacherID
            WHERE a.ClassID = ?
            ORDER BY a.Date DESC, s.RollNo`;
        } else {
            // TeacherID column doesn't exist yet
            query = `SELECT 
                DATE_FORMAT(a.Date, '%Y-%m-%d') as Date,
                s.StudentID,
                s.Name,
                s.RollNo,
                a.Status,
                'Not Recorded' as TeacherName
            FROM attendance a
            JOIN student s ON a.StudentID = s.StudentID
            WHERE a.ClassID = ?
            ORDER BY a.Date DESC, s.RollNo`;
        }

        const [rows] = await db.query(query, [classId]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET attendance summary for teacher's classes
// /api/teacher-dashboard/:teacherId/attendance-summary
router.get('/:teacherId/attendance-summary', async (req, res) => {
    const teacherId = parseInt(req.params.teacherId);
    const classId = req.query.classId;

    try {
        let query = `
      SELECT 
        s.StudentID,
        s.Name,
        s.RollNo,
        c.CourseName,
        SUM(CASE WHEN a.Status = 'P' THEN 1 ELSE 0 END) AS PresentDays,
        COUNT(a.AttendanceID) AS TotalDays,
        ROUND(100 * SUM(CASE WHEN a.Status = 'P' THEN 1 ELSE 0 END) / NULLIF(COUNT(a.AttendanceID), 0), 2) AS AttendancePercent
      FROM attendance a
      JOIN student s ON a.StudentID = s.StudentID
      JOIN class cl ON a.ClassID = cl.ClassID
      JOIN course c ON cl.CourseID = c.CourseID
      WHERE cl.ClassID IN (
        SELECT ClassID FROM teaches WHERE TeacherID = ?
      )`;

        const params = [teacherId];

        if (classId) {
            query += ' AND cl.ClassID = ?';
            params.push(classId);
        }

        query += ' GROUP BY s.StudentID, c.CourseName ORDER BY s.RollNo';

        const [rows] = await db.query(query, params);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE student (only if in teacher's department)
// DELETE /api/teacher-dashboard/:teacherId/student/:studentId
router.delete('/:teacherId/student/:studentId', async (req, res) => {
    const teacherId = parseInt(req.params.teacherId);
    const studentId = parseInt(req.params.studentId);

    try {
        // Verify student is in teacher's department
        const [verify] = await db.query(
            `SELECT s.StudentID 
       FROM student s
       JOIN teacher t ON s.BranchCode = t.Department
       WHERE s.StudentID = ? AND t.TeacherID = ?`,
            [studentId, teacherId]
        );

        if (verify.length === 0) {
            return res.status(403).json({ error: 'Cannot delete student from another department' });
        }

        // Delete student (cascade will handle attendance records if configured)
        await db.query('DELETE FROM attendance WHERE StudentID = ?', [studentId]);
        await db.query('DELETE FROM student WHERE StudentID = ?', [studentId]);

        res.json({ success: true, message: 'Student deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST add student (only to teacher's department)
// POST /api/teacher-dashboard/:teacherId/student
router.post('/:teacherId/student', async (req, res) => {
    const teacherId = parseInt(req.params.teacherId);
    const { Name, RollNo, Year } = req.body;

    try {
        // Get teacher's department
        const [[teacher]] = await db.query(
            'SELECT Department FROM teacher WHERE TeacherID = ?',
            [teacherId]
        );

        if (!teacher) {
            return res.status(404).json({ error: 'Teacher not found' });
        }

        // Insert student with teacher's department
        const [result] = await db.query(
            'INSERT INTO student (Name, RollNo, BranchCode, Year) VALUES (?, ?, ?, ?)',
            [Name, RollNo, teacher.Department, Year]
        );

        res.json({
            success: true,
            studentId: result.insertId,
            message: 'Student added successfully'
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
