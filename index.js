const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// 1. Import Routes
const authRoutes = require('./routes/authRoutes');
const pollRoutes = require('./routes/pollRoutes');

const app = express();

// 2. Middleware
app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://pollpulse-two.vercel.app'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());

// 3. Database Connection
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ Connected to MongoDB Atlas"))
    .catch((err) => console.error("❌ MongoDB connection error:", err.message));

// 4. Register Routes
app.use('/api/auth', authRoutes);
app.use('/api/polls', pollRoutes);

// Test Route
app.get('/test', (req, res) => {
    res.status(200).json({ message: "Backend is working!" });
});

// 5. Start Server .
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
}); 