const express = require("express");
const { createSanPham, getAllSanPham, getSanPhamById, updateSanPhamById, deleteSanPhamById, toggleHienThi, toggleHienThiKMHapDan } = require("../../controllers/controller_TMDT/CRUD/sanPhamController");
const { getLoaiConTheoLoai, getSanPhamTheoLoaiCon } = require("../../controllers/controller_TMDT/CRUD/laySPTheoLoaiVaLoaiConController");
const router = express.Router();
// const { authenticate, isAdmin } = require('../middleware/auth');

// router.use(authenticate, isAdmin);

// @route   POST /api/san-pham
// @desc    Tạo sản phẩm mới
router.post("/", createSanPham);

// @route   GET /api/san-pham
// @desc    Lấy danh sách sản phẩm
router.get("/", getAllSanPham);

// @route   GET /api/san-pham/:id
// @desc    Lấy chi tiết 1 sản phẩm
router.get("/:id", getSanPhamById);

// @route   PUT /api/san-pham/:id
// @desc    Cập nhật 1 sản phẩm
router.put("/:id", updateSanPhamById);

// @route   DELETE /api/san-pham/:id
// @desc    Xóa 1 sản phẩm
router.delete("/:id", deleteSanPhamById);

// @route   PUT /api/san-pham/:id/toggle-hien-thi
// @desc    Ẩn/hiện 1 sản phẩm
// --- THÊM MỚI ROUTE NÀY ---
router.put("/:id/toggle-hien-thi", toggleHienThi);
router.put("/:id/toggle-hien-thi-kmhapdan", toggleHienThiKMHapDan);


// 🧭 Lấy danh sách loại con theo loại
router.get("/loai/:idLoai", getLoaiConTheoLoai);

// 🧭 Lấy sản phẩm theo loại con
router.get("/loai-con/:idLoaiCon", getSanPhamTheoLoaiCon);

module.exports = router;