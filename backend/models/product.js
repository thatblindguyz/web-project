const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      unique: true,
    },

    name: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    desc: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
