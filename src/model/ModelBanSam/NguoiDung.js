const mongoose = require('mongoose');

const NguoiDangSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, lowercase: true, trim: true },
    matKhau: { type: String, required: true }, // nhớ hash ở layer service
    soDienThoai: { type: String,  },
    diaChi: { type: String,  },
    hoTen: { type: String, trim: true },
    avatar: { type: String },

    vaiTro: { type: String, enum: ['cuahang', 'admin', 'user'], default: 'user' },
    isActive: { type: Boolean, default: true },

    currentToken: { type: String }, // ✅ token đang hoạt động

    // --- TRƯỜNG MỚI: Thống kê (Statistics) ---
    // Cập nhật các trường này mỗi khi user hoàn tất 1 đơn hàng
    thongKe: {
      tongSoDonHang: {
        type: Number,
        default: 0,
      },
      tongTienDaMua: {
        type: Number,
        default: 0,
      },
    },

    // --- TRƯỜNG MỚI: Hạng thành viên (Rank) ---
    // Liên kết với Model 'HangTV'
    hangThanhVien: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'HangTV', // Tên của model HangTV (sẽ tạo bên dưới)
      default: null, // Mặc định là null khi mới đăng ký
    },
    permissions: {
        type: [String],
        default: []
    }

  },
  { timestamps: true }
);

module.exports = mongoose.model('NguoiDung', NguoiDangSchema);
