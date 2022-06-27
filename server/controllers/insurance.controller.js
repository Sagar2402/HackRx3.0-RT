const { Insurance, User, Data } = require("../models");
const Claim = require("../models/claim.model");
const { registerOrder, createOrder } = require("./razorpay.controller");

const listInsurance = async (req, res) => {
  try {
    const { type } = req.query;
    const obj = type ? { isActive: 1, type } : { isActive: 1 };
    const insuranceList = await Insurance.find(obj).sort({
      type: 1,
    });
    return res.json({
      success: true,
      message: "List of available Insurances",
      data: insuranceList,
    });
  } catch (error) {
    return res
      .status(500)
      .send({ success: false, msg: "Internal Server Error" });
  }
};

const userInsurance = async (req, res) => {
  try {
    const user = await Data.find({ user: req.user.id }).populate("insurance");
    return res.json({
      success: true,
      message: "List of user Insurances",
      data: user,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ success: false, msg: "Internal Server Error" });
  }
};

const buyInsurance = async (req, res) => {
  try {
    let { insurance_id } = req.body;
    let user = req.user.id;
    const insuranceExists = await User.exists({
      _id: user,
      insurance: insurance_id,
    });
    if (insuranceExists) {
      return res.json({
        success: false,
        message: "Insurance Already Purchased",
      });
    }
    const order = await createOrder(req);
    return res.json({
      success: true,
      message: "Insurance Request Raised",
      data: order,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ success: false, msg: "Internal Server Error" });
  }
};

module.exports = { listInsurance, userInsurance, buyInsurance };
