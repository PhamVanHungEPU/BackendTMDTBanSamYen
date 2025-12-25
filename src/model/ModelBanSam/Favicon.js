const mongoose = require("mongoose");

const FaviconSchema = new mongoose.Schema({
  moTa: { type: String, trim: true },              // mô tả favicon (VD: logo chính, icon tab...)
  image: { type: String, required: true, trim: true }, // đường dẫn ảnh favicon
  hienThi: { type: Boolean, default: true }        // trạng thái hiển thị: true = bật, false = tắt
}, { timestamps: true });

module.exports = mongoose.model("Favicon", FaviconSchema);
