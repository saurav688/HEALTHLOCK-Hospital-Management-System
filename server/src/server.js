import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import patientRoutes from "./routes/patients.js";
import doctorRoutes from "./routes/doctors.js";
import departmentRoutes from "./routes/departments.js";
import roomRoutes from "./routes/rooms.js";
import admissionRoutes from "./routes/admissions.js";
import operationRoutes from "./routes/operations.js";
import checkupRoutes from "./routes/checkups.js";
import medicalAssistantRoutes from "./routes/medical-assistant.js";
import authRoutes from "./routes/auth.js";
import { generalLimiter } from "./middleware/rateLimiter.js";
import { initializeGemini } from "./utils/geminiService.js";
import emailService from "./utils/emailService.js";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from server directory (one level up from src)
dotenv.config({ path: join(__dirname, '..', '.env') });

const app = express();

app.use(cors());
app.use(express.json());
app.use(generalLimiter); // Apply rate limiting to all routes

const PORT = process.env.PORT || 5000;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/healthlock";

// Simple health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", message: "HealthLock backend running" });
});

console.log("Registering routes...");
app.use("/api/patients", patientRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/admissions", admissionRoutes);
app.use("/api/operations", operationRoutes);
app.use("/api/checkups", checkupRoutes);
app.use("/api/medical-assistant", medicalAssistantRoutes);
app.use("/api/auth", authRoutes);

console.log("Starting server...");

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    
    // Initialize Gemini AI
    console.log("\n🤖 Initializing AI Services...");
    initializeGemini();

    // Initialize Email Service (after dotenv is loaded)
    console.log("📧 Initializing Email Service...");
    emailService.initializeTransporter();
    
    app.listen(PORT, () => {
      console.log(`\n✅ Server listening on port ${PORT}`);
      console.log(`📍 API Base: http://localhost:${PORT}/api`);
      console.log(`🏥 HealthLock Hospital Management System Ready\n`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
