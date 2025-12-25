const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    hoTen: { type: String, },              // Ví dụ: "Nguyễn Văn A"
    Image: { type: String, },              // Ví dụ: "Nguyễn Văn A"
    avatar: { type: String, },              // Ví dụ: "Nguyễn Văn A"
    taiKhoan: { type: String, },
    matKhau: { type: String, },
    otp: { type: String },
    otpExpires: { type: Date },
    isActive: { type: Boolean, default: true }, // ✅ Thêm trường isActive
    vaiTro: {
        type: String,
        enum: ['admin', 'nguoibt'],
        default: 'nguoibt'
    },
    tokenVersion: { type: Number, default: 0 }, // optional
    coin: { type: Number, default: 0 },
    ngayTao: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
