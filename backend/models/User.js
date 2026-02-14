const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const userDB = require("../config/userDB");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    roles: {
      type: [String],
      default: ["user"],
    },

    createdFrom: {
      type: String,
      required: true,
      default: "bbscart",
    },

    referralCode: {
      type: String,
      default: null,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    // login tracking
    loginAttempts: {
      type: Number,
      default: 0,
    },

    lastLoginAt: {
      type: Date,
      default: null,
    },

    // email verification
    emailVerificationToken: {
      type: String,
      default: null,
    },
    emailVerificationExpires: {
      type: Date,
      default: null,
    },
    // password reset OTP
    resetPasswordOTP: {
      type: String,
      default: null,
    },
    resetPasswordOTPExpires: {
      type: Date,
      default: null,
    },
    // login OTP
    loginOTP: {
      type: String,
      default: null,
    },
    loginOTPExpires: {
      type: Date,
      default: null,
    },
    profileImage: {
      type: String,
      default: null, // store a URL to the uploaded avatar
    },
    status: { type: String, default: "active" },
  },
  { timestamps: true }
);

// hash password
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = userDB.model("User", UserSchema);
