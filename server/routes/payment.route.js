const express = require("express");
const { registerOrder } = require("../controllers/razorpay.controller");
const auth = require("../middlewares/auth");

const router = express.Router();

router.post("/", auth(), registerOrder);
module.exports = router;
