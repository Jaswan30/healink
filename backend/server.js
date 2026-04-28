// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const bulkUploadRoutes = require("./routes/bulkUploadRoutes");

dotenv.config();

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const publicRoutes = require("./routes/publicRoutes");
const profileRoutes = require("./routes/profileRoutes"); // ⬅️ NEW

const app = express(); // ✅ MOVED ABOVE (IMPORTANT)

const orderRoutes = require("./routes/orderRoutes");
app.use("/api/orders", orderRoutes);

const subscriptionRoutes = require("./routes/subscriptionRoutes");
app.use("/api/subscription", subscriptionRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));

// ✅ Allow both Frontend & Admin origins via CORS
const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:3000",
  process.env.ADMIN_URL || "http://localhost:3001",
];

// ✅ CORS (no wildcard app.options — avoids path-to-regexp error)
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

app.use(express.json());

// ➕ Serve uploaded avatars
app.use("/uploads", express.static("uploads")); // ⬅️ NEW
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://your-frontend-url.vercel.app",
    "https://your-admin-url.vercel.app"
  ],
  credentials: true
}));

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/profile", profileRoutes); // ⬅️ NEW
app.use("/api/bulk-upload", bulkUploadRoutes); // ✅ MOVED HERE (FIX)

// ================= SERVER =================
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 30000 })
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ DB Connection Error:", err.message);
    process.exit(1);
  });

// ✅ Root route
app.get("/", (req, res) => {
  res.send("HEALink backend is running ✅");
});