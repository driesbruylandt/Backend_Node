const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Test github
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    const hash = await bcrypt.hash(user.password, 10);
    user.password = hash;
  }
  next();
});

const User = mongoose.model("user", userSchema);
module.exports = User;
