const Order = require("../models/order");
const { auth, isAdmin } = require("../middleware/auth");

const router = require("express").Router();

/* ============================
   ORDER STATS (MONTHLY)
============================ */

router.get("/stats", auth, isAdmin, async (req, res) => {
  try {
    const orders = await Order.aggregate([
      {
        $match: {
          createdAt: { $exists: true },

          delivery_status: {
            $ne: "cancelled",
          },
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

/* ============================
   ORDER STATS (LAST 7 DAYS)
============================ */

router.get("/week-sales", auth, isAdmin, async (req, res) => {
  try {
    const today = new Date();

    const last7Days = new Date();

    last7Days.setDate(today.getDate() - 6);

    const income = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: last7Days },

          payment_status: "paid",

          delivery_status: {
            $ne: "cancelled",
          },
        },
      },

      {
        $project: {
          day: { $dayOfMonth: "$createdAt" },

          month: { $month: "$createdAt" },

          total: "$total",
        },
      },

      {
        $group: {
          _id: {
            day: "$day",

            month: "$month",
          },

          total: { $sum: "$total" },

          count: { $sum: 1 },
        },
      },
    ]);

    const formatted = income.map((item) => ({
      _id: `${item._id.day}/${item._id.month}`,

      total: item.total,

      count: item.count,
    }));

    res.status(200).send(formatted);
  } catch (err) {
    console.log(err);

    res.status(500).send(err.message);
  }
});

/* ============================
   GET RECENT ORDERS
============================ */

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

/* ============================
   GET 1 ORDER
============================ */

router.get("/find/:id", auth, isAdmin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    res.status(200).send(order);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/* ============================
   GET USER ORDERS
============================ */

router.get("/my-orders", auth, async (req, res) => {
  try {
    const orders = await Order.find({
      userId: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).send(orders);
  } catch (err) {
    console.log(err);

    res.status(500).send(err.message);
  }
});

/* ============================
   GET USER ORDER DETAIL
============================ */

router.get("/my-orders/:id", auth, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,

      userId: req.user._id,
    });

    if (!order) {
      return res.status(404).send("Order not found");
    }

    res.status(200).send(order);
  } catch (err) {
    console.log(err);

    res.status(500).send(err.message);
  }
});

/* ============================
   CANCEL ORDER (USER)
============================ */

router.put("/cancel/:id", auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).send("Order not found");
    }

    if (order.delivery_status === "delivered") {
      return res.status(400).send("Already delivered");
    }

    order.delivery_status = "cancelled";

    await order.save();

    res.status(200).send(order);
  } catch (err) {
    console.log(err);

    res.status(500).send(err.message);
  }
});

/* ============================
   UPDATE DELIVERY STATUS (ADMIN)
============================ */

router.put("/delivery/:id", auth, isAdmin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).send("Order not found");
    }

    const newStatus = req.body.status;

    if (order.delivery_status === "cancelled") {
      return res.status(400).send("Cannot update cancelled order");
    }

    if (order.delivery_status === "delivered") {
      return res.status(400).send("Order already completed");
    }

    const validTransitions = {
      pending: ["delivering", "cancelled"],

      delivering: ["delivered"],
    };

    const allowed = validTransitions[order.delivery_status] || [];

    if (!allowed.includes(newStatus)) {
      return res.status(400).send("Invalid status transition");
    }

    order.delivery_status = newStatus;

    await order.save();

    res.status(200).send(order);
  } catch (err) {
    console.log(err);

    res.status(500).send(err.message);
  }
});

/* ============================
   UPDATE PAYMENT STATUS
============================ */

router.put("/:id/pay", auth, isAdmin, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        payment_status: "paid",
      },
      {
        returnDocument: "after",
      },
    );

    res.status(200).send(order);
  } catch (err) {
    console.log(err);

    res.status(500).send(err.message);
  }
});

module.exports = router;
