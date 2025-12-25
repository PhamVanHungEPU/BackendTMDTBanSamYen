const MaKhuyenMai = require("../../../model/ModelBanSam/MaKhuyenMai");
// CREATE
exports.createMaKhuyenMai = async (req, res) => {
  try {
    const doc = new MaKhuyenMai(req.body);
    await doc.save();
    res.status(201).json({ success: true, data: doc, message: "Tạo mới thành công" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Tạo mới thất bại", error: error.message });
  }
};

// READ (All with Pagination, Search, Sort, Filters)
exports.getAllMaKhuyenMai = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 1000, 
      search = "", 
      sortField = "createdAt", 
      sortOrder = "descend",
      // --- Bộ lọc (Filter) ---
      loaiGiam = "",
      kichHoat = "" 
    } = req.query;

    let query = {};
    // Tìm kiếm
    if (search) {
      query.$or = [
        { tenma: { $regex: search, $options: "i" } },
        { mota: { $regex: search, $options: "i" } }
      ];
    }

    // --- Áp dụng bộ lọc ---
    if (loaiGiam) {
      query.loaiGiam = loaiGiam; // 'phanTram' hoặc 'tienMat'
    }
    if (kichHoat !== "") {
      query.kichHoat = kichHoat === 'true'; // 'true' hoặc 'false'
    }
    
    // Sắp xếp
    const sortOptions = {};
    sortOptions[sortField] = sortOrder === "ascend" ? 1 : -1;

    const data = await MaKhuyenMai.find(query)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await MaKhuyenMai.countDocuments(query);

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
exports.getMaKhuyenMaiById = async (req, res) => {
  try {
    const doc = await MaKhuyenMai.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({ success: false, message: "Không tìm thấy" });
    }
    res.json({ success: true, data: doc });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lấy chi tiết thất bại", error: error.message });
  }
};

// UPDATE by ID
exports.updateMaKhuyenMaiById = async (req, res) => {
  try {
    const doc = await MaKhuyenMai.findByIdAndUpdate(req.params.id, req.body, {
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
exports.deleteMaKhuyenMaiById = async (req, res) => {
  try {
    const doc = await MaKhuyenMai.findByIdAndDelete(req.params.id);
    if (!doc) {
      return res.status(404).json({ success: false, message: "Không tìm thấy" });
    }
    res.json({ success: true, message: "Xóa thành công" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Xóa thất bại", error: error.message });
  }
};