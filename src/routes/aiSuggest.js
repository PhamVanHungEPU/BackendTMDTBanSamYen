// backend/routes/aiSuggest.js
// import express from 'express';
// import OpenAI from 'openai';
const express = require('express');
const OpenAI = require('openai');

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.get('/ai-suggest', async (req, res) => {
  try {
    const query = req.query.query;
    if (!query) return res.json({ suggestions: [] });

    // Prompt mới: Thi trắc nghiệm online
    const prompt = `
Bạn là trợ lý thông minh cho nền tảng thi trắc nghiệm online. Người dùng đang tìm kiếm liên quan đến: "${query}".

Hãy trả về danh sách tối đa 10 gợi ý liên quan, có thể bao gồm:

Tên bộ đề thi phổ biến
Tên môn học (VD: Toán, Lý, Hóa, Sinh, Sử, Địa, Tiếng Anh, Lập trình, Thi bằng lái xe,...)
Chủ đề ôn tập (VD: Định luật Newton, Hóa vô cơ, Lịch sử thế giới,...)
Kỹ năng cần luyện (VD: Kỹ năng đọc hiểu tiếng Anh, Kỹ năng giải phương trình,...)
Dạng câu hỏi phổ biến (VD: Trắc nghiệm đúng/sai,...)

Chỉ viết ra **dưới dạng danh sách gọn**, **mỗi dòng 1 gợi ý**, **không giải thích thêm**, **không được thêm dấu - phía trước**.
`;

    // Gọi OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // hoặc model bạn đang dùng
      messages: [
        { role: "system", content: "Bạn là trợ lý gợi ý cho nền tảng thi trắc nghiệm online." },
        { role: "user", content: prompt },
      ],
      max_tokens: 200,
      temperature: 0.7,
    });

    const text = completion.choices[0].message.content;

    // Parse thành mảng suggestion
    const suggestions = text
      .split('\n')
      .map(line => line.replace(/^\d+\.?\s*/, '').trim())
      .filter(line => line.length > 0)
      .slice(0, 10);

    res.json({ suggestions });
  } catch (error) {
    console.error('Lỗi AI Suggest:', error);
    res.status(500).json({ suggestions: [] });
  }
});

module.exports = router;
