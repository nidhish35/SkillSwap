// backend/config/passport-setup.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/Users'); // Make sure you have a User model

passport.use(new GoogleStrategy({
    // options for google strategy
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/auth/google/callback' // Matches the one in Google Console
},
async (accessToken, refreshToken, profile, done) => {
    // This function is called when a user successfully authenticates with Google
    try {
        // Check if user already exists in your DB
        let currentUser = await User.findOne({ googleId: profile.id });

        if (currentUser) {
            // Already have the user
            console.log('User is:', currentUser);
            done(null, currentUser);
        } else {
            // If not, create a new user in your DB
            const newUser = await new User({
                googleId: profile.id,
                name: profile.displayName,
                email: profile.emails[0].value,
                // You can add other fields from the profile object as needed
                // e.g., profilePicture: profile.photos[0].value
            }).save();
            console.log('New user created:', newUser);
            done(null, newUser);
        }
    } catch (error) {
        done(error, null);
    }
}));