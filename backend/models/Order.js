const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  name: String,
  category: String, // medicine | blood | consultancy | pathology
  quantity: Number,
  price: Number,
  meta: Object, // doctor/date/slot/test/etc
});

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [orderItemSchema],

    totalAmount: {
      type: Number,
      required: true,
    },

    shippingRequired: {
      type: Boolean,
      default: false,
    },

    shippingAddress: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      default: "completed", // demo checkout = completed
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
