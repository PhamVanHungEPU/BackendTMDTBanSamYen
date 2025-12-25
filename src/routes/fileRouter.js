const express = require("express");
const multer = require("multer");
const { convertFile, wordToPdf, pdfToWord } = require("../controllers/WordExcelPDF/fileController");
const router = express.Router();
const path = require('path');
const fs = require("fs");

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

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx"
  ];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("File type not allowed"), false);
  }
};

const upload = multer({ 
    storage,
    limits: { fileSize: 100 * 1024 * 1024 },
    fileFilter
 });

// Route đa năng
router.post("/", upload.single("file"),  convertFile);

// Route riêng
router.post("/word-to-pdf", upload.single("file"), wordToPdf);
router.post("/pdf-to-word", upload.single("file"), pdfToWord);

module.exports = router;
