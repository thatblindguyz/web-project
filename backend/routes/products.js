const express = require("express");
const Product = require("../models/product");
const cloudinary = require("../ultis/cloudinary");
const { isAdmin } = require("../middleware/auth");

const router = express.Router();

/* ============================
   CREATE PRODUCT
============================ */

router.post("/", isAdmin, async (req, res) => {
  const { name, category, desc, price, image } = req.body;

  try {
    if (!image) {
      return res.status(400).send("Image is required");
    }

    /* ============================
       UPLOAD IMAGE
    ============================ */

    const uploadResponse = await cloudinary.uploader.upload(image, {
      folder: "products",
    });

    /* ============================
       GENERATE PRODUCT CODE
    ============================ */

    const lastProduct = await Product.findOne().sort({ createdAt: -1 });

    let newCode = "PRD001";

    if (lastProduct && lastProduct.code) {
      const lastNumber = parseInt(lastProduct.code.replace("PRD", ""));

      const nextNumber = lastNumber + 1;

      newCode = "PRD" + nextNumber.toString().padStart(3, "0");
    }

    /* ============================
       CREATE PRODUCT
    ============================ */

    const product = new Product({
      code: newCode,
      name,
      category,
      desc,
      price,
      image: uploadResponse.secure_url,
    });

    const savedProduct = await product.save();

    res.status(200).send(savedProduct);
  } catch (err) {
    console.log(err);

    res.status(500).send(err.message);
  }
});

/* ============================
   GET ALL PRODUCTS
============================ */

router.get("/", async (req, res) => {
  try {
    const products = await Product.find();

    res.status(200).send(products);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/* ============================
   GET SINGLE PRODUCT
============================ */

router.get("/find/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    res.status(200).send(product);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/* ============================
   DELETE PRODUCT
============================ */

router.delete("/:id", isAdmin, async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);

    res.status(200).send(deleted);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
