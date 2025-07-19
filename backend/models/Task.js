const mongoose = require("mongoose");
const { Schema } = mongoose;

const task = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: { type: String, required: true },
  description: { type: String, required: true, default: "Have to do this" },
  category: { type: String, required: true, default: "HomeWork" },
  priority: {
    type: String,
    required: true,
    enum: ["Low", "Medium", "High", "Urgent"],
    default: "Low",
  },
  startDate: Date,
  dueDate: Date,
  started: Boolean,
  pause: Boolean,
  overDued: Boolean,
});

const Task = mongoose.model("Task", task);
module.exports = Task;
