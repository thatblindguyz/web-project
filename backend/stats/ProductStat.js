const router = require("express").Router();
const Product = require("../models/product");
const Order = require("../models/order");

const { auth, isAdmin } = require("../middleware/auth");

/* ============================
   TOP SELLING PRODUCTS
============================ */

router.get("/top-products", auth, isAdmin, async (req, res) => {
  try {
    const topProducts = await Order.aggregate([
      {
        $match: {
          delivery_status: {
            $ne: "cancelled",
          },
        },
      },

      {
        $unwind: "$products",
      },

      {
        $group: {
          _id: "$products.id",

          totalSold: {
            $sum: "$products.cartQuantity",
          },

          name: {
            $first: "$products.name",
          },

          image: {
            $last: "$products.image",
          },

          price: {
            $first: "$products.price",
          },
        },
      },

      {
        $sort: {
          totalSold: -1,
        },
      },

      {
        $limit: 5,
      },
    ]);

    res.status(200).json(topProducts);
  } catch (err) {
    console.log(err);

    res.status(500).json(err.message);
  }
});

module.exports = router;
