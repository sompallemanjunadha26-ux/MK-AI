import express from "express";
import { protect } from "../middleware/authMiddleware";
import { getUsageStats } from "../services/usageService";

const router = express.Router();

router.get("/stats", protect, async (req: any, res) => {
  try {
    const stats = await getUsageStats(req.user._id.toString());
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch usage stats" });
  }
});

export default router;