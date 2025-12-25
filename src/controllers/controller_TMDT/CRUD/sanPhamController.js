const LoaiSanPhamCon = require("../../../model/ModelBanSam/LoaiSanPhamCon");
const SanPham = require("../../../model/ModelBanSam/SanPham");
// CREATE
exports.createSanPham = async (req, res) => {
  try {
    const doc = new SanPham(req.body);
    await doc.save();
    res.status(201).json({ success: true, data: doc, message: "Tạo sản phẩm thành công" });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "Mã SP hoặc Tên sản phẩm đã tồn tại" });
    }
    res.status(500).json({ success: false, message: "Tạo sản phẩm thất bại", error: error.message });
  }
};

// READ (All)
exports.getAllSanPham = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 1000, 
      search = "", 
      sortField = "createdAt", 
      sortOrder = "descend",
      thuongHieu,
      dangSP,
      loaiNoiBat,
      loaiSanPhamCon,
      maKhuyenMai,
      congDungSP,
      hienThi,
      giaBan_min,
      giaBan_max,
      soLuongTon_min,
      soLuongTon_max,
      khuyenMaiHapDan,
      maLSPCon
    } = req.query;

    let query = {};
    
    // 1. Tìm kiếm (Search)        
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { maSP: { $regex: search, $options: "i" } },
        { moTaNgan: { $regex: search, $options: "i" } },
        { metaTitle: { $regex: search, $options: "i" } },
        { metaKeyword: { $regex: search, $options: "i" } },
      ];
    }

    // 2. Bộ lọc (Filter)
    if (thuongHieu) query.thuongHieu = thuongHieu;
    if (dangSP) query.dangSP = dangSP;
    if (loaiNoiBat) query.loaiNoiBat = loaiNoiBat;
    if (loaiSanPhamCon) query.loaiSanPhamCon = loaiSanPhamCon;
    if (hienThi !== undefined && hienThi !== "") {
      query.hienThi = hienThi === 'true';
    }
    if (khuyenMaiHapDan !== undefined && khuyenMaiHapDan !== "") {
      query.khuyenMaiHapDan = khuyenMaiHapDan === 'true';
    }
    if (maKhuyenMai) query.maKhuyenMai = { $in: [maKhuyenMai] };
    if (congDungSP) query.congDungSP = { $in: [congDungSP] };
    
    if (giaBan_min || giaBan_max) {
      query.giaBan = {};
      if (giaBan_min) query.giaBan.$gte = Number(giaBan_min);
      if (giaBan_max) query.giaBan.$lte = Number(giaBan_max);
    }
    if (soLuongTon_min || soLuongTon_max) {
      query.soLuongTon = {};
      if (soLuongTon_min) query.soLuongTon.$gte = Number(soLuongTon_min);
      if (soLuongTon_max) query.soLuongTon.$lte = Number(soLuongTon_max);
    }
    
    // 3. Sắp xếp (Sort)
    const sortOptions = {};
    sortOptions[sortField] = sortOrder === "ascend" ? 1 : -1;

    // 🆕 Nếu truyền mã Loại Sản Phẩm Con
    if (maLSPCon) {
      const loaiCon = await LoaiSanPhamCon.findOne({ maLSPCon });
      if (loaiCon) {
        query.loaiSanPhamCon = loaiCon._id;
      } else {
        return res.json({
          success: true,
          data: [],
          totalPages: 0,
          currentPage: Number(page),
          total: 0,
          message: "Không tìm thấy loại sản phẩm con theo mã đã nhập"
        });
      }
    }

    // 4. Thực thi Query
    const data = await SanPham.find(query)
      .populate('thuongHieu dangSP loaiNoiBat loaiSanPhamCon maKhuyenMai congDungSP')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await SanPham.countDocuments(query);

    res.json({
      success: true,
      data,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      total: count,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lấy danh sách sản phẩm thất bại", error: error.message });
  }
};

// READ (One by ID)
exports.getSanPhamById = async (req, res) => {
  try {
    const doc = await SanPham.findOne({maSP: req.params.id})
      .populate('thuongHieu dangSP loaiNoiBat loaiSanPhamCon maKhuyenMai congDungSP'); 
      
    if (!doc) {
      return res.status(404).json({ success: false, message: "Không tìm thấy sản phẩm" });
    }
    res.json({ success: true, data: doc });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lấy chi tiết sản phẩm thất bại", error: error.message });
  }
};

// UPDATE by ID
exports.updateSanPhamById = async (req, res) => {
  try {
    const doc = await SanPham.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return res.status(404).json({ success: false, message: "Không tìm thấy sản phẩm" });
    }
    res.json({ success: true, data: doc, message: "Cập nhật sản phẩm thành công" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Cập nhật sản phẩm thất bại", error: error.message });
  }
};

// DELETE by ID
exports.deleteSanPhamById = async (req, res) => {
  try {
    const doc = await SanPham.findByIdAndDelete(req.params.id);
    if (!doc) {
      return res.status(404).json({ success: false, message: "Không tìm thấy sản phẩm" });
    }
    res.json({ success: true, message: "Xóa sản phẩm thành công" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Xóa sản phẩm thất bại", error: error.message });
  }
};

// --- THÊM MỚI: API ẨN/HIỆN SẢN PHẨM ---
exports.toggleHienThi = async (req, res) => {
  try {
    const { id } = req.params;
    const sanPham = await SanPham.findById(id);

    if (!sanPham) {
      return res.status(404).json({ success: false, message: "Không tìm thấy sản phẩm" });
    }

    // Đảo ngược trạng thái
    sanPham.hienThi = !sanPham.hienThi;
    await sanPham.save();

    res.json({
      success: true,
      message: `Đã ${sanPham.hienThi ? 'hiển thị' : 'ẩn'} sản phẩm "${sanPham.name}"`,
      data: {
        id: sanPham._id,
        hienThi: sanPham.hienThi,
      },
    });

  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi khi thay đổi trạng thái", error: error.message });
  }
};

exports.toggleHienThiKMHapDan = async (req, res) => {
  try {
    const { id } = req.params;
    const sanPham = await SanPham.findById(id);

    if (!sanPham) {
      return res.status(404).json({ success: false, message: "Không tìm thấy sản phẩm" });
    }

    // Đảo ngược trạng thái
    sanPham.khuyenMaiHapDan = !sanPham.khuyenMaiHapDan;
    await sanPham.save();

    res.json({
      success: true,
      message: `Đã ${sanPham.khuyenMaiHapDan ? 'hiển thị' : 'ẩn'} sản phẩm "${sanPham.name} này lên danh sách khuyến mãi hấp dẫn!"`,
      data: {
        id: sanPham._id,
        khuyenMaiHapDan: sanPham.khuyenMaiHapDan,
      },
    });

  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi khi thay đổi trạng thái", error: error.message });
  }
};