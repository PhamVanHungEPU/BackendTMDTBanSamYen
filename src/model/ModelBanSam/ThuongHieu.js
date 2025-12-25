// models/ThuongHieu.js
const mongoose = require("mongoose");

const ThuongHieuSchema = new mongoose.Schema(
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
    image: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ThuongHieu", ThuongHieuSchema);
