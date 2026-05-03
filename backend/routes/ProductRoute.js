const express = require("express");
const Product = require("../models/product");
const cloudinary = require("../utility/cloudinary");
const { isAdmin } = require("../middleware/auth");

const router = express.Router();

/* ============================
   CREATE PRODUCT
============================ */

router.post("/", isAdmin, async (req, res) => {
  const { code, name, category, desc, price, image } = req.body;

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

    /* CHECK CODE DUPLICATE */

    const existingCode = await Product.findOne({ code });

    if (existingCode) {
      return res.status(400).send("Product code already exists");
    }

    /* ============================
       CREATE PRODUCT
    ============================ */

    const product = new Product({
      code,
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

/* ============================
   UPDATE PRODUCT
============================ */

router.put("/:id", isAdmin, async (req, res) => {
  const { code, name, category, desc, price, image } = req.body;

  try {
    let updatedData = {
      code,
      name,
      category,
      desc,
      price,
    };

    if (image && image.startsWith("data:image")) {
      const uploadResponse = await cloudinary.uploader.upload(image, {
        folder: "products",
      });

      updatedData.image = uploadResponse.secure_url;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true },
    );

    res.status(200).send(updatedProduct);
  } catch (err) {
    console.log(err);

    res.status(500).send(err.message);
  }
});

module.exports = router;
