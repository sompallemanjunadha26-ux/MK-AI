import express from "express";
import { protect } from "../middleware/authMiddleware";
import Chat from "../models/Chat";

const router = express.Router();

router.get("/history", protect, async (req: any, res) => {
  try {
    const chats = await Chat.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch history" });
  }
});

export default router;