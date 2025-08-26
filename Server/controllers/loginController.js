const User = require('../models/Users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev';

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT
        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });

        // Set token in HTTP-only cookie
        res.cookie('uid', token, {
            httpOnly: true, // cannot be accessed by JS
            secure: process.env.NODE_ENV === 'production', // HTTPS only in production
            sameSite: 'lax', // protects against CSRF
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        // Send only user info in JSON (no token)
        res.status(200).json({ user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
