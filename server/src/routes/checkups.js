import express from "express";
import Checkup from "../models/Checkup.js";
import Patient from "../models/Patient.js";

const router = express.Router();

// GET all checkups
router.get("/", async (req, res) => {
  try {
    const checkups = await Checkup.find()
      .populate("patient", "name age gender phone")
      .sort({ createdAt: -1 });
    res.json(checkups);
  } catch (err) {
    console.error("Error fetching checkups", err);
    res.status(500).json({ message: "Server error" });
  }
});

// CREATE checkup
router.post("/", async (req, res) => {
  try {
    const { patient, doctor, diagnosis, status } = req.body;

    // Validate required fields
    if (!patient || !doctor || !diagnosis) {
      return res.status(400).json({ 
        message: "Patient, doctor, and diagnosis are required" 
      });
    }

    // Verify patient exists
    const patientExists = await Patient.findById(patient);
    if (!patientExists) {
      return res.status(400).json({ 
        message: "Patient not found" 
      });
    }

    const checkup = new Checkup({
      patient,
      doctor,
      diagnosis,
      status: status || "Pending"
    });

    await checkup.save();
    
    // Populate patient data for response
    await checkup.populate("patient", "name age gender phone");
    
    res.status(201).json(checkup);
  } catch (err) {
    console.error("Error creating checkup", err);
    res.status(400).json({ message: "Invalid data", error: err.message });
  }
});

// GET single checkup
router.get("/:id", async (req, res) => {
  try {
    const checkup = await Checkup.findById(req.params.id)
      .populate("patient", "name age gender phone");
    
    if (!checkup) {
      return res.status(404).json({ message: "Checkup not found" });
    }
    
    res.json(checkup);
  } catch (err) {
    console.error("Error fetching checkup", err);
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE checkup
router.put("/:id", async (req, res) => {
  try {
    const checkup = await Checkup.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate("patient", "name age gender phone");
    
    if (!checkup) {
      return res.status(404).json({ message: "Checkup not found" });
    }
    
    res.json(checkup);
  } catch (err) {
    console.error("Error updating checkup", err);
    res.status(400).json({ message: "Invalid data", error: err.message });
  }
});

// DELETE checkup
router.delete("/:id", async (req, res) => {
  try {
    const checkup = await Checkup.findByIdAndDelete(req.params.id);
    
    if (!checkup) {
      return res.status(404).json({ message: "Checkup not found" });
    }
    
    res.json({ message: "Checkup deleted successfully" });
  } catch (err) {
    console.error("Error deleting checkup", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;