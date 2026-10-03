
const express = require("express");

const router = express.Router();

const {
    createEvent,
    getAllEvents,
    updateEvent,
    deleteEvent,
    getEventReport
} = require("../controllers/eventController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// ==========================================
// GET ALL EVENTS
// ==========================================

router.get("/", getAllEvents);

// ==========================================
// ADMIN: GENERATE EVENT REPORT
// ==========================================

router.get(
    "/:id/report",
    authMiddleware,
    adminMiddleware,
    getEventReport
);

// ==========================================
// CREATE EVENT (ADMIN ONLY)
// ==========================================

router.post(
    "/",
    authMiddleware,
    adminMiddleware,
    createEvent
);

// ==========================================
// UPDATE EVENT (ADMIN ONLY)
// ==========================================

router.put(
    "/:id",
    authMiddleware,
    adminMiddleware,
    updateEvent
);

// ==========================================
// DELETE EVENT (ADMIN ONLY)
// ==========================================

router.delete(
    "/:id",
    authMiddleware,
    adminMiddleware,
    deleteEvent
);

module.exports = router;
