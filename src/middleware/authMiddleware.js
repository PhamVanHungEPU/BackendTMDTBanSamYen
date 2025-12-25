const jwt = require("jsonwebtoken");
const NguoiDung = require("../model/ModelBanSam/NguoiDung");

exports.protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Chưa đăng nhập hoặc thiếu token" });
    }

    const token = authHeader.split(" ")[1];

    // ✅ Giải mã token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Phiên đăng nhập đã hết hạn" });
      }
      return res.status(401).json({ message: "Token không hợp lệ" });
    }

    // ✅ Tìm user theo ID
    const user = await NguoiDung.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    // ✅ Kiểm tra token khớp trong DB (để phát hiện bị logout hoặc đổi quyền)
    if (user.currentToken !== token) {
      return res.status(401).json({ message: "Phiên đăng nhập không hợp lệ hoặc đã bị đăng xuất" });
    }

    // ✅ Gán user vào request để controller sau dùng
    req.user = user;
    next();
  } catch (error) {
    console.error("❌ Lỗi middleware protect:", error);
    res.status(500).json({ message: "Lỗi xác thực token", error: error.message });
  }
};
