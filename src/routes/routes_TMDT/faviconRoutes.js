const express = require("express");
const router = express.Router();
const { createFavicon, getAllFavicons, getFaviconById, updateFaviconById, deleteFaviconById } = require("../../controllers/controller_TMDT/CRUD/faviconController");
// (Thêm middleware xác thực/admin ở đây nếu cần)
// const { authenticate, isAdmin } = require('../middleware/auth');

// router.use(authenticate, isAdmin);

router.post("/", createFavicon);
router.get("/", getAllFavicons);
router.get("/:id", getFaviconById);
router.put("/:id", updateFaviconById);
router.delete("/:id", deleteFaviconById);

module.exports = router;