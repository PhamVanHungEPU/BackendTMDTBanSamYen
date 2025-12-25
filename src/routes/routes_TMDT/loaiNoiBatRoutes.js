const express = require("express");
const router = express.Router();
const { createLoaiNoiBat, getAllLoaiNoiBat, getLoaiNoiBatById, updateLoaiNoiBatById, deleteLoaiNoiBatById } = require("../../controllers/controller_TMDT/CRUD/loaiNoiBatController");
router.post("/", createLoaiNoiBat);
router.get("/", getAllLoaiNoiBat);
router.get("/:id", getLoaiNoiBatById);
router.put("/:id", updateLoaiNoiBatById);
router.delete("/:id", deleteLoaiNoiBatById);

module.exports = router;