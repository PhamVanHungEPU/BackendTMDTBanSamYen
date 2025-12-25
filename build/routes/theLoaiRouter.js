"use strict";

var _theLoai = _interopRequireDefault(require("../controllers/TheLoai/theLoai.controller"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
var express = require("express");
var router = express.Router();

// find all the loai
router.get("/get-the-loai", _theLoai["default"].getTheLoai);
router.get("/get-one-the-loai", _theLoai["default"].findOneCategory);

// tao moi the loai
router.post("/create-the-loai", _theLoai["default"].createTheLoai);

// update the loai
router.put("/update-the-loai", _theLoai["default"].updateTheLoai);

// delete the loai
router["delete"]("/delete-the-loai/:id", _theLoai["default"].deleteTheLoai);
module.exports = router;