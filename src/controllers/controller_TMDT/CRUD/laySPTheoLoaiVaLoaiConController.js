const SanPham = require("../../../model/ModelBanSam/SanPham");
const LoaiSanPham = require("../../../model/ModelBanSam/LoaiSanPham");



/**
 * @route GET /api/sanpham/loai/:idLoai
 * @desc  Lấy danh sách loại con theo loại sản phẩm
 */
exports.getLoaiConTheoLoai = async (req, res) => {
  try {
    const { idLoai } = req.params;

    const loai = await LoaiSanPham.findById(idLoai)
      .populate("loaiCon", "name mota image")
      .lean();

    if (!loai)
      return res.status(404).json({ success: false, message: "Không tìm thấy loại sản phẩm" });

    res.status(200).json({ success: true, data: loai.loaiCon });
  } catch (error) {
    console.error("Lỗi getLoaiConTheoLoai:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

/**
 * @route GET /api/sanpham/loai-con/:idLoaiCon
 * @desc  Lấy danh sách sản phẩm thuộc loại con
 */
exports.getSanPhamTheoLoaiCon = async (req, res) => {
  try {
    const { idLoaiCon } = req.params;

    const sanphams = await SanPham.find({
      loaiSanPhamCon: idLoaiCon,
      hienThi: true,
    })
     .populate('thuongHieu dangSP loaiNoiBat loaiSanPhamCon maKhuyenMai congDungSP')
      .lean();

    res.status(200).json({
      success: true,
      count: sanphams.length,
      data: sanphams,
    });
  } catch (error) {
    console.error("Lỗi getSanPhamTheoLoaiCon:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};
