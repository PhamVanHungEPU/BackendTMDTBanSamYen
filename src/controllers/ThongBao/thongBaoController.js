const ThongBao = require("../../model/ThongBao");

// Tạo thông báo mới
exports.createThongBao = async (req, res) => {
  try {
    const { title, message, type, userId } = req.body;
    const tb = await ThongBao.create({ title, message, type, userId });
    res.status(201).json({ success: true, data: tb });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Lấy tất cả thông báo (toàn hệ thống hoặc theo user)
exports.getThongBao = async (req, res) => {
  try {
    const { userId } = req.query;
    const filter = userId ? { userId } : {};
    const data = await ThongBao.find({}).sort({ createdAt: -1 }).limit(20);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Đánh dấu đã đọc
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const tb = await ThongBao.findByIdAndUpdate(id, { read: true }, { new: true });
    res.json({ success: true, data: tb });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.updateThongBao = async (req, res) => {
  try {
    const { title, message } = req.body;
    const { id } = req.params;
    const tb = await ThongBao.findByIdAndUpdate(id, { title, message });
    res.json({ success: true, data: tb });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Xóa thông báo
exports.deleteThongBao = async (req, res) => {
  try {
    const { id } = req.params;
    await ThongBao.findByIdAndDelete(id);
    res.json({ success: true, message: "Đã xoá thông báo" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
