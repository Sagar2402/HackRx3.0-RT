const express = require("express");
const {
  createClaim,
  addAttachment,
  listClaims,
} = require("../controllers/claim.controller");
const auth = require("../middlewares/auth");
const router = express.Router();

router.post("/", auth(), createClaim);
router.post("/", auth(), addAttachment);
router.get("/", auth(), listClaims);
module.exports = router;
