const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const passport = require('passport');
require('dotenv').config();
require('./config/passport-setup');
const path = require("path");

// Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require("./routes/userRoutes");
const uploadRoutes = require("./routes/upload");
const postRoutes = require("./routes/postRoutes"); // ✅ Added

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173", // React app
    credentials: true
}));

// Initialize Passport
app.use(passport.initialize());

// Routes
app.use('/api/auth', authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/posts", postRoutes); // ✅ Added

// Serve uploads as static
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/uploads/profile-pictures", express.static(path.join(__dirname, "uploads/profile-pictures")));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/skillswap', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
