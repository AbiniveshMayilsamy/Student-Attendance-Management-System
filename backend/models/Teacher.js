const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true },
  phone:    { type: String },
  subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }],
  classes:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }],
  userId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Teacher', teacherSchema);
