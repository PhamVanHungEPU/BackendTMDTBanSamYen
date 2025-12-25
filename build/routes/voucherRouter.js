"use strict";

var _voucher = _interopRequireDefault(require("../controllers/Voucher_KhachHang/voucher.controller"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
var express = require("express");
var router = express.Router();

// find all voucher
router.get("/get-voucher", _voucher["default"].getVoucher);

// tao moi voucher
router.post("/create-voucher", _voucher["default"].createVoucher);

// update voucher
router.put("/update-voucher", _voucher["default"].updateVoucher);

// delete voucher
router["delete"]("/delete-voucher/:id", _voucher["default"].deleteVoucher);
module.exports = router;