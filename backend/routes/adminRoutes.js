const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { getAllUsers } = require("../controllers/adminController");
const adminAuth = require("../middleware/adminAuth");

// Models
const User = require("../models/User");
const Doctor = require("../models/Doctor");
const Medicine = require("../models/Medicine");
const Test = require("../models/Test");
const BloodType = require("../models/BloodType");

/* ----------------------------- ADMIN LOGIN ----------------------------- */
/* Public route for the admin panel to sign in. */
router.post("/login", async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Not an admin account" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("Admin login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/* ----------------------------- EXISTING ROUTES ----------------------------- */
router.get("/users", adminAuth, getAllUsers);

/* ----------------------------- DOCTORS ----------------------------- */
router.post("/doctors", adminAuth, async (req, res) => {
  try {
    const doctor = await Doctor.create(req.body);
    res.status(201).json(doctor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/doctors", adminAuth, async (_req, res) => {
  try {
    const doctors = await Doctor.find().sort("-createdAt");
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/doctors/:id", adminAuth, async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/doctors/:id", adminAuth, async (req, res) => {
  try {
    await Doctor.findByIdAndDelete(req.params.id);
    res.json({ message: "Doctor deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ----------------------------- MEDICINES ----------------------------- */
router.post("/medicines", adminAuth, async (req, res) => {
  try {
    const med = await Medicine.create(req.body);
    res.status(201).json(med);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/medicines", adminAuth, async (_req, res) => {
  try {
    const meds = await Medicine.find().sort("-createdAt");
    res.json(meds);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/medicines/:id", adminAuth, async (req, res) => {
  try {
    const med = await Medicine.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(med);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/medicines/:id", adminAuth, async (req, res) => {
  try {
    await Medicine.findByIdAndDelete(req.params.id);
    res.json({ message: "Medicine deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ----------------------------- TESTS ----------------------------- */
router.post("/tests", adminAuth, async (req, res) => {
  try {
    const test = await Test.create(req.body);
    res.status(201).json(test);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/tests", adminAuth, async (_req, res) => {
  try {
    const tests = await Test.find().sort("-createdAt");
    res.json(tests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/tests/:id", adminAuth, async (req, res) => {
  try {
    const test = await Test.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(test);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/tests/:id", adminAuth, async (req, res) => {
  try {
    await Test.findByIdAndDelete(req.params.id);
    res.json({ message: "Test deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ----------------------------- BLOOD CENTERS ----------------------------- */
router.post("/blood-centers", adminAuth, async (req, res) => {
  try {
    const center = await BloodType.create(req.body);
    res.status(201).json(center);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/blood-centers", adminAuth, async (_req, res) => {
  try {
    const centers = await BloodType.find().sort("-createdAt");
    res.json(centers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/blood-centers/:id", adminAuth, async (req, res) => {
  try {
    const center = await BloodType.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(center);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/blood-centers/:id", adminAuth, async (req, res) => {
  try {
    await BloodType.findByIdAndDelete(req.params.id);
    res.json({ message: "Blood center deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
