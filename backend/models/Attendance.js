const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  classId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Class',   required: true },
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
  date:      { type: String, required: true }, // 'YYYY-MM-DD'
  status:    { type: String, enum: ['present', 'absent', 'late'], required: true },
}, { timestamps: true });

attendanceSchema.index({ studentId: 1, date: 1, subjectId: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
