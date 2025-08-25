// Server/models/SwapSession.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const SwapSessionSchema = new Schema({
    teacher: { type: Schema.Types.ObjectId, ref: "User", required: true },
    learner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    listing: { type: Schema.Types.ObjectId, ref: "SkillListing" },

    scheduledAt: { type: Date, required: true },
    durationMinutes: { type: Number, default: 60 },

    status: {
        type: String,
        enum: ["requested", "accepted", "completed", "cancelled"],
        default: "requested"
    },

    meetingUrl: String   // link to the video call
}, { timestamps: true });

module.exports = mongoose.model("SwapSession", SwapSessionSchema);
