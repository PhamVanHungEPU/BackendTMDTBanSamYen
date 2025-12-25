"use strict";

var _order = _interopRequireDefault(require("../controllers/Order/order.controller"));
var _historyOrder = _interopRequireDefault(require("../controllers/Order/history.order.controller"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
var express = require("express");
var router = express.Router();

// find all hang sx
router.post("/dat-hang", _order["default"].createOrder);
router.get("/find-all-order", _historyOrder["default"].historyOrderByIdKH);
router.post("/huy-order", _historyOrder["default"].handleHuyOrder);
module.exports = router;