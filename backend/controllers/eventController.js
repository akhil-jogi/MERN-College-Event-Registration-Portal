
const mongoose = require("mongoose");
const Event = require("../models/Event");
const Registration = require("../models/Registration");

// Validate event fields
const validateEventData = (data) => {
    const requiredFields = [
        "eventTitle",
        "category",
        "eventDate",
        "venue",
        "organizer",
        "maximumParticipants"
    ];

    for (const field of requiredFields) {
        if (
            data[field] === undefined ||
            data[field] === null ||
            String(data[field]).trim() === ""
        ) {
            return `${field} is required`;
        }
    }

    const date = new Date(data.eventDate);

    if (Number.isNaN(date.getTime())) {
        return "Invalid event date";
    }

    if (date <= new Date()) {
        return "Event date must be in the future";
    }

    const capacity = Number(data.maximumParticipants);

    if (!Number.isInteger(capacity) || capacity < 1) {
        return "Maximum participants must be a positive integer";
    }

    return null;
};

// CREATE EVENT
const createEvent = async (req, res) => {
    try {
        const validationError = validateEventData(req.body);

        if (validationError) {
            return res.status(400).json({
                success: false,
                message: validationError
            });
        }

        const event = await Event.create({
            eventTitle: req.body.eventTitle.trim(),
            category: req.body.category.trim(),
            eventDate: req.body.eventDate,
            venue: req.body.venue.trim(),
            organizer: req.body.organizer.trim(),
            maximumParticipants: Number(req.body.maximumParticipants)
        });

        return res.status(201).json({
            success: true,
            message: "Event created successfully",
            event
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to create event"
        });
    }
};

// GET ALL EVENTS
const getAllEvents = async (req, res) => {
    try {
        const events = await Event.find().sort({ eventDate: 1 });

        return res.status(200).json({
            success: true,
            message: "Events fetched successfully",
            count: events.length,
            events
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch events"
        });
    }
};

// UPDATE EVENT
const updateEvent = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Event ID"
            });
        }

        const existingEvent = await Event.findById(id);

        if (!existingEvent) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        const allowedFields = [
            "eventTitle",
            "category",
            "eventDate",
            "venue",
            "organizer",
            "maximumParticipants"
        ];

        const updates = {};

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No valid fields provided for update"
            });
        }

        const mergedData = {
            eventTitle: existingEvent.eventTitle,
            category: existingEvent.category,
            eventDate: existingEvent.eventDate,
            venue: existingEvent.venue,
            organizer: existingEvent.organizer,
            maximumParticipants: existingEvent.maximumParticipants,
            ...updates
        };

        const validationError = validateEventData(mergedData);

        if (validationError) {
            return res.status(400).json({
                success: false,
                message: validationError
            });
        }

        const registrationCount = await Registration.countDocuments({
            eventId: id
        });

        if (
            Number(mergedData.maximumParticipants) < registrationCount
        ) {
            return res.status(400).json({
                success: false,
                message: `Capacity cannot be less than existing registrations (${registrationCount})`
            });
        }

        const updatedEvent = await Event.findByIdAndUpdate(
            id,
            {
                ...updates,
                ...(updates.maximumParticipants !== undefined
                    ? { maximumParticipants: Number(updates.maximumParticipants) }
                    : {})
            },
            {
                new: true,
                runValidators: true
            }
        );

        return res.status(200).json({
            success: true,
            message: "Event updated successfully",
            event: updatedEvent
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to update event"
        });
    }
};

// DELETE EVENT
const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Event ID"
            });
        }

        const event = await Event.findById(id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        await Registration.deleteMany({ eventId: id });
        await Event.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "Event and related registrations deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to delete event"
        });
    }
};

// EVENT REPORT
const getEventReport = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Event ID"
            });
        }

        const event = await Event.findById(id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        const registrations = await Registration.find({
            eventId: id
        }).populate("studentId", "name email");

        const registeredCount = registrations.length;

        return res.status(200).json({
            success: true,
            event: event.eventTitle,
            maximumParticipants: event.maximumParticipants,
            registeredCount,
            availableSeats: Math.max(
                0,
                event.maximumParticipants - registeredCount
            ),
            participants: registrations
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to generate event report"
        });
    }
};

module.exports = {
    createEvent,
    getAllEvents,
    updateEvent,
    deleteEvent,
    getEventReport
};
