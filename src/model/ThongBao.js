// models/ThongBao.js
const mongoose = require("mongoose");

const ThongBaoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // tiêu đề ngắn gọn
    message: { type: String, required: true }, // nội dung thông báo
    type: {
      type: String,
      enum: ["info", "warning", "success", "error"],
      default: "info",
    },
    read: { type: Boolean, default: false }, // đã đọc hay chưa
    // userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false }, 
    // nếu muốn gửi cho user cụ thể, còn không thì để null => gửi cho tất cả
  },
  { timestamps: true }
);

module.exports = mongoose.model("ThongBao", ThongBaoSchema);
