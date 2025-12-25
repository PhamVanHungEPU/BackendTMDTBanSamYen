// routes/word.js
const express = require("express");
const { Document, Packer, Paragraph, TextRun } = require("docx");

const router = express.Router();

router.post("/generate", async (req, res) => {
  try {
    const { content } = req.body;

    const lines = content
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: lines.map(
            (line) =>
              new Paragraph({
                children: [
                  new TextRun({
                    text: line,
                    font: "Times New Roman",
                    size: 24,
                  }),
                ],
              })
          ),
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
    res.setHeader("Content-Disposition", "attachment; filename=CauHoi.docx");
    res.send(buffer);
  } catch (err) {
    console.error("❌ Lỗi tạo file Word:", err);
    res.status(500).send("Lỗi tạo file Word");
  }
});

module.exports = router;
