const express = require("express");
const Order = require("../models/order");
const Product = require("../models/product");

const router = express.Router();

/* ============================
   CHUYỂN KHOẢN QR
============================ */

router.post("/create", express.json(), async (req, res) => {
  try {
    const { items, userId, totalAmount, customerInfo } = req.body;

    if (!items || !userId || totalAmount == null) {
      return res.status(400).send("Thiếu thông tin đơn hàng");
    }

    const products = [];

    for (const item of items) {
      const product = await Product.findById(item._id);

      if (!product) continue;

      products.push({
        id: product._id,

        name: product.name,

        category: product.category,

        shortDesc: product.shortDesc,

        desc: product.desc,

        price: product.price,

        image: product.image,

        cartQuantity: item.cartQuantity,
      });

      /* ================= STOCK ================= */

      if (product.quantity >= item.cartQuantity) {
        product.quantity -= item.cartQuantity;

        await product.save();
      }
    }

    /* ================= CREATE ORDER ================= */

    const newOrder = new Order({
      userId,

      customerId: `manual_${Date.now()}`,

      paymentIntentId: `manual_${Date.now()}`,

      paymentMethod: "manual",

      products,

      subtotal: totalAmount,

      total: totalAmount,

      shipping: {
        name: customerInfo?.name || "",

        email: "",

        phone: customerInfo?.phone || "",

        address: {
          line1: customerInfo?.address || "",

          line2: "",

          city: "",

          country: "VN",
        },
      },

      payment_status: "pending",
    });

    const savedOrder = await newOrder.save();

    console.log("Tạo đơn hàng chuyển khoản thành công:", savedOrder._id);

    res.status(200).send(savedOrder);
  } catch (err) {
    console.error("Lỗi tạo đơn hàng thủ công:", err.message);

    res.status(500).send(err.message);
  }
});

module.exports = router;
