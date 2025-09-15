const express = require('express');
const router = express.Router();

// Logout controller
exports.logout = (req, res) => {
    res.clearCookie('uid', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
    });
    console.log('Logout: clearing cookie');
    res.status(200).json({ message: 'Logged out successfully' });
};