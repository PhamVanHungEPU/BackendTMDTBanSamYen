// controllers/ImageController/ocrController.js
const { default: axios } = require("axios");
const fs = require("fs");
const path = require("path");
const Tesseract = require("tesseract.js");
const OpenAI = require("openai");

// Tạo client OpenAI với API Key từ .env
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ⚡ OCR: convert ảnh ra text
const imageToText = async (req, res) => {
  try {
    console.log("📂 File nhận:", req.file);
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const imagePath = req.file.path;

    const { data: { text } } = await Tesseract.recognize(imagePath, "eng+vie", {
      logger: (m) => console.log(m), // log progress
    });

    // xoá file tạm
    fs.unlinkSync(imagePath);

    return res.json({ text });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "OCR failed" });
  }
};

// ⚡ 1. AI giải đề
const solveByAI = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No image uploaded" });

    // OCR: chuyển ảnh → text
    const { data: { text } } = await Tesseract.recognize(req.file.path, "eng+vie");

    const cleanText = text.trim();

    // Gọi OpenAI GPT để giải đề
    const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
            role: "system",
            content: `Bạn là một trợ lý học tập thông minh, có khả năng giải và giải thích chi tiết các bài tập thuộc nhiều môn học như Toán, Vật lý, Hóa học, Sinh học, Ngữ văn, Lịch sử, Địa lý, Tiếng Anh và các môn khác.

        Nhiệm vụ của bạn:
        - Đưa ra lời giải rõ ràng, dễ hiểu.
        - Với môn tự nhiên (Toán, Lý, Hóa, Sinh): hãy giải từng bước, ghi chú công thức và kết quả cuối.
        - Tuyệt đối KHÔNG dùng ký hiệu LaTeX (\\frac, \\cdot, \\sqrt...). Thay vào đó hãy viết công thức bằng chữ hoặc phép tính thông thường (ví dụ: 7x + 8.9 * (124 - x) = ...).
        - Với môn xã hội (Văn, Sử, Địa): hãy phân tích, tóm tắt và đưa ra câu trả lời súc tích nhưng đầy đủ ý.
        - Với tiếng Anh: có thể dịch, giải thích ngữ pháp và đưa ví dụ minh họa.

        Luôn trả lời bằng tiếng Việt, trình bày khoa học, gọn gàng, dễ đọc và chính xác cho học sinh Việt Nam.`,
            },
            {
            role: "user",
            content: cleanText, // chính là đề bài OCR được
            },
        ],
        max_tokens: 1200,
    });


    const solution = response.choices[0].message.content;

    // Xoá file tạm sau khi xử lý
    fs.unlinkSync(req.file.path);

    return res.json({
      mode: "AI",
      input: cleanText,
      solution,
    });
  } catch (err) {
    console.error("❌ AI Solve error:", err);
    return res.status(500).json({ error: "AI Solve failed" });
  }
};

// ⚡ 2. Search Google
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GOOGLE_CX = process.env.GOOGLE_CX;

const solveByGoogle = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No image uploaded" });
    const { data: { text } } = await Tesseract.recognize(req.file.path, "eng+vie");

    const query = text.trim();
    const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&key=${GOOGLE_API_KEY}&cx=${GOOGLE_CX}`;
    const { data } = await axios.get(url);

    return res.json({
      mode: "Google Search",
      input: query,
      results: data.items?.slice(0, 3) || []
    });
  } catch (err) {
    console.error("❌ Google Search error:", err);
    return res.status(500).json({ error: "Google Search failed" });
  }
};

module.exports = { imageToText, solveByAI, solveByGoogle };
