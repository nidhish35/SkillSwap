// Server/routes/users.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth');

// get current user
router.get('/me', authMiddleware, async (req, res) => {
    return res.json({ user: req.user.toJSON() });
});

// update profile (owner only)
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        if (req.user._id.toString() !== id) return res.status(403).json({ message: 'Forbidden' });

        const allowed = ['name', 'bio', 'avatarUrl', 'skillsOffered', 'skillsWanted'];
        const updates = {};
        for (const k of allowed) if (k in req.body) updates[k] = req.body[k];

        const updated = await User.findByIdAndUpdate(id, { $set: updates }, { new: true });
        return res.json({ user: updated.toJSON() });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
});

// get public user
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'Not found' });
        return res.json({ user: user.toJSON() });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
