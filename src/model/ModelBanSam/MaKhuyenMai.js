const mongoose = require("mongoose");

const MaKhuyenMaiSchema = new mongoose.Schema(
  {
    tenma: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    }, // Ví dụ: "SALE5", "GIAM100K"

    mota: {
      type: String,
      trim: true,
    }, // Mô tả: "Giảm 5% tối đa 100k cho đơn từ 300k"

    loaiGiam: {
      type: String,
      enum: ["phanTram", "tienMat"], // "phanTram" = giảm %, "tienMat" = giảm theo tiền
      required: true,
    },

    giaTriGiam: {
      type: Number,
      required: true,
      min: 0,
    },
    // Nếu là "phanTram" => giảm % (VD: 5 = giảm 5%)
    // Nếu là "tienMat" => giảm trực tiếp số tiền (VD: 100000 = giảm 100k)

    giamToiDa: {
      type: Number,
      default: 0,
    },
    // Chỉ dùng cho loại "phanTram" (VD: giảm 5% nhưng tối đa 100k)
    // Nếu không cần giới hạn thì để 0

    dieuKienApDung: {
      type: Number,
      default: 0,
    },
    // Tổng tiền tối thiểu để áp dụng (VD: >= 300000)

    soLuongMa: {
      type: Number,
      default: 100,
      min: 0,
    },
    // Số lượng mã được cấp ra — có thể giảm dần khi người dùng sử dụng

    ngayBatDau: {
      type: Date,
      default: Date.now,
    },

    ngayKetThuc: {
      type: Date,
      required: true,
    },

    kichHoat: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MaKhuyenMai", MaKhuyenMaiSchema);

// giảm theo %, giảm theo tiền, giá trị giảm, điều kiện áp dụng, số lượng mã, ngày bắt đầu, ngày kết thúc, kích hoạt
// {
//   "tenma": "SALE5",
//   "mota": "Giảm 5% tối đa 100k cho đơn từ 300k",
//   "loaiGiam": "phanTram",
//   "giaTriGiam": 5,
//   "giamToiDa": 100000,
//   "dieuKienApDung": 300000,
//   "soLuongMa": 200,
//   "ngayBatDau": "2025-11-01T00:00:00.000Z",
//   "ngayKetThuc": "2025-12-01T00:00:00.000Z"
// }

// giảm theo số tiền
// {
//   "tenma": "GIAM50K",
//   "mota": "Giảm ngay 50k cho đơn từ 200k",
//   "loaiGiam": "tienMat",
//   "giaTriGiam": 50000,
//   "dieuKienApDung": 200000,
//   "soLuongMa": 500,
//   "ngayBatDau": "2025-11-01T00:00:00.000Z",
//   "ngayKetThuc": "2025-12-01T00:00:00.000Z"
// }
