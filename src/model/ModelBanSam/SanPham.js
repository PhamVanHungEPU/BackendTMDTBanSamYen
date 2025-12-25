const mongoose = require("mongoose");
const crypto = require("crypto");

const SanPhamSchema = new mongoose.Schema(
  {
    maSP: {
      type: String,
      unique: true,
      trim: true,
    }, // Mã sản phẩm tự sinh 8 ký tự

    name: { type: String, required: true, trim: true },

    soLuongTon: { type: Number, default: 0, min: 0 },
    soLuongBan: { type: Number, default: 0, min: 0 },

    kichThuoc: { type: String, trim: true },
    trongLuong: { type: String, trim: true },

    giaBan: { type: Number, min: 0 },

    phanTramGiam: { type: Number, default: 0, min: 0, max: 100 }, // Giảm giá theo %

    moTaNgan: { type: String, trim: true },
    moTaChiTiet: { type: String, trim: true },

    thuongHieu: { type: mongoose.Schema.Types.ObjectId, ref: "ThuongHieu" },
    dangSP: { type: mongoose.Schema.Types.ObjectId, ref: "DangSanPham" },
    loaiNoiBat: { type: mongoose.Schema.Types.ObjectId, ref: "LoaiNoiBat" },
    loaiSanPham: { type: mongoose.Schema.Types.ObjectId, ref: "LoaiSanPham" },
    loaiSanPhamCon: { type: mongoose.Schema.Types.ObjectId, ref: "LoaiSanPhamCon" },
    maKhuyenMai: [{ type: mongoose.Schema.Types.ObjectId, ref: "MaKhuyenMai" }],

    hinhAnh: {
      type: [String],
    },

    hienThi: { type: Boolean, default: true },
    khuyenMaiHapDan: { type: Boolean, default: false },

    congDungSP: [{ type: mongoose.Schema.Types.ObjectId, ref: "CongDung" }], // Tag chức năng: ví dụ ['dưỡng ẩm', 'trắng da']

    // 🧭 Trường SEO
    metaTitle: { type: String, trim: true },
    metaKeyword: { type: String, trim: true },
    metaDescription: { type: String, trim: true },
  },
  { timestamps: true }
);

// 🧩 Tự động sinh mã sản phẩm 8 ký tự ngẫu nhiên trước khi tạo
SanPhamSchema.pre("save", function (next) {
  if (!this.maSP) {
    this.maSP = crypto.randomBytes(4).toString("hex").toUpperCase(); // VD: "A3F2B8D1"
  }
  next();
});

module.exports = mongoose.model("SanPham", SanPhamSchema);
