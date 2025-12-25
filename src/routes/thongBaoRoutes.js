// routes/thongBaoRoutes.js
const express = require("express");
const { createThongBao, getThongBao, markAsRead, deleteThongBao, updateThongBao } = require("../controllers/ThongBao/thongBaoController");
const router = express.Router();

router.post("/create", createThongBao);

router.get("/getall", getThongBao);

router.put("/read/:id", markAsRead);
router.put("/update/:id", updateThongBao);

router.delete("/delete/:id", deleteThongBao);

module.exports = router;
