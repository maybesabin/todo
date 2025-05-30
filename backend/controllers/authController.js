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

        const checkEmail = await User.findOne({ email })
        if (checkEmail) {
            return res.status(400).json({ message: "User with this email already exists" });
        }

        const checkUsername = await User.findOne({ username })
        if (checkUsername) {
            return res.status(400).json({ message: "User with this username already exists" });
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
            return res.status(400).json({ message: "Incorrect credentials." })
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

exports.updateProfile = async (req, res) => {
    try {
        const { username, email, profilePic, password } = req.body;
        const user = req.user;

        const currentUser = await User.findOne({ _id: user._id, role: 'user' }).select("-password");
        if (!currentUser) {
            return res.status(400).json({ message: "User not found!" });
        }

        if (username) {
            const usernameExists = await User.findOne({ username, role: 'user', _id: { $ne: user._id } });
            if (usernameExists) {
                return res.status(400).json({ message: "Username already in use!" });
            }
            currentUser.username = username;
        }

        if (email) {
            const emailExists = await User.findOne({ email, role: 'user', _id: { $ne: user._id } });
            if (emailExists) {
                return res.status(400).json({ message: "Email already in use!" });
            }
            currentUser.email = email;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect credentials!" });
        }

        currentUser.username = username;
        currentUser.email = email;

        if (req.file && req.file.path) {
            currentUser.profilePic = req.file.path;
        }

        await currentUser.save();

        res.status(200).json({ message: "Profile updated successfully", user: currentUser });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
