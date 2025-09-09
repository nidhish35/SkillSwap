const express = require("express");
const multer = require("multer");
const path = require("path");
const User = require("../models/Users");
const auth = require("../middleware/authMiddleware"); // your auth middleware

const router = express.Router();

// storage for uploaded files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // make sure uploads/ folder exists
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

// route to upload profile picture
router.post(
    "/profile-picture",
    auth.protect,
    upload.single("profilePicture"),
    async (req, res) => {
        try {
            const imageUrl = `/uploads/${req.file.filename}`;

            const user = await User.findByIdAndUpdate(
                req.user._id,
                { profilePicture: imageUrl },
                { new: true }
            ).select("-password");

            res.json(user);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
);

module.exports = router;
