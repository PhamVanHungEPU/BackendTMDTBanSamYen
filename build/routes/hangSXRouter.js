"use strict";

var _hangSX = _interopRequireDefault(require("../controllers/HangSX/hangSX.controller"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
var express = require("express");
var router = express.Router();

// find all hang sx
router.get("/get-hang-sx", _hangSX["default"].getHangSX);

// tao moi hang sx
router.post("/create-hang-sx", _hangSX["default"].createHangSX);

// update hang sx
router.put("/update-hang-sx", _hangSX["default"].updateHangSX);

// delete hang sx
router["delete"]("/delete-hang-sx/:nameHSX", _hangSX["default"].deleteHangSX);
module.exports = router;