const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { removeBg, resizeImage } = require("../controllers/ImageController/imageController");
const { convertImage } = require("../controllers/ImageController/convertController");
const { imageToText, solveByAI, solveByGoogle } = require("../controllers/ImageController/ocrController");

// Lưu file tạm vào src/public/uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../public/uploads");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true }); // tạo nếu chưa có
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Routes
router.post("/remove-bg", upload.single("image"), removeBg);
router.post("/resize", upload.single("image"), resizeImage);

// ⚡ API convert ảnh sang định dạng khác
router.post("/convert", upload.single("image"), convertImage);

// ⚡ API OCR (ảnh → text)
router.post("/ocr", upload.single("image"), imageToText);

// Các route mới cho giải đề
router.post("/solve-ai", upload.single("image"), solveByAI);
router.post("/solve-search", upload.single("image"), solveByGoogle);

module.exports = router;
