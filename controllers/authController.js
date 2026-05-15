const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { username, email,password } = req.body;
        
        // 1. Check if user already exists
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: "User already exists" });

        // 2. Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Create and Save user
        user = new User({
            username,
            email,
            password: hashedPassword
        });

        await user.save();

        // 4. Return a Success message
        res.status(201).json({ msg: "User registered successfully!" });

    } catch (err) {
        res.status(500).send("Server Error");
    }
};
// Add this to your existing controllers/authController.js
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Check if user exists
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: "Invalid Credentials" });

        // 2. Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid Credentials" });

        // 3. Create JWT Token
        const payload = { userId: user._id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token, username: user.username });

    } catch (err) {
        res.status(500).send("Server Error");
    }
};