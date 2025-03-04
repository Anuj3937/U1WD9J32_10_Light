const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const therapistSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    lisenceNumber: {
      type: String,
      required: true,
    },
    isPremium: {
      type: Boolean,
      default: false,
      unique: false,
      sparse: true,
    },
    isApproved: {
      type: Boolean,
      default: false,
      unique: false,
      sparse: true,
    },
    primarySpecialization: {
      type: String,
      required: true,
      unique: false,
    },
    professionalBio: {
      type: String,
      required: true,
      unique: false,
    },
    yearsOfExperience: {
      type: Number,
      required: true,
      unique: false,
    },
  },
  {
    timestamps: true,
  }
);

therapistSchema.add({
  razorpay_order_id: {
    type: String,
    sparse: true,
  },
  razorpay_payment_id: {
    type: String,
    sparse: true,
  },
  razorpay_signature: {
    type: String,
    sparse: true,
  },
});

// Match user entered password to hashed password in database
therapistSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Encrypt password using bcrypt
therapistSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const Therapist = mongoose.model("Therapist", therapistSchema);

module.exports = Therapist;
