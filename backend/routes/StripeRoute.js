const express = require("express");
const Stripe = require("stripe");
const Order = require("../models/order");
const Product = require("../models/product");

require("dotenv").config();

const router = express.Router();

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

/* ============================
   CREATE CHECKOUT SESSION
============================ */

router.post("/create-checkout-session", express.json(), async (req, res) => {
  try {
    // Create customer
    const customer = await stripe.customers.create({
      metadata: {
        userId: req.body.userId,
        cart: JSON.stringify(
          req.body.items.map((item) => ({
            id: item._id,
            quantity: item.cartQuantity,
          })),
        ),
      },
    });

    // Create line items
    const line_items = req.body.items.map((item) => {
      const discountedPrice =
        item.isDiscount && item.discountPercent > 0
          ? item.price * (1 - item.discountPercent / 100)
          : item.price;

      return {
        price_data: {
          currency: "vnd",

          product_data: {
            name: item.name,

            images: [
              item.image.startsWith("http")
                ? item.image
                : `${process.env.BASE_URL}/${item.image}`,
            ],

            description: item.shortDesc || item.desc,

            metadata: {
              id: item.id,
            },
          },

          unit_amount: Math.round(discountedPrice),
        },

        quantity: item.cartQuantity,
      };
    });

    // Create Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      locale: "vi",

      shipping_address_collection: {
        allowed_countries: ["VN"],
      },

      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",

            fixed_amount: {
              amount: 0,
              currency: "vnd",
            },

            display_name: "Giao hàng miễn phí",

            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 3,
              },
              maximum: {
                unit: "business_day",
                value: 7,
              },
            },
          },
        },

        {
          shipping_rate_data: {
            type: "fixed_amount",

            fixed_amount: {
              amount: 30000,
              currency: "vnd",
            },

            display_name: "Giao hỏa tốc",

            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 1,
              },
              maximum: {
                unit: "business_day",
                value: 1,
              },
            },
          },
        },
      ],

      phone_number_collection: {
        enabled: true,
      },

      customer: customer.id,

      line_items,

      mode: "payment",

      success_url: `${process.env.CLIENT_URL}/checkout-success`,

      cancel_url: `${process.env.CLIENT_URL}/cart`,
    });

    res.send({ url: session.url });
  } catch (err) {
    console.error("Checkout Error:", err.message);
    res.status(500).send("Checkout Error");
  }
});

/* ============================
   CREATE ORDER FUNCTION
============================ */

const createOrder = async (customer, data) => {
  try {
    const items = JSON.parse(customer.metadata.cart);

    const products = [];

    for (const item of items) {
      const product = await Product.findById(item.id);

      if (!product) continue;

      products.push({
        id: product._id,
        name: product.name,
        category: product.category,
        shortDesc: product.shortDesc,
        desc: product.desc,
        price: product.price,
        image: product.image,
        cartQuantity: item.quantity,
      });

      if (product.quantity >= item.quantity) {
        product.quantity -= item.quantity;
        await product.save();
      }
    }

    const newOrder = new Order({
      userId: customer.metadata.userId,

      customerId: data.customer,

      paymentIntentId: data.payment_intent,

      products,

      subtotal: data.amount_subtotal,

      total: data.amount_total,

      shipping: {
        name: data.customer_details?.name,

        email: data.customer_details?.email,

        phone: data.customer_details?.phone,

        address: {
          line1: data.customer_details?.address?.line1,

          line2: data.customer_details?.address?.line2,

          city: data.customer_details?.address?.city,

          country: data.customer_details?.address?.country,
        },
      },

      payment_status: data.payment_status,
      paymentMethod: "stripe",
    });

    const savedOrder = await newOrder.save();

    console.log("Order created:", savedOrder._id);
  } catch (err) {
    console.error("Order creation error:", err.message);
  }
};

/* ============================
   WEBHOOK
============================ */

let endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (request, response) => {
    let event;

    // Verify signature
    if (endpointSecret) {
      const signature = request.headers["stripe-signature"];

      try {
        event = stripe.webhooks.constructEvent(
          request.body,
          signature,
          endpointSecret,
        );

        console.log("Webhook verified");
      } catch (err) {
        console.log("Webhook signature verification failed.", err.message);

        return response.sendStatus(400);
      }
    } else {
      event = request.body;
    }

    // Extract data
    const data = event.data.object;
    const eventType = event.type;

    console.log("Webhook event:", eventType);

    /* Handle checkout completed */

    if (eventType === "checkout.session.completed") {
      try {
        const customer = await stripe.customers.retrieve(data.customer);

        await createOrder(customer, data);
      } catch (err) {
        console.error("Customer retrieve error:", err.message);
      }
    }

    response.sendStatus(200);
  },
);

module.exports = router;
