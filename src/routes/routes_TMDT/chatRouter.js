const express = require('express');
const router = express.Router();
const { protect } = require('../../middleware/authMiddleware');
const { startOrGetConversation, getConversations, getMessages, markAsRead } = require('../../controllers/controller_TMDT/ChatRealTime/chatController');

// Áp dụng middleware cho tất cả các route bên dưới
// router.use(protect);

// Bắt đầu/lấy cuộc trò chuyện khi click nút chat
router.post('/start', protect, startOrGetConversation);

// Lấy danh sách các cuộc trò chuyện
router.get('/', protect, getConversations);


router.get('/messages/:conversationId', protect, getMessages);

// ✅ ROUTE MỚI: Đánh dấu đã đọc
router.post('/read/:conversationId', protect, markAsRead);

module.exports = router;
