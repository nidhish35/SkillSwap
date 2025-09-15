const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

// Import controllers
const { register } = require('../controllers/registerController');
const { login } = require('../controllers/loginController');
const { logout } = require('../controllers/logoutController');
const { googleLogin, googleCallback } = require('../controllers/googleController'); // Google OAuth
const User = require('../models/Users');
const Post = require('../models/Posts');

// Google OAuth routes
router.get('/google', googleLogin);
router.get('/google/callback', googleCallback);

// Auth routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

// Protected route to get current user
router.get('/me', protect, (req, res) => {
    res.status(200).json({ user: req.user });
});

// ------------------------
// DELETE ACCOUNT ROUTE
// ------------------------
router.delete('/delete', protect, async (req, res) => {
    try {
        const userId = req.user._id;

        // 1) Delete all posts by this user
        await Post.deleteMany({ user: userId });

        // 2) Remove comments by this user from all posts
        await Post.updateMany(
            { 'comments.userId': userId },
            { $pull: { comments: { userId: userId } } }
        );

        // 3) Delete the user account
        await User.findByIdAndDelete(userId);

        // 4) Clear cookie/session
        res.clearCookie('uid', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
        });

        res.status(200).json({ message: 'Account deleted successfully' });
    } catch (err) {
        console.error('Error deleting account:', err);
        res.status(500).json({ message: 'Failed to delete account.' });
    }
});

module.exports = router;
