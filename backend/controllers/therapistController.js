const asyncHandler = require("express-async-handler");
const Therapist = require("../models/therapistModel.js");
const generateToken = require("../utils/generateToken.js");

// @desc    Authenticate therapist & get token
// @route   POST /api/therapists/auth
// @access  Public
const authTherapist = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const therapist = await Therapist.findOne({ email });

  if (therapist && (await therapist.matchPassword(password))) {
    generateToken(res, therapist._id);
    res.json({
      _id: therapist._id,
      firstName: therapist.firstName,
      lastName: therapist.lastName,
      email: therapist.email,
      isApproved: therapist.isApproved,
      isPremium: therapist.isPremium,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc    Register a new therapist
// @route   POST /api/therapists
// @access  Public
const registerTherapist = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    lisenceNumber,
    primarySpecialization,
    professionalBio,
    yearsOfExperience,
  } = req.body;

  const therapistExists = await Therapist.findOne({ email });

  if (therapistExists) {
    res.status(400);
    throw new Error("Therapist already exists");
  }

  const therapist = await Therapist.create({
    firstName,
    lastName,
    email,
    password,
    lisenceNumber,
    primarySpecialization,
    professionalBio,
    yearsOfExperience,
  });

  if (therapist) {
    generateToken(res, therapist._id);

    res.status(201).json({
      _id: therapist._id,
      firstName: therapist.firstName,
      lastName: therapist.lastName,
      email: therapist.email,
      isApproved: therapist.isApproved,
      isPremium: therapist.isPremium,
    });
  } else {
    res.status(400);
    throw new Error("Invalid therapist data");
  }
});

// @desc    Logout therapist / clear cookie
// @route   POST /api/therapists/logout
// @access  Public
const logoutTherapist = (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
};

// @desc    Get therapist profile
// @route   GET /api/therapists/profile
// @access  Private
const getTherapistProfile = asyncHandler(async (req, res) => {
  const therapist = await Therapist.findById(req.therapist._id);

  if (therapist) {
    res.json({
      _id: therapist._id,
      firstName: therapist.firstName,
      lastName: therapist.lastName,
      email: therapist.email,
      lisenceNumber: therapist.lisenceNumber,
      primarySpecialization: therapist.primarySpecialization,
      professionalBio: therapist.professionalBio,
      yearsOfExperience: therapist.yearsOfExperience,
      isApproved: therapist.isApproved,
      isPremium: therapist.isPremium,
    });
  } else {
    res.status(404);
    throw new Error("Therapist not found");
  }
});

// @desc    Update therapist profile
// @route   PUT /api/therapists/profile
// @access  Private
const updateTherapistProfile = asyncHandler(async (req, res) => {
  try {
    const therapist = await Therapist.findById(req.therapist._id);

    if (therapist) {
      therapist.firstName = req.body.firstName || therapist.firstName;
      therapist.lastName = req.body.lastName || therapist.lastName;
      therapist.email = req.body.email || therapist.email;
      therapist.lisenceNumber =
        req.body.lisenceNumber || therapist.lisenceNumber;
      therapist.primarySpecialization =
        req.body.primarySpecialization || therapist.primarySpecialization;
      therapist.professionalBio =
        req.body.professionalBio || therapist.professionalBio;
      therapist.yearsOfExperience =
        req.body.yearsOfExperience || therapist.yearsOfExperience;
      therapist.isApproved =
        req.body.isApproved !== undefined
          ? req.body.isApproved
          : therapist.isApproved;
      therapist.isPremium =
        req.body.isPremium !== undefined
          ? req.body.isPremium
          : therapist.isPremium;

      if (req.body.password) {
        therapist.password = req.body.password;
      }

      const updatedTherapist = await therapist.save();

      res.json({
        _id: updatedTherapist._id,
        firstName: updatedTherapist.firstName,
        lastName: updatedTherapist.lastName,
        email: updatedTherapist.email,
        isApproved: updatedTherapist.isApproved,
        isPremium: updatedTherapist.isPremium,
      });
    } else {
      res.status(404);
      throw new Error("Therapist not found");
    }
  } catch (error) {
    console.error("Error in updateTherapistProfile:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = {
  authTherapist,
  registerTherapist,
  logoutTherapist,
  getTherapistProfile,
  updateTherapistProfile,
};
