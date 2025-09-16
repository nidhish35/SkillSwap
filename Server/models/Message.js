const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }, // Sender
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }, // Receiver
    text: {
        type: String,
        required: true,
        trim: true
    }, // Message content
    status: {
        type: String,
        enum: ["sent", "delivered", "seen"],
        default: "sent"
    }, // Delivery status
    createdAt: {
        type: Date,
        default: Date.now
    } // Timestamp
});

// Optional: make queries always return messages sorted by newest first
messageSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Message", messageSchema);
