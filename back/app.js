const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const studentsRouter = require('./routes/students');
const teachersRouter = require('./routes/teachers');
const attendanceRouter = require('./routes/attendance');
const viewsRouter = require('./routes/views');
const teacherDashboardRouter = require('./routes/teacher-dashboard');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api/students', studentsRouter);
app.use('/api/teachers', teachersRouter);
app.use('/api/attendance', attendanceRouter);
app.use('/api/views', viewsRouter);
app.use('/api/teacher-dashboard', teacherDashboardRouter);

app.get('/', (req, res) => res.json({ server: 'running' }));

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server started on ${port}`));
