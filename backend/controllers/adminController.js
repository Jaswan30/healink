// controllers/admincontroller.js

const User = require("../models/User"); // ✅ FIXED PATH

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).select("-password");
    res.json(users);
  } catch (error) {
    console.error("GET USERS ERROR:", error); // ✅ added debug log
    res.status(500).json({ message: "Error fetching users" });
  }
};