const mongoose = require('mongoose');

const IntakeEntrySchema = new mongoose.Schema({
  userId: { type: String, required: true },
  date: { type: String, required: true }, // format: YYYY-MM-DD
  weight: Number,
  bmi: Number,
  bodyFat: {
    value: Number,
    estimated: Boolean,
  }
});

module.exports = mongoose.model('IntakeEntry', IntakeEntrySchema);
