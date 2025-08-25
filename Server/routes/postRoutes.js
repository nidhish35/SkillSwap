// routes/postRoutes.js
import express from "express";
import SkillPost from "../models/SkillPost.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Get all posts (with user info populated)
router.get("/", async (req, res) => {
    const posts = await SkillPost.find().populate("user", "username avatar");
    res.json(posts);
});

// ✅ Create a new post
router.post("/", authMiddleware, async (req, res) => {
    const { title, description, skillType } = req.body;
    const post = await SkillPost.create({
        user: req.user._id,
        title,
        description,
        skillType,
    });
    res.json(post);
});

export default router;
