const express = require("express");
const { createCongDung, getAllCongDung, getCongDungById, updateCongDungById, deleteCongDungById } = require("../../controllers/controller_TMDT/CRUD/congDungController");
const router = express.Router();
// (Thêm middleware xác thực/admin ở đây nếu cần)
// const { authenticate, isAdmin } = require('../middleware/auth');

// router.use(authenticate, isAdmin);

router.post("/", createCongDung);
router.get("/", getAllCongDung);
router.get("/:id", getCongDungById);
router.put("/:id", updateCongDungById);
router.delete("/:id", deleteCongDungById);

module.exports = router;