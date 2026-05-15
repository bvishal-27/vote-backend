const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const pollRoutes = require('./routes/pollRoutes');

const app = express();

// --- STEP 1: CORS MUST BE FIRST ---
app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://live-polls-three.vercel.app'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Explicitly allow OPTIONS
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200 // Fixes the "204" issue for many browsers
}));

// --- STEP 2: EXPLICIT OPTIONS HANDLER ---
// This ensures that when the browser asks "Can I send a POST?", the server says YES immediately.
app.options('*', cors()); 

// --- STEP 3: OTHER MIDDLEWARE ---
app.use(express.json());

// --- STEP 4: ROUTES ---
app.use('/api/auth', authRoutes);
app.use('/api/polls', pollRoutes);

// Database and Server Start...
const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ Pulse Engine: Active"))
    .catch((err) => console.error("❌ DB Error:", err.message));

const PORT = process.env.PORT || 5001;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server on port ${PORT}`);
});