const dotenv = require("dotenv");
const Razorpay = require("razorpay");

dotenv.config();

const razorPayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_APT_SECRET,
});

module.exports = { razorPayInstance };
