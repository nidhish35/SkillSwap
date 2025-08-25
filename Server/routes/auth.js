// Server/routes/auth.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET } = require('../middleware/auth');
const { authMiddleware } = require('../middleware/auth');

router.get('/me', authMiddleware, (req, res) => {
    res.json({ user: req.user });
});


const TOKEN_EXPIRES_IN = '7d';

// register
const COOKIE_EXPIRES = 7 * 24 * 60 * 60 * 1000; // 7 days in ms

// login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: 'email and password required' });

        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });

        const match = await user.comparePassword(password);
        if (!match) return res.status(401).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: TOKEN_EXPIRES_IN });

        // Set JWT in HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // true in prod
            maxAge: COOKIE_EXPIRES,
            sameSite: 'lax'
        });

        return res.json({ user: user.toJSON() }); // token is now in cookie
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
});

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

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: COOKIE_EXPIRES,
            sameSite: 'lax'
        });

        return res.status(201).json({ user: user.toJSON() });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
});

// logout
router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
});

module.exports = router;
