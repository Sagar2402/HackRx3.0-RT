const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { userService, referralService } = require("../services");
const { Referral } = require("../models");

const createReferralCode = catchAsync(async (req, res) => {
  const referralCode = await referralService.createReferralCode(
    req.body.userId
  );
  if (!referralCode) {
    throw new ApiError(
      httpStatus.UNPROCESSABLE_ENTITY,
      "Referral Code creation failed"
    );
  }
  res.status(httpStatus.CREATED).send(referralCode);
});

const getReferralDetail = catchAsync(async (req, res) => {
  const referralCodeDoc = await referralService.getReferralCodeDetail(
    req.params.referralCode
  );
  if (!referralCodeDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, "Referral Code not found");
  }
  res.send(referralCodeDoc);
});

const updateReferralUsage = catchAsync(async (req, res) => {
  const updatedReferralCode = await referralService.updateReferralCodeUsage(
    req.body.referralCode,
    req.body.userId
  );
  res.send(updatedReferralCode);
});

const deleteReferralCode = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

const fetchReferralDeets = async (req, res) => {
  try {
    const ref = await Referral.findOne({ owner: req.user.id });
    // if (!req.user) {
    //   throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    // }
    return res.send({ ref });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ success: false, msg: "Internal Server Error" });
  }
};

module.exports = {
  createReferralCode,
  getReferralDetail,
  updateReferralUsage,
  deleteReferralCode,
  fetchReferralDeets,
};
