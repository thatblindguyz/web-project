const bcrypt = require("bcrypt");
const express = require("express");
const Joi = require("joi");
const { User } = require("../models/user");
const getAuthToken = require("../utility/genAuthToken");

const router = express.Router();

router.post("/login", async (req, res) => {
  // Validate input
  const schema = Joi.object({
    email: Joi.string().trim().lowercase().email().min(5).max(255).required(),
    password: Joi.string().trim().min(5).max(255).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  // Check if user exists
  let user = await User.findOne({ email: req.body.email }).select("+password");
  if (!user) {
    return res.status(400).send("Sai tên email hoặc mật khẩu.");
  }

  // Check if password is correct
  const isValid = await bcrypt.compare(req.body.password, user.password);
  if (!isValid) {
    return res.status(400).send("Sai tên email hoặc mật khẩu.");
  }

  // Generate auth token
  const token = getAuthToken(user);
  res.send(token);
});

module.exports = router;
