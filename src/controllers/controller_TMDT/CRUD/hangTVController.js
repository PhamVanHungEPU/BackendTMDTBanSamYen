const HangTV = require("../../../model/ModelBanSam/HangTV");
// CREATE
exports.createHangTV = async (req, res) => {
  try {
    const doc = new HangTV(req.body);
    await doc.save();
    res.status(201).json({ success: true, data: doc, message: "Tạo mới thành công" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Tạo mới thất bại", error: error.message });
  }
};

// READ (All with Pagination, Search, Sort)
exports.getAllHangTV = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 1000, 
      search = "", 
      // Sắp xếp mặc định theo điều kiện tiêu thụ
      sortField = "dieuKienTieuThu", 
      sortOrder = "ascend" 
    } = req.query;

    let query = {};
    if (search) {
      query.$or = [
        { tenHang: { $regex: search, $options: "i" } },
        { moTa: { $regex: search, $options: "i" } }
      ];
    }
    
    const sortOptions = {};
    sortOptions[sortField] = sortOrder === "ascend" ? 1 : -1;

    const data = await HangTV.find(query)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await HangTV.countDocuments(query);

    res.json({
      success: true,
      data,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      total: count,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lấy danh sách thất bại", error: error.message });
  }
};

// READ (One by ID)
exports.getHangTVById = async (req, res) => {
  try {
    const doc = await HangTV.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({ success: false, message: "Không tìm thấy" });
    }
    res.json({ success: true, data: doc });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lấy chi tiết thất bại", error: error.message });
  }
};

// UPDATE by ID
exports.updateHangTVById = async (req, res) => {
  try {
    const doc = await HangTV.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return res.status(404).json({ success: false, message: "Không tìm thấy" });
    }
    res.json({ success: true, data: doc, message: "Cập nhật thành công" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Cập nhật thất bại", error: error.message });
  }
};

// DELETE by ID
exports.deleteHangTVById = async (req, res) => {
  try {
    const doc = await HangTV.findByIdAndDelete(req.params.id);
    if (!doc) {
      return res.status(404).json({ success: false, message: "Không tìm thấy" });
    }
    res.json({ success: true, message: "Xóa thành công" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Xóa thất bại", error: error.message });
  }
};