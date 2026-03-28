const express = require('express');
const db = require('../db');
const router = express.Router();

/**
 * POST /api/attendance/mark
 * body: { teacherId, classId, date: "YYYY-MM-DD", records: [{studentId, status}, ...] }
 * Enforces teacher can only mark attendance for classes they teach.
 */
router.post('/mark', async (req, res) => {
  const { teacherId, classId, date, records } = req.body;
  if (!teacherId || !classId || !date || !Array.isArray(records)) {
    return res.status(400).json({ error: 'Invalid payload' });
  }
  const conn = await db.getConnection();
  try {
    // verify teacher teaches this class
    const [verify] = await conn.query('SELECT * FROM teaches WHERE TeacherID = ? AND ClassID = ?', [teacherId, classId]);
    if (verify.length === 0) {
      return res.status(403).json({ error: 'Teacher not allowed to mark this class' });
    }
    // Check if TeacherID column exists
    const [columns] = await conn.query(`SHOW COLUMNS FROM attendance LIKE 'TeacherID'`);
    const hasTeacherColumn = columns.length > 0;

    await conn.beginTransaction();
    // insert or update each attendance (unique constraint prevents duplicates)
    for (const r of records) {
      let { studentId, status } = r;
      status = (status || '').toString().trim().replace(/['"\r\n\s]/g, '').toUpperCase();

      console.log('status received', status);

      if (hasTeacherColumn) {
        await conn.query(
          `INSERT INTO attendance (StudentID, ClassID, Date, Status, TeacherID)
           VALUES (?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE Status = VALUES(Status), TeacherID = VALUES(TeacherID)`,
          [studentId, classId, date, status, teacherId]
        );
      } else {
        await conn.query(
          `INSERT INTO attendance (StudentID, ClassID, Date, Status)
           VALUES (?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE Status = VALUES(Status)`,
          [studentId, classId, date, status]
        );
      }
    }
    await conn.commit();
    res.json({ success: true });
  } catch (err) {

    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
});

// GET students for a class (so teacher can load student list)
// /api/attendance/class/:classId/students
router.get('/class/:classId/students', async (req, res) => {
  const classId = parseInt(req.params.classId);
  try {
    // need course -> branch + yearlevel to filter students
    const [[c]] = await db.query(
      `SELECT c.ClassID, cr.BranchCode, cr.Year
       FROM class c JOIN course cr ON c.CourseID = cr.CourseID WHERE c.ClassID = ?`,
      [classId]
    );
    if (!c) return res.status(404).json({ error: 'Class not found' });
    const [students] = await db.query(
      'SELECT StudentID, Name, RollNo FROM student WHERE BranchCode = ? AND Year = ? ORDER BY RollNo',
      [c.BranchCode, c.Year]
    );
    res.json({ classInfo: c, students });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET attendance summary for branch & year (for dashboard)
// /api/attendance/summary?branch=CSE&year=2
router.get('/summary', async (req, res) => {
  const branch = req.query.branch;
  const year = parseInt(req.query.year);
  try {
    const [rows] = await db.query(
      `SELECT s.StudentID, s.Name AS StudentName,
         SUM(CASE WHEN a.Status='P' THEN 1 ELSE 0 END) AS PresentDays,
         COUNT(a.AttendanceID) AS TotalDays,
         ROUND(100 * SUM(CASE WHEN a.Status='P' THEN 1 ELSE 0 END)/NULLIF(COUNT(a.AttendanceID),0),2) AS AttendancePercent
       FROM student s
       LEFT JOIN attendance a ON a.StudentID = s.StudentID
       WHERE s.BranchCode = ? AND s.Year = ?
       GROUP BY s.RollNo,s.StudentID, s.Name`
      ,
      [branch, year]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
