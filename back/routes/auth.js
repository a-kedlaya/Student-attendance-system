const express = require('express');
const db = require('../db');
const router = express.Router();

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

module.exports = router;
