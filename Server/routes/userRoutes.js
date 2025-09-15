const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

// GET /api/users/me
router.get("/me", protect, userController.getCurrentUser);
router.put("/me", protect, userController.updateProfile);

// userRoutes.js
router.get("/", protect, async (req, res) => {
    const q = req.query.q || "";
    const users = await User.find({
        name: new RegExp(q, "i"),
        _id: { $ne: req.user._id }, // exclude yourself
    })
        .limit(20)
        .select("name avatar");
    res.json(users);
});




module.exports = router;
