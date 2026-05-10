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

        isDiscount: {
          type: Boolean,
          default: false,
        },

        discountPercent: {
          type: Number,
          default: 0,
        },
      },
    ],

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },

    total: {
      type: Number,
      required: true,
      min: 0,
    },

    shipping: {
      type: Object,
      required: true,
    },

    delivery_status: {
      type: String,
      enum: ["pending", "delivering", "delivered", "cancelled"],
      default: "pending",
    },

    paymentMethod: {
      type: String,
      enum: ["stripe", "manual"],
      default: "stripe",
    },

    payment_status: {
      type: String,
      enum: ["pending", "paid"],
      required: true,
    },
  },

  { timestamps: true },
);

const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;
