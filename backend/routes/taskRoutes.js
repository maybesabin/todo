const express = require("express");
const router = express.Router();
const { addTask, viewTasks, updateTask, deleteTask, searchTask, completeTask } = require("../controllers/taskController")
const { authMiddleware } = require("../middleware/authMiddleware")

router.post("/", authMiddleware, addTask);
router.get("/", authMiddleware, viewTasks);
router.put("/:taskId", authMiddleware, updateTask);
router.delete("/:taskId", authMiddleware, deleteTask)
router.get("/search", authMiddleware, searchTask)
router.put("/complete/:taskId", authMiddleware, completeTask)

module.exports = router;