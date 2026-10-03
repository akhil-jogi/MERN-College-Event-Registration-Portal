const express = require("express");
const router = express.Router();

const {
    registerUser,
    loginUser
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

// Student Registration
router.post("/register", registerUser);

// Student Login
router.post("/login", loginUser);

// Protected Test Route
router.get("/profile", authMiddleware, (req, res) => {
    res.status(200).json({
        message: "Access granted",
        user: req.user
    });
});

module.exports = router;