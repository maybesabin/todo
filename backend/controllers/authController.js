const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/authModel")

exports.signup = async (req, res) => {
    try {
        console.log("Request body:", req.body);
        console.log("File:", req.file);

        const { username, email, password } = req.body;

        // Get profile pic URL from Cloudinary
        const profilePic = req.file ? req.file.path : '';

        // Check if user exists
        let user = await User.findOne({ $or: [{ username }, { email }] });
        if (user) {
            return res.status(400).json({ message: "User with this email/username already exists" });
        }

        // Create new user
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role: 'user',
            profilePic
        });

        await newUser.save();
        res.status(200).json({ message: "User created successfully!" });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({
            message: "Error creating user",
            error: error.message
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email, role: 'user' });
        if (!user) {
            return res.status(400).json({ message: "User doesn't exist with this email." })
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Passwords do not match." })
        }

        const token = jwt.sign(
            { _id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d", audience: "todo", issuer: "todo" }
        )

        res.status(200).json({ message: "Logged in successfully!", role: user.role, token: token })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

exports.profile = async (req, res) => {
    try {
        const user = await User.findById(req.user)
        if (!user) {
            return res.status(400).json({ message: "User not found!" })
        }

        res.status(200).json({
            username: user.username,
            email: user.email,
            role: user.role,
            profilePic: user.profilePic
        });
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}