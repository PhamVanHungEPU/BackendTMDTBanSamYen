const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const ShortUrl = require("../model/ShortUrl");

// POST /api/shorten  → tạo link rút gọn
router.post("/shorten", async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "URL is required" });

    // Tạo shortCode ngẫu nhiên (6 ký tự)
    const shortCode = crypto.randomBytes(3).toString("hex");

    const shortUrl = await ShortUrl.create({
      originalUrl: url,
      shortCode,
    });

    return res.json({
      shortUrl: `https://urlrutgon.dantri24h.com/s/${shortUrl.shortCode}`,
      originalUrl: url,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /s/:code → redirect về link gốc
router.get("/:code", async (req, res) => {
  try {
    const { code } = req.params;
    const shortUrl = await ShortUrl.findOne({ shortCode: code });
    if (!shortUrl) return res.status(404).json({ error: "Not found" });

    shortUrl.clicks += 1;
    await shortUrl.save();

    return res.redirect(shortUrl.originalUrl);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
