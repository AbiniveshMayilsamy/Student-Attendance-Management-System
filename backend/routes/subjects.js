const router = require('express').Router();
const Subject = require('../models/Subject');
const { protect, allow } = require('../middleware/auth');

router.use(protect);

router.get('/', async (req, res) => {
  try {
    const subjects = await Subject.find().populate('classId', 'name').populate('teacherId', 'name');
    res.json(subjects);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', allow('admin'), async (req, res) => {
  try { res.status(201).json(await Subject.create(req.body)); }
  catch (err) { res.status(400).json({ message: err.message }); }
});

router.put('/:id', allow('admin'), async (req, res) => {
  try { res.json(await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true })); }
  catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/:id', allow('admin'), async (req, res) => {
  try { await Subject.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); }
  catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
