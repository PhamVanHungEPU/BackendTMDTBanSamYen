"use strict";

var mongoose = require('mongoose');
var mongoose_delete = require('mongoose-delete');
var HangSX_Schema = new mongoose.Schema({
  TenHangSX: {
    type: String,
    required: false
  },
  IdLoaiSP: [{
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'LoaiSP'
  }]
}, {
  timestamps: true // createAt, updateAt
});

// Override all methods
// HangSX_Schema.plugin(mongoose_delete, { overrideMethods: 'all' });

var HangSX = mongoose.model('HangSX', HangSX_Schema);
module.exports = HangSX;