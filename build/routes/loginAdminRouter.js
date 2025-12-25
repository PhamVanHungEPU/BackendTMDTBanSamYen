"use strict";

var _loginAdmin = _interopRequireDefault(require("../controllers/Login/login.admin.controller"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
var express = require("express");
var router = express.Router();

// route đăng nhập admin
router.post("/login-admin", _loginAdmin["default"].loginAccAdmin);
// route register admin
router.post("/register-admin", _loginAdmin["default"].registerAccAdmin);
// route logout  admin
router.post("/logout-admin", _loginAdmin["default"].logoutAdmin);
module.exports = router;