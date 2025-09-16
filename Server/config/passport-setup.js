
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/Users");

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "/api/auth/google/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let currentUser = await User.findOne({ googleId: profile.id });

                if (currentUser) {
                    // Update profile picture
                    if (profile.photos && profile.photos.length > 0) {
                        const photoUrl = profile.photos[0].value;
                        const fileName = `${profile.id}.jpg`;
                        const uploadPath = path.join(__dirname, "../uploads/profile-pictures", fileName);

                        // Download inside async function
                        const imageRes = await axios.get(photoUrl, { responseType: "arraybuffer" });
                        fs.writeFileSync(uploadPath, imageRes.data);

                        currentUser.profilePicture = `/uploads/profile-pictures/${fileName}`;
                        await currentUser.save();
                    }

                    return done(null, currentUser);
                }

                // Create new user
                let profilePicturePath;
                if (profile.photos && profile.photos.length > 0) {
                    const photoUrl = profile.photos[0].value;
                    const fileName = `${profile.id}.jpg`;
                    const uploadPath = path.join(__dirname, "../uploads/profile-pictures", fileName);

                    const imageRes = await axios.get(photoUrl, { responseType: "arraybuffer" });
                    fs.writeFileSync(uploadPath, imageRes.data);

                    profilePicturePath = `/uploads/profile-pictures/${fileName}`;
                }

                const newUser = await new User({
                    googleId: profile.id,
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    profilePicture: profilePicturePath,
                }).save();

                return done(null, newUser);
            } catch (err) {
                return done(err, null);
            }
        }
    )
);
