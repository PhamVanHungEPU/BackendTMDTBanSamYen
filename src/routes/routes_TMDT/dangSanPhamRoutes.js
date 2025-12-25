const express = require("express");
const router = express.Router();
const { createDangSanPham, getAllDangSanPham, getDangSanPhamById, updateDangSanPhamById, deleteDangSanPhamById } = require("../../controllers/controller_TMDT/CRUD/dangSanPhamController");

router.post("/", createDangSanPham);
router.get("/", getAllDangSanPham);
router.get("/:id", getDangSanPhamById);
router.put("/:id", updateDangSanPhamById);
router.delete("/:id", deleteDangSanPhamById);

module.exports = router;