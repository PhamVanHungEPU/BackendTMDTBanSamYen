"use strict";

var _product = _interopRequireDefault(require("../controllers/Product/product.controller"));
var _upload = require("../controllers/Upload/upload.controller");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
var express = require("express");
var router = express.Router();

// find all product
router.get("/get-product", _product["default"].getProducts);

// tao moi product
router.post("/create-product", _product["default"].createProduct);

// update product
router.put("/update-product", _product["default"].updateProduct);

// delete product
router["delete"]("/delete-product/:id", _product["default"].deleteProduct);

// Route import sản phẩm từ file Excel
// router.post('/import-products', uploadExcel.single('file'), product.importProductsFromExcel);

router.post('/upload-excel', _upload.uploadExcelFile);

// Route để upload file Excel
router.post('/import-products', _upload.uploadExcel, _product["default"].importProductsFromExcel); // Đảm bảo gọi middleware uploadExcel trước

// tìm sản phẩm thông qua idloaisp và bán trên 10 sp
router.get("/get-product-idloaisp-noibat", _product["default"].getProductToCategoryNoiBat);
router.get("/get-product-idloaisp-lien-quan", _product["default"].getProductToCategorySPLienQuan);
router.get("/get-detail-product", _product["default"].getDetailSP);
module.exports = router;