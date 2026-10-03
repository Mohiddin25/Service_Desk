import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./api/authRoutes.js";
import ticketRoutes from "./api/ticketRoutes.js";
import assetRoutes from "./api/assetRoutes.js";
import departmentRoutes from "./api/departmentRoutes.js";
import aiRoutes from "./api/aiRoutes.js";

dotenv.config();

const app = express();

const allowedOrigins = [
  "https://service-desk-puce.vercel.app",
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:4173",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:5173",
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests or same-origin requests (curl, Postman, server-to-server)
    if (!origin) return callback(null, true);

    const cleanOrigin = origin.replace(/\/$/, "");
    if (
      allowedOrigins.includes(cleanOrigin) ||
      /\.vercel\.app$/.test(cleanOrigin) ||
      cleanOrigin.includes("localhost") ||
      cleanOrigin.includes("127.0.0.1") ||
      (process.env.FRONTEND_URL && cleanOrigin === process.env.FRONTEND_URL.replace(/\/$/, "")) ||
      (process.env.CLIENT_URL && cleanOrigin === process.env.CLIENT_URL.replace(/\/$/, ""))
    ) {
      return callback(null, true);
    }
    // Permissive fallback reflecting request origin for ease of development & preview deployments
    return callback(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
  ],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(cors({ origin: 'https://service-desk-puce.vercel.app', credentials: true }));
app.use(cookieParser());

// Root and Health Check Endpoints
app.get("/", (req, res) => {
  res.json({
    status: "online",
    message: "Service Desk API is running",
    cors: "configured",
    frontend: "https://service-desk-puce.vercel.app",
    timestamp: new Date().toISOString(),
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy", timestamp: new Date().toISOString() });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/assets", assetRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/ai", aiRoutes);

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