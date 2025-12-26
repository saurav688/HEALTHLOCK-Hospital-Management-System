import express from "express";
import Doctor from "../models/Doctor.js";

const router = express.Router();

router.get("/", async (_req, res) => {
  try {
    const doctors = await Doctor.find().sort({ createdAt: -1 });
    res.json(doctors);
  } catch (err) {
    console.error("Error fetching doctors", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const doctor = new Doctor(req.body);
    await doctor.save();
    res.status(201).json(doctor);
  } catch (err) {
    console.error("Error creating doctor", err);
    res.status(400).json({ message: "Invalid data", error: err.message });
  }
});

export default router;
