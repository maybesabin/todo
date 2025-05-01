const express = require("express");
const router = express.Router();
const { signup, login, profile } = require("../controllers/authController")
const { authMiddleware } = require("../middleware/authMiddleware")
const { upload } = require("../config/cloudinary.config")

router.post("/signup", upload.single('profilePic'), signup)
router.post("/login", login)
router.get("/profile", authMiddleware, profile);

module.exports = router;
