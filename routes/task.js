const express = require("express");
const User = require("../Models/User");
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
    const { name, description } = req.body;
    const user = req.user;
    const task = await new Task({ name, description, user });
    await task.save();
    res.status(201).json({ task, message: "Task created" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;
