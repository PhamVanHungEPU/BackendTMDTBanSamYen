const express = require("express");
const router = express.Router();
const { createLoaiSanPhamCon, getAllLoaiSanPhamCon, getLoaiSanPhamConById, updateLoaiSanPhamConById, deleteLoaiSanPhamConById } = require("../../controllers/controller_TMDT/CRUD/loaiSanPhamConController");

router.post("/", createLoaiSanPhamCon);
router.get("/", getAllLoaiSanPhamCon);
router.get("/:id", getLoaiSanPhamConById);
router.put("/:id", updateLoaiSanPhamConById);
router.delete("/:id", deleteLoaiSanPhamConById);

module.exports = router;