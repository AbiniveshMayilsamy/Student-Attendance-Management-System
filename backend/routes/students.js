const router = require('express').Router();
const Student = require('../models/Student');
const { protect, allow } = require('../middleware/auth');

router.use(protect);

router.get('/', async (req, res) => {
  try {
    const students = await Student.find().populate('classId', 'name batch');
    res.json(students);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate('classId', 'name batch');
    if (!student) return res.status(404).json({ message: 'Not found' });
    res.json(student);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', allow('admin'), async (req, res) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json(student);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.put('/:id', allow('admin'), async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(student);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/:id', allow('admin'), async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
