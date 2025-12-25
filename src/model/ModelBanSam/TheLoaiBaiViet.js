// models/MonHoc.js
const mongoose = require('mongoose');

const TheLoaiSchema = new mongoose.Schema({
    ten: { type: String, required: true },             
    Image: { type: String, required: false },       
});

module.exports = mongoose.model('TheLoaiBaiViet', TheLoaiSchema);
