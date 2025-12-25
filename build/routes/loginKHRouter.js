"use strict";

var _loginGoogle = require("../controllers/Login/login.google.controller");
var _loginKh = _interopRequireDefault(require("../controllers/Login/login.kh.controller"));
var _doiThongTinKh = _interopRequireDefault(require("../controllers/Login/doi.thong.tin.kh.controller"));
var _quenMatKhau = require("../controllers/Login/quen.mat.khau.controller");
var _khachHang = _interopRequireDefault(require("../controllers/Voucher_KhachHang/khachHang.controller"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
var express = require("express");
var router = express.Router();

// route đăng nhập kh
router.post("/login-kh", _loginKh["default"].loginAccKH);
// route register KH
router.post("/register-kh", _loginKh["default"].registerAccKH);
// route logout  KH
router.post("/logout-kh", _loginKh["default"].logoutKH);

// find all acc kh
router.get("/get-kh", _khachHang["default"].getAccKH);
router.get("/get-one-kh", _khachHang["default"].getOneAccKH);

// update acc kh
router.put("/update-kh", _khachHang["default"].updateAccKH);
router.put("/khoa-kh", _khachHang["default"].khoaAccKH);

// delete acc kh
router["delete"]("/delete-kh/:id", _khachHang["default"].deleteAccKH);

// router.post("/auth/google", verifyGoogleToken );

// quên mật khẩu
router.post("/quen-mat-khau", _quenMatKhau.quenMatKhauKH);

// đổi thông tin khách hàng
router.put("/doi-thong-tin", _doiThongTinKh["default"].doiThongTinKH);
module.exports = router;