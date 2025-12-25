const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'NguoiDung',
    },
    content: {
      type: String,
      trim: true,
    },
     // Lưu lại ID của những người đã đọc tin nhắn
    readBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'NguoiDung',
    }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Message', MessageSchema);
