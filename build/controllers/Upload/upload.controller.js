"use strict";

// controllers/uploadController.js
var multer = require('multer');
var path = require('path');
var fs = require('fs');
var xlsx = require('xlsx');
var _require = require('console'),
  log = _require.log;

// Cài đặt multer để lưu trữ file
var storage = multer.diskStorage({
  destination: function destination(req, file, cb) {
    cb(null, path.join(__dirname, '../../public/uploads/')); // Lưu vào public/uploads
  },
  filename: function filename(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Tên file duy nhất
  }
});
var upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // Giới hạn kích thước file là 5MB
  },
  fileFilter: function fileFilter(req, file, cb) {
    var filetypes = /jpeg|jpg|png|gif/;
    var extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    var mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Error: File upload chỉ chấp nhận định dạng hình ảnh!');
    }
  }
});

// Tạo endpoint upload
var uploadFile = function uploadFile(req, res) {
  upload.single('file')(req, res, function (err) {
    if (err) {
      return res.status(400).json({
        message: err
      });
    }
    if (!req.file) {
      return res.status(400).json({
        message: 'No file uploaded. Vui lòng chọn file để upload.'
      });
    }
    var fileUrl = "".concat(req.protocol, "://").concat(req.get('host'), "/uploads/").concat(req.file.filename);
    res.json({
      url: fileUrl,
      typee: "ImageChinh"
    });
  });
};

// Endpoint upload nhiều ảnh
var uploadFiles = function uploadFiles(req, res) {
  upload.array('files', 12)(req, res, function (err) {
    // 'filee' là tên trường trong form gửi lên
    if (err) {
      return res.status(400).json({
        message: err.message
      });
    }
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        message: 'No files uploaded. Vui lòng chọn file để upload.'
      });
    }

    // Lấy URL cho mỗi file và trả về
    var fileUrls = req.files.map(function (file, index) {
      var fileUrl = "".concat(req.protocol, "://").concat(req.get('host'), "/uploads/").concat(file.filename);
      return {
        url: fileUrl,
        typee: 'ImageSlider' // Ảnh đầu tiên là chính, còn lại là slider
      };
    });
    res.json(fileUrls); // Trả về mảng các URL và loại ảnh
  });
};

// Cấu hình multer để lưu file vào thư mục public/excel/
var excelStorage = multer.diskStorage({
  // destination: (req, file, cb) => {
  //     cb(null, path.join(__dirname, '../../public/excel/'));  // Chắc chắn thư mục tồn tại và có quyền ghi
  // },
  destination: function destination(req, file, cb) {
    var uploadDir = path.join(__dirname, '../../public/excel/');
    console.log("uploadDir: ", uploadDir);

    // Kiểm tra nếu thư mục chưa có thì tạo mới
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, {
        recursive: true
      });
    }
    cb(null, uploadDir); // Lưu vào thư mục public/excel/
  },
  filename: function filename(req, file, cb) {
    var originalFileName = req.body.originalFileName || file.originalname; // Lấy tên gốc từ frontend
    var extname = path.extname(originalFileName);
    cb(null, originalFileName); // Sử dụng tên gốc từ React
  }
});

// Middleware xử lý file Excel
var uploadExcel = multer({
  storage: excelStorage,
  fileFilter: function fileFilter(req, file, cb) {
    var extname = path.extname(file.originalname).toLowerCase();
    if (extname !== '.xlsx' && extname !== '.xls') {
      return cb(new Error('Chỉ chấp nhận file Excel (.xlsx, .xls)'));
    }
    cb(null, true);
  }
}).single('file');

// API endpoint để xử lý upload file Excel
var uploadExcelFile = function uploadExcelFile(req, res) {
  uploadExcel(req, res, function (err) {
    if (err) {
      return res.status(400).json({
        message: err.message
      });
    }

    // Đọc file Excel và xử lý dữ liệu
    var filePath = path.join(__dirname, '../../public/excel/', req.file.filename);
    try {
      var workbook = xlsx.readFile(filePath); // Đọc file Excel
      var sheetName = workbook.SheetNames[0]; // Lấy sheet đầu tiên
      var worksheet = workbook.Sheets[sheetName];
      var data = xlsx.utils.sheet_to_json(worksheet); // Chuyển dữ liệu sheet thành JSON

      // Trả về dữ liệu sau khi đọc file Excel
      res.status(200).json({
        success: true,
        message: "upload file excel thành công",
        data: data // Bạn có thể trả về dữ liệu từ Excel nếu cần
      });

      // Sau khi xử lý xong, có thể xóa file Excel
      // fs.unlinkSync(filePath);
    } catch (error) {
      res.status(500).json({
        message: 'Có lỗi khi xử lý file Excel',
        error: error.message
      });
    }
  });
};
module.exports = {
  uploadFile: uploadFile,
  uploadFiles: uploadFiles,
  uploadExcel: uploadExcel,
  uploadExcelFile: uploadExcelFile
};