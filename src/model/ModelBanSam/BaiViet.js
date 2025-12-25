const mongoose = require("mongoose");
const crypto = require("crypto");

const schema = new mongoose.Schema(
    {
        maBV: {
            type: String,
            unique: true,
            trim: true,
        }, // Mã sản phẩm tự sinh 8 ký tự
        title: { type: String, },
        anhBia: { type: String, },
        moTaNgan: { type: String, default: "",  },
        noiDungChinh: { type: String, default: "",  },
        tags: [{ type: String}],    
        status: {type: Boolean, default: false},
        ngayDang: { type: Date, default: Date.now,},
        theLoai: { type: mongoose.Schema.Types.ObjectId, ref: 'TheLoaiBaiViet', },
        nguoiTao: { type: mongoose.Schema.Types.ObjectId, ref: 'NguoiDung', },
        likeCount: { type: Number, default: 0 },
    }, 
    {
        // Lưu cả thời điểm tạo/cập nhật
        timestamps: { createdAt: "ngayTao", updatedAt: "ngayCapNhat" },
        versionKey: false
    }
);

// 🧩 Tự động sinh mã sản phẩm 8 ký tự ngẫu nhiên trước khi tạo
schema.pre("save", function (next) {
  if (!this.maBV) {
    this.maBV = crypto.randomBytes(4).toString("hex").toUpperCase(); // VD: "A3F2B8D1"
  }
  next();
});

module.exports = mongoose.model("BaiViet", schema);
