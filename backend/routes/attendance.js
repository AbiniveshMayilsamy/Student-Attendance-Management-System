const router = require('express').Router();
const Attendance = require('../models/Attendance');
const { protect, allow } = require('../middleware/auth');

router.use(protect);

// GET /api/attendance?classId=&date=&subjectId=&studentId=&from=&to=
router.get('/', async (req, res) => {
  try {
    const { classId, date, subjectId, studentId, from, to } = req.query;
    const filter = {};
    if (classId)   filter.classId   = classId;
    if (subjectId) filter.subjectId = subjectId;
    if (studentId) filter.studentId = studentId;
    if (date)      filter.date      = date;
    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = from;
      if (to)   filter.date.$lte = to;
    }
    const records = await Attendance.find(filter)
      .populate('studentId', 'name rollNo')
      .populate('classId',   'name')
      .populate('subjectId', 'name')
      .sort({ date: -1 });
    res.json(records);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/attendance/bulk  — save entire class attendance for a date
router.post('/bulk', allow('admin', 'teacher'), async (req, res) => {
  try {
    const { records } = req.body; // [{ studentId, classId, subjectId, date, status }]
    const ops = records.map(r => ({
      updateOne: {
        filter: { studentId: r.studentId, date: r.date, subjectId: r.subjectId },
        update: { $set: r },
        upsert: true,
      },
    }));
    await Attendance.bulkWrite(ops);
    res.json({ message: 'Saved', count: records.length });
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.put('/:id', allow('admin', 'teacher'), async (req, res) => {
  try { res.json(await Attendance.findByIdAndUpdate(req.params.id, req.body, { new: true })); }
  catch (err) { res.status(400).json({ message: err.message }); }
});

module.exports = router;
