const SanPham = require("../../../model/ModelBanSam/SanPham");
const NguoiDung = require("../../../model/ModelBanSam/NguoiDung");
const DonHang = require("../../../model/ModelBanSam/DonHang");
const BaiViet = require("../../../model/ModelBanSam/BaiViet");


// 🧮 Hàm nhóm doanh thu theo ngày
function groupByDate(orders) {
  const map = {};
  orders.forEach((order) => {
    const d = new Date(order.ngayDat);
    const dayOfWeek = d.getDay(); // 0 = Chủ nhật, 1 = Thứ 2, ...
    
    // Map số sang tên ngày
    const dayNames = [
      "Chủ nhật",
      "Thứ 2", 
      "Thứ 3",
      "Thứ 4",
      "Thứ 5",
      "Thứ 6",
      "Thứ 7"
    ];
    
    const key = dayNames[dayOfWeek];
    map[key] = (map[key] || 0) + order.tongThanhToan;
  });
  return Object.entries(map).map(([ngay, tong]) => ({ ngay, tong }));
}

// 🧩 Controller chính
exports.thongKeDashboard = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const sevenDaysAgo = new Date(now.setDate(now.getDate() - 6));

    // --- Đếm tổng ---
    const [donHang, nguoiDung, sanPham, baiViet] = await Promise.all([
      DonHang.countDocuments(),
      NguoiDung.countDocuments(),
      SanPham.countDocuments(),
      BaiViet.countDocuments(),
    ]);

    // --- Doanh thu tháng này ---
    const donThang = await DonHang.find({
      trangThaiDon: "Hoàn thành",
      ngayDat: { $gte: startOfMonth },
    });
    const doanhThuThang = donThang.reduce(
      (sum, d) => sum + (d.tongThanhToan || 0),
      0
    );

    // --- Doanh thu 7 ngày gần nhất ---
    const don7Ngay = await DonHang.find({
      trangThaiDon: "Hoàn thành",
      ngayDat: { $gte: sevenDaysAgo },
    });

    const doanhThu7Ngay = groupByDate(don7Ngay);

    // --- Lượt truy cập (tạm thời random vì chưa có bảng logs) ---
    const truyCap7Ngay = [
      { ngay: "Thứ 5", luot: 40 },
      { ngay: "Thứ 6", luot: 60 },
      { ngay: "Thứ 7", luot: 30 },
      { ngay: "Chủ nhật", luot: 50 },
      { ngay: "Thứ 2", luot: 90 },
      { ngay: "Thứ 3", luot: 70 },
      { ngay: "Thứ 4", luot: 80 },
    ];

    return res.json({
      success: true,
      data: {
        donHang,
        nguoiDung,
        baiViet,
        sanPham,
        doanhThuThang,
        doanhThu7Ngay,
        truyCap7Ngay,
      },
    });
  } catch (err) {
    console.error("❌ Lỗi thống kê dashboard:", err);
    return res.status(500).json({ success: false, message: "Lỗi server" });
  }
};
