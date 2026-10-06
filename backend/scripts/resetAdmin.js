
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("../models/User");

const resetAdmin = async () => {
  try {
    const password = process.env.ADMIN_PASSWORD;

    if (!process.env.MONGODB_URI || !password) {
      throw new Error("Required environment variables are missing");
    }

    if (password.length < 8) {
      throw new Error("Admin password must contain at least 8 characters");
    }

    await mongoose.connect(process.env.MONGODB_URI);

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await User.findOneAndUpdate(
      { email: "admin@college.com", role: "admin" },
      {
        $set: {
          name: "College Admin",
          password: hashedPassword,
          role: "admin",
        },
      },
      { new: true }
    );

    if (!admin) {
      throw new Error(
        "Admin account not found. Please check the existing admin account."
      );
    }

    console.log("Admin password reset successfully");
    console.log("Admin Email:", admin.email);
  } catch (error) {
    console.error("Error:", error.message);
    process.exitCode = 1;
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  }
};

resetAdmin();
