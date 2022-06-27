const mongoose = require('mongoose');
const referralSchema = mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      index: true,
      unique: true,
    },
    owner: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
      private: true,
    },
    totalUses: {
      type: Number,
      default: 0,
      required: true,
    },
    usedBy: [
      {
        user: {
          type: mongoose.SchemaTypes.ObjectId,
          ref: 'User',
          required: true,
        },
        email: {
          type: String,
          lowercase: true,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        time: {
          type: Date,
          required: true,
        },
      },
    ],
    blacklisted: {
      type: Boolean,
      default: false,
      private: true,
    },
  },
  {
    timestamps: true,
  }
);


const Referral = mongoose.model('Referral', referralSchema);

module.exports = Referral;
