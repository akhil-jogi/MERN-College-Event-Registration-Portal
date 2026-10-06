const express = require("express");
const router = express.Router();

const {
    registerUser,
    loginUser,
    changePassword
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");
router.put("/change-password", authMiddleware, changePassword);
// Student Registration
router.post("/register", registerUser);

// Student Login
router.post("/login", loginUser);

// Change Password
router.put("/change-password", authMiddleware, changePassword);

// Protected Test Route
router.get("/profile", authMiddleware, (req, res) => {
    res.status(200).json({
        message: "Access granted",
        user: req.user
    });
});

module.exports = router;