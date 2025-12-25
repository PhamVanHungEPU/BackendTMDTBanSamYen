// import OpenAI from "openai";
// import dotenv from "dotenv";

const OpenAI = require("openai");
const dotenv = require("dotenv");

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ====================== 
// 🧠 API sinh nội dung
// ======================
const taoNoiDungAI = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || prompt.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Prompt không được để trống!",
      });
    }

    // Gọi ChatGPT
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini", // RÕ RÀNG, KHÔNG BAO GIỜ BỊ LỖI MODEL
      messages: [
        {
          role: "system",
          content:
            "Bạn là AI chuyên viết bài chuẩn SEO, đúng ngữ pháp, trình bày đẹp bằng HTML, CSS",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    const content = response.choices[0].message.content;

    return res.json({
      success: true,
      content: content,
    });
  } catch (err) {
    console.error("🔥 Lỗi ChatGPT:", err);
    return res.status(500).json({
      success: false,
      message: "Lỗi xử lý AI",
      error: err?.message,
    });
  }
};

module.exports = {
    taoNoiDungAI
};