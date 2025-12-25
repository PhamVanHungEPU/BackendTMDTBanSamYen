const express = require("express");
const { uploadAudio1, deleteAudio1 } = require("../controllers/Upload/uploadCloud.controller");

const router = express.Router();

router.post("/upload", uploadAudio1);
router.delete("/delete", deleteAudio1);

module.exports = router;
