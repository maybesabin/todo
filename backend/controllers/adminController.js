const User = require("../models/authModel");
const Task = require("../models/taskModel")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

exports.adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email, role: 'admin' });

        if (!user) {
            return res.status(400).json({ message: "Admin doesn't exist with this email." })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Passwords do not match!" })
        }

        const token = jwt.sign(
            { _id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d", audience: "todo", issuer: "todo" }
        )

        res.status(200).json({ message: "Logged in successfully as admin.", token: token })

    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

exports.adminSignup = async (req, res) => {
    try {
        const { email, password } = req.body;

        let user = await User.findOne({ email, role: 'admin' })

        if (user) {
            return res.status(400).json({ message: "Admin with this email already exists!" })
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = new User({
            email,
            password: hashedPassword,
            role: 'admin',
            tasks: []
        })

        await newAdmin.save()
        res.status(200).json({ message: "Admin created successfully!" })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find({ role: "user" }).select('-password'); //excludes passwords
        res.status(200).json({
            message: "Users fetched successfully!",
            users: users
        })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find();
        res.status(200).json({
            message: "Tasks fetched successfully!",
            tasks
        })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}


exports.getUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findOne({ _id: userId }).select("-password");
        if (!user) {
            return res.status(400).json({ message: "User not found!" })
        }
        return res.status(200).json({ user: user })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;

        await User.findByIdAndDelete({ _id: userId, role: 'user' })

        res.status(200).json({ message: "User deleted successfully!" })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

exports.updateUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { username, email, password } = req.body;

        const user = await User.findOne({ _id: userId, role: 'user' }).select("-password")
        if (!user) {
            return res.status(400).json({ message: "User not found!" })
        }

        const updatedUser = await User.findByIdAndUpdate({ _id: userId },
            {
                role: 'user',
                username,
                email,
                password
            }, { new: true }
        )
        res.status(200).json({ messsage: "User updated successfully!", user: updatedUser })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}