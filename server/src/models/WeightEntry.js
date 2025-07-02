const mongoose = require("mongoose");
const WeightEntrySchema = new mongoose.Schema({
  userId:     { type: mongoose.Types.ObjectId, ref: "User", required: true },
  weight:     { type: Number, required: true },
  date:       { type: Date, default: Date.now },
});
module.exports = mongoose.model("WeightEntry", WeightEntrySchema);