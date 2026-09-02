import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

const app=express();
dotenv.config();

app.use(express.json());


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