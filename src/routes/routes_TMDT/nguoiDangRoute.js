// routes/nguoiDung.routes.js
const express = require('express');
const { getDanhSachNguoiDung, toggleStatus, phanQuyen, logoutNguoiDung, xoaNguoiDung, updatePermissions } = require('../../controllers/controller_TMDT/Auth/nguoiDungController');
const router = express.Router();

// Tất cả routes này yêu cầu admin
// router.use(authenticate, isAdmin);

// Lấy danh sách người dùng
router.get('/', getDanhSachNguoiDung);

// Bật/tắt trạng thái tài khoản
router.put('/:id/toggle-status', toggleStatus);

// Phân quyền
router.put('/:id/phan-quyen', phanQuyen);

// Đăng xuất người dùng (xóa token)
router.post('/:id/logout', logoutNguoiDung);

// Xóa người dùng
router.delete('/:id', xoaNguoiDung);

router.put("/:id/permissions", updatePermissions);


module.exports = router;