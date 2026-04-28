// backend/middleware/adminAuth.js
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // <-- FIXED PATH

module.exports = async function adminAuth(req, res, next) {
  try {
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).lean();

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("adminAuth error:", err.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};
