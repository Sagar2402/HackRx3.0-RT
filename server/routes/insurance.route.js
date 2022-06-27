const express = require("express");
const {
  userInsurance,
  listInsurance,
  buyInsurance,
} = require("../controllers/insurance.controller");
const {
  paymentCallback,
  verifyPayment,
} = require("../controllers/razorpay.controller");
const { fetchReferralDeets } = require("../controllers/referral.controller");
const { fetchUser } = require("../controllers/user.controller");
const auth = require("../middlewares/auth");
const router = express.Router();

router.get("/", listInsurance);
router.get("/user", auth(), userInsurance);
router.post("/buy", auth(), buyInsurance);
router.get("/payment/callback", verifyPayment);

router.route("/user-info").get(auth(), fetchUser);

router.route("/ref-info").get(auth(), fetchReferralDeets);
module.exports = router;
