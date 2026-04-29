const router = require('express').Router();
const Class = require('../models/Class');
const { protect, allow } = require('../middleware/auth');

router.use(protect);

router.get('/', async (req, res) => {
  try { res.json(await Class.find()); }
  catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', allow('admin'), async (req, res) => {
  try { res.status(201).json(await Class.create(req.body)); }
  catch (err) { res.status(400).json({ message: err.message }); }
});

router.put('/:id', allow('admin'), async (req, res) => {
  try { res.json(await Class.findByIdAndUpdate(req.params.id, req.body, { new: true })); }
  catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/:id', allow('admin'), async (req, res) => {
  try { await Class.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); }
  catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
