// controllers/controller_TMDT/ChatRealTime/chatController.js
const Conversation = require("../../../model/ModelBanSam/Conversation");
const Message = require("../../../model/ModelBanSam/Message");
const NguoiDung = require("../../../model/ModelBanSam/NguoiDung");
const { getIo } = require("../../../Socket.IO");

// Start or get conversation between current user and support (admin/cuahang)
exports.startOrGetConversation = async (req, res) => {
  try {
    const senderId = req.user._id;

    // Find admin or cuahang user (support staff)
    const supportStaff = await NguoiDung.findOne({
      vaiTro: { $in: ["admin", "cuahang"] },
    });

    if (!supportStaff) {
      return res.status(404).json({ message: "Hiện không có nhân viên hỗ trợ nào (admin/cửa hàng)." });
    }

    const receiverId = supportStaff._id;

    // Avoid admin chatting with self
    if (senderId.toString() === receiverId.toString()) {
      return res.status(200).json({ message: "Bạn là quản trị viên/cửa hàng." });
    }

    // Find conversation between sender and receiver
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    }).populate("participants", "hoTen avatar vaiTro");

    // Create if not exists
    if (!conversation) {
      conversation = new Conversation({
        participants: [senderId, receiverId],
        lastMessage: {
          content: "Xin chào, Shop có thể giúp gì cho bạn?",
          sender: receiverId,
          createdAt: new Date(),
        },
      });
      await conversation.save();
      conversation = await Conversation.findById(conversation._id).populate("participants", "hoTen avatar vaiTro");
    }

    // Get messages
    const messages = await Message.find({ conversationId: conversation._id }).populate("sender", "hoTen avatar").sort({ createdAt: "asc" });

    res.status(200).json({ conversation, messages });
  } catch (error) {
    console.error("startOrGetConversation error:", error);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

// Get all conversations (admin sees all; user sees own)
exports.getConversations = async (req, res) => {
  try {
    const userId = req.user._id;
    const currentUser = await NguoiDung.findById(userId);

    let query = {};
    if (currentUser.vaiTro === "admin" || currentUser.vaiTro === "cuahang") {
      query = {}; // admin: all, adjust if you want filter
    } else {
      query = { participants: userId };
    }

    const conversations = await Conversation.find(query).populate("participants", "hoTen avatar vaiTro").sort({ "lastMessage.createdAt": -1 }).lean();

    // Add unreadCount for each conversation
    for (const convo of conversations) {
      const unreadCount = await Message.countDocuments({
        conversationId: convo._id,
        sender: { $ne: userId },
        readBy: { $nin: [userId] },
      });
      convo.unreadCount = unreadCount;
    }

    res.status(200).json(conversations);
  } catch (error) {
    console.error("getConversations error:", error);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

// Get messages for a conversation (with permission)
exports.getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user._id;

    const currentUser = await NguoiDung.findById(userId);
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({ success: false, message: "Không tìm thấy cuộc trò chuyện." });
    }

    const isAdminOrStore = currentUser.vaiTro === "admin" || currentUser.vaiTro === "cuahang";
    const isParticipant = conversation.participants.map((p) => p.toString()).includes(userId.toString());

    if (!isAdminOrStore && !isParticipant) {
      return res.status(403).json({ success: false, message: "Không được phép truy cập." });
    }

    const messages = await Message.find({ conversationId }).populate("sender", "hoTen avatar").sort({ createdAt: "asc" });

    res.status(200).json({ success: true, messages });
  } catch (error) {
    console.error("getMessages error:", error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ" });
  }
};

// Mark all messages in a conversation as read by current user
exports.markAsRead = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user._id;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) return res.status(404).json({ message: "Không tìm thấy cuộc trò chuyện." });

    await Message.updateMany(
      {
        conversationId,
        sender: { $ne: userId },
        readBy: { $nin: [userId] },
      },
      {
        $addToSet: { readBy: userId },
      }
    );

    // Emit realtime event to other participant to update UI
    const otherParticipant = conversation.participants.find((p) => p.toString() !== userId.toString());
    if (otherParticipant) {
      try {
        const io = getIo();
        io.to(otherParticipant.toString()).emit("messagesRead", { conversationId, readerId: userId.toString() });
      } catch (e) {
        console.warn("Could not emit messagesRead:", e.message);
      }
    }

    res.status(200).json({ success: true, message: "Đã đánh dấu đã đọc." });
  } catch (error) {
    console.error("markAsRead error:", error);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};
