const mongoose = require('mongoose');

const DanhGiaPhongTroSchema = new mongoose.Schema(
  {
    sanPham: { type: mongoose.Schema.Types.ObjectId, ref: 'SanPham', required: true },
    nguoiDanhGia: { type: mongoose.Schema.Types.ObjectId, ref: 'NguoiDung', required: true },
    sao: { type: Number, required: true, min: 1, max: 5 },
    binhLuan: { type: String },
    ngayDanhGia: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('DanhGia', DanhGiaPhongTroSchema);
