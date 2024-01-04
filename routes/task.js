const express = require("express");
const User = require("../Models/User");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Task route");
});

// CRUD tasks
module.exports = router;
