const express = require("express");
const router = express.Router();
const { createTheLoaiBaiViet, getAllTheLoaiBaiViet, getTheLoaiBaiVietById, updateTheLoaiBaiVietById, deleteTheLoaiBaiVietById } = require("../../controllers/controller_TMDT/CRUD/theLoaiBaiVietController");

router.post("/", createTheLoaiBaiViet);
router.get("/", getAllTheLoaiBaiViet);
router.get("/:id", getTheLoaiBaiVietById);
router.put("/:id", updateTheLoaiBaiVietById);
router.delete("/:id", deleteTheLoaiBaiVietById);

module.exports = router;