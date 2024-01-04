const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Test github
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          return !/\d/.test(value);
        },
        message: "Name cannot contain numbers",
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (value) {
          return /\S+@\S+\.\S+/.test(value);
        },
        message: "Invalid email format",
      },
    },
    password: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          return /^(?=.*[A-Z]).{10,}$/.test(value);
        },
        message:
          "Password must contain at least one capital letter and be at least 10 characters long",
      },
    },
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
