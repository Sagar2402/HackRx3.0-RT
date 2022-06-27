const Transaction = require("../models/transaction.model");
const Razorpay = require("razorpay");
const shortid = require("shortid");
const crypto = require("crypto");
const { Insurance, User, Data } = require("../models");

//Registering Order on Razorpay server
const registerOrder = async (req, res) => {
  try {
    console.log("Entry");
    const razorpay = new Razorpay({
      key_id: process.env.key_id,
      key_secret: process.env.key_secret,
    });
    let { insurance_id } = req.body;
    let insurance = await Insurance.findById(insurance_id);
    console.log(insurance);
    if (!insurance)
      return res.status(400).send({
        success: false,
        msg: "No Insurance Found",
      });
    console.log("Selected Insurance", insurance);
    console.log(req.user.id);
    let user = await User.findOne({
      _id: req.user._id,
      insurance: insurance_id,
    });
    console.log("Found ", user);
    if (user) {
      console.log("Insurance already purchased", user);
      return res.status(400).send({
        success: false,
        msg: "Insurance already purchased",
      });
    }
    // TODO: Overhead razorpay charges to be added in ammout
    const options = {
      amount: insurance.price * 100,
      currency: "INR",
      receipt: shortid.generate(),
      payment_capture: true,
    };
    let response;
    await razorpay.orders.create(options, (err, order) => {
      if (err) {
        console.log("Razorpay Error :", err);
        return res
          .status(500)
          .send({ success: false, msg: "Razorpay Server Error" });
      }
      if (order) {
        response = order;
        console.log("Order generated : ", order);
      }
    });
    console.log(req.user);
    await razorpay.paymentLink.create({
      amount: insurance.price * 100,
      currency: "INR",
      accept_partial: false,
      description: "Insurance",
      customer: {
        name: req.user.name,
        email: req.user.email,
        contact: req.user.phone.toString(),
      },
      notify: {
        sms: true,
        email: true,
      },
      reminder_enable: true,
      notes: {
        policy_name: insurance.name,
      },
      callback_url: process.env.APP_URL,
      callback_method: "get",
    });
    console.log(response);
    console.log(insurance);
    //New Transaction Initiated
    let newTransaction = new Transaction({
      user: req.user.id,
      // user: '6228a7d17ff99d984e267927',  //For Testing
      insurance: insurance._id,
      name: insurance.name,
      orderId: response.id,
      amount: response.amount / 100,
      isPaymentConfirmed: false,
    });
    await newTransaction.save();
    console.log("New Transaction initiated", newTransaction);
    return res.status(200).send({
      success: true,
      msg: "Order Registered with Razorpay and New Transaction initiated",
      data: newTransaction,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ success: false, msg: "Internal Server Error" });
  }
};

//To verify payment has been registered
//In production razorpay webhook will hit this endpoint on money deducted by razorpay
const verifyPaymentAlternate = async (req, res) => {
  console.log(req.body);
  try {
    // confirmation to razorpay
    res.sendStatus(200);

    //Validating
    const secret = "Hj08oLHfEU";
    console.log(req.body);
    const hash = crypto.createHmac("sha256", secret);
    hash.update(JSON.stringify(req.body));
    const digest = hash.digest("hex");

    console.log(digest, req.headers["x-razorpay-signature"]);

    //If validation true confirm payment in DB
    if (digest === req.headers["x-razorpay-signature"]) {
      console.log("Valid Request,Confirming Payment");
      let transaction = await Transaction.findOne({
        orderId: req.body.payload.payment.entity.order_id,
      });
      if (transaction) {
        (transaction.isPaymentConfirmed = true),
          (transaction.transactionData = req.body);
        await transaction.save();
        let delegateCardID = transaction.delegateCard;

        let user = await User.findOneAndUpdate(
          { _id: transaction.user },
          { $push: { delegateCard: { card_id: delegateCardID } } }
        );
        console.log("Payment Success");
      }
    } else {
      console.log(
        "Payment validation attempt from unknown source,payment not registered"
      );
    }
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ success: false, msg: "Internal Server Error" });
  }
};

const verifyPayment = async (req, res) => {
  console.log(req.query);
  try {
    let {
      razorpay_payment_id,
      razorpay_signature,
      razorpay_payment_link_id,
      razorpay_payment_link_status,
    } = req.query;
    let order_id = razorpay_payment_link_id;
    //Validating
    // const secret = "HyE84sPchHUZ2mqDOyC5j97l"; //Secret Key

    // body = order_id + "|" + razorpay_payment_id;
    // var expectedSignature = crypto
    //   .createHmac("sha256", secret)
    //   .update(body.toString())
    //   .digest("hex");
    // console.log("sig received ", razorpay_signature);
    // console.log("sig generated ", expectedSignature);

    if (razorpay_payment_link_status == "paid") {
      let transaction = await Transaction.findOne({
        orderId: order_id,
        isPaymentConfirmed: false,
      });
      console.log("Transaction :", transaction);
      if (transaction) {
        await Data.create({
          insurance: transaction.insurance,
          payload: transaction.transactionData,
          user: transaction.user,
          transaction: transaction._id,
        });
        (transaction.isPaymentConfirmed = true),
          (transaction.transactionData = {
            order_id,
            razorpay_payment_id,
          });
        await transaction.save();
        console.log("Transaction ID ", transaction.insurance);
        let insurance = transaction.insurance;
        let user = await User.findOneAndUpdate(
          { _id: transaction.user },
          { $addToSet: { insurance: insurance } }
        );

        console.log("Payment Success");
        console.log("Transaction : ", transaction);
        console.log("User : ", user);
      }
      console.log("Payment Confirmed");
      return res.status(200).send({
        success: true,
        msg: "Payement Confirmed",
        data: transaction,
      });
    }
    return res
      .status(400)
      .send({ success: false, msg: "Payment validation failed" });
  } catch (error) {
    console.log(error);
    return res.send({
      success: false,
      msg: "Internal Server Error",
      error,
    });
  }
};

const createOrder = async (req) => {
  try {
    console.log("Entry");
    const razorpay = new Razorpay({
      key_id: process.env.key_id,
      key_secret: process.env.key_secret,
    });
    let { insurance_id, payload } = req.body;
    let insurance = await Insurance.findById(insurance_id);
    console.log(insurance);
    if (!insurance)
      return {
        success: false,
        msg: "No Insurance Found",
      };
    console.log("Selected Insurance", insurance);
    console.log(req.user.id);
    let user = await User.findOne({
      _id: req.user._id,
      insurance: insurance_id,
    });
    console.log("Found ", user);
    if (user) {
      console.log("Insurance already purchased", user);
      return {
        success: false,
        msg: "Insurance already purchased",
      };
    }
    // TODO: Overhead razorpay charges to be added in ammout
    // const options = {
    //   amount: insurance.price * 100,
    //   currency: "INR",
    //   receipt: shortid.generate(),
    //   payment_capture: true,
    // };
    let response;
    // await razorpay.orders.create(options, (err, order) => {
    //   if (err) {
    //     console.log("Razorpay Error :", err);
    //     return { success: false, msg: "Razorpay Server Error" };
    //   }
    //   if (order) {
    //     response = order;
    //     console.log("Order generated : ", order);
    //   }
    // });
    console.log(req.user);
    await razorpay.paymentLink.create(
      {
        amount: insurance.price * 100,
        currency: "INR",
        accept_partial: false,
        description: insurance.type + "_" + insurance.name,
        customer: {
          name: req.user.name,
          email: req.user.email,
          contact: req.user.phone.toString(),
        },
        notify: {
          sms: true,
          email: true,
        },
        reminder_enable: true,
        notes: {
          policy_name: insurance.name,
          policy_id: insurance._id,
        },
        callback_url: "http://localhost:5000/insurance/payment/callback",
        callback_method: "get",
      },
      (err, order) => {
        if (err) {
          console.log("Razorpay Error :", err);
          return { success: false, msg: "Razorpay Server Error" };
        }
        if (order) {
          response = order;
          console.log("Order generated : ", order);
        }
      }
    );
    console.log(response);
    console.log(insurance);
    //New Transaction Initiated
    let newTransaction = new Transaction({
      user: req.user.id,
      // user: '6228a7d17ff99d984e267927',  //For Testing
      insurance: insurance._id,
      transactionData: payload,
      name: insurance.name,
      orderId: response.id,
      amount: response.amount / 100,
      isPaymentConfirmed: false,
    });
    await newTransaction.save();
    console.log("New Transaction initiated", newTransaction);
    return {
      success: true,
      msg: "Order Registered with Razorpay and New Transaction initiated",
      data: newTransaction,
    };
  } catch (err) {
    console.log(err);
    return { success: false, msg: "Internal Server Error" };
  }
};

const paymentCallback = async (req, res) => {
  try {
    // console.log(req);
    const status = req.query.razorpay_payment_link_status;
    const orderId = req.query.razorpay_payment_id;
    console.log(req.query);
    if (status == "paid") {
      const transaction = await Transaction.findOne({ orderId });
      return res.json({ message: transaction });
    }
    return res.json({ message: "done" });
  } catch (error) {
    console.log(error);
    return res.send({
      success: false,
      msg: "Internal Server Error",
    });
  }
};

module.exports = {
  verifyPayment,
  registerOrder,
  verifyPaymentAlternate,
  createOrder,
  paymentCallback,
};
