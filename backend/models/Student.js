const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name:    { type: String, required: true },
  rollNo:  { type: String, required: true, unique: true },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  email:   { type: String },
  phone:   { type: String },
  userId:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
