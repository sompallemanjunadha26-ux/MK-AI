import express from "express";
import { protect } from "../middleware/authMiddleware";
import Usage from "../models/Usage";
import Chat from "../models/Chat";

const router = express.Router();

router.get("/monthly", protect, async (req: any, res) => {
  try {
    const userId = req.user._id;

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const chats = await Chat.aggregate([
      {
        $match: {
          user: userId,
          createdAt: { $gte: startOfMonth }
        }
      },
      {
        $group: {
          _id: { $dayOfMonth: "$createdAt" },
          totalTokens: { $sum: "$tokens" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      month: startOfMonth.getMonth() + 1,
      year: startOfMonth.getFullYear(),
      dailyBreakdown: chats
    });

  } catch (error) {
    res.status(500).json({ message: "Analytics failed" });
  }
});

export default router;