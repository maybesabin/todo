const Task = require("../models/taskModel");
const User = require("../models/authModel");

exports.addTask = async (req, res) => {
    try {
        const { title, description, category } = req.body;
        if (!title || !description || !category) {
            return res.status(400).json({ message: "Fields cannot be empty!" })
        }

        const userId = req.user._id;

        const task = new Task({ title, description, category, user: userId })
        const savedTask = await task.save();

        //add tasks to array
        await User.findOneAndUpdate(
            userId,
            { $push: { tasks: savedTask } },
            { new: true }
        )

        res.status(200).json({ message: "Task added successfully!" });
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

exports.viewTask = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId).populate('tasks');
        if (!user) {
            return res.status(400).json({ message: "User not found." })
        }

        res.status(200).json({
            message: "Task fetched successfully!",
            tasks: user.tasks
        })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

exports.updateTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { title, description, category } = req.body;
        const userId = req.user._id;

        //find task
        const task = await Task.findById(taskId);
        if (!task) {
            res.status(400).json({ message: "Task not found" })
        }

        //verify task belongs to the user
        if (task.user?.toString() !== userId.toString()) {
            return res.status(400).json({ message: "You are not authorized to update this task." })
        }

        const updatedTask = await Task.findByIdAndUpdate(
            taskId,
            { title, description, category },
            { new: true }
        )

        res.status(200).json({ message: "Task updated successfully!", task: updatedTask })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

exports.deleteTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const userId = req.user._id;

        const task = await Task.findById(taskId);

        //check whether task belongs to user or not
        if (task.user?.toString() !== userId.toString()) {
            return res.status(400).json({ message: "You are not authorized to update this task." })
        }

        await Task.findByIdAndDelete(taskId);
        res.status(200).json({ message: "Task deleted successfully!" })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}
