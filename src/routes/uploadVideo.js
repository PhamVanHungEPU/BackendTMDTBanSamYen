const express = require("express");
const { uploadVideo, deleteVideo } = require("../controllers/Upload/uploadCloud.controller");

const router = express.Router();

router.post("/upload", uploadVideo);
router.delete("/delete", deleteVideo);

module.exports = router;
