const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 100,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      minlength: 5,
      maxlength: 255,
    },

    password: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 255,
      select: false,
    },

    isAdmin: {
      type: Boolean,
      default: false,
    },
    resetToken: String,

    resetTokenExpire: Date,
  },

  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

exports.User = User;
