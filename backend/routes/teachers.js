const router = require('express').Router();
const Teacher = require('../models/Teacher');
const { protect, allow } = require('../middleware/auth');

router.use(protect);

router.get('/', async (req, res) => {
  try {
    const teachers = await Teacher.find().populate('subjects', 'name').populate('classes', 'name');
    res.json(teachers);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', allow('admin'), async (req, res) => {
  try {
    const teacher = await Teacher.create(req.body);
    res.status(201).json(teacher);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.put('/:id', allow('admin'), async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(teacher);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/:id', allow('admin'), async (req, res) => {
  try {
    await Teacher.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
