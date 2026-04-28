const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
  hospitalName: String,
  type: String,
  name: String,
  specialty: String,
  price: Number,
  location: String,
  approved: { type: Boolean, default: false },
});

module.exports = mongoose.model("Subscription", subscriptionSchema);