import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

/* ================== MONGODB ================== */

mongoose.connect(process.env.MONGO_URI as string)
.then(()=> console.log("MongoDB Connected"))
.catch(err=> console.log(err));

/* ================== TEST ROUTE ================== */

app.get("/", (req,res)=>{
  res.send("Backend Working");
});

/* ================== USER MODEL ================== */

const UserSchema = new mongoose.Schema({
  name:String,
  email:{ type:String, unique:true },
  password:String
});

const User = mongoose.model("User", UserSchema);

/* ================== REGISTER ================== */

app.post("/api/auth/register", async (req,res)=>{
  try{
    const {name,email,password} = req.body;

    const hashed = await bcrypt.hash(password,10);

    await User.create({
      name,
      email,
      password:hashed
    });

    res.json({message:"Registered Successfully"});
  }catch(err){
    res.status(500).json({message:"Register Error"});
  }
});

/* ================== LOGIN ================== */

app.post("/api/auth/login", async (req,res)=>{
  try{
    const {email,password} = req.body;

    const user = await User.findOne({email});
    if(!user) return res.status(404).json({message:"User not found"});

    const match = await bcrypt.compare(password,user.password);
    if(!match) return res.status(400).json({message:"Wrong password"});

    const token = jwt.sign(
      {id:user._id},
      process.env.JWT_SECRET as string,
      {expiresIn:"7d"}
    );

    res.json({
      token,
      user:{
        id:user._id,
        name:user.name,
        email:user.email
      }
    });

  }catch(err){
    res.status(500).json({message:"Login Error"});
  }
});

/* ================== SERVER ================== */

const PORT = parseInt(process.env.PORT || "5000");

app.listen(PORT,()=>{
  console.log("Server running on",PORT);
});