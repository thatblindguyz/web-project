const express = require("express");
const cors = require("cors");
const app = express();
const products = require("./products");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the backend!");
});

app.get("/products", (req, res) => {
  res.send(products);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const path = require("path");

app.use("/images", express.static(path.join(__dirname, "images")));
