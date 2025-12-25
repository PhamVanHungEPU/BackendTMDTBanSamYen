"use strict";

var mongoose = require('mongoose');
var Product = require('./SanPham');

// Định nghĩa schema cho sản phẩm trong đơn hàng
var productSchema = new mongoose.Schema({
  _idSP: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'SanPham',
    required: true
  },
  // Lấy thông tin sản phẩm từ _idSP
  size: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  }
});

// Định nghĩa schema cho đơn hàng
var orderSchema = new mongoose.Schema({
  lastName: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  note: {
    type: String,
    "default": ''
  },
  products: [productSchema],
  // Mảng sản phẩm trong đơn hàng
  thanhTien: {
    type: Number,
    required: true
  },
  // Tổng tiền của đơn hàng
  soTienCanThanhToan: {
    type: Number,
    required: true
  },
  // Tổng tiền của đơn hàng
  soTienGiamGia: {
    type: Number,
    required: true
  },
  // Tổng số tiền giảm giá
  giamGia: {
    type: Number,
    required: true
  },
  tongSoLuong: {
    type: Number,
    required: true
  },
  // Tổng số lượng sản phẩm
  idKhachHang: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'AccKH'
  },
  // ID khách hàng (nếu có)
  TinhTrangDonHang: {
    type: String,
    "enum": ["Chưa giao hàng", "Đã giao hàng", "Đang giao hàng"],
    "default": "Chưa giao hàng"
  },
  TinhTrangThanhToan: {
    type: String,
    "enum": ["Đã Thanh Toán", "Chưa Thanh Toán", "Chờ hoàn tiền", "Đã hoàn tiền"],
    "default": "Chưa Thanh Toán"
  },
  TrangThaiHuyDon: {
    type: String,
    "enum": ["Đã Hủy", "Không Hủy"],
    "default": "Không Hủy"
  }
}, {
  timestamps: true
} // Thêm createdAt và updatedAt
);
var Order = mongoose.model('Order', orderSchema);
module.exports = Order;