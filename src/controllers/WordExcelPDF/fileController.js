// src/controllers/convertFile.js
const fs = require("fs");
const path = require("path");
const libre = require("libreoffice-convert");
const { exec } = require("child_process");

// 📌 Hàm dùng libreoffice-convert (Word -> PDF, Excel -> PDF...)
function convertWithLibre(req, res, inputPath, outputExt) {
  const outputFileName = Date.now() + outputExt;
  const outputPath = path.resolve(__dirname, "../../public/uploads", outputFileName);

  const file = fs.readFileSync(inputPath);

  libre.convert(file, outputExt, undefined, (err, done) => {
    // Xoá file gốc
    try {
      if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
    } catch (e) {
      console.warn("⚠️ Cannot remove input file:", e.message);
    }

    if (err) {
      console.error("❌ Conversion error:", err);
      return res.status(500).json({ error: "Conversion failed" });
    }

    // Lưu file kết quả
    fs.writeFileSync(outputPath, done);

    // URL cho client
    const fileUrl = `https://backend.dantri24h.com/uploads/${outputFileName}`;
    res.json({
      success: true,
      url: fileUrl,
      name: outputFileName,
    });
  });
}

// 📌 Hàm dùng soffice trực tiếp (PDF -> Word)
function convertPdfToDocx(req, res, inputPath) {
  const outputDir = path.resolve(__dirname, "../../public/uploads");
  const tempName = path.basename(inputPath, ".pdf") + ".docx"; // file docx mà soffice sẽ tạo
  const tempPath = path.join(outputDir, tempName);

  const outputFileName = Date.now() + ".docx";
  const outputPath = path.join(outputDir, outputFileName);

  console.log("📥 PDF input:", inputPath);

  const command = `soffice --headless --infilter="writer_pdf_import" --convert-to docx:"MS Word 2007 XML" "${inputPath}" --outdir "${outputDir}"`;

  exec(command, (err, stdout, stderr) => {
    // Xoá file gốc PDF
    try {
      if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
    } catch (e) {
      console.warn("⚠️ Cannot remove input file:", e.message);
    }

    if (err) {
      console.error("❌ PDF -> DOCX error:", stderr || err.message);
      return res.status(500).json({ error: "PDF to DOCX failed" });
    }

    console.log("✅ LibreOffice output:", stdout);

    // Đổi tên file thành output chuẩn
    try {
      if (fs.existsSync(tempPath)) {
        fs.renameSync(tempPath, outputPath);
      }
    } catch (e) {
      console.error("⚠️ Rename failed:", e.message);
    }

    const fileUrl = `https://backend.dantri24h.com/uploads/${outputFileName}`;
    res.json({
      success: true,
      url: fileUrl,
      name: outputFileName,
    });
  });
}


// 📌 Route đa năng: /api/convert?to=pdf|docx|xlsx|pptx...
exports.convertFile = (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  const targetExt = req.query.to ? "." + req.query.to : ".pdf";

  if (targetExt === ".docx" && req.file.originalname.endsWith(".pdf")) {
    // Nếu là PDF -> DOCX
    return convertPdfToDocx(req, res, req.file.path);
  }

  // Các trường hợp khác
  convertWithLibre(req, res, req.file.path, targetExt);
};

// 📌 Word -> PDF
exports.wordToPdf = (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  convertWithLibre(req, res, req.file.path, ".pdf");
};

// 📌 PDF -> Word
exports.pdfToWord = (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const inputPath = req.file.path;
  const outputDir = path.resolve(__dirname, "../../public/uploads");

  // Đảm bảo thư mục uploads tồn tại
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Tên tạm LibreOffice sẽ tạo (giữ nguyên tên gốc .pdf -> .docx)
  const tempName = path.basename(inputPath, ".pdf") + ".docx";
  const tempPath = path.join(outputDir, tempName);

  // Tên chuẩn mình muốn trả về
  const outputFileName = Date.now() + ".docx";
  const outputPath = path.join(outputDir, outputFileName);

  console.log("📥 PDF input:", inputPath);

  const command = `soffice --headless --infilter="writer_pdf_import" --convert-to docx:"MS Word 2007 XML" "${inputPath}" --outdir "${outputDir}"`;

  exec(command, (err, stdout, stderr) => {
    // Xoá file PDF gốc
    try {
      if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
    } catch (e) {
      console.warn("⚠️ Cannot remove input file:", e.message);
    }

    if (err) {
      console.error("❌ LibreOffice error:", stderr || err.message);
      return res.status(500).json({ error: "PDF to DOCX failed" });
    }

    console.log("✅ LibreOffice stdout:", stdout);
    console.log("⚠️ LibreOffice stderr:", stderr);

    // Kiểm tra xem file docx có sinh ra không
    if (!fs.existsSync(tempPath)) {
      console.error("❌ DOCX file not created:", tempPath);
      return res.status(500).json({ error: "No DOCX output found" });
    }

    // Đổi tên thành file chuẩn
    try {
      fs.renameSync(tempPath, outputPath);
    } catch (e) {
      console.error("⚠️ Rename failed:", e.message);
      return res.status(500).json({ error: "Rename failed" });
    }

    const fileUrl = `https://backend.dantri24h.com/uploads/${outputFileName}`;
    console.log("✅ File created:", outputPath);

    res.json({
      success: true,
      url: fileUrl,
      name: outputFileName,
    });
  });
};
