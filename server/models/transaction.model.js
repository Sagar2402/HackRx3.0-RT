const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    insurance: {
      type: mongoose.Types.ObjectId,
      ref: "Insurance",
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    transaction: {
      type: mongoose.Types.ObjectId,
      ref: "Transaction",
    },
    orderId: {
      type: String,
    },
    transactionData: {
      type: Object,
    },
    amount: {
      type: String,
    },
    isPaymentConfirmed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = Transaction = mongoose.model("Transaction", transactionSchema);
