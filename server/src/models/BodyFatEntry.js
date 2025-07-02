const mongoose = require("mongoose");
const BodyFatEntrySchema = new mongoose.Schema({
  userId:     { type: mongoose.Types.ObjectId, ref: "User", required: true },
  bodyFat:    { type: Number, required: true },
  date:       { type: Date, default: Date.now },
});
module.exports = mongoose.model("BodyFatEntry", BodyFatEntrySchema);