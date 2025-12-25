const PhiGiaoHang = require("../../../model/ModelBanSam/PhiGiaoHang");

// 🟢 Thêm phí giao hàng
exports.taoPhiGiaoHang = async (req, res) => {
  try {
    const data = req.body;

    const tonTai = await PhiGiaoHang.findOne({ name: data.name });
    if (tonTai)
      return res.status(400).json({ success: false, message: "Tên phí đã tồn tại!" });

    const phi = await PhiGiaoHang.create(data);
    res.status(201).json({
      success: true,
      message: "Thêm phí giao hàng thành công!",
      data: phi,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 🟡 Lấy danh sách tất cả phí giao hàng
exports.layTatCaPhi = async (req, res) => {
  try {
    const list = await PhiGiaoHang.find().sort({ createdAt: -1 });
    res.json({ success: true, data: list });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 🔵 Lấy 1 phí giao hàng theo ID
exports.layMotPhi = async (req, res) => {
  try {
    const phi = await PhiGiaoHang.findById(req.params.id);
    if (!phi)
      return res.status(404).json({ success: false, message: "Không tìm thấy phí giao hàng!" });
    res.json({ success: true, data: phi });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 🟠 Cập nhật phí giao hàng
exports.capNhatPhi = async (req, res) => {
  try {
    const phi = await PhiGiaoHang.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!phi)
      return res.status(404).json({ success: false, message: "Không tìm thấy phí giao hàng để cập nhật!" });

    res.json({
      success: true,
      message: "Cập nhật phí giao hàng thành công!",
      data: phi,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 🔴 Xóa phí giao hàng
exports.xoaPhi = async (req, res) => {
  try {
    const phi = await PhiGiaoHang.findByIdAndDelete(req.params.id);
    if (!phi)
      return res.status(404).json({ success: false, message: "Không tìm thấy phí giao hàng để xóa!" });

    res.json({ success: true, message: "Đã xóa phí giao hàng!" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
