const express = require('express');
const db = require('../db');
const router = express.Router(); // ✅ THIS LINE IS REQUIRED
module.exports=router;
// ✅ Subjects by branch/year
// ✅ Get all branches (for dropdowns)
router.get("/branches", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT BranchCode, BranchName FROM branch");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching branches:", err);
    res.status(500).json({ error: err.message });
  }
});


router.get('/subjects', async (req, res) => {
  const { branch, year } = req.query;
  try {
    const [rows] = await db.query(
      `SELECT DISTINCT CourseName 
       FROM course 
       WHERE BranchCode = ? AND Year = ?`,
      [branch, year]
    );
    res.json(rows);
  } catch (err) {
    console.error('Error fetching subjects:', err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Student Attendance Summary (filtered)
router.get('/student_attendance_summary', async (req, res) => {
  const { branch, year, subject } = req.query;
  try {
    const [rows] = await db.query(`
  SELECT s.Name AS StudentName, c.CourseName,
         SUM(CASE WHEN UPPER(TRIM(a.Status)) = 'P' THEN 1 ELSE 0 END) AS PresentDays,
         COUNT(a.AttendanceID) AS TotalDays,
         ROUND((SUM(CASE WHEN UPPER(TRIM(a.Status)) = 'P' THEN 1 ELSE 0 END)/NULLIF(COUNT(a.AttendanceID),0))*100,2) AS AttendancePercent
  FROM attendance a
  JOIN student s ON a.StudentID = s.StudentID
  JOIN class cl ON a.ClassID = cl.ClassID
  JOIN course c ON cl.CourseID = c.CourseID
  WHERE s.BranchCode = ? AND s.Year = ? AND c.CourseName = ?
  GROUP BY s.StudentID, c.CourseName
`, [branch, year, subject]);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching attendance summary:', err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Teacher Load (selected branch)
router.get('/teacher_load', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        t.TeacherID,
        t.Name AS TeacherName,
        t.Department,
        t.Email,
        c.CourseName AS Subject,
        c.BranchCode,
        c.Year
      FROM teaches th
      JOIN teacher t ON th.TeacherID = t.TeacherID
      JOIN class cl ON th.ClassID = cl.ClassID
      JOIN course c ON cl.CourseID = c.CourseID
      ORDER BY t.Department, t.Name;
    `);
    
    res.json(rows);
  } catch (err) {
    console.error('Error fetching teacher load:', err);
    res.status(500).json({ error: err.message });
  }
});


module.exports=router;