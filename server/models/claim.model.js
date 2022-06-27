const mongoose = require("mongoose");
const file = require("./file.model").FileSchema;
const claimSchema = mongoose.Schema(
  {
    claimId: {
      type: String,
      required: true,
      index: true,
      unique: true,
    },
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
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    isValid: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ["Raised", "Process", "Reviewed", "Completed", "Rejected"],
    },
    number: {
      type: Number,
      required: true,
    },
    files: [file],
    employees: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
        required: true,
      },
    ],
  },

  {
    timestamps: true,
  }
);

const Claim = mongoose.model("Claim", claimSchema);

module.exports = Claim;
