const crypto = require("crypto");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel.js");
const { razorPayInstance } = require("../config/razorpayInstance.js");

// @desc    Checkout Handler
// @route   POST /api/payment/checkout
// @access  Private
const checkout = asyncHandler(async (req, res) => {
  const options = {
    amount: Number(req.body.amount * 100),
    currency: "INR",
  };
  const order = await razorPayInstance.orders.create(options);
  console.log(order);

  res.status(200).json({
    success: true,
    order,
  });
});

// @desc    Verify Incoming Payment
// @route   POST /api/payment/paymentverification
// @access  Private
const paymentVerification = asyncHandler(async (req, res) => {
  try {
    const body =
      req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_APT_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === req.body.razorpay_signature;

    const user = await User.findById(req.body._id);
    console.log("User fetched for payment:", user);

    if (user && isAuthentic) {
      user.razorpay_order_id =
        req.body.razorpay_order_id || user.razorpay_order_id;
      user.razorpay_payment_id =
        req.body.razorpay_payment_id || user.razorpay_payment_id;
      user.razorpay_signature =
        req.body.razorpay_signature || user.razorpay_signature;
      user.paymentComplete = "true";

      const updatedUser = await user.save();
      console.log("Processed user Payment:", updatedUser);

      res.json({
        _id: updatedUser._id,
        razorpay_order_id: updatedUser.razorpay_order_id,
        razorpay_payment_id: updatedUser.razorpay_payment_id,
        paymentComplete: updatedUser.paymentComplete,
      });
    } else {
      res.status(400).json({
        success: false,
      });
      throw new Error("Payment Error");
    }
  } catch (error) {
    console.error("Error in paymentVerification:", error); // Log any caught errors
    res.status(500).json({ message: "Server Error" });
  }
});

/* export const paymentVerification = async (req, res) => {

  const body = req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_APT_SECRET)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    // Database comes here

    await Payment.create({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    res.redirect(
      `http://localhost:3000/paymentsuccess?reference=${razorpay_payment_id}`
    );
  } else {
    res.status(400).json({
      success: false,
    });
  }
}; */

module.exports = { checkout, paymentVerification };
