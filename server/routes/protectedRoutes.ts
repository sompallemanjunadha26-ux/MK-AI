import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/profile", protect, (req: any, res) => {
  res.json({
    message: "Protected route accessed",
    user: req.user
  });
});

router.get("/admin", protect, adminOnly, (req: any, res) => {
  res.json({
    message: "Admin route accessed"
  });
});

export default router;