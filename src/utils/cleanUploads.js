// utils/cleanUploads.js
const fs = require("fs");
const path = require("path");

const UPLOAD_DIR = path.join(__dirname, "../public/uploads/");
const MAX_AGE = 1 * 60 * 1000; // 5 phút tính theo mili giây

const cleanUploads = () => {
    fs.readdir(UPLOAD_DIR, (err, files) => {
        if (err) return console.error("Lỗi khi đọc thư mục:", err);

        files.forEach((file) => {
            const filePath = path.join(UPLOAD_DIR, file);

            fs.stat(filePath, (err, stats) => {
                if (err) return console.error("Lỗi khi lấy thông tin file:", err);

                const now = Date.now();
                const fileAge = now - stats.mtimeMs;

                if (fileAge > MAX_AGE) {
                    fs.unlink(filePath, (err) => {
                        if (err) return console.error("Lỗi khi xóa file:", err);
                        console.log(`Đã xóa file: ${file}`);
                    });
                }
            });
        });
    });
};

module.exports = cleanUploads;
