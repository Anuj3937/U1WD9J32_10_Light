const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel.js");
const Therapist = require("../models/therapistModel.js"); // Import therapist model

const protect = asyncHandler(async (req, res, next) => {
  let token = req.cookies.jwt;
  console.log("Token:", token);

  if (!token) {
    res.status(401);
    console.log("Cookies:", req.cookies);
    throw new Error("Not authorized, no token");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded);

    // Check if the user exists in the **User** collection
    const user = await User.findById(decoded.userId).select("-password");

    if (user) {
      req.user = user; // Attach user data to req
      return next();
    }

    // If not found in User, check in **Therapist** collection
    const therapist = await Therapist.findById(decoded.userId).select(
      "-password"
    );
    if (therapist) {
      req.therapist = therapist; // Attach therapist data to req
      return next();
    }

    res.status(401);
    throw new Error("Not authorized, user or therapist not found");
  } catch (error) {
    console.error(error);
    res.status(401);
    throw new Error("Not authorized, token failed");
  }
});

module.exports = { protect };
