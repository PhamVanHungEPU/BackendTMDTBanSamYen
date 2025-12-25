// models/DangSanPham.js
const mongoose = require("mongoose");

const DangSanPhamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    mota: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DangSanPham", DangSanPhamSchema);
