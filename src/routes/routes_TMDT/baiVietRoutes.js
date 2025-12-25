const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/authMiddleware");
const { getAll, getOne, create, update, remove, toggleStatus } = require("../../controllers/controller_TMDT/CRUD/baiVietController");

// Lấy danh sách bài viết có phân trang + lọc
router.get("/", getAll);

// Lấy chi tiết 1 bài viết
router.get("/:id", getOne);

// Tạo bài viết (cần đăng nhập)
router.post("/", protect, create);

// Cập nhật bài viết
router.put("/:id", protect, update);

// Xóa bài viết
router.delete("/:id", protect, remove);

// ADMIN / CUAHANG: Bật/tắt trạng thái duyệt bài
router.post("/:id/toggle-status", protect, toggleStatus);

module.exports = router;
