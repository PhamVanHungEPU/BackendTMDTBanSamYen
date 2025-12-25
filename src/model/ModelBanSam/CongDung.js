const mongoose = require("mongoose");

const LoaiSanPhamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    mota: { type: String, trim: true },
    image: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CongDung", LoaiSanPhamSchema);
