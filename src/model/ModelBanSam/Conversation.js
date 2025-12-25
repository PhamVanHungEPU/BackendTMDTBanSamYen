const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema(
  {
    // Mảng chứa ID của những người tham gia cuộc trò chuyện (luôn là 2 người)
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'NguoiDung',
        required: true,
      },
    ],
    // Lưu lại tin nhắn cuối cùng để hiển thị preview
    lastMessage: {
      content: String,
      sender: { type: mongoose.Schema.Types.ObjectId, ref: 'NguoiDung' },
      createdAt: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Conversation', ConversationSchema);
