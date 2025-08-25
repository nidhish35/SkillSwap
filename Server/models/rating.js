// Server/models/Rating.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const RatingSchema = new Schema({
    from: { type: Schema.Types.ObjectId, ref: "User", required: true },
    to: { type: Schema.Types.ObjectId, ref: "User", required: true },
    session: { type: Schema.Types.ObjectId, ref: "SwapSession" },

    score: { type: Number, min: 1, max: 5, required: true },
    comment: String
}, { timestamps: true });

module.exports = mongoose.model("Rating", RatingSchema);
