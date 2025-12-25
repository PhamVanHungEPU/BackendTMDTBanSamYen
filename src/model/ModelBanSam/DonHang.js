const mongoose = require("mongoose");

// Hàm sinh mã đơn hàng ngẫu nhiên 6 ký tự
function generateOrderCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
  return code;
}

const DonHangSchema = new mongoose.Schema(
  {
    maDonHang: {
      type: String,
      unique: true,
      required: true,
      default: generateOrderCode,
    },

    nguoiDung: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NguoiDung",
      required: true,
    },

    sanPhams: [
      {
        sanPhamId: { type: mongoose.Schema.Types.ObjectId, ref: "SanPham" },
        tenSP: { type: String, required: true },
        hinhAnh: [{ type: String }],
        giaBan: { type: Number, required: true },
        phanTramGiam: { type: Number, default: 0 },
        giaSauGiam: { type: Number, required: true },
        soLuong: { type: Number, required: true, min: 1 },
        thanhTien: { type: Number, required: true },
      },
    ],

    tongTienHang: { type: Number, required: true },
    giamGia: { type: Number, default: 0 },
    phiGiaoHang: { type: Number, default: 0 },
    tongThanhToan: { type: Number, required: true },

    maKhuyenMai: { type: String, default: null },

    thongTinGiaoHang: {
      hoTen: { type: String, required: true },
      soDienThoai: { type: String, required: true },
      email: { type: String, required: true },
      diaChi: { type: String, required: true },
      ghiChu: { type: String },
      tinhThanh: { type: String },
      phuongXa: { type: String },
    },

    trangThaiDon: {
      type: String,
      enum: [
        "Chờ xác nhận",
        "Đang xử lý",
        "Đang giao hàng",
        "Hoàn thành",
        "Đã hủy",
      ],
      default: "Chờ xác nhận",
    },

    trangThaiThanhToan: {
      type: String,
      enum: ["Chưa thanh toán", "Đã thanh toán", "Hoàn tiền"],
      default: "Chưa thanh toán",
    },

    // 🔥 THÊM MỚI: Lịch sử giao dịch tiền
    transactionHistory: [
      {
        date: { type: Date, default: Date.now },
        amount: { type: Number },
        type: { type: String }, // 'deposit', 'refund'
        reference: { type: String }, // Mã giao dịch SePay (webhook id)
        gateway: { type: String }, // 'SePay', 'VNPAY'...
      }
    ],

    ngayDat: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Đảm bảo mã đơn hàng là duy nhất
DonHangSchema.pre("save", async function (next) {
  if (!this.maDonHang) {
    let newCode;
    let exists = true;
    do {
      newCode = generateOrderCode();
      const existing = await mongoose.model("DonHang").findOne({ maDonHang: newCode });
      if (!existing) exists = false;
    } while (exists);
    this.maDonHang = newCode;
  }
  next();
});

module.exports = mongoose.model("DonHang", DonHangSchema);
