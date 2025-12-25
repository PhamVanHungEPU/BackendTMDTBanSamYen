const express = require("express");
const router = express.Router();
const { createHangTV, getAllHangTV, getHangTVById, updateHangTVById, deleteHangTVById } = require("../../controllers/controller_TMDT/CRUD/hangTVController");

router.post("/", createHangTV);
router.get("/", getAllHangTV);
router.get("/:id", getHangTVById);
router.put("/:id", updateHangTVById);
router.delete("/:id", deleteHangTVById);

module.exports = router;