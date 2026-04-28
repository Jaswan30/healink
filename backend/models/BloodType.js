const mongoose = require("mongoose");
module.exports = mongoose.models.BloodType || mongoose.model(
  "BloodType",
  new mongoose.Schema({
    centerName: String,
    location: String,
    available: Boolean,
    bloodTypes: [String], // ["A+","O-"]
  }, { timestamps: true })
);
