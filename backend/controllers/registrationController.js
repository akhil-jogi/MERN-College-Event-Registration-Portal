
const mongoose = require("mongoose");

const Registration = require("../models/Registration");
const Event = require("../models/Event");

// ==========================================
// REGISTER FOR AN EVENT
// ==========================================

const registerForEvent = async (req, res) => {
    try {
        const { eventId } = req.body;

        // Check whether Event ID is provided
        if (!eventId) {
            return res.status(400).json({
                success: false,
                message: "Event ID is required"
            });
        }

        // Validate MongoDB Event ID
        if (!mongoose.isValidObjectId(eventId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Event ID"
            });
        }

        // Find event
        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        // Check whether student is already registered
        const existingRegistration = await Registration.findOne({
            studentId: req.user.id,
            eventId: eventId
        });

        if (existingRegistration) {
            return res.status(400).json({
                success: false,
                message: "Already registered for this event"
            });
        }

        // Count existing registrations
        const registrationCount = await Registration.countDocuments({
            eventId: eventId
        });

        // Check maximum participant limit
        if (registrationCount >= event.maximumParticipants) {
            return res.status(400).json({
                success: false,
                message: "Event is full. Registration is closed."
            });
        }

        // Create registration
        const registration = await Registration.create({
            studentId: req.user.id,
            eventId: eventId
        });

        return res.status(201).json({
            success: true,
            message: "Event registration successful",
            registration
        });

    } catch (error) {
        console.error("Event Registration Error:", error);

        // Handle duplicate registration at database level
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Already registered for this event"
            });
        }

        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

// ==========================================
// GET MY REGISTRATIONS
// ==========================================

const getMyRegistrations = async (req, res) => {
    try {
        const registrations = await Registration.find({
            studentId: req.user.id
        }).populate("eventId");

        return res.status(200).json({
            success: true,
            count: registrations.length,
            registrations
        });

    } catch (error) {
        console.error("Get Registrations Error:", error);

        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

// ==========================================
// CANCEL REGISTRATION
// ==========================================

const cancelRegistration = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate Registration ID
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Registration ID"
            });
        }

        const registration = await Registration.findById(id);

        if (!registration) {
            return res.status(404).json({
                success: false,
                message: "Registration not found"
            });
        }

        // Ensure student can cancel only their own registration
        if (registration.studentId.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "You cannot cancel another student's registration"
            });
        }

        await Registration.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "Registration cancelled successfully"
        });

    } catch (error) {
        console.error("Cancel Registration Error:", error);

        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

// ==========================================
// ADMIN: GET EVENT PARTICIPANTS
// ==========================================

const getEventParticipants = async (req, res) => {
    try {
        const { eventId } = req.params;

        // Validate Event ID
        if (!mongoose.isValidObjectId(eventId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Event ID"
            });
        }

        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        const registrations = await Registration.find({
            eventId: eventId
        }).populate("studentId", "name email");

        return res.status(200).json({
            success: true,
            event: event.eventTitle,
            count: registrations.length,
            participants: registrations
        });

    } catch (error) {
        console.error("Get Event Participants Error:", error);

        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

// ==========================================
// EXPORT CONTROLLERS
// ==========================================

module.exports = {
    registerForEvent,
    getMyRegistrations,
    cancelRegistration,
    getEventParticipants
};
