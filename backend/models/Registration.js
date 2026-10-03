const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema(
    {
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        eventId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event",
            required: true
        },

        registrationDate: {
            type: Date,
            default: Date.now
        },

        participationStatus: {
            type: String,
            enum: ["Registered", "Attended", "Absent"],
            default: "Registered"
        }
    },
    {
        timestamps: true
    }
);

// Prevent duplicate registration for the same event
// by the same student.
registrationSchema.index(
    {
        studentId: 1,
        eventId: 1
    },
    {
        unique: true
    }
);

module.exports = mongoose.model(
    "Registration",
    registrationSchema
);