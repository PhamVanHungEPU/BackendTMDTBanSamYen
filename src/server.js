const express = require('express');
const bodyParser = require('body-parser');
const viewEngine = require('./config/viewEngine');
const connectDB = require('./config/connectDB');
const http = require('http'); // ✅ 1. Import http
const cookieParser = require('cookie-parser');
const multer = require('multer');
const { initSocket } = require('./Socket.IO');

const uploadRouter = require('./routes/uploadRouter');
const uploadAudio = require('./routes/uploadAudio');
const uploadVideo = require('./routes/uploadVideo');
const aiSuggestRouter = require('./routes/aiSuggest');

const authRouter = require('./routes/routes_TMDT/authRouter');
const nguoiDangRoutes = require('./routes/routes_TMDT/nguoiDangRoute');
const congDungRoutes = require("./routes/routes_TMDT/congDungRoutes");
const dangSanPhamRoutes = require("./routes/routes_TMDT/dangSanPhamRoutes");
const hangTVRoutes = require("./routes/routes_TMDT/hangTVRoutes");
const loaiNoiBatRoutes = require("./routes/routes_TMDT/loaiNoiBatRoutes");
const loaiSanPhamRoutes = require("./routes/routes_TMDT/loaiSanPhamRoutes");
const loaiSanPhamConRoutes = require("./routes/routes_TMDT/loaiSanPhamConRoutes");
const maKhuyenMaiRoutes = require("./routes/routes_TMDT/maKhuyenMaiRoutes");
const theLoaiBaiVietRoutes = require("./routes/routes_TMDT/theLoaiBaiVietRoutes");
const thuongHieuRoutes = require("./routes/routes_TMDT/thuongHieuRoutes");
const bannerRoutes = require("./routes/routes_TMDT/bannerRoutes"); 
const faviconRoutes = require("./routes/routes_TMDT/faviconRoutes"); 
const sanPhamRoutes = require("./routes/routes_TMDT/sanPhamRoutes"); 
const danhGiaRoutes = require("./routes/routes_TMDT/danhGiaRoutes"); 
const gioHangRoutes = require("./routes/routes_TMDT/gioHangRoutes"); 
const phiGiaoHangRoutes = require("./routes/routes_TMDT/phiGiaoHangRoutes"); 
const donHangRoutes = require("./routes/routes_TMDT/donHangRoutes"); 
const adminDashboardRoutes = require("./routes/routes_TMDT/adminDashboardRoutes"); 
const baiVietRoutes = require("./routes/routes_TMDT/baiVietRoutes"); 
const aiRoutes = require("./routes/routes_TMDT/aiRoutes"); 
const chatRouter = require("./routes/routes_TMDT/chatRouter"); 

const cors = require('cors');
const path = require('path');
const cleanUploads = require('./utils/cleanUploads');

require("dotenv").config();


let app = express();
const server = http.createServer(app); // ✅ 4. Tạo server từ app
initSocket(server); // ✅ 5. Khởi tạo Socket.IO với server
let port = process.env.PORT || 8882;

connectDB();

// Cài đặt CORS
const allowedOrigins = [
    'http://localhost:3171',     
];

app.use(cookieParser());



app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) { // Dùng includes thay cho indexOf
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,    
    methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'],  // Cho phép phương thức OPTIONS (preflight)
    allowedHeaders: ['Content-Type', 'Authorization', 'upload-type'],
}));
app.options('*', cors()); // Enable preflight requests for all routes
app.set('trust proxy', true); // BẮT BUỘC nếu dùng nginx hoặc VPS


// Config bodyParser
app.use(express.json())
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));


// Đặt thư mục public/uploads làm public để có thể truy cập
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));


// Config app
viewEngine(app);

const routes = [  
  
    { path: '/api/upload', router: uploadRouter },
    { path: '/api/audio', router: uploadAudio },
    { path: '/api/video', router: uploadVideo },
    { path: '/api/chatgpt', router: aiSuggestRouter },
    
    { path: '/api/auth', router: authRouter },
    { path: '/api/nguoi-dung', router: nguoiDangRoutes },
    { path: `/api/banner`, router: bannerRoutes }, 
    { path: `/api/favicon`, router: faviconRoutes }, 
    {
        path: `/api/cong-dung`,
        router: congDungRoutes,
    },
    {
        path: `/api/dang-san-pham`,
        router: dangSanPhamRoutes,
    },
    {
        path: `/api/hang-thanh-vien`,
        router: hangTVRoutes,
    },
    {
        path: `/api/loai-noi-bat`,
        router: loaiNoiBatRoutes,
    },
    {
        path: `/api/loai-san-pham`,
        router: loaiSanPhamRoutes,
    },
    {
        path: `/api/loai-san-pham-con`,
        router: loaiSanPhamConRoutes,
    },
    {
        path: `/api/ma-khuyen-mai`,
        router: maKhuyenMaiRoutes,
    },
    {
        path: `/api/the-loai-bai-viet`,
        router: theLoaiBaiVietRoutes,
    },
    {
        path: `/api/thuong-hieu`,
        router: thuongHieuRoutes,
    },
    {
        path: `/api/san-pham`,
        router: sanPhamRoutes,
    },
    {
        path: `/api/danh-gia`,
        router: danhGiaRoutes,
    },
    {
        path: `/api/gio-hang`,
        router: gioHangRoutes,
    },
    {
        path: `/api/phi-giao-hang`,
        router: phiGiaoHangRoutes,
    },
    {
        path: `/api/don-hang`,
        router: donHangRoutes,
    },
    {
        path: `/api/admin`,
        router: adminDashboardRoutes,
    },
    {
        path: `/api/bai-viet`,
        router: baiVietRoutes,
    },
     {
        path: `/api/ai`,
        router: aiRoutes,
    },

  
    { path: '/api/chat', router: chatRouter },

];
  
routes.forEach(route => app.use(route.path, route.router));

// Sử dụng uploadRouter
app.use("/api/upload", uploadRouter); // Đặt đường dẫn cho upload

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: err.message });
  } else if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
});

// Lịch cron: "*/5 * * * *" = 5 phút 1 lần
// cron.schedule("*/10 * * * *", () => {
//   console.log("🧹 Đang dọn thư mục uploads...");
//   cleanUploads();    
// });

app.get("/_socket_debug", (req, res) => {
  try {
    // require map (adjust path if Socket.IO.js exports internals)
    const { /* no direct access exported; if you want, export maps */ } = require("./Socket.IO");
    // If you want to expose maps, you can export functions from Socket.IO.js to return current maps.
    res.json({ ok: true, note: "If you need maps exported modify Socket.IO.js to export them." });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

server.listen(port, () => {
    console.log("backend nodejs is running on the port:", port, `\n http://localhost:${port}`);
});
