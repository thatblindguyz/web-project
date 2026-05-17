const express = require("express");

const router = express.Router();

const { User } = require("../models/user");

const { auth, isAdmin } = require("../middleware/auth");

/* ============================
   GET ALL USERS
============================ */

router.get("/", auth, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).send(users);
  } catch (err) {
    console.log(err);

    res.status(500).send(err.message);
  }
});

/* ============================
   GET SINGLE USER
============================ */

router.get("/:id", auth, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).send("User not found");
    }

    res.status(200).send(user);
  } catch (err) {
    console.log(err);

    res.status(500).send(err.message);
  }
});

/* ============================
   DELETE USER
============================ */

router.delete("/:id", auth, isAdmin, async (req, res) => {
  try {
    if (req.user._id.toString() === req.params.id) {
      return res.status(400).send("Không thể tự xóa tài khoản admin!");
    }
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).send("Không tìm thấy người dùng!");
    }

    res.status(200).send("Người dùng đã được xóa thành công!");
  } catch (err) {
    console.log(err);

    res.status(500).send(err.message);
  }
});

module.exports = router;
