// routes/danhGia.routes.js
const express = require("express");
const { createDanhGia, getDanhGiaTheoSanPham, getTrungBinhSao, deleteDanhGia } = require("../../controllers/controller_TMDT/CRUD/danhGiaController");
const { protect } = require("../../middleware/authMiddleware");
const router = express.Router();

// 🟢 POST - thêm đánh giá
router.post("/", createDanhGia);

// 🔵 GET - lấy danh sách đánh giá theo sản phẩm
router.get("/san-pham/:idSP", getDanhGiaTheoSanPham);

// 🟣 GET - tính trung bình sao theo sản phẩm
router.get("/trung-binh/:idSP", getTrungBinhSao);

// 🔴 DELETE - xóa đánh giá
router.delete("/:id", protect, deleteDanhGia);

module.exports = router;
