const express = require("express");
const router = express.Router();
const { addTask, viewTask, updateTask, deleteTask } = require("../controllers/taskController")
const authMiddleware = require("../middleware/authMiddleware")

router.post("/", authMiddleware, addTask);
router.get("/", authMiddleware, viewTask);
router.put("/:taskId", authMiddleware, updateTask);
router.delete("/:taskId", authMiddleware, deleteTask)

module.exports = router;