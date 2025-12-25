const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../../../utils/generateToken");
const NguoiDung = require("../../../model/ModelBanSam/NguoiDung");

// 📌 Đăng ký tài khoản
exports.registerTK = async (req, res) => {
  try {
    const { email, soDienThoai, hoTen, matKhau, diaChi } = req.body;

    if (!email || !matKhau) {
      return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin" });
    }

    // Kiểm tra trùng email
    const existedEmail = await NguoiDung.findOne({ email });
    if (existedEmail) {
      return res.status(400).json({ message: "Có thể email này đã được đăng ký. Vui lòng chọn email khác!" });
    }

    // Kiểm tra trùng số điện thoại (nếu có)
    if (soDienThoai) {
      const existedPhone = await NguoiDung.findOne({ soDienThoai });
      if (existedPhone) {
        return res.status(400).json({ message: "Có thể Số điện thoại này đã được đăng ký. Vui lòng chọn Số điện thoại khác!" });
      }
    }

    // Hash mật khẩu
    const hashedPassword = await bcrypt.hash(matKhau, 10);

    const newUser = new NguoiDung({
      email,
      soDienThoai,
      hoTen,
      diaChi,
      matKhau: hashedPassword,
    });

    await newUser.save();

    const token = generateToken(newUser);

    res.status(201).json({
      message: "Đăng ký thành công",
      user: {
        id: newUser._id,
        email: newUser.email,
        hoTen: newUser.hoTen,
        soDienThoai: newUser.soDienThoai,
        vaiTro: newUser.vaiTro,
      },
      token,
    });
  } catch (error) {
    console.error("Lỗi đăng ký:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// 📌 Đăng nhập
exports.loginTK = async (req, res) => {
  try {
    const { taiKhoan, matKhau } = req.body; // thay 'email' thành 'taiKhoan' cho linh hoạt

    // if (!taiKhoan || !matKhau) {
    //   return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin" });
    // }

    // Kiểm tra người dùng có nhập email hay số điện thoại
    let user;
    if (taiKhoan.includes("@")) {
      // Nếu có ký tự @ → là email
      user = await NguoiDung.findOne({ email: taiKhoan });
    } else {
      // Nếu không có @ → là số điện thoại
      user = await NguoiDung.findOne({ soDienThoai: taiKhoan });
    }

    if(!user.isActive){
        return res.status(403).json({ message: "Tài khoản đang bị khóa. Liên hệ admin để khắc phục!" });
    }

    if (!user) {
      return res.status(404).json({ message: "Sai email hoặc số điện thoại" });
    }

    // So sánh mật khẩu
    const isMatch = await bcrypt.compare(matKhau, user.matKhau);
    if (!isMatch) {
      return res.status(400).json({ message: "Mật khẩu không chính xác" });
    }
   

    // Tạo token
    const token = generateToken(user);

    user.currentToken = token;
    await user.save();

    res.status(200).json({
      message: "Đăng nhập thành công",
      user: {
        id: user._id,
        email: user.email,
        soDienThoai: user.soDienThoai,
        hoTen: user.hoTen,
        vaiTro: user.vaiTro,
        avatar: user.avatar,
        permissions: user.permissions,
      },
      token,
    });
  } catch (error) {
    console.error("Lỗi đăng nhập:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};


// 📌 Đăng xuất
exports.logoutTK = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    await NguoiDung.findByIdAndUpdate(decoded.id, { $unset: { currentToken: "" } });

    res.status(200).json({ message: "Đăng xuất thành công" });
  } catch (error) {
    res.status(400).json({ message: "Lỗi khi đăng xuất", error: error.message });
  }
};


// 📌 Lấy thông tin user hiện tại (sau khi login)
exports.getMeTK = async (req, res) => {
  try {
    console.log("req.user từ token:", req.user); 
    console.log("User ID từ token:", req.user._id); // Kiểm tra user ID từ token
    
    const user = await NguoiDung.findById(req.user._id).populate("hangThanhVien").select("-matKhau"); // loại bỏ trường mật khẩu khi trả về
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

exports.doiMatKhau = async (req, res) => {
  try {
    const { matKhauCu, matKhauMoi } = req.body;
    console.log("req.user._id: ",req.user._id);
    

    if (!matKhauCu || !matKhauMoi)
      return res
        .status(400)
        .json({ success: false, message: "Thiếu mật khẩu cũ hoặc mới" });

    const user = await NguoiDung.findById(req.user._id).populate('hangThanhVien')
    if (!user)
      return res.status(404).json({ success: false, message: "Không tìm thấy người dùng" });

    // ✅ Kiểm tra mật khẩu cũ
    const isMatch = await bcrypt.compare(matKhauCu, user.matKhau);
    if (!isMatch)
      return res
        .status(400)
        .json({ success: false, message: "Mật khẩu cũ không đúng" });

    // ✅ Hash mật khẩu mới
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(matKhauMoi, salt);

    user.matKhau = hashed;
    await user.save();

    res.json({ success: true, message: "Đổi mật khẩu thành công" });
  } catch (err) {
    console.error("Lỗi đổi mật khẩu:", err);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

exports.capNhatThongTin = async (req, res) => {
  try {
    const { hoTen, soDienThoai, diaChi, avatar } = req.body;
    const user = await NguoiDung.findById(req.user._id).populate('hangThanhVien')

    if (!user)
      return res.status(404).json({ success: false, message: "Không tìm thấy người dùng" });

    // ✅ Cập nhật các trường cho phép
    if (hoTen) user.hoTen = hoTen;
    if (soDienThoai) user.soDienThoai = soDienThoai;
    if (diaChi) user.diaChi = diaChi;
    if (avatar) user.avatar = avatar;

    await user.save();

    res.json({ success: true, message: "Cập nhật thông tin thành công", data: user });
  } catch (err) {
    console.error("Lỗi cập nhật thông tin:", err);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};
