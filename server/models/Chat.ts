import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    chatId: String,
    userMessage: String,
    aiMessage: String,
    tokens: Number,
  },
  { timestamps: true }
);

export default mongoose.model("Chat", chatSchema);