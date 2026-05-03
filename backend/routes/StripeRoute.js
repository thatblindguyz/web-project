const express = require("express");
const Stripe = require("stripe");
const Order = require("../models/order");

require("dotenv").config();

const router = express.Router();

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

/* ============================
   CREATE CHECKOUT SESSION
============================ */

router.post("/create-checkout-session", async (req, res) => {
  try {
    console.log("Items received:", req.body.items);

    // Create customer
    const customer = await stripe.customers.create({
      metadata: {
        userId: req.body.userId,
        cart: JSON.stringify(req.body.items),
      },
    });

    // Create line items
    const line_items = req.body.items.map((item) => ({
      price_data: {
        currency: "usd",

        product_data: {
          name: item.name,

          // dùng BASE_URL cho image
          images: [
            item.image.startsWith("http")
              ? item.image
              : `${process.env.BASE_URL}/${item.image}`,
          ],

          description: item.desc,

          metadata: {
            id: item.id,
          },
        },

        unit_amount: Math.round(item.price * 100),
      },

      quantity: item.cartQuantity,
    }));

    // Create Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],

      shipping_address_collection: {
        allowed_countries: ["VN"],
      },

      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",

            fixed_amount: {
              amount: 0,
              currency: "usd",
            },

            display_name: "Free shipping",

            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 5,
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
              amount: 1500,
              currency: "usd",
            },

            display_name: "Next day air",

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

    const products = items.map((item) => ({
      id: item.id,
      name: item.name,
      category: item.category,
      desc: item.desc,
      price: item.price,
      image: item.image,
      cartQuantity: item.cartQuantity,
    }));

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
