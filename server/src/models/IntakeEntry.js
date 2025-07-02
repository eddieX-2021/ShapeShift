// server/src/models/IntakeEntry.js
const mongoose = require('mongoose');

const BodyFatSchema = new mongoose.Schema({
  method: { type: String, required: true, enum: ['manual','navy'] },
  value:  { type: Number, required: true }
});

const IntakeEntrySchema = new mongoose.Schema({
  userId:   { type: String, required: true },
  date:     { type: String, required: true },
  weight:   { type: Number, required: true },
  bmi:      { type: Number, required: true },
  bodyFat:  { type: BodyFatSchema, required: true }
});

module.exports = mongoose.model('IntakeEntry', IntakeEntrySchema);
