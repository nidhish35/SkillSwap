// models/SkillPost.js
import mongoose from "mongoose";

const skillPostSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        title: { type: String, required: true },
        description: String,
        skillType: { type: String, enum: ["offer", "want"], required: true },
        createdAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

export default mongoose.model("SkillPost", skillPostSchema);
