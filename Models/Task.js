const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    description: { type: String, required: true },
    completed: { type: Boolean, default: false },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model("task", taskSchema);
module.exports = Task;
