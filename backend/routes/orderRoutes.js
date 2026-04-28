const express = require("express");
const Order = require("../models/Order");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

/**
 * CREATE ORDER (from checkout)
 */
router.post("/", requireAuth, async (req, res) => {
  try {
    const {
      items,
      totalAmount,
      shippingRequired,
      shippingAddress,
      phone,
    } = req.body;

    const order = await Order.create({
      userId: req.user._id,
      items,
      totalAmount,
      shippingRequired,
      shippingAddress,
      phone,
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * GET USER ORDERS
 */
router.get("/my", requireAuth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });

    res.json(orders);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * ADMIN: GET ALL ORDERS (future use)
 */
router.get("/", requireAuth, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: "Access denied" });
    }

    const orders = await Order.find().populate("userId", "email");
    res.json(orders);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
