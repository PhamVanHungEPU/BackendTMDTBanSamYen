const express = require("express");
const router = express.Router();
const { createThuongHieu, getAllThuongHieu, getThuongHieuById, updateThuongHieuById, deleteThuongHieuById } = require("../../controllers/controller_TMDT/CRUD/thuongHieuController");

router.post("/", createThuongHieu);
router.get("/", getAllThuongHieu);
router.get("/:id", getThuongHieuById);
router.put("/:id", updateThuongHieuById);
router.delete("/:id", deleteThuongHieuById);

module.exports = router;