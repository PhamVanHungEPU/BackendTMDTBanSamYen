const express = require("express");
const { createBaiViet, updateBaiViet, getBaiViet, getDetailBaiViet, deleteBaiViet, toggleStatus, getAllTheLoai } = require("../controllers/BaiViet/baiviet.controller");
const BaiViet = require("../model/BaiViet");
const router = express.Router();

router.get("/get-bai-viet", getBaiViet);
router.get("/get-the-loai", getAllTheLoai);
router.get("/get-detail-bai-viet", getDetailBaiViet);
router.post("/create-bai-viet", createBaiViet);
router.put("/update-bai-viet", updateBaiViet);
router.delete("/delete-bai-viet/:id", deleteBaiViet);
router.put("/thay-doi-status-bai-viet", toggleStatus);

// Tăng 1 lượt yêu thích
router.post("/:id/like", async (req, res) => {
  try {
    const { id } = req.params;

    // Atomic increment
    const doc = await BaiViet.findByIdAndUpdate(
      id,
      { $inc: { likeCount: 1 } },
      { new: true, select: "likeCount _id" }
    ).lean();

    if (!doc) {
      return res.status(404).json({ errCode: 1, message: "Không tìm thấy bài viết" });
    }

    return res.status(200).json({
      errCode: 0,
      message: "Đã cộng 1 lượt yêu thích",
      data: { likeCount: doc.likeCount, _id: doc._id },
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ errCode: 2, message: "Lỗi server" });
  }
});

// (tuỳ chọn) Lấy likeCount
router.get("/:id/likes", async (req, res) => {
  try {
    const doc = await BaiViet.findById(req.params.id).select("likeCount").lean();
    if (!doc) return res.status(404).json({ errCode: 1, message: "Không tìm thấy bài viết" });
    res.json({ errCode: 0, data: { likeCount: doc.likeCount } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ errCode: 2, message: "Lỗi server" });
  }
});


module.exports = router;