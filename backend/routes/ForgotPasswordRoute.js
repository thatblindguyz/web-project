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
      return res.status(404).send("Không tìm thấy người dùng!");
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
      from: `"TECHCOM Support" <${process.env.EMAIL_USER}>`,

      to: user.email,

      subject: "TECHCOM - Yêu cầu đặt lại mật khẩu",

      html: `
  <div style="
    font-family: Arial, sans-serif;
    max-width: 600px;
    margin: auto;
    padding: 24px;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    background: #ffffff;
  ">
    <h2 style="
      color: #1d4ed8;
      margin-bottom: 20px;
    ">
      Đặt lại mật khẩu TECHCOM
    </h2>

    <p>Xin chào <b>${user.name}</b>,</p>

    <p>
      Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.
    </p>

    <p>
      Nhấn vào nút bên dưới để tạo mật khẩu mới:
    </p>

    <a
      href="${resetLink}"
      style="
        display: inline-block;
        margin-top: 12px;
        padding: 12px 22px;
        background: #1d4ed8;
        color: #ffffff;
        text-decoration: none;
        border-radius: 8px;
        font-weight: bold;
      "
    >
      Đặt lại mật khẩu
    </a>

    <p style="
      margin-top: 24px;
      color: #475569;
    ">
      Liên kết này sẽ hết hạn sau 15 phút.
    </p>

    <p style="
      color: #475569;
    ">
      Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.
    </p>

    <hr style="
      margin: 24px 0;
      border: none;
      border-top: 1px solid #e2e8f0;
    " />

    <p style="
      font-size: 12px;
      color: #94a3b8;
      text-align: center;
    ">
      © 2026 TECHCOM. All rights reserved.
    </p>
  </div>
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
      return res.status(400).send("Token không hợp lệ hoặc đã hết hạn");
    }

    // HASH NEW PASSWORD
    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(req.body.password, salt);

    user.resetToken = undefined;
    user.resetTokenExpire = undefined;

    await user.save();

    res.send("Đặt lại mật khẩu thành công!");
  } catch (err) {
    console.log(err);

    res.status(500).send(err.message);
  }
});

module.exports = router;
