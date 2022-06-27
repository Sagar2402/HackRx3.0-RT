const mongoose = require("mongoose");
const dataSchema = mongoose.Schema(
  {
    insurance: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Insurance",
      required: true,
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    claims: {
      type: Number,
      default: 0,
    },
    payload: { type: Object },
  },
  {
    timestamps: true,
  }
);
const Data = mongoose.model("Data", dataSchema);

module.exports = Data;
