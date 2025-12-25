// routes/uploadRoutes.js
const express = require("express");
const path = require("path");
const xlsx = require("xlsx");
const { uploadFile1, uploadFiles1, deleteFile1 } = require("../controllers/Upload/uploadCloud.controller");
const router = express.Router();

// Tạo route upload
router.post("/upload", uploadFile1);
router.post("/uploadSlider", uploadFiles1);
router.post("/delete", deleteFile1);



module.exports = router;
