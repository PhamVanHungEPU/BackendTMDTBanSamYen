"use strict";

var mongoose = require('mongoose');
var Voucher_Schema = new mongoose.Schema({
  code: {
    type: String
  },
  dieuKien: {
    type: String
  },
  giamGia: {
    type: String
  }
}, {
  timestamps: true // createAt, updateAt
});
module.exports = mongoose.model("Voucher", Voucher_Schema);