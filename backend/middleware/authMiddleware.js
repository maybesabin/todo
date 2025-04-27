const jwt = require("jsonwebtoken")
const User = require("../models/authModel");

exports.authMiddleware = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.split(" ")[1];
        if (!token) {
            return res.status(400).json({ message: "Authentication required." })
        }

        //verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        //find user
        const user = await User.findById(decoded._id);
        if (!user) {
            return res.status(400).json({ message: "User not found" })
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

exports.adminAuthMiddleware = async (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(400).json({ message: "Access denied!" });
    }
    next();
}
