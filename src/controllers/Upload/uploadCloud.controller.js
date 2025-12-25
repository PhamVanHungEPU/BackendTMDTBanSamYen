const multer = require("multer");
const path = require("path");
const fs = require("fs");
const xlsx = require("xlsx");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

// =============================================
// 🔧 Cấu hình Cloudinary
// =============================================
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// =============================================
// 📁 Đảm bảo thư mục uploads tồn tại
// =============================================
const uploadDir = path.join(__dirname, "../../public/uploads/");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("✅ Đã tạo thư mục uploads:", uploadDir);
}

// =============================================
// 🛡️ Helper: Xóa file an toàn
// =============================================
const safeDeleteFile = (filePath) => {
  try {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`✅ Đã xóa file tạm: ${path.basename(filePath)}`);
      return true;
    }
    return false;
  } catch (error) {
    console.warn(`⚠️ Không thể xóa file ${filePath}:`, error.message);
    return false;
  }
};

// =============================================
// 📤 Cấu hình Multer
// =============================================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
  fileFilter: (req, file, cb) => {
    // Cho phép tất cả file types
    cb(null, true);
  },
});

// =============================================
// 📷 Upload 1 file
// =============================================
const uploadFile1 = (req, res) => {
  upload.single("file")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message || "Lỗi upload file",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Không có file nào được tải lên.",
      });
    }

    try {
      console.log(`📤 Đang upload: ${req.file.filename}`);

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "folderupload",
        resource_type: "auto",
      });

      // Xóa file tạm
      safeDeleteFile(req.file.path);

      console.log(`✅ Upload thành công: ${result.public_id}`);

      return res.status(200).json({
        success: true,
        data: {
          url: result.secure_url,
          public_id: result.public_id,
          type: "Image",
        },
      });
    } catch (error) {
      console.error("❌ Lỗi upload Cloudinary:", error);

      // Xóa file tạm nếu upload failed
      safeDeleteFile(req.file.path);

      return res.status(500).json({
        success: false,
        message: "Lỗi khi upload file lên Cloudinary.",
        error: error.message,
      });
    }
  });
};

// =============================================
// 🗑️ Xóa file từ Cloudinary
// =============================================
const deleteFile1 = async (req, res) => {
  const { public_id } = req.body;

  console.log("🗑️ Yêu cầu xóa file:", public_id);

  if (!public_id) {
    return res.status(400).json({
      success: false,
      message: "Thiếu public_id.",
    });
  }

  try {
    const result = await cloudinary.uploader.destroy(public_id);

    if (result.result === "ok") {
      console.log(`✅ Đã xóa: ${public_id}`);
      return res.status(200).json({
        success: true,
        message: "Xóa file thành công.",
      });
    } else if (result.result === "not found") {
      return res.status(404).json({
        success: false,
        message: "File không tồn tại trên Cloudinary.",
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "Không thể xóa file.",
        result,
      });
    }
  } catch (error) {
    console.error("❌ Lỗi xóa file:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi xóa file.",
      error: error.message,
    });
  }
};

// =============================================
// 📷 Upload nhiều files (Slider Images)
// =============================================
const uploadFiles1 = (req, res) => {
  upload.array("files", 18)(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message || "Lỗi upload files",
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Không có file nào được tải lên.",
      });
    }

    console.log(`📤 Đang upload ${req.files.length} files...`);

    try {
      const uploadPromises = req.files.map(async (file) => {
        try {
          const uploaded = await cloudinary.uploader.upload(file.path, {
            folder: "folderupload",
            resource_type: "auto",
            timeout: 60000,
          });

          // Xóa file tạm sau khi upload thành công
          safeDeleteFile(file.path);

          return {
            url: uploaded.secure_url,
            public_id: uploaded.public_id,
            type: "ImageSlider",
          };
        } catch (uploadError) {
          console.error(`❌ Lỗi upload ${file.filename}:`, uploadError);

          // Xóa file tạm nếu upload failed
          safeDeleteFile(file.path);

          return null;
        }
      });

      const results = await Promise.all(uploadPromises);
      const successFiles = results.filter((f) => f !== null);

      if (successFiles.length === 0) {
        return res.status(500).json({
          success: false,
          message: "Không upload được file nào.",
        });
      }

      console.log(`✅ Upload thành công ${successFiles.length}/${req.files.length} files`);

      return res.status(200).json({
        success: true,
        data: successFiles,
        message: `Upload thành công ${successFiles.length}/${req.files.length} file.`,
      });
    } catch (error) {
      console.error("❌ Lỗi upload multiple:", error);

      // Xóa tất cả files tạm nếu có lỗi
      if (req.files) {
        req.files.forEach((file) => safeDeleteFile(file.path));
      }

      return res.status(500).json({
        success: false,
        message: "Lỗi khi upload files.",
        error: error.message,
      });
    }
  });
};

// =============================================
// 🎵 Upload Audio
// =============================================
const uploadAudio1 = (req, res) => {
  upload.single("audio")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng chọn file âm thanh.",
      });
    }

    try {
      // Kiểm tra mimetype (optional)
      if (!req.file.mimetype?.startsWith("audio/")) {
        safeDeleteFile(req.file.path);
        return res.status(415).json({
          success: false,
          message: "Chỉ nhận file audio (mp3, wav, ogg, m4a...)",
        });
      }

      console.log(`🎵 Đang upload audio: ${req.file.filename}`);

      const uploaded = await cloudinary.uploader.upload(req.file.path, {
        folder: "folderupload/audio",
        resource_type: "video", // audio dùng resource_type "video"
      });

      safeDeleteFile(req.file.path);

      console.log(`✅ Upload audio thành công: ${uploaded.public_id}`);

      return res.status(200).json({
        success: true,
        data: {
          url: uploaded.secure_url,
          public_id: uploaded.public_id,
          type: "Audio",
        },
      });
    } catch (error) {
      console.error("❌ Lỗi upload audio:", error);
      safeDeleteFile(req.file.path);

      return res.status(500).json({
        success: false,
        message: "Lỗi khi upload âm thanh.",
        error: error.message,
      });
    }
  });
};

// =============================================
// 🗑️ Xóa Audio
// =============================================
const deleteAudio1 = async (req, res) => {
  const { public_id } = req.body;

  if (!public_id) {
    return res.status(400).json({
      success: false,
      message: "Thiếu public_id",
    });
  }

  try {
    const result = await cloudinary.uploader.destroy(public_id, {
      resource_type: "video",
    });

    if (result.result === "ok") {
      return res.status(200).json({
        success: true,
        message: "Xóa âm thanh thành công.",
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "Xóa âm thanh thất bại.",
      });
    }
  } catch (error) {
    console.error("❌ Lỗi xóa audio:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi xóa âm thanh.",
      error: error.message,
    });
  }
};

// =============================================
// 🎬 Upload Video
// =============================================
const uploadVideo = (req, res) => {
  upload.single("video")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng chọn video để upload.",
      });
    }

    try {
      // Kiểm tra mimetype (optional)
      if (!req.file.mimetype?.startsWith("video/")) {
        safeDeleteFile(req.file.path);
        return res.status(415).json({
          success: false,
          message: "Chỉ nhận file video (mp4, webm, mov...)",
        });
      }

      console.log(`🎬 Đang upload video: ${req.file.filename}`);

      const uploaded = await cloudinary.uploader.upload(req.file.path, {
        folder: "folderupload/video",
        resource_type: "video",
        chunk_size: 6000000, // 6MB chunks cho file lớn
        overwrite: true,
      });

      safeDeleteFile(req.file.path);

      console.log(`✅ Upload video thành công: ${uploaded.public_id}`);

      return res.status(200).json({
        success: true,
        data: {
          url: uploaded.secure_url,
          public_id: uploaded.public_id,
          bytes: uploaded.bytes,
          duration: uploaded.duration,
          format: uploaded.format,
          type: "Video",
        },
      });
    } catch (error) {
      console.error("❌ Lỗi upload video:", error);
      safeDeleteFile(req.file.path);

      return res.status(500).json({
        success: false,
        message: "Lỗi khi upload video.",
        error: error.message,
      });
    }
  });
};

// =============================================
// 🗑️ Xóa Video
// =============================================
const deleteVideo = async (req, res) => {
  const { public_id } = req.body;

  if (!public_id) {
    return res.status(400).json({
      success: false,
      message: "Thiếu public_id",
    });
  }

  try {
    const result = await cloudinary.uploader.destroy(public_id, {
      resource_type: "video",
    });

    if (result.result === "ok") {
      return res.status(200).json({
        success: true,
        message: "Xóa video thành công.",
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "Xóa video thất bại.",
      });
    }
  } catch (error) {
    console.error("❌ Lỗi xóa video:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi xóa video.",
      error: error.message,
    });
  }
};

// =============================================
// 📊 Upload Excel
// =============================================
const excelStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const excelDir = path.join(__dirname, "../../public/excel/");
    if (!fs.existsSync(excelDir)) {
      fs.mkdirSync(excelDir, { recursive: true });
    }
    cb(null, excelDir);
  },
  filename: (req, file, cb) => {
    const originalFileName = req.body.originalFileName || file.originalname;
    cb(null, originalFileName);
  },
});

const uploadExcel1 = multer({
  storage: excelStorage,
  fileFilter: (req, file, cb) => {
    const extname = path.extname(file.originalname).toLowerCase();
    if (extname !== ".xlsx" && extname !== ".xls") {
      return cb(new Error("Chỉ chấp nhận file Excel (.xlsx, .xls)"));
    }
    cb(null, true);
  },
});

const uploadExcelFile1 = (req, res) => {
  uploadExcel1.single("file")(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng chọn file Excel.",
      });
    }

    const filePath = path.join(
      __dirname,
      "../../public/excel/",
      req.file.filename
    );

    try {
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = xlsx.utils.sheet_to_json(worksheet);

      res.status(200).json({
        success: true,
        message: "Upload file excel thành công",
        data,
      });
    } catch (error) {
      console.error("❌ Lỗi xử lý Excel:", error);
      res.status(500).json({
        success: false,
        message: "Có lỗi khi xử lý file Excel",
        error: error.message,
      });
    }
  });
};

// =============================================
// 📤 Upload Multiple (Legacy - field: "file")
// =============================================
const uploadFileMutiple1 = (req, res) => {
  upload.array("file", 10)(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Không có file nào được tải lên.",
      });
    }

    try {
      const results = [];

      for (const file of req.files) {
        try {
          const uploaded = await cloudinary.uploader.upload(file.path, {
            folder: "folderupload",
            resource_type: "auto",
          });

          safeDeleteFile(file.path);

          results.push({
            url: uploaded.secure_url,
            public_id: uploaded.public_id,
            type: "ImageChinh",
          });
        } catch (uploadError) {
          console.error(`❌ Lỗi upload ${file.filename}:`, uploadError);
          safeDeleteFile(file.path);
        }
      }

      if (results.length === 0) {
        return res.status(500).json({
          success: false,
          message: "Không upload được file nào.",
        });
      }

      return res.status(200).json({
        success: true,
        files: results,
      });
    } catch (error) {
      console.error("❌ Lỗi upload multiple:", error);

      if (req.files) {
        req.files.forEach((file) => safeDeleteFile(file.path));
      }

      return res.status(500).json({
        success: false,
        message: "Lỗi khi upload files.",
        error: error.message,
      });
    }
  });
};

// =============================================
// 📦 EXPORTS
// =============================================
module.exports = {
  uploadFile1,
  uploadFiles1,
  deleteFile1,
  uploadAudio1,
  deleteAudio1,
  uploadVideo,
  deleteVideo,
  uploadExcelFile1,
  uploadFileMutiple1,
};