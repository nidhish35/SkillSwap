const Post = require('../models/Posts');
const { protect } = require('../middleware/authMiddleware');
// Create a new post
exports.createPost = async (req, res) => {
    try {
        const { title, description, skillsOffered, skillsWanted, media } = req.body;

        const post = new Post({
            protect,
            user: req.user._id, // assuming authentication middleware attaches user
            title,
            description,
            skillsOffered,
            skillsWanted,
            media
        });

        await post.save();
        res.status(201).json(post);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// // Get all posts
// exports.getAllPosts = async (req, res) => {
//     try {
//         const posts = await Post.find()
//             .populate('user', 'name email profilePicture') // show limited user info
//             .sort({ createdAt: -1 });
//         res.json(posts);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };

// Get a single post by ID
exports.getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('user', 'name email profilePicture');
        if (!post) return res.status(404).json({ message: 'Post not found' });
        res.json(post);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update a post
exports.updatePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        Object.assign(post, req.body);
        await post.save();
        res.json(post);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete a post
exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        await post.deleteOne();
        res.json({ message: 'Post deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Like a post
exports.likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        const alreadyLiked = post.likes.some(
            like => like.userId.toString() === req.user._id.toString()
        );

        if (alreadyLiked) {
            // remove like (toggle)
            post.likes = post.likes.filter(
                like => like.userId.toString() !== req.user._id.toString()
            );
        } else {
            post.likes.push({ userId: req.user._id });
        }

        await post.save();
        res.json(post);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// // Add a comment
// exports.addComment = async (req, res) => {
//     try {
//         const { text } = req.body;
//         const post = await Post.findById(req.params.id);
//         if (!post) return res.status(404).json({ message: 'Post not found' });

//         post.comments.push({ userId: req.user._id, text });
//         await post.save();

//         res.json(post);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };

exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate("user", "name profilePicture") // populate post author
            .populate("comments.userId", "name profilePicture"); // populate comment authors

        res.json(posts);
    } catch (err) {
        console.error("Error fetching posts:", err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.addComment = async (req, res) => {
    try {
        const { text } = req.body;
        const post = await Post.findById(req.params.id);

        if (!post) return res.status(404).json({ message: "Post not found" });

        const newComment = {
            userId: req.user._id,
            text,
        };

        post.comments.push(newComment);
        await post.save();

        // Re-fetch with populated user data
        const updatedPost = await Post.findById(req.params.id)
            .populate("user", "name profilePicture")
            .populate("comments.userId", "name profilePicture");

        res.json(updatedPost);
    } catch (err) {
        console.error("Error adding comment:", err);
        res.status(500).json({ message: "Server error" });
    }
};