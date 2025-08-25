// Server/models/Message.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const MessageSchema = new Schema({
    session: { type: Schema.Types.ObjectId, ref: "SwapSession" },
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Message", MessageSchema);
