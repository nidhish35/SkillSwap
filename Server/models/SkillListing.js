// Server/models/SkillListing.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const SkillListingSchema = new Schema({
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: String,
    tags: [String],   // e.g. ["Cloud", "AWS", "DevOps"]

    level: { type: String, enum: ["beginner", "intermediate", "advanced"], default: "beginner" },

    isPublished: { type: Boolean, default: true },
    ratingAvg: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("SkillListing", SkillListingSchema);
