const fs = require("fs");
const path = require("path");
const axios = require("axios");
const sharp = require("sharp");
const FormData = require("form-data");

// ⚡ Xoá nền (remove.bg)
const removeBg = async (req, res) => {
  try {
    console.log("📂 File nhận:", req.file);

    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const apiKey = process.env.REMOVE_BG_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "Missing remove.bg API key" });

    const formData = new FormData();
    formData.append("image_file", fs.createReadStream(req.file.path));
    formData.append("size", "auto");

    const response = await axios.post("https://api.remove.bg/v1.0/removebg", formData, {
      headers: { ...formData.getHeaders(), "X-Api-Key": apiKey },
      responseType: "arraybuffer",
    });

    // Lưu vào src/public/uploads
    const outputPath = path.join(__dirname, "../../public/uploads", `no-bg-${Date.now()}.png`);
    fs.writeFileSync(outputPath, response.data);

    fs.unlinkSync(req.file.path); // xoá file gốc

    return res.json({
      url: `/uploads/${path.basename(outputPath)}`,
      absoluteUrl: `https://backend.dantri24h.com/uploads/${path.basename(outputPath)}`
    });
  } catch (err) {
    console.error(err.response?.data?.toString() || err.message);
    return res.status(500).json({ error: "Failed to remove background" });
  }
};

// ⚡ Resize ảnh bằng Sharp
const resizeImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const width = parseInt(req.body.width) || 800;
    const height = parseInt(req.body.height) || null;

    // Lưu vào src/public/uploads
    const outputPath = path.join(__dirname, "../../public/uploads", `resized-${Date.now()}.jpg`);

    await sharp(req.file.path)
      .resize(width, height)
      .jpeg({ quality: 80 })
      .toFile(outputPath);

    fs.unlinkSync(req.file.path);

    return res.json({
      url: `/uploads/${path.basename(outputPath)}`,
      absoluteUrl: `https://backend.dantri24h.com/uploads/${path.basename(outputPath)}`
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Resize failed" });
  }
};

module.exports = { removeBg, resizeImage };
