import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    tokensUsed: { type: Number, default: 0 },

    otp: { type: String },
    otpExpiry: { type: Date },

    isBlocked: { type: Boolean, default: false },
    role: { type: String, default: "user" }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);