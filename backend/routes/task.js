const express = require("express");
const Task = require("../models/Task");
const router = express.Router();

// get all tasks route for user
router.get("/", async (req, res) => {
  const userId = req.userId;
  try {
    const tasks = await Task.find({ userId: userId });
    console.log("Tasks:", tasks);
    res.json({ message: "These are all the tasks", tasks: tasks });
  } catch (error) {
    console.error("Failed to retrieve all tasks", error);
    res.status(500).json({ message: "Server Error in retrieving tasks" });
  }
});
// crate task route
router.post("/create", async (req, res) => {
  try {
    const userId = req.userId;
    const { title, description, category, priority } = req.body;
    if (!title) {
      return res.status(400).json({ message: "Title must be filled" });
    }
    const newTask = new Task({
      userId: userId,
      title: title,
      description: description,
      category: category,
      priority: priority,
    });
    await newTask.save();
    res
      .status(201)
      .json({ message: "New Task is successfully created", task: newTask });
  } catch (error) {
    console.error("Failed to save the new task", error);
    res.status(500).json({ message: "Server Error in creating new task" });
  }
});
// get specific task route
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const desireTask = await Task.findById(id);
    if (!desireTask) {
      return res.status(400).json({ message: "Can't find the task" });
    }
    res.status(201).json({ message: "Task found", task: desireTask });
  } catch (error) {
    res.status(500).json({ message: "Server Error in finding task" });
  }
});
//update specific task route
router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const task = req.body;
    const updatedTask = await Task.findByIdAndUpdate(id, task, { new: true });
    if (!updatedTask) {
      return res.status(400).json({ message: "Task not found" });
    }
    res.status(201).json({ message: "Task Updated", task: updatedTask });
  } catch (error) {
    res.status(500).json({ message: "Task Update Error" });
  }
});
//delete task
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const deletedTask = await Task.findByIdAndDelete(id);
    if (!deletedTask) {
      return res.status(400).json({ message: "Deleting Task Failed" });
    }
    res.status(201).json({ message: "Task Deleted", task: deletedTask });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
