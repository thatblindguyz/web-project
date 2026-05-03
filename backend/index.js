const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

require("dotenv").config();

/* ============================
   ROUTES IMPORT
============================ */

const stripeRoute = require("./routes/StripeRoute");
const productRoute = require("./routes/ProductRoute");
const registerRoute = require("./routes/RegisterRoute");
const loginRoute = require("./routes/LoginRoute");
const userStats = require("./stats/UserStat");
const orderStats = require("./stats/OrderStat");
const incomeStats = require("./stats/IncomeStat");

const app = express();

app.use(cors());

/* 
   STRIPE WEBHOOK
 */

app.use("/api/webhook", express.raw({ type: "application/json" }));

/* ============================
   BODY PARSER
============================ */

app.use(
  express.json({
    limit: "20mb",
  }),
);

app.use(
  express.urlencoded({
    limit: "20mb",
    extended: true,
  }),
);

/* ============================
   API ROUTES
============================ */

app.use("/api", registerRoute);
app.use("/api", loginRoute);
app.use("/api/products", productRoute);
app.use("/api", stripeRoute);
app.use("/api/users", userStats);
app.use("/api/orders", orderStats);
app.use("/api/income", incomeStats);

/* ============================
   STATIC FILES
============================ */

// Serve local images
app.use("/images", express.static(path.join(__dirname, "images")));

/* ============================
   ROOT ROUTE
============================ */

app.get("/", (req, res) => {
  res.send("Backend is running...");
});

/* ============================
   DATABASE CONNECTION
============================ */

const PORT = process.env.PORT || 5000;
const uri = process.env.DB_URI;

mongoose
  .connect(uri)
  .then(() => {
    console.log("Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    app.use("/api", productRoute);
    console.error("❌ Error connecting to MongoDB:", error.message);
  });
