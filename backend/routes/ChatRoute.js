// backend/routes/ChatRoute.js

const router = require("express").Router();

const Conversation = require("../models/Chat");
const Message = require("../models/Message");

const { auth, isAdmin } = require("../middleware/auth");

/* =========================
   USER SEND MESSAGE
========================= */

router.post("/send", auth, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).send("Message is required");
    }

    let conversation = await Conversation.findOne({
      userId: req.user._id,
    });

    if (!conversation) {
      conversation = await Conversation.create({
        userId: req.user._id,

        lastMessage: text,
      });
    }

    const message = await Message.create({
      conversationId: conversation._id,

      sender: req.user.name,

      text,

      isAdmin: false,
    });

    conversation.lastMessage = text;

    await conversation.save();

    res.status(200).send(message);
  } catch (err) {
    console.log(err);

    res.status(500).send(err.message);
  }
});

/* =========================
   GET USER MESSAGES
========================= */

router.get("/messages", auth, async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      userId: req.user._id,
    });

    if (!conversation) {
      return res.status(200).send([]);
    }

    const messages = await Message.find({
      conversationId: conversation._id,
    }).sort({ createdAt: 1 });

    res.status(200).send(messages);
  } catch (err) {
    console.log(err);

    res.status(500).send(err.message);
  }
});

/* =========================
   ADMIN GET CONVERSATIONS
========================= */

router.get("/admin/conversations", auth, isAdmin, async (req, res) => {
  try {
    const conversations = await Conversation.find()
      .populate("userId", "name email")
      .sort({ updatedAt: -1 });

    res.status(200).send(conversations);
  } catch (err) {
    console.log(err);

    res.status(500).send(err.message);
  }
});

/* =========================
   ADMIN GET MESSAGES
========================= */

router.get(
  "/admin/messages/:conversationId",
  auth,
  isAdmin,
  async (req, res) => {
    try {
      const messages = await Message.find({
        conversationId: req.params.conversationId,
      }).sort({ createdAt: 1 });

      res.status(200).send(messages);
    } catch (err) {
      console.log(err);

      res.status(500).send(err.message);
    }
  },
);

/* =========================
   ADMIN REPLY
========================= */

router.post("/admin/reply/:conversationId", auth, isAdmin, async (req, res) => {
  try {
    const { text } = req.body;

    const message = await Message.create({
      conversationId: req.params.conversationId,

      sender: "Admin",

      text,

      isAdmin: true,
    });

    await Conversation.findByIdAndUpdate(req.params.conversationId, {
      lastMessage: text,
    });

    res.status(200).send(message);
  } catch (err) {
    console.log(err);

    res.status(500).send(err.message);
  }
});

module.exports = router;
