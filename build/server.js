"use strict";

var express = require('express');
var bodyParser = require('body-parser');
var viewEngine = require('./config/viewEngine');
var uploadRouter = require('./routes/uploadRouter');
var adminRouter = require('./routes/loginAdminRouter');
var categoryRouter = require('./routes/theLoaiRouter');
var hangSXRouter = require('./routes/hangSXRouter');
var productRouter = require('./routes/productRouter');
var khRouter = require('./routes/loginKHRouter');
var voucherRouter = require('./routes/voucherRouter');
var orderRouter = require('./routes/orderRouter');
var commentRouter = require('./routes/commentRouter');
var connectDB = require('./config/connectDB');
var cors = require('cors');
var multer = require('multer');
var path = require('path');
var cron = require('node-cron');
var moment = require('moment');
require("dotenv").config();
var app = express();
var port = process.env.PORT || 6969;
var hostname = process.env.HOST_NAME;
connectDB();

// Cài đặt CORS
var allowedOrigins = ['http://localhost:3006',
// Local development
'http://localhost:3008',
// Local development
'https://bandodientu-admin.vercel.app', 'https://bandodientu-kt-trangchu.vercel.app', 'https://admin-dodientu.dokhactu.site', 'https://shopbandodientu.dokhactu.site'];
app.use(cors({
  origin: function origin(_origin, callback) {
    if (!_origin || allowedOrigins.includes(_origin)) {
      // Dùng includes thay cho indexOf
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.options('*', cors()); // Enable preflight requests for all routes

// Config bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// Đặt thư mục public/uploads làm public để có thể truy cập
app.use('/uploads', express["static"](path.join(__dirname, './public/uploads')));

// Config app
viewEngine(app);
var routes = [{
  path: '/api/accadmin',
  router: adminRouter
}, {
  path: '/api/category',
  router: categoryRouter
}, {
  path: '/api/hangsx',
  router: hangSXRouter
}, {
  path: '/api/product',
  router: productRouter
}, {
  path: '/api/acckh',
  router: khRouter
}, {
  path: '/api/voucher',
  router: voucherRouter
}, {
  path: '/api/order',
  router: orderRouter
}, {
  path: '/api/comment',
  router: commentRouter
}];
routes.forEach(function (route) {
  return app.use(route.path, route.router);
});
// // route cho login,register,logout admin
// app.use("/api/accadmin", adminRouter);
// // route cho The Loai
// app.use("/api/category", categoryRouter);
// // route cho hang sx
// app.use("/api/hangsx", hangSXRouter);

// Sử dụng uploadRouter
app.use("/api/upload", uploadRouter); // Đặt đường dẫn cho upload

app.listen(port, function () {
  console.log("backend nodejs is running on the port:", port, "\n http://localhost:".concat(port));
});