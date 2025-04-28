const express = require("express")
const router = express.Router();
const { authMiddleware, adminAuthMiddleware } = require("../middleware/authMiddleware")
const {
    adminLogin,
    adminSignup,
    getUsers,
    getTasks,
    getUser,
    deleteUser,
    updateUser
} = require("../controllers/adminController")

//auth routes
router.post("/login", adminLogin)
router.post("/signup", adminSignup)

//user routes
router.get("/user/:userId", authMiddleware, adminAuthMiddleware, getUser)
router.delete("/user/:userId", authMiddleware, adminAuthMiddleware, deleteUser)
router.put("/user/:userId", authMiddleware, adminAuthMiddleware, updateUser)

//other routes
router.get("/users", authMiddleware, adminAuthMiddleware, getUsers)
router.get("/tasks", authMiddleware, adminAuthMiddleware, getTasks)

module.exports = router;