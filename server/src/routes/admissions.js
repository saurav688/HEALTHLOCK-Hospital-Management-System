import express from "express";
import Admission from "../models/Admission.js";

const router = express.Router();

router.get("/", async (_req, res) => {
  try {
    const admissions = await Admission.find()
      .populate("patient", "name age gender phone department")
      .populate("doctor", "name specialization department")
      .populate("room", "roomNo type status")
      .sort({ createdAt: -1 });

    res.json(admissions);
  } catch (err) {
    console.error("Error fetching admissions", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const admission = new Admission(req.body);
    await admission.save();
    res.status(201).json(admission);
  } catch (err) {
    console.error("Error creating admission", err);
    res.status(400).json({ message: "Invalid data", error: err.message });
  }
});

// DELETE admission
router.delete("/:id", async (req, res) => {
  try {
    const admission = await Admission.findByIdAndDelete(req.params.id);
    
    if (!admission) {
      return res.status(404).json({ message: "Admission not found" });
    }
    
    res.json({ message: "Admission deleted successfully" });
  } catch (err) {
    console.error("Error deleting admission", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
