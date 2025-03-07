const express = require("express");
const {
  checkout,
  paymentVerification,
} = require("../controllers/paymentController.js");

const router = express.Router();

router.post(
  "/checkout",
  //protect,
  checkout
);

router.post(
  "/paymentverification",
  //protect,
  paymentVerification
);

module.exports = router;
