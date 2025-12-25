"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var SanPham = require('../../model/SanPham');
var path = require('path');
var xlsx = require('xlsx');
var fs = require('fs');
var LoaiSP = require('../../model/LoaiSP');
var HangSX = require('../../model/HangSX');
require('dotenv').config();
module.exports = {
  getProducts: function () {
    var _getProducts = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(req, res) {
      var _req$query, page, limit, TenSP, sort, order, locTheoLoai, locTheoGia, locTheoHangSX, SoLuotDanhGia, SoLuotBan, GiamGiaSP, tu, den, pageNumber, limitNumber, skip, query, searchKeywords, locTheoLoaiArray, locTheoHangSXArray, sortOrder, convert_string, valuesArray, giatri1, giatri2, giatri3, giatri4, sp, totalSanPham, totalPages;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _req$query = req.query, page = _req$query.page, limit = _req$query.limit, TenSP = _req$query.TenSP, sort = _req$query.sort, order = _req$query.order, locTheoLoai = _req$query.locTheoLoai, locTheoGia = _req$query.locTheoGia, locTheoHangSX = _req$query.locTheoHangSX, SoLuotDanhGia = _req$query.SoLuotDanhGia, SoLuotBan = _req$query.SoLuotBan, GiamGiaSP = _req$query.GiamGiaSP, tu = _req$query.tu, den = _req$query.den; // Chuyển đổi thành số
            pageNumber = parseInt(page, 10);
            limitNumber = parseInt(limit, 10); // Tính toán số bản ghi bỏ qua
            skip = (pageNumber - 1) * limitNumber; // Tạo query tìm kiếm
            query = {};
            if (TenSP) {
              searchKeywords = TenSP.trim().split(/\s+/).map(function (keyword) {
                // Chuyển keyword thành regex để tìm kiếm gần đúng (không phân biệt chữ hoa chữ thường)
                var normalizedKeyword = keyword.toLowerCase(); // Chuyển tất cả về chữ thường để không phân biệt
                return {
                  TenSP: {
                    $regex: normalizedKeyword,
                    $options: 'i'
                  } // 'i' giúp tìm kiếm không phân biệt chữ hoa chữ thường
                };
              });
              query.$or = searchKeywords;
            }
            // Tìm kiếm theo IdLoaiSP nếu có
            if (locTheoLoai) {
              // Chuyển 'locTheoLoai' từ string sang mảng ObjectId
              locTheoLoaiArray = Array.isArray(locTheoLoai) ? locTheoLoai : JSON.parse(locTheoLoai);
              query.IdLoaiSP = {
                $in: locTheoLoaiArray
              }; // Dùng toán tử $in để lọc theo mảng các ObjectId
            }

            // Tìm kiếm theo IdHangSX nếu có
            if (locTheoHangSX) {
              // Chuyển 'locTheoHangSX' từ string sang mảng ObjectId
              locTheoHangSXArray = Array.isArray(locTheoHangSX) ? locTheoHangSX : JSON.parse(locTheoHangSX);
              query.IdHangSX = {
                $in: locTheoHangSXArray
              }; // Dùng toán tử $in để lọc theo mảng các ObjectId
            }

            // tang/giam
            sortOrder = 1; // tang dn
            if (order === 'desc') {
              sortOrder = -1;
            }

            // lọc sản phẩm theo giá từ X đến Y
            if (locTheoGia) {
              convert_string = locTheoGia.replace(/[^\d-]/g, '');
              valuesArray = convert_string.split('-');
              giatri1 = parseFloat(valuesArray[0]);
              giatri2 = parseFloat(valuesArray[1]); // Lọc sản phẩm có giá trong sizes[0].price nằm trong khoảng giatri1 và giatri2
              if (convert_string) {
                query.sizes = {
                  $elemMatch: {
                    price: {
                      $gte: giatri1,
                      $lte: giatri2
                    }
                  }
                };
              }
            }
            if (tu && den) {
              giatri3 = parseFloat(tu);
              giatri4 = parseFloat(den);
              console.log("giatri3: ", giatri3);
              console.log("giatri4: ", giatri4);
              // Lọc sản phẩm có giá trong sizes[0].price nằm trong khoảng giatri1 và giatri2
              if (giatri3 && giatri4) {
                query.sizes = {
                  $elemMatch: {
                    price: {
                      $gte: giatri3,
                      $lte: giatri4
                    }
                  }
                };
              }
            }
            if (SoLuotDanhGia) {
              query.SoLuotDanhGia = {
                $gt: SoLuotDanhGia
              }; // Lọc sản phẩm có số lượng đánh giá lớn hơn 10
            }
            if (SoLuotBan) {
              query.SoLuongBan = {
                $gt: SoLuotBan
              }; // Lọc sản phẩm có số lượng bán lớn hơn 10
            }
            if (GiamGiaSP) {
              query.GiamGiaSP = {
                $gt: GiamGiaSP
              }; // Lọc sản phẩm có GiamGiaSP lớn hơn 20
            }
            _context.next = 18;
            return SanPham.find(query).populate("IdHangSX IdLoaiSP").skip(skip).limit(limitNumber).sort(_defineProperty({}, sort, sortOrder));
          case 18:
            sp = _context.sent;
            // Sắp xếp mảng sizes theo price từ thấp đến cao
            sp = sp.map(function (product) {
              // Sort sizes array based on price (ascending)
              if (product.sizes && product.sizes.length > 0) {
                product.sizes.sort(function (a, b) {
                  return a.price - b.price;
                }); // Sort sizes array by price
              }
              return product;
            });
            _context.next = 22;
            return SanPham.countDocuments(query);
          case 22:
            totalSanPham = _context.sent;
            // Đếm tổng số chức vụ
            totalPages = Math.ceil(totalSanPham / limitNumber); // Tính số trang
            if (!sp) {
              _context.next = 28;
              break;
            }
            return _context.abrupt("return", res.status(200).json({
              message: "Đã tìm ra products",
              errCode: 0,
              data: sp,
              totalSanPham: totalSanPham,
              totalPages: totalPages,
              currentPage: pageNumber
            }));
          case 28:
            return _context.abrupt("return", res.status(500).json({
              message: "Tìm products thất bại!",
              errCode: -1
            }));
          case 29:
            _context.next = 35;
            break;
          case 31:
            _context.prev = 31;
            _context.t0 = _context["catch"](0);
            console.error(_context.t0);
            return _context.abrupt("return", res.status(500).json({
              message: "Có lỗi xảy ra.",
              error: _context.t0.message
            }));
          case 35:
          case "end":
            return _context.stop();
        }
      }, _callee, null, [[0, 31]]);
    }));
    function getProducts(_x, _x2) {
      return _getProducts.apply(this, arguments);
    }
    return getProducts;
  }(),
  createProduct: function () {
    var _createProduct = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(req, res) {
      var _req$body, TenSP, GiamGiaSP, MoTa, MoTaChiTiet, ImageSlider, Image, IdHangSX, IdLoaiSP, sizes, createSP;
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _req$body = req.body, TenSP = _req$body.TenSP, GiamGiaSP = _req$body.GiamGiaSP, MoTa = _req$body.MoTa, MoTaChiTiet = _req$body.MoTaChiTiet, ImageSlider = _req$body.ImageSlider, Image = _req$body.Image, IdHangSX = _req$body.IdHangSX, IdLoaiSP = _req$body.IdLoaiSP, sizes = _req$body.sizes;
            console.log("TenSP: ", TenSP);
            console.log("GiamGiaSP: ", GiamGiaSP);
            console.log("MoTa: ", MoTa);
            console.log("MoTaChiTiet: ", MoTaChiTiet);
            console.log("ImageSlider: ", ImageSlider);
            console.log("Image: ", Image);
            console.log("IdHangSX: ", IdHangSX);
            console.log("IdLoaiSP: ", IdLoaiSP);
            console.log("sizes: ", sizes);
            _context2.next = 13;
            return SanPham.create({
              TenSP: TenSP,
              GiamGiaSP: GiamGiaSP,
              MoTa: MoTa,
              MoTaChiTiet: MoTaChiTiet,
              ImageSlider: ImageSlider,
              Image: Image,
              IdHangSX: IdHangSX,
              IdLoaiSP: IdLoaiSP,
              sizes: sizes
            });
          case 13:
            createSP = _context2.sent;
            if (!createSP) {
              _context2.next = 18;
              break;
            }
            return _context2.abrupt("return", res.status(200).json({
              message: "Bạn đã thêm sản phẩm thành công!",
              errCode: 0,
              data: createSP
            }));
          case 18:
            return _context2.abrupt("return", res.status(500).json({
              message: "Bạn thêm sản phẩm thất bại!",
              errCode: -1
            }));
          case 19:
            _context2.next = 25;
            break;
          case 21:
            _context2.prev = 21;
            _context2.t0 = _context2["catch"](0);
            console.error(_context2.t0);
            return _context2.abrupt("return", res.status(500).json({
              message: "Có lỗi xảy ra.",
              error: _context2.t0.message
            }));
          case 25:
          case "end":
            return _context2.stop();
        }
      }, _callee2, null, [[0, 21]]);
    }));
    function createProduct(_x3, _x4) {
      return _createProduct.apply(this, arguments);
    }
    return createProduct;
  }(),
  updateProduct: function () {
    var _updateProduct = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3(req, res) {
      var _req$body2, _id, TenSP, IdHangSX, IdLoaiSP, sizes, Image, ImageSlider, MoTa, MoTaChiTiet, GiamGiaSP, updateTL;
      return _regeneratorRuntime().wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _req$body2 = req.body, _id = _req$body2._id, TenSP = _req$body2.TenSP, IdHangSX = _req$body2.IdHangSX, IdLoaiSP = _req$body2.IdLoaiSP, sizes = _req$body2.sizes, Image = _req$body2.Image, ImageSlider = _req$body2.ImageSlider, MoTa = _req$body2.MoTa, MoTaChiTiet = _req$body2.MoTaChiTiet, GiamGiaSP = _req$body2.GiamGiaSP;
            _context3.next = 4;
            return SanPham.updateOne({
              _id: _id
            }, {
              TenSP: TenSP,
              IdHangSX: IdHangSX,
              IdLoaiSP: IdLoaiSP,
              sizes: sizes,
              Image: Image,
              ImageSlider: ImageSlider,
              MoTa: MoTa,
              MoTaChiTiet: MoTaChiTiet,
              GiamGiaSP: GiamGiaSP
            });
          case 4:
            updateTL = _context3.sent;
            if (!updateTL) {
              _context3.next = 9;
              break;
            }
            return _context3.abrupt("return", res.status(200).json({
              data: updateTL,
              message: "Chỉnh sửa sản phẩm thành công"
            }));
          case 9:
            return _context3.abrupt("return", res.status(404).json({
              message: "Chỉnh sửa sản phẩm thất bại"
            }));
          case 10:
            _context3.next = 16;
            break;
          case 12:
            _context3.prev = 12;
            _context3.t0 = _context3["catch"](0);
            console.error(_context3.t0);
            return _context3.abrupt("return", res.status(500).json({
              message: "Có lỗi xảy ra.",
              error: _context3.t0.message
            }));
          case 16:
          case "end":
            return _context3.stop();
        }
      }, _callee3, null, [[0, 12]]);
    }));
    function updateProduct(_x5, _x6) {
      return _updateProduct.apply(this, arguments);
    }
    return updateProduct;
  }(),
  deleteProduct: function () {
    var _deleteProduct = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4(req, res) {
      var _id, xoaTL;
      return _regeneratorRuntime().wrap(function _callee4$(_context4) {
        while (1) switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            _id = req.params.id;
            _context4.next = 4;
            return SanPham.deleteOne({
              _id: _id
            });
          case 4:
            xoaTL = _context4.sent;
            if (!xoaTL) {
              _context4.next = 9;
              break;
            }
            return _context4.abrupt("return", res.status(200).json({
              data: xoaTL,
              message: "Bạn đã xoá sản phẩm thành công!"
            }));
          case 9:
            return _context4.abrupt("return", res.status(500).json({
              message: "Bạn đã xoá sản phẩm thất bại!"
            }));
          case 10:
            _context4.next = 16;
            break;
          case 12:
            _context4.prev = 12;
            _context4.t0 = _context4["catch"](0);
            console.error(_context4.t0);
            return _context4.abrupt("return", res.status(500).json({
              message: "Có lỗi xảy ra.",
              error: _context4.t0.message
            }));
          case 16:
          case "end":
            return _context4.stop();
        }
      }, _callee4, null, [[0, 12]]);
    }));
    function deleteProduct(_x7, _x8) {
      return _deleteProduct.apply(this, arguments);
    }
    return deleteProduct;
  }(),
  // Xử lý file Excel và lưu sản phẩm vào MongoDB
  importProductsFromExcel: function () {
    var _importProductsFromExcel = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5(req, res) {
      var originalFileName, filePath, workbook, sheetName, worksheet, data, products, _loop, _ret, i;
      return _regeneratorRuntime().wrap(function _callee5$(_context6) {
        while (1) switch (_context6.prev = _context6.next) {
          case 0:
            // Lấy tên file gốc từ frontend
            originalFileName = req.body.originalFileName; // Tên file gốc từ frontend
            console.log('Original file name:', originalFileName);
            console.log('Uploaded file:', req.file);
            filePath = path.join(__dirname, '../../public/excel/', originalFileName);
            console.log("filePath: ", filePath);
            _context6.prev = 5;
            workbook = xlsx.readFile(filePath); // Đọc file Excel
            sheetName = workbook.SheetNames[0]; // Lấy sheet đầu tiên
            worksheet = workbook.Sheets[sheetName];
            data = xlsx.utils.sheet_to_json(worksheet); // Chuyển dữ liệu sheet thành JSON
            console.log("data: ", data);
            products = [];
            _loop = /*#__PURE__*/_regeneratorRuntime().mark(function _loop() {
              var product, category, brand, sizes, quantities, prices, totalQuantity, newProduct;
              return _regeneratorRuntime().wrap(function _loop$(_context5) {
                while (1) switch (_context5.prev = _context5.next) {
                  case 0:
                    product = data[i]; // Kiểm tra thể loại sản phẩm
                    console.log("product: ", product);
                    _context5.next = 4;
                    return LoaiSP.findOne({
                      TenLoaiSP: product.IdLoaiSP
                    });
                  case 4:
                    category = _context5.sent;
                    if (category) {
                      _context5.next = 7;
                      break;
                    }
                    return _context5.abrupt("return", {
                      v: res.status(400).json({
                        message: "Th\u1EC3 lo\u1EA1i kh\xF4ng h\u1EE3p l\u1EC7: ".concat(product.IdLoaiSP)
                      })
                    });
                  case 7:
                    _context5.next = 9;
                    return HangSX.findOne({
                      TenHangSX: product.IdHangSX
                    });
                  case 9:
                    brand = _context5.sent;
                    if (brand) {
                      _context5.next = 12;
                      break;
                    }
                    return _context5.abrupt("return", {
                      v: res.status(400).json({
                        message: "H\xE3ng s\u1EA3n xu\u1EA5t kh\xF4ng h\u1EE3p l\u1EC7: ".concat(product.IdHangSX)
                      })
                    });
                  case 12:
                    // Chuyển các thông tin size, quantity, price thành mảng                
                    sizes = product.size ? product.size.replace(/,\s*$/, '').split(',').map(function (size) {
                      return size.trim();
                    }) : []; // Tách các size
                    quantities = product.quantity ? String(product.quantity).replace(/,\s*$/, '').split(',').map(function (quantity) {
                      return parseInt(quantity.trim());
                    }) : []; // Chuyển quantity thành chuỗi và tách
                    prices = product.price ? String(product.price).replace(/,\s*$/, '') // Loại bỏ dấu phẩy thừa cuối chuỗi (nếu có)
                    .split(',') // Tách chuỗi theo dấu phẩy
                    .map(function (price) {
                      return parseFloat(price.trim());
                    }) // Chuyển đổi từng giá trị thành float
                    : []; // Chuyển price thành chuỗi và tách
                    console.log("product.size:", product.size);
                    console.log("product.quantity:", product.quantity);
                    console.log("product.price:", product.price);

                    // Kiểm tra rằng số lượng các phần tử là khớp nhau
                    // if (sizes.length !== quantities.length || sizes.length !== prices.length) {
                    //     return res.status(400).json({ message: 'Dữ liệu size, quantity, price không hợp lệ, số lượng không khớp.' });
                    // }

                    // Tính tổng số lượng tồn kho từ tất cả các quantity
                    totalQuantity = quantities.reduce(function (acc, quantity) {
                      return acc + quantity;
                    }, 0); // Tạo sản phẩm
                    newProduct = new SanPham({
                      TenSP: product.TenSP,
                      // GiaBan: product.GiaBan,
                      GiamGiaSP: product.GiamGiaSP || 0,
                      MoTa: product.MoTa || 'Không có mô tả',
                      MoTaChiTiet: product.MoTaChiTiet || 'Không có mô tả chi tiết',
                      IdHangSX: brand._id,
                      IdLoaiSP: category._id,
                      sizes: sizes.map(function (size, index) {
                        return {
                          size: size,
                          quantity: quantities[index],
                          price: prices[index]
                        };
                      }),
                      SoLuongTon: totalQuantity
                    });
                    products.push(newProduct); // Thêm sản phẩm vào mảng
                  case 21:
                  case "end":
                    return _context5.stop();
                }
              }, _loop);
            });
            i = 0;
          case 14:
            if (!(i < data.length)) {
              _context6.next = 22;
              break;
            }
            return _context6.delegateYield(_loop(), "t0", 16);
          case 16:
            _ret = _context6.t0;
            if (!_ret) {
              _context6.next = 19;
              break;
            }
            return _context6.abrupt("return", _ret.v);
          case 19:
            i++;
            _context6.next = 14;
            break;
          case 22:
            console.log("products: ", products);

            // Lưu tất cả sản phẩm vào MongoDB
            _context6.next = 25;
            return SanPham.insertMany(products);
          case 25:
            // Xóa file Excel sau khi xử lý xong
            fs.unlinkSync(filePath); // Xóa file Excel tạm sau khi import

            res.status(200).json({
              message: 'Import sản phẩm thành công',
              data: products
            });
            _context6.next = 33;
            break;
          case 29:
            _context6.prev = 29;
            _context6.t1 = _context6["catch"](5);
            console.error(_context6.t1);
            res.status(500).json({
              message: 'Có lỗi xảy ra khi import sản phẩm',
              error: _context6.t1.message
            });
          case 33:
          case "end":
            return _context6.stop();
        }
      }, _callee5, null, [[5, 29]]);
    }));
    function importProductsFromExcel(_x9, _x10) {
      return _importProductsFromExcel.apply(this, arguments);
    }
    return importProductsFromExcel;
  }(),
  getProductToCategoryNoiBat: function () {
    var _getProductToCategoryNoiBat = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee6(req, res) {
      var _req$query2, page, limit, TenSP, sort, order, locTheoLoai, locTheoGia, locTheoHangSX, SoLuotDanhGia, SoLuotBan, GiamGiaSP, tu, den, IdLoaiSP, pageNumber, limitNumber, skip, idLoaiSPArray, sp;
      return _regeneratorRuntime().wrap(function _callee6$(_context7) {
        while (1) switch (_context7.prev = _context7.next) {
          case 0:
            _context7.prev = 0;
            _req$query2 = req.query, page = _req$query2.page, limit = _req$query2.limit, TenSP = _req$query2.TenSP, sort = _req$query2.sort, order = _req$query2.order, locTheoLoai = _req$query2.locTheoLoai, locTheoGia = _req$query2.locTheoGia, locTheoHangSX = _req$query2.locTheoHangSX, SoLuotDanhGia = _req$query2.SoLuotDanhGia, SoLuotBan = _req$query2.SoLuotBan, GiamGiaSP = _req$query2.GiamGiaSP, tu = _req$query2.tu, den = _req$query2.den, IdLoaiSP = _req$query2.IdLoaiSP;
            console.log("id: ", IdLoaiSP);

            // Chuyển đổi thành số
            pageNumber = parseInt(page, 10);
            limitNumber = parseInt(limit, 10); // Tính toán số bản ghi bỏ qua
            skip = (pageNumber - 1) * limitNumber;
            if (IdLoaiSP) {
              _context7.next = 8;
              break;
            }
            return _context7.abrupt("return", res.status(400).json({
              message: "IdLoaiSP is required!"
            }));
          case 8:
            // Nếu IdLoaiSP là một chuỗi, ta sẽ chuyển nó thành mảng
            idLoaiSPArray = IdLoaiSP.split(','); // Tách chuỗi thành mảng nếu cần
            _context7.next = 11;
            return SanPham.find({
              IdLoaiSP: {
                $in: idLoaiSPArray
              },
              SoLuongBan: {
                $gt: 2
              } // Tìm các sản phẩm có SoLuongBan lớn hơn 2
            }).populate("IdHangSX IdLoaiSP");
          case 11:
            sp = _context7.sent;
            if (!(sp && sp.length > 0)) {
              _context7.next = 16;
              break;
            }
            return _context7.abrupt("return", res.status(200).json({
              data: sp,
              message: "Bạn đã tìm sản phẩm nổi bật thành công!"
            }));
          case 16:
            return _context7.abrupt("return", res.status(500).json({
              message: "Bạn đã tìm sản phẩm thất bại!"
            }));
          case 17:
            _context7.next = 23;
            break;
          case 19:
            _context7.prev = 19;
            _context7.t0 = _context7["catch"](0);
            console.error(_context7.t0);
            return _context7.abrupt("return", res.status(500).json({
              message: "Có lỗi xảy ra.",
              error: _context7.t0.message
            }));
          case 23:
          case "end":
            return _context7.stop();
        }
      }, _callee6, null, [[0, 19]]);
    }));
    function getProductToCategoryNoiBat(_x11, _x12) {
      return _getProductToCategoryNoiBat.apply(this, arguments);
    }
    return getProductToCategoryNoiBat;
  }(),
  getDetailSP: function () {
    var _getDetailSP = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee7(req, res) {
      var id, sp;
      return _regeneratorRuntime().wrap(function _callee7$(_context8) {
        while (1) switch (_context8.prev = _context8.next) {
          case 0:
            _context8.prev = 0;
            id = req.query.id;
            console.log("id getDetailSP: ", id);
            _context8.next = 5;
            return SanPham.findById(id).populate("IdHangSX IdLoaiSP");
          case 5:
            sp = _context8.sent;
            if (!sp) {
              _context8.next = 10;
              break;
            }
            return _context8.abrupt("return", res.status(200).json({
              data: sp,
              message: "Đã có thông tin chi tiết!"
            }));
          case 10:
            return _context8.abrupt("return", res.status(500).json({
              message: "Thông tin chi tiết thất bại!"
            }));
          case 11:
            _context8.next = 17;
            break;
          case 13:
            _context8.prev = 13;
            _context8.t0 = _context8["catch"](0);
            console.error(_context8.t0);
            return _context8.abrupt("return", res.status(500).json({
              message: "Có lỗi xảy ra.",
              error: _context8.t0.message
            }));
          case 17:
          case "end":
            return _context8.stop();
        }
      }, _callee7, null, [[0, 13]]);
    }));
    function getDetailSP(_x13, _x14) {
      return _getDetailSP.apply(this, arguments);
    }
    return getDetailSP;
  }(),
  getProductToCategorySPLienQuan: function () {
    var _getProductToCategorySPLienQuan = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee8(req, res) {
      var _req$query3, page, limit, TenSP, sort, order, locTheoLoai, locTheoGia, locTheoHangSX, SoLuotDanhGia, SoLuotBan, GiamGiaSP, tu, den, IdLoaiSP, pageNumber, limitNumber, skip, idLoaiSPArray, query, searchKeywords, keywordsArray, searchConditions, locTheoHangSXArray, sortOrder, convert_string, valuesArray, giatri1, giatri2, giatri3, giatri4, sp, totalSanPham, totalPages;
      return _regeneratorRuntime().wrap(function _callee8$(_context9) {
        while (1) switch (_context9.prev = _context9.next) {
          case 0:
            _context9.prev = 0;
            _req$query3 = req.query, page = _req$query3.page, limit = _req$query3.limit, TenSP = _req$query3.TenSP, sort = _req$query3.sort, order = _req$query3.order, locTheoLoai = _req$query3.locTheoLoai, locTheoGia = _req$query3.locTheoGia, locTheoHangSX = _req$query3.locTheoHangSX, SoLuotDanhGia = _req$query3.SoLuotDanhGia, SoLuotBan = _req$query3.SoLuotBan, GiamGiaSP = _req$query3.GiamGiaSP, tu = _req$query3.tu, den = _req$query3.den, IdLoaiSP = _req$query3.IdLoaiSP;
            console.log("id: ", IdLoaiSP);

            // Chuyển đổi thành số
            pageNumber = parseInt(page, 10);
            limitNumber = parseInt(limit, 10); // Tính toán số bản ghi bỏ qua
            skip = (pageNumber - 1) * limitNumber;
            console.log("id getProductToCategorySPLienQuan: ", IdLoaiSP);
            if (IdLoaiSP) {
              _context9.next = 9;
              break;
            }
            return _context9.abrupt("return", res.status(400).json({
              message: "IdLoaiSP is required!"
            }));
          case 9:
            // Nếu IdLoaiSP là một chuỗi, ta sẽ chuyển nó thành mảng
            idLoaiSPArray = IdLoaiSP.split(','); // Tách chuỗi thành mảng nếu cần
            // ----------------------
            // Tạo query tìm kiếm
            query = {};
            if (TenSP) {
              searchKeywords = TenSP || '';
              keywordsArray = searchKeywords.trim().split(/\s+/);
              searchConditions = keywordsArray.map(function (keyword) {
                return {
                  TenSP: {
                    $regex: keyword,
                    $options: 'i'
                  } // Tìm kiếm không phân biệt chữ hoa chữ thường
                };
              });
              query.$or = searchConditions;
            }

            // Tìm kiếm theo IdHangSX nếu có
            if (locTheoHangSX) {
              // Chuyển 'locTheoHangSX' từ string sang mảng ObjectId
              locTheoHangSXArray = Array.isArray(locTheoHangSX) ? locTheoHangSX : JSON.parse(locTheoHangSX);
              query.IdHangSX = {
                $in: locTheoHangSXArray
              }; // Dùng toán tử $in để lọc theo mảng các ObjectId
            }

            // tang/giam
            sortOrder = 1; // tang dn
            if (order === 'desc') {
              sortOrder = -1;
            }

            // lọc sản phẩm theo giá từ X đến Y
            if (locTheoGia) {
              convert_string = locTheoGia.replace(/[^\d-]/g, '');
              valuesArray = convert_string.split('-');
              giatri1 = parseFloat(valuesArray[0]);
              giatri2 = parseFloat(valuesArray[1]); // Lọc sản phẩm có giá trong sizes[0].price nằm trong khoảng giatri1 và giatri2
              if (convert_string) {
                query.sizes = {
                  $elemMatch: {
                    price: {
                      $gte: giatri1,
                      $lte: giatri2
                    }
                  }
                };
              }
            }
            if (tu && den) {
              giatri3 = parseFloat(tu);
              giatri4 = parseFloat(den);
              console.log("giatri3: ", giatri3);
              console.log("giatri4: ", giatri4);
              // Lọc sản phẩm có giá trong sizes[0].price nằm trong khoảng giatri1 và giatri2
              if (giatri3 && giatri4) {
                query.sizes = {
                  $elemMatch: {
                    price: {
                      $gte: giatri3,
                      $lte: giatri4
                    }
                  }
                };
              }
            }
            if (SoLuotDanhGia) {
              query.SoLuotDanhGia = {
                $gt: SoLuotDanhGia
              }; // Lọc sản phẩm có số lượng đánh giá lớn hơn 10
            }
            if (SoLuotBan) {
              query.SoLuongBan = {
                $gt: SoLuotBan
              }; // Lọc sản phẩm có số lượng bán lớn hơn 10
            }
            if (GiamGiaSP) {
              query.GiamGiaSP = {
                $gt: GiamGiaSP
              }; // Lọc sản phẩm có GiamGiaSP lớn hơn 20
            }

            // Thêm điều kiện lọc theo loại sản phẩm (IdLoaiSP)
            query.IdLoaiSP = {
              $in: idLoaiSPArray
            };
            _context9.next = 23;
            return SanPham.find(query).collation({
              locale: 'vi',
              strength: 1
            }).populate("IdHangSX IdLoaiSP").skip(skip).limit(limitNumber).sort(_defineProperty({}, sort, sortOrder));
          case 23:
            sp = _context9.sent;
            // Sắp xếp mảng sizes theo price từ thấp đến cao
            sp = sp.map(function (product) {
              // Sort sizes array based on price (ascending)
              if (product.sizes && product.sizes.length > 0) {
                product.sizes.sort(function (a, b) {
                  return a.price - b.price;
                }); // Sort sizes array by price
              }
              return product;
            });
            _context9.next = 27;
            return SanPham.countDocuments(query);
          case 27:
            totalSanPham = _context9.sent;
            // Đếm tổng số chức vụ
            totalPages = Math.ceil(totalSanPham / limitNumber); // Tính số trang
            if (!sp) {
              _context9.next = 33;
              break;
            }
            return _context9.abrupt("return", res.status(200).json({
              message: "Đã tìm ra products",
              errCode: 0,
              data: sp,
              totalSanPham: totalSanPham,
              totalPages: totalPages,
              currentPage: pageNumber
            }));
          case 33:
            return _context9.abrupt("return", res.status(500).json({
              message: "Tìm products thất bại!",
              errCode: -1
            }));
          case 34:
            _context9.next = 40;
            break;
          case 36:
            _context9.prev = 36;
            _context9.t0 = _context9["catch"](0);
            console.error(_context9.t0);
            return _context9.abrupt("return", res.status(500).json({
              message: "Có lỗi xảy ra.",
              error: _context9.t0.message
            }));
          case 40:
          case "end":
            return _context9.stop();
        }
      }, _callee8, null, [[0, 36]]);
    }));
    function getProductToCategorySPLienQuan(_x15, _x16) {
      return _getProductToCategorySPLienQuan.apply(this, arguments);
    }
    return getProductToCategorySPLienQuan;
  }()
};