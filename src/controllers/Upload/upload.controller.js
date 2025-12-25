// controllers/uploadController.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const xlsx = require("xlsx");


// Cài đặt multer để lưu trữ file
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../../public/uploads/")); // Lưu vào public/uploads
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Tên file duy nhất
    },
});

const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // Giới hạn kích thước file là 5MB
    },
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const extname = filetypes.test(
            path.extname(file.originalname).toLowerCase()
        );
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb("Error: File upload chỉ chấp nhận định dạng hình ảnh!");
        }
    },
});

// Tạo endpoint upload
// const uploadFile = (req, res) => {
//     upload.single("file")(req, res, (err) => {
//         if (err) {
//             return res.status(400).json({ message: err });
//         }

//         if (!req.file) {
//             return res
//                 .status(400)
//                 .json({
//                     message: "No file uploaded. Vui lòng chọn file để upload.",
//                 });
//         }

//         const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${
//             req.file.filename
//         }`;

//         res.json({ url: fileUrl, typee: "ImageChinh" });
//     });
// };





// Endpoint upload nhiều ảnh
const uploadFiles = (req, res) => {
    upload.array("files", 12)(req, res, (err) => {
        // 'filee' là tên trường trong form gửi lên
        if (err) {
            return res.status(400).json({ message: err.message });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                message: "No files uploaded. Vui lòng chọn file để upload.",
            });
        }

        // Lấy URL cho mỗi file và trả về
        const fileUrls = req.files.map((file, index) => {
            const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${
                file.filename
            }`;
            return {
                url: fileUrl,
                typee: "ImageSlider", // Ảnh đầu tiên là chính, còn lại là slider
            };
        });

        res.json(fileUrls); // Trả về mảng các URL và loại ảnh
    });
};

// Cấu hình multer để lưu file vào thư mục public/excel/
const excelStorage = multer.diskStorage({
    // destination: (req, file, cb) => {
    //     cb(null, path.join(__dirname, '../../public/excel/'));  // Chắc chắn thư mục tồn tại và có quyền ghi
    // },
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, "../../public/excel/");
        console.log("uploadDir: ", uploadDir);

        // Kiểm tra nếu thư mục chưa có thì tạo mới
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        cb(null, uploadDir); // Lưu vào thư mục public/excel/
    },
    filename: function (req, file, cb) {
        const originalFileName = req.body.originalFileName || file.originalname; // Lấy tên gốc từ frontend
        const extname = path.extname(originalFileName);
        cb(null, originalFileName); // Sử dụng tên gốc từ React
    },
});

// Middleware xử lý file Excel
const uploadExcel = multer({
    storage: excelStorage,
    fileFilter: (req, file, cb) => {
        const extname = path.extname(file.originalname).toLowerCase();
        if (extname !== ".xlsx" && extname !== ".xls") {
            return cb(new Error("Chỉ chấp nhận file Excel (.xlsx, .xls)"));
        }
        cb(null, true);
    },
}).single("file");

// API endpoint để xử lý upload file Excel
const uploadExcelFile = (req, res) => {
    uploadExcel(req, res, (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }

        // Đọc file Excel và xử lý dữ liệu
        const filePath = path.join(
            __dirname,
            "../../public/excel/",
            req.file.filename
        );
        try {
            const workbook = xlsx.readFile(filePath); // Đọc file Excel
            const sheetName = workbook.SheetNames[0]; // Lấy sheet đầu tiên
            const worksheet = workbook.Sheets[sheetName];
            const data = xlsx.utils.sheet_to_json(worksheet); // Chuyển dữ liệu sheet thành JSON

            // Trả về dữ liệu sau khi đọc file Excel
            res.status(200).json({
                success: true,
                message: "upload file excel thành công",
                data: data, // Bạn có thể trả về dữ liệu từ Excel nếu cần
            });

            // Sau khi xử lý xong, có thể xóa file Excel
            // fs.unlinkSync(filePath);
        } catch (error) {
            res.status(500).json({
                message: "Có lỗi khi xử lý file Excel",
                error: error.message,
            });
        }
    });
};


module.exports = {
    uploadFiles,
    uploadExcel,
    uploadExcelFile,

};
