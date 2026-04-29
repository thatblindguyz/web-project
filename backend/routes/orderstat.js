const Order = require("../models/order");
const { auth, isAdmin } = require("../middleware/auth");

const router = require("express").Router();

//  ORDER STATS (MONTHLY)

router.get("/stats", auth, isAdmin, async (req, res) => {
  try {
    const orders = await Order.aggregate([
      {
        $match: {
          createdAt: { $exists: true },
        },
      },

      {
        $project: {
          month: { $month: "$createdAt" },
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
    res.status(200).send(orders);
  } catch (err) {
    console.error("Order stats error:", err);
    res.status(500).send(err.message);
  }
});

//  ORDER STATS (last 7 days)

router.get("/week-sales", auth, isAdmin, async (req, res) => {
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
    console.log(err);
    res.status(500).send(err.message);
  }
});

// get recent orders

router.get("/", auth, isAdmin, async (req, res) => {
  const query = req.query.new;

  try {
    const orders = query
      ? await Order.find()
          .populate("userId", "name")
          .sort({ createdAt: -1 })
          .limit(4)
      : await Order.find().populate("userId", "name").sort({ createdAt: -1 });

    res.status(200).send(orders);
  } catch (err) {
    console.log(err);

    res.status(500).send(err);
  }
});

module.exports = router;
