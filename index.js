const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// 1. Import Routes
const authRoutes = require('./routes/authRoutes');
const pollRoutes = require('./routes/pollRoutes');

const app = express();

// 2. Middleware - THE FIX FOR 204/CORS ERRORS
app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://live-polls-three.vercel.app'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    // This is the specific fix for the "204" preflight error
    optionsSuccessStatus: 200 
}));

// Explicitly handle preflight for all routes
app.options('*', cors());

app.use(express.json());

// 3. Database Connection
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ Pulse Engine: Connected to MongoDB Atlas"))
    .catch((err) => console.error("❌ MongoDB connection error:", err.message));

// 4. Register Routes
app.use('/api/auth', authRoutes);
app.use('/api/polls', pollRoutes);

// Health Check Route
app.get('/test', (req, res) => {
    res.status(200).json({ 
        message: "Backend is working!", 
        status: "Online",
        time: new Date().toISOString()
    });
});

// 5. Start Server 
// Render provides the PORT dynamically, so we must use process.env.PORT
const PORT = process.env.PORT || 5001;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Pulse Server is live and listening on port ${PORT}`);
});