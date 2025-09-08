const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        // required: true
    },
    profilePicture: {
        type: String // URL to profile picture
    },
    googleId: { type: String,
        unique: true,
        sparse: true
    },
    bio: {
        type: String,
        maxlength: 500
    },
    skillsOffered: [
        {
            type: String
        }
    ],
    skillsWanted: [
        {
            type: String
        }
    ],
    rating: {
        type: Number,
        default: 0
    },
    feedbacks: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            comment: String,
            rating: Number,
            date: { type: Date, default: Date.now }
        }
    ],
    onlineStatus: {
        type: Boolean,
        default: false
    },
    lastLogin: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Optional: method to calculate average rating
userSchema.methods.calculateRating = function() {
    if (this.feedbacks.length === 0) return 0;
    const sum = this.feedbacks.reduce((acc, f) => acc + f.rating, 0);
    this.rating = sum / this.feedbacks.length;
    return this.rating;
}

module.exports = mongoose.model('User', userSchema);
