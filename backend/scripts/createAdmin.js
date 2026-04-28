require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

(async () => {
  try {
    const email = process.argv[2];
    const pass  = process.argv[3];
    if (!email || !pass) {
      console.log("Usage: node scripts/createAdmin.js <email> <password>");
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 30000 });

    const exists = await User.findOne({ email });
    if (exists) {
      console.log("User already exists. Choose another email or use reset script.");
      process.exit(0);
    }

    const hash = await bcrypt.hash(pass, 10);
    await User.create({ name: "Admin", email, password: hash, role: "admin" });
    console.log("✅ Admin user created.");
  } catch (e) {
    console.error("Error:", e.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
})();
