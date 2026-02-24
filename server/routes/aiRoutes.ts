import express from "express";
import axios from "axios";
import Chat from "../models/Chat";

const router = express.Router();

router.post("/", async (req: any, res: any) => {
  try {
    const { message, chatId } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message required" });
    }

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: process.env.GROQ_MODEL,
        messages: [{ role: "user", content: message }],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
      }
    );

    const aiReply =
      response.data.choices?.[0]?.message?.content || "No response";

    const tokens = response.data.usage?.total_tokens || 0;

    await Chat.create({
      chatId,
      userMessage: message,
      aiMessage: aiReply,
      tokens,
    });

    res.json({ reply: aiReply, tokens });
  } catch (error: any) {
    console.log("AI ERROR:", error.response?.data || error.message);
    res.status(500).json({ message: "AI failed" });
  }
});

router.get("/history/:chatId", async (req: any, res: any) => {
  const chats = await Chat.find({ chatId: req.params.chatId }).sort({
    createdAt: 1,
  });
  res.json(chats);
});

router.get("/all-chats", async (req: any, res: any) => {
  const chats = await Chat.distinct("chatId");
  res.json(chats);
});

export default router;   // 🔥 VERY IMPORTANT LINE