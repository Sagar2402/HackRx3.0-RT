const express = require("express");
const authRoute = require("./auth.route");
const userRoute = require("./user.route");
const paymentRoute = require("./payment.route");
const claimRoute = require("./claim.route");
const insuranceRoute = require("./insurance.route");
const config = require("../config/config");

const router = express.Router();

const defaultRoutes = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/users",
    route: userRoute,
  },
  {
    path: "/payment",
    route: paymentRoute,
  },
  {
    path: "/claim",
    route: claimRoute,
  },
  {
    path: "/insurance",
    route: insuranceRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === "development") {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
