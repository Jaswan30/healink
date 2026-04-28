require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/user");

async function createAdmin() {
  await mongoose.connect(process.env.MONGO_URI);

  const email = "admin@healink.com";
  const password = "Admin@123";

  const exists = await User.findOne({ email });
  if (exists) {
    console.log("❌ Admin already exists");
    process.exit(0);
  }

  const hashed = await bcrypt.hash(password, 10);

  await User.create({
    name: "HEALink Admin",
    email,
    password: hashed,
    role: "admin",
  });

  console.log("✅ ADMIN CREATED");
  console.log("Email:", email);
  console.log("Password:", password);

  process.exit(0);
}

createAdmin();
