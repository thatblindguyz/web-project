const express = require("express");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

const { User } = require("../models/user");

const router = express.Router();

/* =========================
   FORGOT PASSWORD
========================= */

router.post("/forgot-password", async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
    });

    if (!user) {
      return res.status(404).send("User not found");
    }

    // CREATE TOKEN
    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetToken = resetToken;

    user.resetTokenExpire = Date.now() + 1000 * 60 * 15;

    await user.save();

    // EMAIL TRANSPORT
    const transporter = nodemailer.createTransport({
      service: "gmail",

      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // RESET LINK
    const resetLink = `http://localhost:3000/reset-password/${resetToken}`;

    // SEND EMAIL
    await transporter.sendMail({
      from: process.env.EMAIL_USER,

      to: user.email,

      subject: "Reset Password",

      html: `
        <h2>Password Reset</h2>

        <p>Click below to reset password:</p>

        <a href="${resetLink}">
          ${resetLink}
        </a>
      `,
    });

    res.send("Reset email sent");
  } catch (err) {
    console.log(err);

    res.status(500).send(err.message);
  }
});

/* =========================
   RESET PASSWORD
========================= */

router.post("/reset-password/:token", async (req, res) => {
  try {
    const user = await User.findOne({
      resetToken: req.params.token,

      resetTokenExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).send("Invalid or expired token");
    }

    // HASH NEW PASSWORD
    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(req.body.password, salt);

    user.resetToken = undefined;
    user.resetTokenExpire = undefined;

    await user.save();

    res.send("Password reset successful");
  } catch (err) {
    console.log(err);

    res.status(500).send(err.message);
  }
});

module.exports = router;
