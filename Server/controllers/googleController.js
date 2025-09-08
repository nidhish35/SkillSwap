const passport = require('passport');
const jwt = require('jsonwebtoken');

/**
 * @desc    Initiates the Google OAuth 2.0 authentication flow
 * @route   GET /api/auth/google
 * @access  Public
 */
const googleLogin = passport.authenticate('google', {
    scope: ['profile', 'email'] // The information we are requesting from Google
});

/**
 * @desc    Handles the callback after Google has authenticated the user
 * @route   GET /api/auth/google/callback
 * @access  Public
 */
const handleGoogleCallback = (req, res) => {
    // At this point, `req.user` is populated by the Passport strategy's `done` function.
    // We can now generate our own application-specific token (JWT).

    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });

    // Set the token in an HTTP-Only cookie for security
    res.cookie('uid', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    // Redirect the user back to the frontend dashboard
    res.redirect(`${process.env.CLIENT_URL}/dashboard`);
};

// We export an array of middleware. Express will execute them in sequence.
// 1. Passport authenticates the request.
// 2. If successful, our handleGoogleCallback function is called.
const googleCallback = [
    passport.authenticate('google', {
        session: false,
        failureRedirect: `${process.env.CLIENT_URL}/login` // Redirect on failure
    }),
    handleGoogleCallback
];

module.exports = {
    googleLogin,
    googleCallback,
};
