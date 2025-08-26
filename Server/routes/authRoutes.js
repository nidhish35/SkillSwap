const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

// Import controllers
const { register } = require('../controllers/registerController');
const { login } = require('../controllers/loginController');

// Routes
router.post('/register', register);
router.post('/login', login);


router.post('/logout', (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0)
    });
    res.json({ message: 'Logged out successfully' });
});


// Protected route to get current user
router.get('/me', protect, (req, res) => {
    res.status(200).json({ user: req.user });
});

module.exports = router;
