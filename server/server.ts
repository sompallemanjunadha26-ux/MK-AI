import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import aiRoutes from "./routes/aiRoutes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.log("MongoDB Error:", err));

// Routes
app.use("/api/ai", aiRoutes);

app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

// ✅ Render + Local Compatible Port Fix
const PORT: number = parseInt(process.env.PORT || "5000", 10);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});