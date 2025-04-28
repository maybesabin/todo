const express = require("express");
const router = express.Router();
const { addTask, viewTasks, viewTask, updateTask, deleteTask, searchTask } = require("../controllers/taskController")
const { authMiddleware } = require("../middleware/authMiddleware")

router.post("/", authMiddleware, addTask);
router.get("/", authMiddleware, viewTasks);
router.get("/:taskId", authMiddleware, viewTask);
router.put("/:taskId", authMiddleware, updateTask);
router.delete("/:taskId", authMiddleware, deleteTask)
router.get("/search", authMiddleware, searchTask)

module.exports = router;