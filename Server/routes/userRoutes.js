const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

// GET /api/users/me
router.get("/me", protect, userController.getCurrentUser);
router.put("/me", protect, userController.updateProfile);




module.exports = router;
