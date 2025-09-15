
const User = require('../models/Users');
const bcrypt = require('bcryptjs');
const jwt =require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev';

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email }).select('+password'); // Explicitly include password for comparison
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
            httpOnly: true,
            // **FIX**: Make the secure flag dynamic, just like in your logout handler
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/', // cookie valid for entire site
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        // **SECURITY FIX**: Never send the entire user object.
        // Create a new object without the password.
        const userResponse = {
            _id: user._id,
            name: user.name,
            email: user.email,
            bio: user.bio,
            skillsOffered: user.skillsOffered,
            skillsWanted: user.skillsWanted,
        };

        res.status(200).json({ user: userResponse });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
