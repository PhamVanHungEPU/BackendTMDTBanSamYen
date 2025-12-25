"use strict";

var _comment = _interopRequireDefault(require("../controllers/Comments/comment.controller"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
var express = require("express");
var router = express.Router();

// find all comment
router.get("/get-comment", _comment["default"].getComment);

// tao moi comment
router.post("/create-comment", _comment["default"].createComment);

// delete comment
router["delete"]("/delete-comment/:id", _comment["default"].deleteComment);
module.exports = router;