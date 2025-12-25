"use strict";

var mongoose = require('mongoose');
var Role_Schema = new mongoose.Schema({
  key: {
    type: String
  }
}, {
  timestamps: true // createAt, updateAt
});
module.exports = mongoose.model("Role", Role_Schema);