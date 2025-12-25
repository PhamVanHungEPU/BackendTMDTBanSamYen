"use strict";

var mongoose = require('mongoose');
var Comments_Schema = new mongoose.Schema({
  title: {
    type: String
  },
  soSaoDanhGia: {
    type: String
  },
  idKH: {
    ref: "AccKH",
    type: mongoose.SchemaTypes.ObjectId
  },
  idSP: {
    ref: "SanPham",
    type: mongoose.SchemaTypes.ObjectId
  }
}, {
  timestamps: true // createAt, updateAt
});
module.exports = mongoose.model("Comments", Comments_Schema);