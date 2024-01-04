const express = require("express");
const Task = require("../Models/Task");
const router = express.Router();
const auth = require("../middleware/auth");

router.get("/test", auth, (req, res) => {
  res.json({
    message: "Task route",
    user: req.user,
  });
});

router.post("/create", auth, async (req, res) => {
  try {
    const task = new Task({ ...req.body, user: req.user._id });
    await task.save();
    res.status(201).json({ task, message: "Task created" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/showTasks", auth, async (req, res) => {
  try {
    const completed = req.query.completed;
    let query = { user: req.user._id };
    if (completed !== undefined) {
      query.completed = completed.toLowerCase() === "true";
    }
    const tasks = await Task.find(query);
    res.status(200).json({ tasks, message: "Tasks found" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/showTask/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findOne({ _id, user: req.user._id });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json({ task, message: "Task found" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/update/:id", auth, async (req, res) => {
  const _id = req.params.id;
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "completed"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).json({ message: "Invalid update" });
  }

  try {
    const task = await Task.findOne({ _id, user: req.user._id });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    updates.forEach((update) => (task[update] = req.body[update]));
    await task.save();
    res.json({ task, message: "Task updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/delete/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findOneAndDelete({ _id, user: req.user._id });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json({ task, message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;
