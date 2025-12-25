// models/GioHang.js
const mongoose = require("mongoose");

const GioHangSchema = new mongoose.Schema(
  {
    nguoiDung: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NguoiDung",
      required: true,
    },
    sanPhams: [
      {
        sanPham: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "SanPham",
          required: true,
        },
        soLuong: {
          type: Number,
          required: true,
          min: 1,
          default: 1,
        },
      },
    ],
    tongTien: { type: Number, default: 0 },
    appliedVoucher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MaKhuyenMai",
        default: null,
    },
    discountAmount: { type: Number, default: 0 },

  },
  { timestamps: true }
);

// ✅ Tính tổng tiền dựa trên giá và phanTramGiam hiện tại
GioHangSchema.pre("save", async function (next) {
  try {
    const SanPham = mongoose.model("SanPham");
    let total = 0;

    for (const item of this.sanPhams) {
      const sp = await SanPham.findById(item.sanPham).select("giaBan phanTramGiam");
      if (!sp) continue;
      const donGiaSauGiam = sp.giaBan * (1 - (sp.phanTramGiam || 0) / 100);
      total += donGiaSauGiam * item.soLuong;
    }

    this.tongTien = Math.round(total);
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("GioHang", GioHangSchema);
