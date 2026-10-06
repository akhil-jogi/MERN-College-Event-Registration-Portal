const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("../models/User");

const students = [
    {
        name: "Rahul",
        email: "rahul@gmail.com",
        password: "1234567890"
    },
    {
        name: "Nikhil",
        email: "nikhil@gmail.com",
        password: "1234567890"
    },
    {
        name: "Mohan",
        email: "mohan@gmail.com",
        password: "1234567890"
    }
];

const resetStudents = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is missing in .env");
        }

        await mongoose.connect(process.env.MONGODB_URI);

        console.log("MongoDB connected");

        // Remove existing student accounts
        await User.deleteMany({ role: "student" });

        console.log("Old student accounts removed");

        // Create final student accounts
        for (const student of students) {
            const hashedPassword = await bcrypt.hash(student.password, 10);

            await User.create({
                name: student.name,
                email: student.email,
                password: hashedPassword,
                role: "student"
            });

            console.log(`Student created: ${student.email}`);
        }

        console.log("Final student accounts created successfully");
    } catch (error) {
        console.error("Error:", error.message);
    } finally {
        await mongoose.connection.close();
        console.log("MongoDB connection closed");
    }
};

resetStudents();