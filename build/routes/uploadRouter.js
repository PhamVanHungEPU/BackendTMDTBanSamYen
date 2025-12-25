"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var _upload = _interopRequireWildcard(require("../controllers/Upload/upload.controller"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
// routes/uploadRoutes.js
var express = require('express');
var path = require('path');
var xlsx = require('xlsx');
var router = express.Router();

// Tạo route upload
router.post('/upload', _upload["default"].uploadFile);
router.post('/multiple', _upload["default"].uploadFiles);
router.post('/upload-excel', _upload.uploadExcelFile);
// router.post('/upload-excel', uploadExcel, (req, res) => {
//     if (!req.file) {
//         return res.status(400).json({ message: 'Không tìm thấy file Excel để tải lên.' });
//     }

//     // Đường dẫn file từ server
//     const filePath = `/public/excel/${req.file.filename}`;
//     console.log('File path:', filePath); // Kiểm tra đường dẫn file

//     // Đọc file Excel và xử lý dữ liệu
//     try {
//         // Đọc file Excel đã được upload
//         const workbook = xlsx.readFile(path.join(__dirname, '../../public/excel/', req.file.filename));
//         console.log('workbook:', workbook);
//         const sheetName = workbook.SheetNames[0];  // Lấy tên sheet đầu tiên
//         const worksheet = workbook.Sheets[sheetName];
//         const data = xlsx.utils.sheet_to_json(worksheet);  // Chuyển dữ liệu từ sheet thành JSON

//         // Trả về dữ liệu và đường dẫn file
//         res.status(200).json({
//             success: true,
//             message: 'File uploaded successfully!',
//             filePath: filePath,  // Trả về đường dẫn file có thể truy cập qua HTTP
//             data: data  // Trả về dữ liệu từ file Excel
//         });

//         // Xóa file sau khi xử lý (nếu không cần giữ lại)
//         // fs.unlinkSync(path.join(__dirname, '../../public/excel/', req.file.filename));
//     } catch (error) {
//         console.error('Error processing Excel file:', error);
//         return res.status(500).json({ message: 'Có lỗi khi xử lý file Excel', error: error.message });
//     }
// });

module.exports = router;