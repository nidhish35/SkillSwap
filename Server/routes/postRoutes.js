const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

// Middleware example (assuming you have JWT/auth)

const { protect } = require('../middleware/authMiddleware');

// CRUD Routes
router.post('/', protect, postController.createPost);
router.get('/', postController.getAllPosts);
router.get('/:id', postController.getPostById);
router.put('/:id', protect, postController.updatePost);
router.delete('/:id', protect, postController.deletePost);

// Engagement
router.post('/:id/like', protect, postController.likePost);
router.post('/:id/comment', protect, postController.addComment);

module.exports = router;
