// models/PhiGiaoHang.js
const mongoose = require("mongoose");

const PhiGiaoHangSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    }, // Tên phí: "Nội thành HN", "Toàn quốc", "FreeShip >500k"

    mota: {
      type: String,
      trim: true,
    }, // Mô tả ngắn gọn   

    giaTri: {
      type: Number,
      required: true,
      min: 0,
    },

    dieuKienApDung: {
      type: Number,
      default: 0,
    },
    // Tổng đơn tối thiểu để áp dụng (VD: >= 500000 mới free ship)

    kichHoat: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PhiGiaoHang", PhiGiaoHangSchema);
