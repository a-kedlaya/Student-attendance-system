const express = require('express');
const db = require('../db');
const router = express.Router();

// POST /api/teachers/signup
router.post('/signup', async (req, res) => {
  const { name, email, department, password, subjects } = req.body;

  if (!name || !email || !department || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    // Check if email already exists
    const [existing] = await conn.query('SELECT TeacherID FROM teacher WHERE Email = ?', [email]);

    if (existing.length > 0) {
      await conn.rollback();
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Insert new teacher
    const [result] = await conn.query(
      'INSERT INTO teacher (Name, Email, Department, Password) VALUES (?, ?, ?, ?)',
      [name, email, department, password]
    );

    const teacherId = result.insertId;

    // If subjects are provided, assign them to the teacher
    if (subjects && Array.isArray(subjects) && subjects.length > 0) {
      for (const subject of subjects) {
        // Find the course and class for this subject
        const [courses] = await conn.query(
          `SELECT c.CourseID, cl.ClassID 
           FROM course c
           JOIN class cl ON c.CourseID = cl.CourseID
           WHERE c.CourseName = ? AND c.BranchCode = ? AND c.Year = ?
           LIMIT 1`,
          [subject.name, department, subject.year]
        );

        if (courses.length > 0) {
          // Insert into teaches table
          await conn.query(
            'INSERT INTO teaches (TeacherID, ClassID) VALUES (?, ?)',
            [teacherId, courses[0].ClassID]
          );
        }
      }
    }

    await conn.commit();

    res.json({
      success: true,
      message: 'Registration successful',
      teacherId: teacherId,
      subjectsAssigned: subjects ? subjects.length : 0
    });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
});

// POST /api/teachers/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const [rows] = await db.query(
      'SELECT TeacherID, Name, Department, Email FROM teacher WHERE Email = ? AND Password = ?',
      [email, password]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const teacher = rows[0];
    res.json({
      success: true,
      teacher: {
        id: teacher.TeacherID,
        name: teacher.Name,
        department: teacher.Department,
        email: teacher.Email
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all teachers
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT TeacherID, Name, Department, Email FROM teacher ORDER BY Name');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET classes (subjects) for a teacher (classes they teach)
// /api/teachers/:id/classes
router.get('/:id/classes', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const [rows] = await db.query(
      `SELECT c.ClassID, cr.CourseName, cr.BranchCode, cr.Year, c.CalendarYear, c.YearLevel
       FROM teaches te
       JOIN class c ON te.ClassID = c.ClassID
       JOIN course cr ON cr.CourseID = c.CourseID
       WHERE te.TeacherID = ?`,
      [id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
