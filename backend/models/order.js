const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    customerId: { type: String },

    paymentIntentID: { type: String },

    products: [
      {
        id: { type: String },
        name: { type: String },
        category: { type: String },
        desc: { type: String },
        price: { type: Number },
        image: { type: String },
        cartQuantity: { type: Number },
      },
    ],

    subtotal: {
      type: Number,
      required: true,
    },

    total: {
      type: Number,
      required: true,
    },

    shipping: {
      type: Object,
      required: true,
    },

    delivery_status: {
      type: String,
      default: "pending",
    },

    payment_status: {
      type: String,
      required: true,
    },
  },

  { timestamps: true },
);

const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;
