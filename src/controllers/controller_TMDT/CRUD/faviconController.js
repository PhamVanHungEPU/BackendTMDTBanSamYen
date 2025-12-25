const Favicon = require("../../../model/ModelBanSam/Favicon");
// CREATE
exports.createFavicon = async (req, res) => {
  try {
    const doc = new Favicon(req.body);
    await doc.save();
    res.status(201).json({ success: true, data: doc, message: "Tạo favicon thành công" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Tạo favicon thất bại", error: error.message });
  }
};

// READ (All with Pagination, Search, Sort, Filter)
exports.getAllFavicons = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 1000, 
      search = "", 
      sortField = "createdAt", 
      sortOrder = "descend",
      // Bộ lọc (Filter)
      hienThi = "" 
    } = req.query;

    let query = {};
    
    // Tìm kiếm (theo moTa)
    if (search) {
      query.moTa = { $regex: search, $options: "i" };
    }

    // Bộ lọc (Filter)
    if (hienThi !== "") {
      query.hienThi = hienThi === 'true'; // 'true' hoặc 'false'
    }
    
    // Sắp xếp
    const sortOptions = {};
    sortOptions[sortField] = sortOrder === "ascend" ? 1 : -1;

    const data = await Favicon.find(query)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Favicon.countDocuments(query);

    res.json({
      success: true,
      data,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      total: count,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lấy danh sách favicon thất bại", error: error.message });
  }
};

// READ (One by ID)
exports.getFaviconById = async (req, res) => {
  try {
    const doc = await Favicon.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({ success: false, message: "Không tìm thấy favicon" });
    }
    res.json({ success: true, data: doc });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lấy chi tiết favicon thất bại", error: error.message });
  }
};

// UPDATE by ID
exports.updateFaviconById = async (req, res) => {
  try {
    const doc = await Favicon.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return res.status(404).json({ success: false, message: "Không tìm thấy favicon" });
    }
    res.json({ success: true, data: doc, message: "Cập nhật favicon thành công" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Cập nhật favicon thất bại", error: error.message });
  }
};

// DELETE by ID
exports.deleteFaviconById = async (req, res) => {
  try {
    const doc = await Favicon.findByIdAndDelete(req.params.id);
    if (!doc) {
      return res.status(404).json({ success: false, message: "Không tìm thấy favicon" });
    }
    res.json({ success: true, message: "Xóa favicon thành công" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Xóa favicon thất bại", error: error.message });
  }
};