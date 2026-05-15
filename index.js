const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const pollRoutes = require('./routes/pollRoutes');

const app = express();

// 1. CLEAN CORS - No wildcards to prevent 'Status 1' crashes
app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://live-polls-three.vercel.app'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200
}));

app.use(express.json());

// 2. ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/polls', pollRoutes);

// Health Check
app.get('/test', (req, res) => {
    res.status(200).json({ message: "Backend is working!" });
});

// 3. DATABASE
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ Database Connected Successfully"))
    .catch((err) => {
        console.error("❌ Database Connection Failed:", err.message);
        process.exit(1); // Exit if DB fails
    });

// 4. SERVER
const PORT = process.env.PORT || 5001;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
});