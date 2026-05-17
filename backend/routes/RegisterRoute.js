const bcrypt = require("bcrypt");
const express = require("express");
const Joi = require("joi");
const { User } = require("../models/user");
const genAuthToken = require("../utility/genAuthToken");

const router = express.Router();

// Register route
router.post("/register", async (req, res) => {
  try {
    // Validate input
    const schema = Joi.object({
      name: Joi.string().min(3).max(100).required(),
      email: Joi.string().trim().lowercase().email().min(5).max(255).required(),
      password: Joi.string().min(5).max(255).required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    // Check if user exists
    let user = await User.findOne({ email: req.body.email });

    if (user) {
      return res.status(400).send("Người dùng đã tồn tại!");
    }

    // Create new user
    user = new User({
      name: req.body.name,
      email: req.body.email.trim().toLowerCase(),
      password: req.body.password,
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    // Save user
    user = await user.save();

    // Generate token
    const token = genAuthToken(user);

    res.send(token);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
