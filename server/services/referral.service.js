const httpStatus = require('http-status');
const { Referral } = require('../models');
const getRandomString = require('../utils/randomStringGenerator');
const ApiError = require('../utils/ApiError');

const createReferralCode = async (userId) => {
  const newReferralCode = getRandomString();
  const referralDetail = {
    code: newReferralCode,
    owner: userId,
    totalUses: 0,
  };
  return Referral.create(referralDetail);
};

const updateReferralCodeUsage = async (referralCode, user) => {
  const referralDoc = await Referral.findOne({ code: referralCode, blacklisted: false });
  if (!referralDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Referral code not found');
  } else {
    const userDetail = {
      user: user.id,
      email: user.email,
      name: user.name,
      time: Date.now(),
    };
    const newUpdatedReferralDoc = {
      totalUses: +referralDoc.totalUses + 1,
      usedBy: referralDoc.usedBy.concat(userDetail),
    };
    Object.assign(referralDoc, newUpdatedReferralDoc);
    return referralDoc.save();
  }
};

const verifyReferralCode = async (referralCode) => {
  const referralDoc = await Referral.findOne({ code: referralCode, blacklisted: false });
  // Max used for referral code set as 5 Todo: Update it as needed or move it to environment variable
  if (!referralDoc || +referralCode.totalUses > 5) {
    throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'Referral code not found or expired');
  }
  return referralDoc;
};


const getReferralCodeDetail = async (referralCode) => {
  return Referral.findOne({ code: referralCode, blacklisted: false });
};

module.exports = {
  getReferralCodeDetail,
  createReferralCode,
  updateReferralCodeUsage,
  verifyReferralCode,
};
