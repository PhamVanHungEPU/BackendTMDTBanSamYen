const mongoose = require("mongoose");

const BannerSchema = new mongoose.Schema({
  image: { type: String, trim: true }, // URL ảnh banner
  moTa: { type: String, trim: true }, 
  linkURL: { type: String, trim: true }, 
  thuTu: { type: Number, default: 0 }, // thứ tự hiển thị (tùy chọn)
  hienThi: { type: Boolean, default: true } // bật/tắt hiển thị banner
}, { timestamps: true });

module.exports = mongoose.model("Banner", BannerSchema);
