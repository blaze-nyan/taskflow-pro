const express = require("express");

//models
const User = require("../models/User");
const Task = require("../models/Task");
const router = express.Router();

router.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    if (!users) {
      return res.status(400).json({ message: "No User Found" });
    }
    res.status(200).json({ message: "Users Found", users: users });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});
router.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    if (!tasks) {
      return res.status(400).json({ message: "No Task Found" });
    }
    res.status(200).json({ message: "Tasks Found", tasks: tasks });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});
router.delete("/users/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const deletedUser = await User.findOneAndDelete({ _id: id });
    if (!deletedUser) {
      return res.status(400).json({ message: "Fail to delete user" });
    }
    res.status(201).json({ message: "User deleted", user: deletedUser });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});
module.exports = router;
