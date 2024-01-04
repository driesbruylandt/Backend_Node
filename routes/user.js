const express = require("express");
const User = require("../Models/User");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

router.get("/", (req, res) => {
  res.send("User route");
});

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await new User({ name, email, password });
    await user.save();
    res.status(201).json({ user, message: "User created" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({
      email,
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Incorrect password" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.send({ user, token, message: "Logged in" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/showUsers", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;

    const users = await User.find().limit(limit).skip(offset);
    res.status(200).json({ users, message: "Users found" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/delete", auth, async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ _id: req.user._id });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user, message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/update", auth, async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["name", "email", "password"];
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );
    if (!isValidOperation) {
      return res.status(400).json({ message: "Invalid update" });
    }
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    res.json({ user: req.user, message: "User updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;
