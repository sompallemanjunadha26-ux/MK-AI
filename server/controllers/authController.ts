import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: "7d"
  });
};

export const signup = async (req: Request, res: Response) => {
  try {
    const { username, password, phone } = req.body;

    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const user = await User.create({
      username,
      password: hashedPassword,
      phone,
      otp,
      otpExpiry: new Date(Date.now() + 10 * 60 * 1000)
    });

    console.log("OTP for user:", otp);

    res.status(201).json({
      message: "User created. Verify OTP.",
      userId: user._id
    });

  } catch (error) {
    res.status(500).json({ message: "Signup error" });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { username, otp } = req.body;

    const user = await User.findOne({ username });

    if (!user || user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpiry && user.otpExpiry < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    res.json({ message: "OTP verified successfully" });

  } catch (error) {
    res.status(500).json({ message: "OTP verification failed" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: "User is blocked" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = generateToken(user._id.toString());

    res.json({
      message: "Login successful",
      token,
      role: user.role
    });

  } catch (error) {
    res.status(500).json({ message: "Login error" });
  }
};