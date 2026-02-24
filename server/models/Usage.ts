import mongoose from "mongoose";

const usageSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  dailyTokens: {
    type: Number,
    default: 0
  },
  monthlyTokens: {
    type: Number,
    default: 0
  },
  lastReset: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Usage", usageSchema);