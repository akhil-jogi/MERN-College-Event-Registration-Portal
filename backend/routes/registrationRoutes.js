const express = require("express");
const router = express.Router();

const {
    registerForEvent,
    getMyRegistrations,
    cancelRegistration,
    getEventParticipants
} = require("../controllers/registrationController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const studentMiddleware = require("../middleware/studentMiddleware");

// Student: register for an event
router.post(
    "/",
    authMiddleware,
    studentMiddleware,
    registerForEvent
);

// Student: view own registrations
router.get(
    "/",
    authMiddleware,
    studentMiddleware,
    getMyRegistrations
);

// Student: cancel own registration
router.delete(
    "/:id",
    authMiddleware,
    studentMiddleware,
    cancelRegistration
);

// Admin: view participants
router.get(
    "/event/:eventId/participants",
    authMiddleware,
    adminMiddleware,
    getEventParticipants
);

module.exports = router;