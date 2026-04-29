const router = require('express').Router();
const Settings = require('../models/Settings');
const { protect, allow } = require('../middleware/auth');

router.use(protect);

router.get('/', async (req, res) => {
  try {
    let s = await Settings.findOne();
    if (!s) s = await Settings.create({});
    res.json(s);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/', allow('admin'), async (req, res) => {
  try {
    let s = await Settings.findOne();
    if (!s) s = new Settings();
    Object.assign(s, req.body);
    await s.save();
    res.json(s);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

module.exports = router;
