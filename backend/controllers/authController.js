const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/authModel")

exports.signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        let user = await User.findOne({ username, email });
        if (user) {
            return res.status(400).json({ message: "User with this email/username already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role: 'user'
        });

        await newUser.save();
        res.status(200).json({ message: "User created successfully!" })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
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
        const userId = req.user._id;

        const user = await User.findById(userId).select("username email role");
        if (!user) {
            return res.status(400).json({ message: "User not found!" })
        }

        res.status(200).json({ username: user.username, email: user.email, role: user.role });
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}