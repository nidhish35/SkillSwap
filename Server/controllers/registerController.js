const User = require('../models/Users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev';

exports.register = async (req, res) => {
    try {
        const { name, email, password, skillsOffered, skillsWanted, bio } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            skillsOffered,
            skillsWanted,
            bio
        });

        await newUser.save();

        // // Generate JWT
        // const token = jwt.sign({ id: newUser.id }, JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
