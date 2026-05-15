const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // Get token from header (Format: Bearer <token>)
    const token = req.header('Authorization')?.split(" ")[1];
    if (!token) return res.status(401).json({ msg: "No token, access denied" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.userId; 
        next();
    } catch (err) {
        res.status(401).json({ msg: "Token is not valid" });
    }
};