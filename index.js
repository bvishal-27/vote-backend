const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import Routes
const authRoutes = require('./routes/authRoutes');
const pollRoutes = require('./routes/pollRoutes');

const app = express();

// CORS Configuration
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'https://pollpulse-two.vercel.app',
      'https://live-polls-three.vercel.app'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  })
);

// Middleware
app.use(express.json());

// Test Route
app.get('/test', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Backend is working!'
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/polls', pollRoutes);

// Database Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas');
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

// Start Server
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});