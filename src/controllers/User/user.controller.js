const User = require("../../model/User");
const bcrypt = require("bcryptjs");

module.exports = {

    getAllUser: async (req, res) => {
        try {
            let filter = {};   

            const deThiList = await User.find(filter)
            console.log("deThiList: ", deThiList);

            res.status(200).json({ data: deThiList, message: "Lấy danh sách user thành công", errCode: 0 });
        } catch (error) {
            console.error('Lỗi khi lấy danh sách user:', error);
            res.status(500).json({ message: 'Lỗi server' });
        }
    },


    getUserById: async (req, res) => {
        try {
            const { idUser } = req.query;

            if (!idUser) {
            return res.status(400).json({
                message: "ID người dùng không hợp lệ",
                errCode: 1,
            });
            }

            const user = await User.findById(idUser);

            if (!user) {
            return res.status(404).json({
                message: "Không tìm thấy người dùng",
                errCode: 2,
            });
            }

            return res.status(200).json({
            data: user,
            message: "Lấy thông tin người dùng thành công",
            errCode: 0,
            });
        } catch (error) {
            console.error("Lỗi khi lấy thông tin người dùng:", error);
            return res.status(500).json({
            message: "Lỗi server",
            errCode: 3,
            });
        }
    },

    updateUserInfo: async (req, res) => {
        try {
            const { _id, hoTen, image } = req.body;
            console.log("image: >>>", image);
            

            if (!_id) {
            return res.status(400).json({ message: "Thiếu ID người dùng", errCode: 1 });
            }

            const updatedUser = await User.findByIdAndUpdate(
            _id,
            {
                $set: {
                hoTen: hoTen,
                Image: image,
                },
            },
            { new: true } // Trả về user sau khi cập nhật
            );

            if (!updatedUser) {
            return res.status(404).json({ message: "Không tìm thấy người dùng", errCode: 2 });
            }

            return res.status(200).json({
            data: updatedUser,
            message: "Cập nhật người dùng thành công",
            errCode: 0,
            });
        } catch (error) {
            console.error("Lỗi khi cập nhật người dùng:", error);
            return res.status(500).json({
            message: "Lỗi server",
            errCode: -1,
            });
        }
    },

    changePassword: async (req, res) => {
        try {
        const { oldPassword, newPassword } = req.body;
        const userId = req.userId || req.body.userId || req.query.userId; // hoặc truyền id từ token/session

        if (!userId || !oldPassword || !newPassword) {
            return res.status(400).json({
            errCode: 1,
            message: "Thiếu thông tin đầu vào",
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
            errCode: 2,
            message: "Không tìm thấy người dùng",
            });
        }

        // So sánh mật khẩu cũ
        const isMatch = await bcrypt.compare(oldPassword, user.matKhau);
        if (!isMatch) {
            return res.status(401).json({
            errCode: 3,
            message: "Mật khẩu cũ không đúng",
            });
        }

        // Mã hóa mật khẩu mới và cập nhật
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        user.matKhau = hashedPassword;

        await user.save();

        return res.status(200).json({
            errCode: 0,
            message: "Đổi mật khẩu thành công",
        });
        } catch (error) {
        console.error("Lỗi khi đổi mật khẩu:", error);
        return res.status(500).json({
            errCode: 99,
            message: "Lỗi server",
        });
        }
    },

}