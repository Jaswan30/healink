const path = require("path");
const fs = require("fs");
const express = require("express");
const multer = require("multer");
const requireAuth = require("../middleware/requireAuth");
const User = require("../models/User"); // ✅ FIXED

const router = express.Router();

// ------- file upload setup -------
const UPLOAD_DIR = path.join(process.cwd(), "uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || "");
    cb(null, `avatar_${Date.now()}${ext}`);
  },
});
const upload = multer({ storage });

// ------- GET current profile -------
router.get("/me", requireAuth, async (req, res) => {
  const u = await User.findById(req.user._id || req.user.id)
    .select("-password")
    .lean();
  if (!u) return res.status(404).json({ message: "User not found" });
  res.json(u);
});

// ------- UPDATE basic profile -------
router.put("/me", requireAuth, async (req, res) => {
  const { name, phone, address, location } = req.body;

  const update = {};
  if (typeof name === "string") update.name = name;
  if (typeof phone === "string") update.phone = phone;

  if (address && typeof address === "object") {
    update.address = {
      line1: address.line1 || "",
      line2: address.line2 || "",
      city: address.city || "",
      state: address.state || "",
      zip: address.zip || "",
      country: address.country || "",
    };
  }

  if (location && typeof location === "object") {
    update.location = {
      lat: Number(location.lat),
      lng: Number(location.lng),
    };
  }

  const u = await User.findByIdAndUpdate(req.user._id || req.user.id, update, {
    new: true,
    runValidators: true,
    select: "-password",
  });
  res.json(u);
});

// ------- Upload avatar -------
router.post("/avatar", requireAuth, upload.single("avatar"), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  const avatarUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

  const u = await User.findByIdAndUpdate(
    req.user._id || req.user.id,
    { avatarUrl },
    { new: true, select: "-password" }
  );

  res.json({ avatarUrl, user: u });
});

module.exports = router;
