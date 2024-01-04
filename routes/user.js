const express = require("express");
const User = require("../Models/User");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

module.exports = router;
