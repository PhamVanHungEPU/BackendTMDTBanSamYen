const Banner = require("../../../model/ModelBanSam/Banner");
// CREATE
exports.createBanner = async (req, res) => {
  try {
    const doc = new Banner(req.body);
    await doc.save();
    res.status(201).json({ success: true, data: doc, message: "Tạo banner thành công" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Tạo banner thất bại", error: error.message });
  }
};

// READ (All with Pagination, Search, Sort, Filter)
exports.getAllBanners = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 1000, 
      search = "", 
      // Sắp xếp mặc định theo 'thứ tự' tăng dần
      sortField = "thuTu", 
      sortOrder = "ascend",
      // Bộ lọc (Filter)
      hienThi = "" 
    } = req.query;

    let query = {};
    
    // Tìm kiếm (theo moTa, linkURL)
    if (search) {
      query.$or = [
        { moTa: { $regex: search, $options: "i" } },
        { linkURL: { $regex: search, $options: "i" } }
      ];
    }

    // Bộ lọc (Filter)
    if (hienThi !== "") {
      query.hienThi = hienThi === 'true'; // 'true' hoặc 'false'
    }
    
    // Sắp xếp
    const sortOptions = {};
    sortOptions[sortField] = sortOrder === "ascend" ? 1 : -1;

    const data = await Banner.find(query)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Banner.countDocuments(query);

    res.json({
      success: true,
      data,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      total: count,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lấy danh sách banner thất bại", error: error.message });
  }
};

// READ (One by ID)
exports.getBannerById = async (req, res) => {
  try {
    const doc = await Banner.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({ success: false, message: "Không tìm thấy banner" });
    }
    res.json({ success: true, data: doc });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lấy chi tiết banner thất bại", error: error.message });
  }
};

// UPDATE by ID
exports.updateBannerById = async (req, res) => {
  try {
    const doc = await Banner.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return res.status(404).json({ success: false, message: "Không tìm thấy banner" });
    }
    res.json({ success: true, data: doc, message: "Cập nhật banner thành công" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Cập nhật banner thất bại", error: error.message });
  }
};

// DELETE by ID
exports.deleteBannerById = async (req, res) => {
  try {
    const doc = await Banner.findByIdAndDelete(req.params.id);
    if (!doc) {
      return res.status(404).json({ success: false, message: "Không tìm thấy banner" });
    }
    res.json({ success: true, message: "Xóa banner thành công" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Xóa banner thất bại", error: error.message });
  }
};