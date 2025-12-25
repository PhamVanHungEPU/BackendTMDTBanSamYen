const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // danh sách user trong cuộc chat
  isGroup: { type: Boolean, default: false }, // true = chat nhóm, false = chat 1-1
}, { timestamps: true });

module.exports = mongoose.model("Conversation", conversationSchema);
