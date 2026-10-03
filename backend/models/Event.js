const mongoose = require("mongoose");
const eventSchema = new mongoose.Schema(
    {
        eventTitle: {
            type: String,
            required: true,
            trim: true
        },

        category: {
            type: String,
            required: true,
            trim: true
        },

        eventDate: {
            type: Date,
            required: true
        },

        venue: {
            type: String,
            required: true,
            trim: true
        },

        organizer: {
            type: String,
            required: true,
            trim: true
        },

        maximumParticipants: {
            type: Number,
            required: true,
            min: 1
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Event", eventSchema);