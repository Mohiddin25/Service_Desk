import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./api/authRoutes.js";

const app = express();
dotenv.config();

app.use(express.json());
app.use(cookieParser());

// Auth API Routes
app.use("/api/auth", authRoutes);



const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);

    process.exit(1);
  }
};

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    connectDB();
    console.log(`Server running on port ${PORT}`);
});