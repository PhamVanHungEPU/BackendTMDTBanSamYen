const express = require("express");
const Message = require("../model/Message");
const router = express.Router();

// Gửi message
router.post("/", async (req, res) => {
  try {
    const { conversationId, sender, text } = req.body;

    const newMessage = new Message({
      conversationId,
      sender,
      text,
    });

    const saved = await newMessage.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Lấy tất cả message trong 1 conversation
router.get("/:conversationId", async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    }).populate("sender", "username avatar");

    res.json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
