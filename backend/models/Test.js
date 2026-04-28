const mongoose = require("mongoose");
module.exports = mongoose.models.Test || mongoose.model(
  "Test",
  new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    price: Number,
    category: String, // e.g. "healthCheckup" | "healthTest" | "fullBody"
  }, { timestamps: true })
);
