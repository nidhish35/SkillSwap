const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const passport = require('passport'); // <-- Import Passport
require('dotenv').config(); // <-- Load .env variables
require('./config/passport-setup'); // <-- This runs the passport config code


const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173", // <-- your React/Vite app URL
    credentials: true // allow cookies
}));

// Initialize Passport
app.use(passport.initialize()); // <-- Initialize Passport

// Routes
app.use('/api/auth', authRoutes);

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/skillswap', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
