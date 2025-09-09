const User = require("../models/Users");

// Get current logged-in user
exports.getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update profile of logged-in user
exports.updateProfile = async (req, res) => {
    try {
        const allowedUpdates = [
            "name",
            "email",
            "profilePicture",
            "bio",
            "skillsOffered",
            "skillsWanted",
            "onlineStatus",
        ];

        const updates = {};
        for (let key of allowedUpdates) {
            if (req.body[key] !== undefined) {
                updates[key] = req.body[key];
            }
        }

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { $set: updates },
            { new: true, runValidators: true }
        ).select("-password");

        if (!user) return res.status(404).json({ message: "User not found" });

        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// Add feedback to a user
exports.addFeedback = async (req, res) => {
    try {
        const { comment, rating } = req.body;
        const feedback = {
            userId: req.user._id, // assuming req.user is set by auth middleware
            comment,
            rating,
        };

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.feedbacks.push(feedback);
        user.calculateRating(); // update average rating
        await user.save();

        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
