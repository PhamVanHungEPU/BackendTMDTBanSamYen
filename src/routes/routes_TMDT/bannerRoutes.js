const express = require("express");
const router = express.Router();
const { createBanner, getAllBanners, getBannerById, updateBannerById, deleteBannerById } = require("../../controllers/controller_TMDT/CRUD/bannerController");
// (Thêm middleware xác thực/admin ở đây nếu cần)
// const { authenticate, isAdmin } = require('../middleware/auth');

// router.use(authenticate, isAdmin);

router.post("/", createBanner);
router.get("/", getAllBanners);
router.get("/:id", getBannerById);
router.put("/:id", updateBannerById);
router.delete("/:id", deleteBannerById);

module.exports = router;