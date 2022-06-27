const mongoose = require("mongoose");
const insuranceSchema = mongoose.Schema(
  {
    insuranceId: {
      type: String,
      required: true,
      index: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      default: 0,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    type: {
      type: String,
      enum: ["Motor", "Health", "Property"],
    },
    maxClaims: {
      type: Number,
      default: 1,
    },
    locations: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

const Insurance = mongoose.model("Insurance", insuranceSchema);

module.exports = Insurance;
