// controllers/danhGia.controller.js

const DanhGia = require("../../../model/ModelBanSam/DanhGia");
const SanPham = require("../../../model/ModelBanSam/SanPham");

/**
 * ✅ Thêm đánh giá cho sản phẩm
 * POST /api/danh-gia
 */
exports.createDanhGia = async (req, res) => {
  try {
    const { sanPham, nguoiDanhGia, sao, binhLuan } = req.body;

    if (!sanPham || !nguoiDanhGia || !sao) {
      return res.status(400).json({
        success: false,
        message: "Thiếu dữ liệu bắt buộc.",
      });
    }

    // Kiểm tra tồn tại sản phẩm
    const sp = await SanPham.findById(sanPham);
    if (!sp)
      return res.status(404).json({ success: false, message: "Không tìm thấy sản phẩm." });

    // Tạo đánh giá
    const danhGia = await DanhGia.create({
      sanPham,
      nguoiDanhGia,
      sao,
      binhLuan,
    });

    res.status(201).json({
      success: true,
      message: "Thêm đánh giá thành công.",
      data: danhGia,
    });
  } catch (error) {
    console.error("❌ Lỗi tạo đánh giá:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi thêm đánh giá.",
      error: error.message,
    });
  }
};

/**
 * ✅ Lấy danh sách đánh giá theo sản phẩm
 * GET /api/danh-gia/san-pham/:idSP
 */
exports.getDanhGiaTheoSanPham = async (req, res) => {
  try {
    const { idSP } = req.params;

    const danhGias = await DanhGia.find({ sanPham: idSP })
      .populate("nguoiDanhGia", "hoTen soDienThoai email avatar")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: danhGias.length,
      data: danhGias,
    });
  } catch (error) {
    console.error("❌ Lỗi lấy đánh giá:", error);
    res.status(500).json({
      success: false,
      message: "Không thể lấy danh sách đánh giá.",
      error: error.message,
    });
  }
};

/**
 * ✅ Tính trung bình sao của sản phẩm
 * GET /api/danh-gia/trung-binh/:idSP
 */
exports.getTrungBinhSao = async (req, res) => {
  try {
    const { idSP } = req.params;

    const result = await DanhGia.aggregate([
      { $match: { sanPham: require("mongoose").Types.ObjectId.createFromHexString(idSP) } },
      {
        $group: {
          _id: "$sanPham",
          trungBinh: { $avg: "$sao" },
          tongDanhGia: { $sum: 1 },
        },
      },
    ]);

    if (result.length === 0)
      return res.status(200).json({
        success: true,
        data: { trungBinh: 0, tongDanhGia: 0 },
      });

    res.status(200).json({
      success: true,
      data: result[0],
    });
  } catch (error) {
    console.error("❌ Lỗi tính trung bình sao:", error);
    res.status(500).json({
      success: false,
      message: "Không thể tính trung bình sao.",
      error: error.message,
    });
  }
};

/**
 * ✅ Xóa đánh giá
 * DELETE /api/danh-gia/:id
 */
exports.deleteDanhGia = async (req, res) => {
  try {
    const { id } = req.params;
    const nguoiDanhGia = req.user._id

    if (!nguoiDanhGia) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin người đánh giá.",
      });
    }

    // Xóa theo đúng id + đúng người đã đánh giá
    const dg = await DanhGia.findOneAndDelete({
      _id: id,
      nguoiDanhGia: nguoiDanhGia
    });

    if (!dg) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đánh giá hoặc bạn không có quyền xóa.",
      });
    }

    res.json({
      success: true,
      message: "Đã xóa đánh giá thành công.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Không thể xóa đánh giá.",
      error: error.message,
    });
  }
};
