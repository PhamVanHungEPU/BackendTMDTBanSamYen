const express = require("express");
const router = express.Router();

const { 
    taoPhiGiaoHang, 
    layTatCaPhi,
    layMotPhi,
    capNhatPhi,
    xoaPhi,
 } = require("../../controllers/controller_TMDT/CRUD/phiGiaoHangController");

// ✅ Tạo mới
router.post("/", taoPhiGiaoHang);

// ✅ Lấy tất cả
router.get("/", layTatCaPhi);

// ✅ Lấy 1 phí giao hàng theo ID
router.get("/:id", layMotPhi);

// ✅ Cập nhật
router.put("/:id", capNhatPhi);

// ✅ Xóa
router.delete("/:id", xoaPhi);

module.exports = router;
