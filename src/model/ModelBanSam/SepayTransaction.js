// const mongoose = require('mongoose')

// const SePayTransactionModel = new mongoose.Schema(
//   {
//     sepayId: { type: Number },  // id do SePay trả về
//     gateway: { type: String },
//     transactionDate: { type: String },
//     accountNumber: { type: String },
//     subAccount: { type: String },
//     code: { type: String },
//     content: { type: String },
//     transferType: { type: String },
//     description: { type: String },
//     transferAmount: { type: Number },
//     referenceCode: { type: String },
//     accumulated: { type: Number }
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model('SePayTransaction', SePayTransactionModel);


const mongoose = require("mongoose");

const sePayTransactionSchema = new mongoose.Schema(
  {
    sepayId: {
      type: Number,
      required: true,
      unique: true, // ✅ Đảm bảo không trùng lặp giao dịch
      index: true,  // ✅ Tăng tốc độ query
    },
    gateway: {
      type: String,
      required: true,
    },
    transactionDate: {
      type: Date,
      required: true,
    },
    accountNumber: {
      type: String,
      required: true,
    },
    subAccount: {
      type: String,
    },
    code: {
      type: String,
    },
    content: {
      type: String,
      required: true,
      index: true, // ✅ Index để tìm kiếm theo nội dung (mã đơn hàng)
    },
    transferType: {
      type: String,
    },
    description: {
      type: String,
    },
    transferAmount: {
      type: Number,
      required: true,
    },
    referenceCode: {
      type: String,
    },
    accumulated: {
      type: Number,
    },
    // ✅ Thêm trường để tracking
    processedAt: {
      type: Date,
      default: Date.now,
    },
    orderId: {
      type: String,
      index: true, // ✅ Link đến mã đơn hàng
    },
  },
  {
    timestamps: true, // ✅ Tự động thêm createdAt, updatedAt
  }
);

// ✅ Compound index cho query phức tạp
sePayTransactionSchema.index({ gateway: 1, transactionDate: -1 });
sePayTransactionSchema.index({ accountNumber: 1, transactionDate: -1 });

const SePayTransaction = mongoose.model("SePayTransaction", sePayTransactionSchema);

module.exports = SePayTransaction;