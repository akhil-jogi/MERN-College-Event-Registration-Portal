const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("../models/User");

const createAdmin = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is missing");
        }

        if (!process.env.ADMIN_PASSWORD) {
            throw new Error("ADMIN_PASSWORD is missing from .env");
        }

        await mongoose.connect(process.env.MONGODB_URI);

        console.log("MongoDB Connected");

        const existingAdmin = await User.findOne({
            role: "admin"
        });

        if (existingAdmin) {
            console.log("Admin account already exists");
            return;
        }

        const hashedPassword = await bcrypt.hash(
            process.env.ADMIN_PASSWORD,
            10
        );

        const admin = await User.create({
            name: "College Admin",
            email: "admin@college.com",
            password: hashedPassword,
            role: "admin"
        });

        console.log("Admin created successfully");
        console.log("Admin Email:", admin.email);

    } catch (error) {
        console.error("Error creating admin:", error.message);
        process.exitCode = 1;

    } finally {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
        }
    }
};

createAdmin();