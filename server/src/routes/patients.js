import express from "express";
import Patient from "../models/Patient.js";

const router = express.Router();

// GET all patients
router.get("/", async (req, res) => {
  try {
    const patients = await Patient.find().sort({ createdAt: -1 });
    res.json(patients);
  } catch (err) {
    console.error("Error fetching patients", err);
    res.status(500).json({ message: "Server error" });
  }
});

// CREATE patient
router.post("/", async (req, res) => {
  try {
    const patient = new Patient(req.body);
    await patient.save();
    res.status(201).json(patient);
  } catch (err) {
    console.error("Error creating patient", err);
    res.status(400).json({ message: "Invalid data", error: err.message });
  }
});

// GET single patient
router.get("/:id", async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: "Patient not found" });
    res.json(patient);
  } catch (err) {
    console.error("Error fetching patient", err);
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE patient
router.put("/:id", async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!patient) return res.status(404).json({ message: "Patient not found" });
    res.json(patient);
  } catch (err) {
    console.error("Error updating patient", err);
    res.status(400).json({ message: "Invalid data", error: err.message });
  }
});

// DELETE patient
router.delete("/:id", async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) return res.status(404).json({ message: "Patient not found" });
    res.json({ message: "Patient deleted" });
  } catch (err) {
    console.error("Error deleting patient", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
