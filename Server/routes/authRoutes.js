const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');


// Import controllers
const { register } = require('../controllers/registerController');
const { login } = require('../controllers/loginController');
const { googleLogin, googleCallback } = require('../controllers/googleController'); // <-- Import from new controller
// Google OAuth routes
router.get('/google', googleLogin);
router.get('/google/callback', googleCallback);

// Routes
router.post('/register', register);
router.post('/login', login);


router.post('/logout', (req, res) => {
res.clearCookie('uid', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/' // ensure cookie is cleared on the correct path,
});
console.log('Logout: clearing cookie');
res.status(200).json({ message: 'Logged out successfully' });
});




// Protected route to get current user
router.get('/me', protect, (req, res) => {
    res.status(200).json({ user: req.user });
});

module.exports = router;
