// controllers/ImageController/convertController.js
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

// ⚡ Chuyển đổi định dạng ảnh
const convertImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const format = req.body.format || "png"; // định dạng muốn convert (png, jpg, webp, gif)
    const allowedFormats = ["png", "jpg", "jpeg", "webp", "gif"];

    if (!allowedFormats.includes(format)) {
      return res.status(400).json({ error: "Invalid format, chỉ hỗ trợ png, jpg, webp, gif" });
    }

    const outputPath = path.join(
      __dirname,
      "../../public/uploads",
      `converted-${Date.now()}.${format}`
    );

    await sharp(req.file.path).toFormat(format).toFile(outputPath);

    // Xoá file gốc sau khi xử lý
    fs.unlinkSync(req.file.path);

    return res.json({
      url: `/uploads/${path.basename(outputPath)}`,
      absoluteUrl: `https://backend.dantri24h.com/uploads/${path.basename(outputPath)}`,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Convert image failed" });
  }
};

module.exports = { convertImage };
