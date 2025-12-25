// controllers/gioHangController.js
const GioHang = require("../../../model/ModelBanSam/GioHang");
const MaKhuyenMai = require("../../../model/ModelBanSam/MaKhuyenMai");
const PhiGiaoHang = require("../../../model/ModelBanSam/PhiGiaoHang");
const SanPham = require("../../../model/ModelBanSam/SanPham");

// ==== Helper tính phí giao hàng ====
async function tinhPhiGiaoHang(tongTienSauVoucher) {
  // Lấy danh sách phí đang kích hoạt
  const phiList = await PhiGiaoHang.find({ kichHoat: true }).sort({
    dieuKienApDung: -1, // Ưu tiên điều kiện cao hơn
  });

  if (!phiList.length) return { phi: 0, chiTiet: null };

  // Tìm phí đầu tiên có điều kiện phù hợp
  const matched = phiList.find((phi) => tongTienSauVoucher >= phi.dieuKienApDung);

  if (matched) {
    return { phi: matched.giaTri, chiTiet: matched };
  }

  // Nếu không có điều kiện phù hợp, lấy phí thấp nhất làm mặc định
  const defaultFee = phiList[phiList.length - 1];
  return { phi: defaultFee.giaTri, chiTiet: defaultFee };
}


// 🟢 Thêm vào giỏ
exports.themVaoGio = async (req, res) => {
  try {
    const { sanPhamId, soLuong } = req.body;
    const userId = req.user._id; // middleware auth gán vào

   if (!sanPhamId || !soLuong)
      return res.status(400).json({ success: false, message: "Thiếu dữ liệu!" });

    // Tìm giỏ hàng của user
    let gioHang = await GioHang.findOne({ nguoiDung: userId });

    if (!gioHang) {
      gioHang = new GioHang({ nguoiDung: userId, sanPhams: [] });
    }

    // Kiểm tra xem sản phẩm đã có trong giỏ chưa
    const existingItem = gioHang.sanPhams.find(
      (item) => item.sanPham.toString() === sanPhamId
    );

    if (existingItem) {
      existingItem.soLuong += soLuong;
    } else {
      gioHang.sanPhams.push({
        sanPham: sanPhamId, // 👈 phải là object có field
        soLuong,
      });
    }

    gioHang.appliedVoucher = null;
    gioHang.discountAmount = 0;

    await gioHang.save();

    res.json({ success: true, data: gioHang });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: error.message || "Lỗi server!" });
  }
};

// 🟢 Lấy giỏ hàng người dùng
exports.layGioHang = async (req, res) => {
  try {
    const gio = await GioHang.findOne({ nguoiDung: req.user._id })
      .populate("sanPhams.sanPham")
      .populate("appliedVoucher")

    if (!gio)
      return res.json({ success: true, data: { sanPhams: [], tongTien: 0 } });

    // ✅ Tính lại tổng tiền theo giá hiện tại
    const tongTienGoc = gio.sanPhams.reduce((sum, item) => {
      const sp = item.sanPham;
      if (!sp) return sum;
      const donGiaSauGiam = sp.giaBan * (1 - (sp.phanTramGiam || 0) / 100);
      return sum + donGiaSauGiam * item.soLuong;
    }, 0);

    let tongSau = tongTienGoc;
    let voucherInfo = null;

    if (gio.appliedVoucher) {
      tongSau = Math.max(0, tongTienGoc - gio.discountAmount);
      voucherInfo = {
        tenma: gio.appliedVoucher.tenma,
        mota: gio.appliedVoucher.mota,
        giamGia: gio.discountAmount,
      };
    }

    // ✅ Thêm tính phí giao hàng
    const { phi, chiTiet } = await tinhPhiGiaoHang(tongSau);
    const tongCuoi = tongSau + phi;

    return res.json({
      success: true,
      data: { 
            ...gio.toObject(), 
            tongTien: tongCuoi, 
            tongHang: tongSau,
            phiGiaoHang: phi,
            phiChiTiet: chiTiet,  
            voucher: voucherInfo,  
        },
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// 🟢 Cập nhật số lượng (body: { sanPhamId, soLuong })
exports.capNhatSoLuong = async (req, res) => {
  try {
    const { sanPhamId, soLuong } = req.body;
  
    
    const qty = Math.max(1, Number(soLuong) || 1);

    let gio = await GioHang.findOne({ nguoiDung: req.user._id }).populate("nguoiDung sanPhams.sanPham")
    if (!gio) return res.status(404).json({ success: false, message: "Giỏ hàng trống" });

    const item = gio.sanPhams.find((i) => {
        const id =
            typeof i.sanPham === "object"
            ? i.sanPham._id.toString()
            : i.sanPham.toString();
        return id === sanPhamId;
    });

    if (!item) return res.status(404).json({ success: false, message: "Không tìm thấy sản phẩm trong giỏ" });

    item.soLuong = qty;

    gio.appliedVoucher = null;
    gio.discountAmount = 0;

    await gio.save();

    // ✅ Populate lại để có dữ liệu sản phẩm đầy đủ
    await gio.populate("sanPhams.sanPham");

     // ✅ Tính lại tổng tiền
    const tongTien = gio.sanPhams.reduce((sum, i) => {
      const sp = i.sanPham;
      if (!sp) return sum;
      const donGiaSauGiam = sp.giaBan * (1 - (sp.phanTramGiam || 0) / 100);
      return sum + donGiaSauGiam * i.soLuong;
    }, 0);

    const { phi, chiTiet } = await tinhPhiGiaoHang(tongTien);
    gio.tongTien = tongTien + phi;
    await gio.save();

    return res.json({
        success: true,
        data: {
            ...gio.toObject(),
            tongHang: tongTien,
            phiGiaoHang: phi,
            phiChiTiet: chiTiet,
            tongTien: gio.tongTien
        },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 🟢 Xóa 1 sản phẩm khỏi giỏ (params: :sanPhamId)
exports.xoaKhoiGio = async (req, res) => {
  try {
    const { sanPhamId } = req.params;
    const userId = req.user._id;

    // Tìm giỏ hàng người dùng
    let gio = await GioHang.findOne({ nguoiDung: userId }).populate("sanPhams.sanPham");
    if (!gio) {
      return res.status(404).json({
        success: false,
        message: "Giỏ hàng trống.",
      });
    }

    // Lọc bỏ sản phẩm có ID trùng với sanPhamId
    const beforeCount = gio.sanPhams.length;
    gio.sanPhams = gio.sanPhams.filter((item) => {
      const id =
        typeof item.sanPham === "object"
          ? item.sanPham._id.toString()
          : item.sanPham.toString();
      return id !== sanPhamId;
    });

    if (gio.sanPhams.length === beforeCount) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm trong giỏ hàng.",
      });
    }

    gio.appliedVoucher = null;
    gio.discountAmount = 0;

    // Lưu lại giỏ hàng
    await gio.save();

    // Populate lại để trả về dữ liệu đầy đủ
    await gio.populate("sanPhams.sanPham");

    // Tính lại tổng tiền
    const tongTien = gio.sanPhams.reduce((sum, item) => {
      const sp = item.sanPham;
      if (!sp) return sum;
      const donGiaSauGiam = sp.giaBan * (1 - (sp.phanTramGiam || 0) / 100);
      return sum + donGiaSauGiam * item.soLuong;
    }, 0);

   const { phi, chiTiet } = await tinhPhiGiaoHang(tongTien);
    gio.tongTien = tongTien + phi;
    await gio.save();

    res.json({
        success: true,
        message: "Đã xóa sản phẩm khỏi giỏ hàng.",
        data: {
            ...gio.toObject(),
            tongHang: tongTien,
            phiGiaoHang: phi,
            phiChiTiet: chiTiet,
            tongTien: gio.tongTien,
        },
    });
  } catch (err) {
    console.error("❌ Lỗi xóa sản phẩm:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Lỗi server!",
    });
  }
};


// 🟢 Xóa toàn bộ giỏ hàng của user
exports.xoaTatCa = async (req, res) => {
  try {
    const userId = req.user._id;

    let gio = await GioHang.findOne({ nguoiDung: userId });
    if (!gio) {
      // Nếu chưa có giỏ, coi như trống
      return res.json({
        success: true,
        message: "Giỏ hàng đã trống.",
        data: { sanPhams: [], tongTien: 0 },
      });
    }

    // Xóa toàn bộ sản phẩm trong giỏ
    gio.sanPhams = [];
    gio.tongTien = 0;

    gio.appliedVoucher = null;
    gio.discountAmount = 0;
   
    const { phi, chiTiet } = await tinhPhiGiaoHang(0);

    await gio.save();


    res.json({
    success: true,
    message: "Đã xóa toàn bộ giỏ hàng.",
    data: {
        sanPhams: [],
        tongHang: 0,
        phiGiaoHang: phi,
        phiChiTiet: chiTiet,
        tongTien: phi, // vì chỉ còn phí giao hàng
    },
    });

  } catch (err) {
    console.error("❌ Lỗi xóa toàn bộ giỏ:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Lỗi server!",
    });
  }
};


// 🟢 Áp dụng mã khuyến mãi
exports.apDungVoucher = async (req, res) => {
  try {
    const { maCode } = req.body;
    const userId = req.user._id;

    if (!maCode)
      return res.status(400).json({ success: false, message: "Thiếu mã khuyến mãi!" });

    // 🔹 Tìm giỏ hàng của người dùng
    let gioHang = await GioHang.findOne({ nguoiDung: userId }).populate("sanPhams.sanPham");
    if (!gioHang)
      return res.status(404).json({ success: false, message: "Giỏ hàng trống!" });

    // 🔹 Nếu giỏ đã áp dụng mã khuyến mãi
    if (gioHang.appliedVoucher)
      return res.status(400).json({ success: false, message: "Giỏ hàng đã áp dụng mã khuyến mãi!" });

    // 🔹 Tìm mã khuyến mãi hợp lệ
    const voucher = await MaKhuyenMai.findOne({
      tenma: maCode.trim(),
      kichHoat: true,
      ngayBatDau: { $lte: new Date() },
      ngayKetThuc: { $gte: new Date() },
      soLuongMa: { $gt: 0 },
    });

    if (!voucher)
      return res.status(404).json({ success: false, message: "Mã khuyến mãi không tồn tại hoặc đã hết hạn!" });

    // 🔹 Kiểm tra điều kiện tổng tiền
    const tongTien = gioHang.tongTien;
    if (tongTien < voucher.dieuKienApDung)
      return res.status(400).json({
        success: false,
        message: `Mã ${voucher.tenma} chỉ áp dụng cho đơn từ ${voucher.dieuKienApDung.toLocaleString()}đ trở lên!`,
      });

    // 🔹 Tính giảm giá
    let giamGia = 0;
    if (voucher.loaiGiam === "phanTram") {
      giamGia = (tongTien * voucher.giaTriGiam) / 100;
      if (voucher.giamToiDa > 0) {
        giamGia = Math.min(giamGia, voucher.giamToiDa);
      }
    } else if (voucher.loaiGiam === "tienMat") {
      giamGia = voucher.giaTriGiam;
    }

    // 🔹 Cập nhật giỏ
    gioHang.appliedVoucher = voucher._id;
    gioHang.discountAmount = Math.round(giamGia);
    // gioHang.tongTien = Math.max(0, Math.round(tongTien - giamGia));
    const tongSauVoucher = Math.max(0, Math.round(tongTien - giamGia));

    // 🔹 Thêm phí giao hàng
    const { phi, chiTiet } = await tinhPhiGiaoHang(tongSauVoucher);
    gioHang.tongTien = tongSauVoucher + phi;


    await gioHang.save();

    // 🔹 Giảm số lượng mã
    voucher.soLuongMa = Math.max(0, voucher.soLuongMa - 1);
    await voucher.save();

    res.json({
      success: true,
      message: `Áp dụng mã ${voucher.tenma} thành công!`,
      data: {
        tongTruoc: tongTien,
        giamGia: Math.round(giamGia),
        phiGiaoHang: phi,
        phiChiTiet: chiTiet,
        tongSau: Math.round(gioHang.tongTien),
        voucher: {
            tenma: voucher.tenma,
            loaiGiam: voucher.loaiGiam,
            giaTriGiam: voucher.giaTriGiam,
            giamToiDa: voucher.giamToiDa,
        },
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message || "Lỗi server!" });
  }
};

// 🟢 Xóa mã khuyến mãi đã áp dụng
exports.xoaVoucher = async (req, res) => {
  try {
    const userId = req.user._id;

    // Tìm giỏ hàng
    let gio = await GioHang.findOne({ nguoiDung: userId }).populate("appliedVoucher");
    if (!gio) return res.status(404).json({ success: false, message: "Giỏ hàng trống!" });

    if (!gio.appliedVoucher)
      return res.status(400).json({ success: false, message: "Chưa áp dụng mã khuyến mãi nào!" });

    // Hoàn lại số lượng mã (nếu cần)
    const voucher = await MaKhuyenMai.findById(gio.appliedVoucher);
    if (voucher) {
      voucher.soLuongMa += 1;
      await voucher.save();
    }

    // Xóa mã khỏi giỏ
    gio.appliedVoucher = null;
    gio.discountAmount = 0;

    // ✅ Tính lại tổng tiền gốc
    let tongHang = 0;
    for (const item of gio.sanPhams) {
      const sp = await SanPham.findById(item.sanPham).select("giaBan phanTramGiam");
      if (!sp) continue;
      const donGiaSauGiam = sp.giaBan * (1 - (sp.phanTramGiam || 0) / 100);
      tongHang += donGiaSauGiam * item.soLuong;
    }

    // ✅ Tính lại phí giao hàng theo tổng hàng mới
    const { phi, chiTiet } = await tinhPhiGiaoHang(tongHang);

    gio.tongTien = Math.round(tongHang + phi);
    await gio.save();

    return res.json({
      success: true,
      message: "Đã xóa mã khuyến mãi khỏi giỏ hàng.",
      data: {
        ...gio.toObject(),
        tongHang: Math.round(tongHang),
        phiGiaoHang: phi,
        phiChiTiet: chiTiet,
        tongTien: gio.tongTien,
      },
    });
  } catch (err) {
    console.error("❌ Lỗi xóa voucher:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};