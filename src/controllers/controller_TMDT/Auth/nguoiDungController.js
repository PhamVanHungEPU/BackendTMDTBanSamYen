// controllers/nguoiDung.controller.js

const NguoiDung = require("../../../model/ModelBanSam/NguoiDung");

  // ✅ Lấy danh sách người dùng
  exports.getDanhSachNguoiDung = async (req, res) => {
    try {
        const { page = 1, limit, search = '', vaiTro = '', 
            sortField = "createdAt", // Mặc định là 'createdAt'
            sortOrder = "descend", // Mặc định là 'descend' 
        } = req.query;

        let query = {};

        // Tìm kiếm theo tên, email, số điện thoại
        if (search) {
            query.$or = [
            { hoTen: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { soDienThoai: { $regex: search, $options: 'i' } },
            ];
        }

        // Lọc theo vai trò
        if (vaiTro) {
            query.vaiTro = vaiTro;
        }

        if (req.query.isActive !== undefined) {
            query.isActive = req.query.isActive === 'true';
        }

        const sortOptions = {};
        // Chuyển 'ascend' -> 1, 'descend' -> -1
        sortOptions[sortField] = sortOrder === "ascend" ? 1 : -1;

        const users = await NguoiDung.find(query)
            .select('-matKhau -currentToken') // Không trả về mật khẩu và token
            .populate('hangThanhVien')
            .sort(sortOptions)
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await NguoiDung.countDocuments(query);

        res.json({
            success: true,
            data: users,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            total: count,
        });
        } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách người dùng',
            error: error.message,
        });
    }
  },


  // ✅ Bật/tắt trạng thái tài khoản
  exports.toggleStatus = async (req, res) => {
    try {
      const { id } = req.params;

      const user = await NguoiDung.findById(id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy người dùng',
        });
      }

      user.isActive = !user.isActive;
      
      // Nếu khóa tài khoản, xóa token để đăng xuất
      if (!user.isActive) {
        user.currentToken = null;
      }

      await user.save();

      res.json({
        success: true,
        message: `${user.hoTen} đã được ${
          user.isActive ? 'mở khóa' : 'khóa tài khoản'
        }`,
        data: {
          id: user._id,
          hoTen: user.hoTen,
          isActive: user.isActive,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi thay đổi trạng thái',
        error: error.message,
      });
    }
  },

  // ✅ Phân quyền
  exports.phanQuyen = async (req, res) => {
    try {
      const { id } = req.params;
      const { vaiTro } = req.body;

      if (!['user', 'cuahang', 'admin'].includes(vaiTro)) {
        return res.status(400).json({
          success: false,
          message: 'Vai trò không hợp lệ. Chỉ chấp nhận: user, mod, admin',
        });
      }

      const user = await NguoiDung.findByIdAndUpdate(
        id,
        { vaiTro },
        { new: true }
      ).select('-matKhau -currentToken');

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy người dùng',
        });
      }

      res.json({
        success: true,
        message: `Đã phân quyền ${vaiTro.toUpperCase()} cho ${user.hoTen}`,
        data: user,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi phân quyền',
        error: error.message,
      });
    }
  },

  // ✅ Đăng xuất người dùng (xóa token)
  exports.logoutNguoiDung = async (req, res) => {
    try {
      const { id } = req.params;

      const user = await NguoiDung.findByIdAndUpdate(
        id,
        { currentToken: null },
        { new: true }
      ).select('-matKhau');

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy người dùng',
        });
      }

      res.json({
        success: true,
        message: `Đã đăng xuất ${user.hoTen}`,
        data: {
          id: user._id,
          hoTen: user.hoTen,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi đăng xuất người dùng',
        error: error.message,
      });
    }
  },

  // ✅ Xóa người dùng
  exports.xoaNguoiDung = async (req, res) => {
    try {
      const { id } = req.params;

      const user = await NguoiDung.findByIdAndDelete(id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy người dùng',
        });
      }

      res.json({
        success: true,
        message: `Đã xóa người dùng ${user.hoTen}`,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi xóa người dùng',
        error: error.message,
      });
    }
  }

exports.updatePermissions = async (req, res) => {
  try {
    const { id } = req.params;
    const { permissions } = req.body;

    const user = await NguoiDung.findByIdAndUpdate(
      id,
      { permissions },
      { new: true }
    );

    if (!user)
      return res.status(404).json({ success: false, message: "Không tìm thấy user" });

    res.json({
      success: true,
      message: "Cập nhật quyền truy cập thành công",
      data: user
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi cập nhật quyền",
      error: error.message
    });
  }
};



