const express = require('express');
const db = require('../db');
const router = express.Router();

// GET all branches
router.get('/branches', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM branch ORDER BY BranchCode');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ... other routes (students list, add student, etc.)


// GET students by branch & year (year optional)
// e.g. /api/students?branch=CSE&year=2
router.get('/', async (req, res) => {
  const branch = req.query.branch;
  const year = req.query.year;
  try {
    let sql = 'SELECT StudentID, Name, RollNo, BranchCode, Year FROM student';
    const params = [];
    if (branch && year) {
      sql += ' WHERE BranchCode = ? AND Year = ?';
      params.push(branch, year);
    } else if (branch) {
      sql += ' WHERE BranchCode = ?';
      params.push(branch);
    } else if (year) {
      sql += ' WHERE Year = ?';
      params.push(year);
    }
    sql += ' ORDER BY Year, RollNo';
    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST add student
router.post('/', async (req, res) => {
  const { Name, RollNo, BranchCode, Year } = req.body;
  try {
    const [r] = await db.query(
      'INSERT INTO student (Name, RollNo, BranchCode, Year) VALUES (?,?,?,?)',
      [Name, RollNo, BranchCode, Year]
    );
    res.json({ insertedId: r.insertId });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST student login
router.post('/login', async (req, res) => {
  const { name, rollNo } = req.body;

  if (!name || !rollNo) {
    return res.status(400).json({ error: 'Name and roll number are required' });
  }

  try {
    const [rows] = await db.query(
      'SELECT StudentID, Name, RollNo, BranchCode, Year FROM student WHERE Name = ? AND RollNo = ?',
      [name, rollNo]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid name or roll number' });
    }

    const student = rows[0];
    res.json({
      success: true,
      student: {
        id: student.StudentID,
        name: student.Name,
        rollNo: student.RollNo,
        branch: student.BranchCode,
        year: student.Year
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET student attendance summary
// /api/students/:id/attendance
router.get('/:id/attendance', async (req, res) => {
  const studentId = parseInt(req.params.id);

  try {
    const [rows] = await db.query(
      `SELECT 
        c.CourseName,
        SUM(CASE WHEN a.Status = 'P' THEN 1 ELSE 0 END) AS PresentDays,
        COUNT(a.AttendanceID) AS TotalDays,
        ROUND(100 * SUM(CASE WHEN a.Status = 'P' THEN 1 ELSE 0 END) / NULLIF(COUNT(a.AttendanceID), 0), 2) AS AttendancePercent
      FROM attendance a
      JOIN class cl ON a.ClassID = cl.ClassID
      JOIN course c ON cl.CourseID = c.CourseID
      WHERE a.StudentID = ?
      GROUP BY c.CourseName
      ORDER BY c.CourseName`,
      [studentId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
