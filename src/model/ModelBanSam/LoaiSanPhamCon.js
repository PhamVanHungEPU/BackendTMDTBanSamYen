const mongoose = require("mongoose");
const crypto = require("crypto");

const LoaiSanPhamConSchema = new mongoose.Schema(
  {
     maLSPCon: {
      type: String,
      unique: true,
      trim: true,
    }, // Mã sản phẩm tự sinh 8 ký tự
    name: { type: String, required: true, trim: true },
    mota: { type: String, trim: true },
    image: { type: String, trim: true },   
  },
  { timestamps: true }
);

// 🧩 Tự động sinh mã sản phẩm 8 ký tự ngẫu nhiên trước khi tạo
LoaiSanPhamConSchema.pre("save", function (next) {
  if (!this.maLSPCon) {
    this.maLSPCon = crypto.randomBytes(4).toString("hex").toUpperCase(); // VD: "A3F2B8D1"
  }
  next();
});

module.exports = mongoose.model("LoaiSanPhamCon", LoaiSanPhamConSchema);
