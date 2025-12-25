const express = require("express");
const router = express.Router();
const { createLoaiSanPham, getAllLoaiSanPham, getLoaiSanPhamById, updateLoaiSanPhamById, deleteLoaiSanPhamById } = require("../../controllers/controller_TMDT/CRUD/loaiSanPhamController");

router.post("/", createLoaiSanPham);
router.get("/", getAllLoaiSanPham);
router.get("/:id", getLoaiSanPhamById);
router.put("/:id", updateLoaiSanPhamById);
router.delete("/:id", deleteLoaiSanPhamById);

module.exports = router;