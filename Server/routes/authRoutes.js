const express = require('express');
const router = express.Router();

// Import controllers
const { register } = require('../controllers/registerController');
const { login } = require('../controllers/loginController');

// Routes
router.post('/register', register);
router.post('/login', login);

module.exports = router;
