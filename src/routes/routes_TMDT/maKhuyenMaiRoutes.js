const express = require("express");
const router = express.Router();
const { createMaKhuyenMai, getAllMaKhuyenMai, getMaKhuyenMaiById, updateMaKhuyenMaiById, deleteMaKhuyenMaiById } = require("../../controllers/controller_TMDT/CRUD/maKhuyenMaiController");

router.post("/", createMaKhuyenMai);
router.get("/", getAllMaKhuyenMai);
router.get("/:id", getMaKhuyenMaiById);
router.put("/:id", updateMaKhuyenMaiById);
router.delete("/:id", deleteMaKhuyenMaiById);

module.exports = router;