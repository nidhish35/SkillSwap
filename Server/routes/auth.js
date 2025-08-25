// Server/routes/auth.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET } = require('../middleware/auth');

const TOKEN_EXPIRES_IN = '7d';

// register
router.post('/register', async (req, res) => {
    try {
        const { email, username, password, name } = req.body;
        if (!email || !username || !password) return res.status(400).json({ message: 'email, username and password required' });

        const exists = await User.findOne({ $or: [{ email }, { username }] });
        if (exists) return res.status(409).json({ message: 'Email or username already taken' });

        const user = new User({ email, username, password, name });
        await user.save();

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: TOKEN_EXPIRES_IN });
        return res.status(201).json({ token, user: user.toJSON() });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
});

// login
router.post('/login', async (req, res) => {
    try {
        const { emailOrUsername, password } = req.body;
        if (!emailOrUsername || !password) return res.status(400).json({ message: 'emailOrUsername and password required' });

        const user = await User.findOne({ $or: [{ email: emailOrUsername }, { username: emailOrUsername }] });
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });

        const match = await user.comparePassword(password);
        if (!match) return res.status(401).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: TOKEN_EXPIRES_IN });
        return res.json({ token, user: user.toJSON() });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
