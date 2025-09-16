const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const Message = require("../models/Message");
const User = require("../models/Users");

// Get conversation list
router.get("/conversations", protect, async (req, res) => {
    try {
        const messages = await Message.find({
            $or: [{ from: req.user.id }, { to: req.user.id }],
        });

        const userIds = [
            ...new Set(messages.map((m) => (m.from.toString() === req.user.id ? m.to.toString() : m.from.toString())))
        ];

        const users = await User.find({ _id: { $in: userIds } }).select("_id name profilePicture");
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch conversations" });
    }
});

// Get messages with specific user
router.get("/:userId", protect, async (req, res) => {
    try {
        const msgs = await Message.find({
            $or: [
                { from: req.user.id, to: req.params.userId },
                { from: req.params.userId, to: req.user.id },
            ],
        }).sort({ createdAt: 1 });

        res.json(msgs);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch messages" });
    }
});

module.exports = router;
