const mongoose = require("mongoose");
module.exports = mongoose.models.Medicine || mongoose.model(
  "Medicine",
  new mongoose.Schema({
    name: { type: String, required: true },
    price: Number,
    discount: Number,
  }, { timestamps: true })
);
