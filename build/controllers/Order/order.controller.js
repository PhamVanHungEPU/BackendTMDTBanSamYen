"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var Order = require('../../model/Order');
var Product = require('../../model/SanPham'); // Import model sản phẩm
var nodemailer = require('nodemailer');
require('dotenv').config();

// API tạo đơn hàng
var createOrder = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(req, res) {
    var _req$body, lastName, firstName, email, address, phone, note, products, idKhachHang, thanhTien, soTienCanThanhToan, soTienGiamGia, giamGia, tongSoLuong, formatCurrency, transporter, productsHtml, _iterator, _step, product, productDetails, sendOrderConfirmationEmail, _iterator2, _step2, _loop, _ret, newOrder, _iterator3, _step3, _product, _idSP, size, quantity, productData, updated, _iterator4, _step4, sizeData;
    return _regeneratorRuntime().wrap(function _callee2$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _req$body = req.body, lastName = _req$body.lastName, firstName = _req$body.firstName, email = _req$body.email, address = _req$body.address, phone = _req$body.phone, note = _req$body.note, products = _req$body.products, idKhachHang = _req$body.idKhachHang, thanhTien = _req$body.thanhTien, soTienCanThanhToan = _req$body.soTienCanThanhToan, soTienGiamGia = _req$body.soTienGiamGia, giamGia = _req$body.giamGia, tongSoLuong = _req$body.tongSoLuong;
          console.log("lastName, firstName, email, address, phone, note: ", lastName, firstName, email, address, phone, note);
          console.log("products: ", products);
          console.log("idKhachHang: ", idKhachHang);
          console.log(" thanhTien, soTienCanThanhToan, soTienGiamGia, giamGia, tongSoLuong: ", thanhTien, soTienCanThanhToan, soTienGiamGia, giamGia, tongSoLuong);

          // Hàm định dạng tiền tệ VND
          formatCurrency = function formatCurrency(amount) {
            return new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND'
            }).format(amount);
          }; //---- GỬI XÁC NHẬN ĐƠN HÀNG VỀ EMAIL
          transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS
            }
          }); // Tạo bảng HTML để hiển thị thông tin đơn hàng
          productsHtml = ''; // Lặp qua các sản phẩm trong đơn hàng
          _iterator = _createForOfIteratorHelper(products);
          _context3.prev = 10;
          _iterator.s();
        case 12:
          if ((_step = _iterator.n()).done) {
            _context3.next = 20;
            break;
          }
          product = _step.value;
          _context3.next = 16;
          return Product.findById(product._idSP).exec();
        case 16:
          productDetails = _context3.sent;
          // Kiểm tra nếu tìm thấy sản phẩm
          if (productDetails) {
            // Thêm thông tin sản phẩm vào bảng HTML
            productsHtml += "\n                    <tr>\n                        <td>".concat(productDetails.TenSP, "</td>  \n                        <td>").concat(product.size, "</td>  \n                        <td>").concat(product.quantity, "</td>  \n                        <td>").concat(formatCurrency(product.price), "</td>  <!-- Gi\xE1 m\u1ED7i s\u1EA3n ph\u1EA9m -->\n                        <td>").concat(formatCurrency(product.quantity * product.price), "</td>  <!-- T\u1ED5ng ti\u1EC1n cho s\u1EA3n ph\u1EA9m -->\n                    </tr>\n                ");
          }
        case 18:
          _context3.next = 12;
          break;
        case 20:
          _context3.next = 25;
          break;
        case 22:
          _context3.prev = 22;
          _context3.t0 = _context3["catch"](10);
          _iterator.e(_context3.t0);
        case 25:
          _context3.prev = 25;
          _iterator.f();
          return _context3.finish(25);
        case 28:
          sendOrderConfirmationEmail = /*#__PURE__*/function () {
            var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(toEmail) {
              var mailOptions;
              return _regeneratorRuntime().wrap(function _callee$(_context) {
                while (1) switch (_context.prev = _context.next) {
                  case 0:
                    // Tạo nội dung email với bảng sản phẩm
                    mailOptions = {
                      from: 'Khắc Tú',
                      to: toEmail,
                      subject: 'Xác nhận đơn hàng của bạn.',
                      html: "\n                    <p style=\"color: navy; font-size: 20px;\">C\u1EA3m \u01A1n b\u1EA1n <span style=\"color: black; font-weight: bold; font-style: italic;\">".concat(lastName, " ").concat(firstName, "</span> \u0111\xE3 \u0111\u1EB7t h\xE0ng!!</p>\n                    <p style=\"color: green; font-style: italic;\">\u0110\u01A1n h\xE0ng c\u1EE7a b\u1EA1n \u0111\xE3 \u0111\u01B0\u1EE3c x\xE1c nh\u1EADn.</p>\n                    <p>T\u1ED5ng s\u1ED1 l\u01B0\u1EE3ng \u0111\u1EB7t: <span style=\"color: blue;\">").concat(tongSoLuong, "</span> s\u1EA3n ph\u1EA9m</p>\n                    <p>T\u1ED5ng ti\u1EC1n c\u1EE7a ").concat(tongSoLuong, " s\u1EA3n ph\u1EA9m: <span style=\"color: red;\">").concat(formatCurrency(thanhTien), "</span></p>\n                    <p>Ph\xED giao h\xE0ng: <span style=\"color: red;\">0</span></p>\n                    <p>B\u1EA1n \u0111\u01B0\u1EE3c gi\u1EA3m ").concat(giamGia, "% c\u1EE5 th\u1EC3 l\xE0: <span style=\"color: red;\">-").concat(formatCurrency(soTienGiamGia), "</span></p>\n                    <p>S\u1ED1 ti\u1EC1n c\u1EA7n thanh to\xE1n: <span style=\"color: red;\">").concat(formatCurrency(soTienCanThanhToan), "</span></p>\n                    <p>S\u1ED1 \u0110i\u1EC7n Tho\u1EA1i C\u1EE7a B\u1EA1n ").concat(firstName, " ").concat(lastName, ": ").concat(phone, "</p>\n                    <p>\u0110\u1ECBa ch\u1EC9 nh\u1EADn h\xE0ng: <span style=\"color: navy; font-style: italic;\">").concat(address, "</span></p>\n                    <br/>\n                    <table border=\"1\" cellpadding=\"5\" cellspacing=\"0\" style=\"border-collapse: collapse; width: 100%;\">\n                        <thead>\n                            <tr>\n                                <th style=\"text-align: left;\">T\xEAn s\u1EA3n ph\u1EA9m</th>\n                                <th style=\"text-align: left;\">C\u1EA5u h\xECnh</th>\n                                <th style=\"text-align: left;\">S\u1ED1 l\u01B0\u1EE3ng \u0111\u1EB7t</th>\n                                <th style=\"text-align: left;\">\u0110\u01A1n gi\xE1</th>\n                                <th style=\"text-align: left;\">T\u1ED5ng ti\u1EC1n</th>\n                            </tr>\n                        </thead>\n                        <tbody>\n                            ").concat(productsHtml, "\n                        </tbody>\n                    </table>\n                    <p>Link Website c\u1EE7a t\xF4i: <a href=\"#\">WebShop Kh\u1EAFc T\xFA</a></p>\n                ")
                    };
                    return _context.abrupt("return", new Promise(function (resolve, reject) {
                      transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                          reject(error);
                        } else {
                          console.log('Email sent: ' + info.response);
                          resolve();
                        }
                      });
                    }));
                  case 2:
                  case "end":
                    return _context.stop();
                }
              }, _callee);
            }));
            return function sendOrderConfirmationEmail(_x3) {
              return _ref2.apply(this, arguments);
            };
          }(); // Kiểm tra số lượng tồn của từng size trong sản phẩm
          _iterator2 = _createForOfIteratorHelper(products);
          _context3.prev = 30;
          _loop = /*#__PURE__*/_regeneratorRuntime().mark(function _loop() {
            var item, product, size;
            return _regeneratorRuntime().wrap(function _loop$(_context2) {
              while (1) switch (_context2.prev = _context2.next) {
                case 0:
                  item = _step2.value;
                  _context2.next = 3;
                  return Product.findById(item._idSP);
                case 3:
                  product = _context2.sent;
                  if (product) {
                    _context2.next = 6;
                    break;
                  }
                  return _context2.abrupt("return", {
                    v: res.status(404).json({
                      message: "S\u1EA3n ph\u1EA9m v\u1EDBi ID ".concat(item._idSP, " kh\xF4ng t\u1ED3n t\u1EA1i!")
                    })
                  });
                case 6:
                  // Tìm size sản phẩm trong mảng sizes
                  size = product.sizes.find(function (s) {
                    return s.size === item.size;
                  }); // Kiểm tra nếu size không tồn tại
                  if (size) {
                    _context2.next = 9;
                    break;
                  }
                  return _context2.abrupt("return", {
                    v: res.status(400).json({
                      message: "Size ".concat(item.size, " c\u1EE7a s\u1EA3n ph\u1EA9m kh\xF4ng h\u1EE3p l\u1EC7!")
                    })
                  });
                case 9:
                  if (!(size.quantity < item.quantity)) {
                    _context2.next = 11;
                    break;
                  }
                  return _context2.abrupt("return", {
                    v: res.status(400).json({
                      message: "S\u1EA3n ph\u1EA9m ".concat(product.TenSP, " - c\u1EA5u h\xECnh: ").concat(item.size, " ch\u1EC9 c\xF2n ").concat(size.quantity, " s\u1EA3n ph\u1EA9m trong kho, b\u1EA1n kh\xF4ng th\u1EC3 \u0111\u1EB7t ").concat(item.quantity, " s\u1EA3n ph\u1EA9m!")
                    })
                  });
                case 11:
                case "end":
                  return _context2.stop();
              }
            }, _loop);
          });
          _iterator2.s();
        case 33:
          if ((_step2 = _iterator2.n()).done) {
            _context3.next = 40;
            break;
          }
          return _context3.delegateYield(_loop(), "t1", 35);
        case 35:
          _ret = _context3.t1;
          if (!_ret) {
            _context3.next = 38;
            break;
          }
          return _context3.abrupt("return", _ret.v);
        case 38:
          _context3.next = 33;
          break;
        case 40:
          _context3.next = 45;
          break;
        case 42:
          _context3.prev = 42;
          _context3.t2 = _context3["catch"](30);
          _iterator2.e(_context3.t2);
        case 45:
          _context3.prev = 45;
          _iterator2.f();
          return _context3.finish(45);
        case 48:
          // Tạo đơn hàng mới
          newOrder = new Order({
            lastName: lastName,
            firstName: firstName,
            email: email,
            address: address,
            phone: phone,
            note: note,
            products: products,
            soTienGiamGia: soTienGiamGia,
            giamGia: giamGia,
            soTienCanThanhToan: soTienCanThanhToan,
            thanhTien: thanhTien,
            tongSoLuong: tongSoLuong,
            idKhachHang: idKhachHang || null
          }); // Lưu đơn hàng vào database
          _context3.next = 51;
          return newOrder.save();
        case 51:
          _context3.next = 53;
          return sendOrderConfirmationEmail(email);
        case 53:
          // Cập nhật số lượng tồn kho và số lượng bán cho từng sản phẩm
          _iterator3 = _createForOfIteratorHelper(products);
          _context3.prev = 54;
          _iterator3.s();
        case 56:
          if ((_step3 = _iterator3.n()).done) {
            _context3.next = 101;
            break;
          }
          _product = _step3.value;
          _idSP = _product._idSP, size = _product.size, quantity = _product.quantity; // Tìm sản phẩm theo _idSP
          _context3.next = 61;
          return Product.findById(_idSP);
        case 61:
          productData = _context3.sent;
          if (!productData) {
            _context3.next = 98;
            break;
          }
          console.log("Found product: ".concat(productData.TenSP));

          // Kiểm tra xem sản phẩm có kích thước (size) nào khớp với size đã đặt không
          updated = false; // Duyệt qua các kích thước (sizes) của sản phẩm
          _iterator4 = _createForOfIteratorHelper(productData.sizes);
          _context3.prev = 66;
          _iterator4.s();
        case 68:
          if ((_step4 = _iterator4.n()).done) {
            _context3.next = 83;
            break;
          }
          sizeData = _step4.value;
          if (!(sizeData.size === size)) {
            _context3.next = 81;
            break;
          }
          console.log("Updating size ".concat(sizeData.size, " with quantity ").concat(quantity));

          // Giảm số lượng tồn kho của size đã đặt
          if (!(sizeData.quantity >= quantity)) {
            _context3.next = 79;
            break;
          }
          sizeData.quantity -= quantity;
          productData.SoLuongBan += quantity;
          updated = true;
          return _context3.abrupt("break", 83);
        case 79:
          console.log("Not enough stock for size ".concat(sizeData.size));
          return _context3.abrupt("return", res.status(400).json({
            message: "Kh\xF4ng \u0111\u1EE7 s\u1ED1 l\u01B0\u1EE3ng cho size ".concat(sizeData.size)
          }));
        case 81:
          _context3.next = 68;
          break;
        case 83:
          _context3.next = 88;
          break;
        case 85:
          _context3.prev = 85;
          _context3.t3 = _context3["catch"](66);
          _iterator4.e(_context3.t3);
        case 88:
          _context3.prev = 88;
          _iterator4.f();
          return _context3.finish(88);
        case 91:
          if (!updated) {
            _context3.next = 96;
            break;
          }
          // Cập nhật lại SoLuongTon (tổng số lượng tồn kho)
          productData.SoLuongTon = productData.sizes.reduce(function (total, size) {
            return total + size.quantity;
          }, 0);
          console.log("Updated stock for product: ".concat(productData.TenSP, ", new SoLuongTon: ").concat(productData.SoLuongTon));

          // Lưu lại thông tin sản phẩm đã cập nhật
          _context3.next = 96;
          return productData.save();
        case 96:
          _context3.next = 99;
          break;
        case 98:
          console.log("Product not found: ".concat(productId));
        case 99:
          _context3.next = 56;
          break;
        case 101:
          _context3.next = 106;
          break;
        case 103:
          _context3.prev = 103;
          _context3.t4 = _context3["catch"](54);
          _iterator3.e(_context3.t4);
        case 106:
          _context3.prev = 106;
          _iterator3.f();
          return _context3.finish(106);
        case 109:
          return _context3.abrupt("return", res.status(201).json({
            message: 'Đặt hàng thành công!',
            data: newOrder
          }));
        case 112:
          _context3.prev = 112;
          _context3.t5 = _context3["catch"](0);
          return _context3.abrupt("return", res.status(500).json({
            message: 'Đã xảy ra lỗi khi tạo đơn hàng!',
            error: _context3.t5.message
          }));
        case 115:
        case "end":
          return _context3.stop();
      }
    }, _callee2, null, [[0, 112], [10, 22, 25, 28], [30, 42, 45, 48], [54, 103, 106, 109], [66, 85, 88, 91]]);
  }));
  return function createOrder(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
module.exports = {
  createOrder: createOrder
};