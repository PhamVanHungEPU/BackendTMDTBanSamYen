// models/LoaiNoiBat.js
const mongoose = require("mongoose");

const LoaiNoiBatSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    mota: {
      type: String,
      trim: true,
      default: "",
    },
    image: {
      type: String, // URL ảnh icon hoặc banner
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true, // thêm createdAt & updatedAt
  }
);

module.exports = mongoose.model("LoaiNoiBat", LoaiNoiBatSchema);
