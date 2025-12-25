const mongoose = require('mongoose')
const SePayTransactionModel = new mongoose.Schema(
      {
            _id: { type: String },
            gateway: { type: String },
            transactionDate: { type: String },
            accountNumber: { type: String },
            subAccount: { type: String },
            code: { type: String },
            content: { type: String },
            transferType: { type: String },
            description: { type: String },
            transferAmount: { type: Number },
            referenceCode: { type: String },
            accumulated: { type: Number }
      }
);

const SePayTransaction = mongoose.model('SePayTransaction', SePayTransactionModel);

module.exports = SePayTransaction;