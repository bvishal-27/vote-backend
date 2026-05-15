const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// 1. Import Routes
const authRoutes = require('./routes/authRoutes');
const pollRoutes = require('./routes/pollRoutes');

const app = express();

// 2. Middleware - CLEANED & UPDATED
app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://live-polls-three.vercel.app' // Only your local dev and actual live site
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], 
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());

// 3. Database Connection
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ Pulse Engine: Connected to MongoDB Atlas"))
    .catch((err) => console.error("❌ MongoDB connection error:", err.message));

// 4. Register Routes
app.use('/api/auth', authRoutes);
app.use('/api/polls', pollRoutes);

// Test Route
app.get('/test', (req, res) => {
    res.status(200).json({ message: "Backend is working!" });
});

// 5. Start Server 
const PORT = process.env.PORT || 5001;

// Binding to '0.0.0.0' for Render deployment stability
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Pulse Server synchronizing on port ${PORT}`);
});