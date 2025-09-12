const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // reference to the User who created the post
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 150
    },
    description: {
        type: String,
        required: true,
        maxlength: 2000
    },
    skillsOffered: {
        type: [String],
        default: []
    },
    skillsWanted: {
        type: [String],
        default: []
    },
    media: {
        type: [String], // Array of URLs (images, videos, etc.)
        default: []
    },
    likes: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            date: { type: Date, default: Date.now }
        }
    ],
    comments: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            text: { type: String, required: true, maxlength: 500 },
            date: { type: Date, default: Date.now }
        }
    ],
    status: {
        type: String,
        enum: ['active', 'completed', 'archived'],
        default: 'active'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Middleware to update "updatedAt" automatically
postSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Post', postSchema);
