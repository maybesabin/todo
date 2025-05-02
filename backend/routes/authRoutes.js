const express = require("express");
const router = express.Router();
const { signup, login, profile, updateProfile } = require("../controllers/authController")
const { authMiddleware } = require("../middleware/authMiddleware")
const { upload } = require("../config/cloudinary.config")

router.post("/signup", upload.single('profilePic'), signup)
router.post("/login", login)
router.get("/profile", authMiddleware, profile);
router.put("/update-profile", authMiddleware, upload.single('profilePic'), updateProfile);

module.exports = router;
