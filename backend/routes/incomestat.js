const Order = require("../models/order");
const { auth, isAdmin } = require("../middleware/auth");

const router = require("express").Router();

//  INCOME STATS (MONTHLY)

router.get("/stats", auth, isAdmin, async (req, res) => {
  try {
    const income = await Order.aggregate([
      {
        $match: {
          createdAt: { $exists: true },
          payment_status: "paid",
        },
      },

      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$total",
        },
      },

      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },

      {
        $sort: { _id: -1 },
      },

      {
        $limit: 2,
      },
    ]);

    res.status(200).send(income);
  } catch (err) {
    console.error("Income stats error:", err);
    res.status(500).send(err.message);
  }
});

//  INCOME STATS (LAST 7 DAYS)

router.get("/weeksales", auth, isAdmin, async (req, res) => {
  try {
    const today = new Date();

    const last7Days = new Date();
    last7Days.setDate(today.getDate() - 7);

    const income = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: last7Days },
          payment_status: "paid",
        },
      },

      {
        $project: {
          day: { $isoDayOfWeek: "$createdAt" }, // Mon=1
          sales: "$total",
        },
      },

      {
        $group: {
          _id: "$day",
          total: { $sum: "$sales" },
        },
      },

      {
        $sort: { _id: 1 },
      },
    ]);

    res.status(200).send(income);
  } catch (err) {
    console.error("Weekly income error:", err);
    res.status(500).send(err.message);
  }
});

// TOTAL INCOME (ALL TIME)

router.get("/all", auth, isAdmin, async (req, res) => {
  try {
    const income = await Order.aggregate([
      {
        $match: {
          payment_status: "paid",
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$total" },
        },
      },
    ]);

    res.status(200).send(income);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

module.exports = router;
