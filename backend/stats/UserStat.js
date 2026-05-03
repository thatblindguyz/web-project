const router = require("express").Router();

const { User } = require("../models/user");

const { auth, isAdmin } = require("../middleware/auth");

/* ============================
   GET ALL USERS
============================ */

router.get("/", auth, isAdmin, async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });

    res.status(200).send(users);
  } catch (err) {
    console.log(err);

    res.status(500).send(err.message);
  }
});

/* ============================
   USER STATS
============================ */

router.get("/stats", auth, isAdmin, async (req, res) => {
  try {
    const users = await User.aggregate([
      {
        $project: {
          month: {
            $month: "$createdAt",
          },
        },
      },

      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },

      {
        $sort: { _id: -1 },
      },

      {
        $limit: 2,
      },
    ]);

    res.status(200).send(users);
  } catch (err) {
    console.log(err);

    res.status(500).send(err.message);
  }
});

module.exports = router;
