// backend/routes/publicRoutes.js
const express = require("express");
const router = express.Router();

const Doctor = require("../models/Doctor");
const Medicine = require("../models/Medicine");
const Test = require("../models/Test");
const BloodType = require("../models/BloodType");

// helper: safe query wrapper
async function safe(fn, res) {
  try {
    const data = await fn();
    res.json(data);
  } catch (err) {
    console.error("Public API error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

// Helper: text search via ?q=
const qFilter = (field, q) =>
  q ? { [field]: { $regex: q.trim(), $options: "i" } } : {};

// ===== Medicines (public) =====
router.get("/medicines", (req, res) =>
  safe(async () => {
    const q = req.query.q || "";
    return await Medicine.find(qFilter("name", q)).sort({ name: 1 }).limit(50);
  }, res)
);

// ===== Doctors (public) =====
router.get("/doctors", (req, res) =>
  safe(async () => {
    const q = req.query.q || "";
    const where = q
      ? {
          $or: [
            { name: { $regex: q.trim(), $options: "i" } },
            { specialty: { $regex: q.trim(), $options: "i" } },
          ],
        }
      : {};
    return await Doctor.find(where).sort({ name: 1 }).limit(50);
  }, res)
);

// ===== Lab Tests (public) =====
router.get("/tests", (req, res) =>
  safe(async () => {
    const q = req.query.q || "";
    // your model field might be "title" — search both
    const where = q
      ? {
          $or: [
            { name: { $regex: q.trim(), $options: "i" } },
            { title: { $regex: q.trim(), $options: "i" } },
          ],
        }
      : {};
    return await Test.find(where).sort({ name: 1, title: 1 }).limit(50);
  }, res)
);

// ===== Blood Banks / Blood Centers (public) =====
router.get("/blood-centers", (req, res) =>
  safe(async () => {
    const q = req.query.q || "";
    const where = q
      ? {
          $or: [
            { name: { $regex: q.trim(), $options: "i" } },
            { location: { $regex: q.trim(), $options: "i" } },
          ],
        }
      : {};
    return await BloodType.find(where).sort({ name: 1 }).limit(50);
  }, res)
);

module.exports = router;
