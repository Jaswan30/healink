const mongoose = require("mongoose");
module.exports = mongoose.models.Doctor || mongoose.model(
  "Doctor",
  new mongoose.Schema({
    name: { type: String, required: true },
    specialty: String,
    languages: [String],
    fee: Number,
  }, { timestamps: true })
);
