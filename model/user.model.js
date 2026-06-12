const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username majburiy"],
      unique: true,
      trim: true,
      minlength: [3, "Username kamida 3 ta belgi bo'lishi kerak"],
    },
    email: {
      type: String,
      required: [true, "Email majburiy"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Parol majburiy"],
      minlength: [6, "Parol kamida 6 ta belgi bo'lishi kerak"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verifyCode: {
      type: String,
      default: null,
    },
    verifyCodeExpire: {
      type: Date,
      default: null,
    },
    resetPasswordCode: {
      type: String,
      default: null,
    },
    resetPasswordCodeExpire: {
      type: Date,
      default: null,
    },
    refreshToken: {
      type: String,
      default: null,
    },
  },
  { versionKey: false, timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = model("User", userSchema);
