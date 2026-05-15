const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Route: POST /api/auth/registers
router.post('/register', authController.register);
// Add this to routes/authRoutes.js
router.post('/login', authController.login);

module.exports = router; 