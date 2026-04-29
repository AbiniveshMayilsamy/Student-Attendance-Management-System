const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  schoolName:              { type: String, default: 'Greenwood High School' },
  academicYear:            { type: String, default: '2024-25' },
  lowAttendanceThreshold:  { type: Number, default: 75 },
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
