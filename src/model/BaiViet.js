const mongoose = require("mongoose");

const schema = new mongoose.Schema(
    {
        title: { type: String, },
        anhBia: { type: String, },
        moTaNgan: { type: String, default: "",  },
        noiDungChinh: { type: String, default: "",  },
        tags: [{ type: String}],    
        status: {type: Boolean, default: false},
        ngayDang: { type: Date, default: Date.now,},
        theLoai: { type: mongoose.Schema.Types.ObjectId, ref: 'TheLoai', },
        nguoiTao: { type: mongoose.Schema.Types.ObjectId, ref: 'User', },
        likeCount: { type: Number, default: 0 },
    }, 
    {
        // Lưu cả thời điểm tạo/cập nhật
        timestamps: { createdAt: "ngayTao", updatedAt: "ngayCapNhat" },
        versionKey: false
    }
);


module.exports = mongoose.model("BaiViet", schema);
