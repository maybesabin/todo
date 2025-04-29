const express = require("express");
const router = express.Router();
const {
    addTask,
    viewTasks,
    updateTask,
    deleteTask,
    searchTask,
    completeTask,
    deleteCompleted,
    deleteAll,
    deleteActive
} = require("../controllers/taskController")
const { authMiddleware } = require("../middleware/authMiddleware")

router.post("/", authMiddleware, addTask);
router.get("/", authMiddleware, viewTasks);
router.delete("/delete-completed", authMiddleware, deleteCompleted)
router.delete("/delete-all", authMiddleware, deleteAll)
router.delete("/delete-active", authMiddleware, deleteActive)
router.get("/search", authMiddleware, searchTask)
router.put("/:taskId", authMiddleware, updateTask);
router.delete("/:taskId", authMiddleware, deleteTask)
router.put("/complete/:taskId", authMiddleware, completeTask)

module.exports = router;