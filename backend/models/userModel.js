const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
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

    paymentComplete: {
      type: Boolean,
      default: false,
      unique: false,
      sparse: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.add({
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
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Encrypt password using bcrypt
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

module.exports = User;
