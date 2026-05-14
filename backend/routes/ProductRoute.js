const express = require("express");
const Product = require("../models/product");
const cloudinary = require("../utility/cloudinary");
const { isAdmin } = require("../middleware/auth");

const router = express.Router();

/* ============================
   CREATE PRODUCT
============================ */

router.post("/", isAdmin, async (req, res) => {
  const {
    code,
    name,
    category,
    shortDesc,
    desc,
    price,
    image,
    images,
    quantity,
  } = req.body;

  try {
    if (!images || images.length === 0) {
      return res.status(400).send("Images are required");
    }

    const uploadedImages = await Promise.all(
      images.map(async (img) => {
        const result = await cloudinary.uploader.upload(img, {
          folder: "products",
        });

        return result.secure_url;
      }),
    );

    const product = new Product({
      code,
      name,
      category,
      shortDesc,
      desc,
      price,
      quantity,
      images: uploadedImages,
      image: uploadedImages[0],
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
   SEARCH PRODUCTS
============================ */

router.get("/search", async (req, res) => {
  const query = req.query.q;

  try {
    const products = await Product.find({
      name: { $regex: query, $options: "i" }, // không phân biệt hoa thường
    });

    res.status(200).send(products);
  } catch (err) {
    console.log(err);
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
  const {
    code,
    name,
    category,
    shortDesc,
    desc,
    price,
    image,
    images,
    quantity,
    isDiscount,
    discountPercent,
  } = req.body;

  try {
    let updatedData = {
      code,
      name,
      category,
      shortDesc,
      desc,
      price,
      quantity,
      isDiscount,
      discountPercent,
    };

    if (images && images.length > 0) {
      const uploadedImages = await Promise.all(
        images.map(async (img) => {
          if (img.startsWith("http")) {
            return img;
          }

          const result = await cloudinary.uploader.upload(img, {
            folder: "products",
          });

          return result.secure_url;
        }),
      );

      updatedData.images = uploadedImages;

      updatedData.image = image;
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
