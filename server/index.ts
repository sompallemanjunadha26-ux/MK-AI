import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import OpenAI from "openai";
import multer from "multer";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI as string)
  .then(() => console.log("MongoDB Connected"));

interface IUser extends mongoose.Document {
  email: string;
  password: string;
}

const User = mongoose.model<IUser>("User", new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
}));

interface IMessage {
  role: "user" | "assistant";
  content: string;
}

interface IChat extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  messages: IMessage[];
}

const Chat = mongoose.model<IChat>("Chat", new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  title: String,
  messages: [
    {
      role: String,
      content: String
    }
  ]
}, { timestamps: true }));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const auth = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

const upload = multer({ dest: "uploads/" });

app.post("/api/auth/register", async (req, res) => {
  const { email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  await User.create({ email, password: hashed });
  res.json({ message: "User created" });
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "User not found" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: "Wrong password" });

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET as string,
    { expiresIn: "7d" }
  );

  res.json({ token });
});

app.post("/api/chat/new", auth, async (req: any, res) => {
  const chat = await Chat.create({
    userId: req.user.id,
    title: "New Chat",
    messages: []
  });
  res.json(chat);
});

app.get("/api/chat/history", auth, async (req: any, res) => {
  const chats = await Chat.find({ userId: req.user.id }).sort({ createdAt: -1 });
  res.json(chats);
});

app.post("/api/ai/:chatId", auth, async (req: any, res) => {
  const { message } = req.body;
  const chat = await Chat.findById(req.params.chatId);

  if (!chat) return res.status(404).json({ message: "Chat not found" });

  chat.messages.push({ role: "user", content: message });

  // 🔥 FIX: convert mongoose docs → plain objects
  const formattedMessages = chat.messages.map((m: any) => ({
    role: m.role,
    content: m.content
  }));

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: formattedMessages
  });

  const reply = completion.choices[0].message.content as string;

  chat.messages.push({ role: "assistant", content: reply });
  await chat.save();

  res.json({ reply });
});

app.post("/api/upload", auth, upload.single("file"), async (req: any, res) => {
  res.json({ message: "File uploaded", file: req.file });
});

// 🔥 FIX PORT TYPE
const PORT: number = parseInt(process.env.PORT || "5000", 10);

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port " + PORT);
});