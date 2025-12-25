const express = require("express");
const Conversation = require("../model/Conversation");
const router = express.Router();

// Tạo conversation mới (2 người)
router.post("/", async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;

    // check nếu đã có rồi thì không tạo mới
    let existing = await Conversation.findOne({
      members: { $all: [senderId, receiverId], $size: 2 },
    });

    if (existing) return res.json(existing);

    const newConversation = new Conversation({
      members: [senderId, receiverId],
    });

    const saved = await newConversation.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Lấy tất cả conversation của 1 user
router.get("/:userId", async (req, res) => {
  try {
    const conversations = await Conversation.find({
      members: { $in: [req.params.userId] },
    }).populate("members", "username avatar");
    res.json(conversations);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
