// routes/gioHangRoutes.js
const express = require("express");
const { layGioHang, themVaoGio, capNhatSoLuong, xoaKhoiGio, xoaTatCa, apDungVoucher, xoaVoucher } = require("../../controllers/controller_TMDT/CRUD/gioHangController");
const { protect } = require("../../middleware/authMiddleware");
const router = express.Router();

router.post("/", protect, themVaoGio);
router.get("/", protect, layGioHang);
router.put("/", protect, capNhatSoLuong);
router.delete("/:sanPhamId", protect, xoaKhoiGio);
router.delete("/", protect, xoaTatCa);
router.post("/apply-voucher", protect, apDungVoucher);
router.post("/remove-voucher", protect, xoaVoucher);


module.exports = router;
