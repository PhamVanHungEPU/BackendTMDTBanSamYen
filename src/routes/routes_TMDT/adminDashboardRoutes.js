const express = require("express");
const { thongKeDashboard } = require("../../controllers/controller_TMDT/CRUD/adminDashboardController");
const { protect } = require("../../middleware/authMiddleware");
const router = express.Router();

// 📊 Route chính
router.get("/dashboard", protect, thongKeDashboard);

module.exports = router;
