const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  batch:    { type: String, required: true },
  strength: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Class', classSchema);
