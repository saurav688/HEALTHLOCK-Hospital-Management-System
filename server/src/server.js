import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import patientRoutes from "./routes/patients.js";
import doctorRoutes from "./routes/doctors.js";
import departmentRoutes from "./routes/departments.js";
import roomRoutes from "./routes/rooms.js";
import admissionRoutes from "./routes/admissions.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/medicare";

// Simple health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", message: "Medicare backend running" });
});

app.use("/api/patients", patientRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/admissions", admissionRoutes);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
