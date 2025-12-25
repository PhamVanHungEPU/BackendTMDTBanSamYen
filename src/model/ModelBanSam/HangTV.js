const mongoose = require('mongoose');

const HangThanhVienSchema = new mongoose.Schema(
  {
    tenHang: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    }, // Ví dụ: "Đồng", "Bạc", "Vàng", "Kim Cương"
    
    moTa: {
      type: String,
    }, // Mô tả ngắn về quyền lợi

    // Điều kiện để đạt được hạng (ví dụ: tổng chi tiêu tối thiểu)
    dieuKienTieuThu: {
      type: Number,
      required: true,
      default: 0, 
    }, // Ví dụ: 5.000.000 (VND)

    // Ưu đãi cho hạng này (ví dụ: giảm giá 5%)
    uuDaiPhanTram: {
      type: Number,
      default: 0,
    }, // Ví dụ: 5 (tương ứng 5%)
  },
  { timestamps: true }
);

module.exports = mongoose.model('HangTV', HangThanhVienSchema);