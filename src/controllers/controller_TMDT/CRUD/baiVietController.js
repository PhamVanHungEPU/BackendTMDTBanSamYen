const mongoose = require("mongoose");
const BaiViet = require("../../../model/ModelBanSam/BaiViet");

module.exports = {
    // ===========================
    // 📌 GET ALL — Phân trang + tìm kiếm + lọc
    // ===========================
    getAll: async (req, res) => {
        try {
            let {
                page = 1,
                limit = 10000,
                title = "",
                tags,
                status,
                nguoiTao,
                theLoai
            } = req.query;

            page = Number(page);
            limit = Number(limit);

            let filter = {};

            if (title) {
                filter.title = { $regex: title, $options: "i" };
            }

            if (tags) {
                filter.tags = { $in: tags.split(",") };
            }

            if (status === "true" || status === "false") {
                filter.status = status === "true";
            }

            if (nguoiTao && mongoose.Types.ObjectId.isValid(nguoiTao)) {
                filter.nguoiTao = nguoiTao;
            }

            if (theLoai && mongoose.Types.ObjectId.isValid(theLoai)) {
                filter.theLoai = theLoai;
            }

            const total = await BaiViet.countDocuments(filter);

            const list = await BaiViet.find(filter)
                .populate("theLoai", "ten")
                .populate("nguoiTao", "hoTen email avatar vaiTro")
                .sort({ ngayDang: -1 })
                .skip((page - 1) * limit)
                .limit(limit);

            res.json({
                success: true,
                total,
                page,
                limit,
                data: list,
            });

        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    },

    // ===========================
    // 📌 GET ONE
    // ===========================
    getOne: async (req, res) => {
        try {
            const bv = await BaiViet.findOne({maBV: req.params.id})
                .populate("theLoai", "ten")
                .populate("nguoiTao", "hoTen email avatar vaiTro");

            if (!bv) return res.status(404).json({ success: false, message: "Không tìm thấy bài viết" });

            res.json({ success: true, data: bv });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    },

    // ===========================
    // 📌 CREATE — auto duyệt nếu là admin
    // ===========================
    create: async (req, res) => {
        try {
            const user = req.user; // từ middleware auth

            const statusAuto = user.vaiTro === "admin" ? true : false;

            const newPost = new BaiViet({
                ...req.body,
                nguoiTao: user._id,
                status: statusAuto,
                ngayDang: new Date(),
            });

            await newPost.save();

            res.json({
                success: true,
                message: "Tạo bài viết thành công",
                data: newPost,
            });

        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    },

    // ===========================
    // 📌 UPDATE — admin và chủ bài viết mới sửa được
    // ===========================
    update: async (req, res) => {
        try {
            const user = req.user;
            const post = await BaiViet.findById(req.params.id);

            if (!post)
                return res
                    .status(404)
                    .json({ success: false, message: "Không tìm thấy bài viết" });

            // ❌ Không phải admin và không phải người tạo
            if (user.vaiTro !== "admin" && String(post.nguoiTao) !== String(user._id)) {
                return res.status(403).json({
                    success: false,
                    message: "Không có quyền sửa bài viết",
                });
            }

            let updateData = { ...req.body };

            // ✅ Nếu "cửa hàng" sửa bài → state = false (chờ admin duyệt)
            if (user.vaiTro === "cuahang") {
                updateData.status = false;
            }

            // Admin sửa thì giữ nguyên status cũ (trừ khi admin tự đổi)
            const updated = await BaiViet.findByIdAndUpdate(
                req.params.id,
                updateData,
                { new: true }
            );

            res.json({
                success: true,
                message:
                    user.vaiTro === "cuahang"
                        ? "Cập nhật thành công — bài viết sẽ chờ admin duyệt lại"
                        : "Cập nhật thành công",
                data: updated,
            });

        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    },


    // ===========================
    // 📌 DELETE — chỉ admin
    // ===========================
    remove: async (req, res) => {
        try {
            const user = req.user;

            if (user.vaiTro !== "admin") {
                return res.status(403).json({ success: false, message: "Chỉ admin được xoá bài" });
            }

            await BaiViet.findByIdAndDelete(req.params.id);

            res.json({ success: true, message: "Xoá bài viết thành công" });

        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    },

    // ===========================
    // 📌 TOGGLE STATUS — duyệt / tắt duyệt bài
    // ===========================
    toggleStatus: async (req, res) => {
        try {
            const user = req.user;
            if (user.vaiTro !== "admin")
                return res.status(403).json({ success: false, message: "Chỉ admin được duyệt bài" });

            const post = await BaiViet.findById(req.params.id);
            if (!post)
                return res.status(404).json({ success: false, message: "Không tìm thấy bài viết" });

            post.status = !post.status;
            await post.save();

            res.json({
                success: true,
                message: post.status ? "Đã duyệt bài viết" : "Đã tắt duyệt bài",
                data: post,
            });

        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    },

};
