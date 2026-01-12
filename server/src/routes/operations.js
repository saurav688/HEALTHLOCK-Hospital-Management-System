import express from "express";
import Operation from "../models/Operation.js";
import Patient from "../models/Patient.js";
import Room from "../models/Room.js";

const router = express.Router();

// GET all operations
router.get("/", async (req, res) => {
  try {
    const operations = await Operation.find()
      .populate("patient", "name age gender phone")
      .populate("room", "roomNumber type")
      .sort({ operationDate: 1 });
    res.json(operations);
  } catch (err) {
    console.error("Error fetching operations", err);
    res.status(500).json({ message: "Server error" });
  }
});

// CREATE operation
router.post("/", async (req, res) => {
  try {
    const { patient, operationType, doctor, operationDate, room, duration, notes, preOpInstructions, postOpInstructions } = req.body;

    // Validate required fields
    if (!patient || !operationType || !doctor || !operationDate) {
      return res.status(400).json({ 
        message: "Patient, operation type, doctor, and operation date are required" 
      });
    }

    // Verify patient exists
    const patientExists = await Patient.findById(patient);
    if (!patientExists) {
      return res.status(400).json({ 
        message: "Patient not found" 
      });
    }

    // Verify room exists if provided
    if (room) {
      const roomExists = await Room.findById(room);
      if (!roomExists) {
        return res.status(400).json({ 
          message: "Room not found" 
        });
      }
    }

    const operation = new Operation({
      patient,
      operationType,
      doctor,
      operationDate: new Date(operationDate),
      room: room || undefined,
      duration: duration || 60,
      notes,
      preOpInstructions,
      postOpInstructions
    });

    await operation.save();
    
    // Populate patient and room data for response
    await operation.populate("patient", "name age gender phone");
    if (operation.room) {
      await operation.populate("room", "roomNumber type");
    }
    
    res.status(201).json(operation);
  } catch (err) {
    console.error("Error creating operation", err);
    res.status(400).json({ message: "Invalid data", error: err.message });
  }
});

// GET single operation
router.get("/:id", async (req, res) => {
  try {
    const operation = await Operation.findById(req.params.id)
      .populate("patient", "name age gender phone address")
      .populate("room", "roomNumber type status");
    
    if (!operation) {
      return res.status(404).json({ message: "Operation not found" });
    }
    
    res.json(operation);
  } catch (err) {
    console.error("Error fetching operation", err);
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE operation
router.put("/:id", async (req, res) => {
  try {
    const operation = await Operation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate("patient", "name age gender phone")
     .populate("room", "roomNumber type");
    
    if (!operation) {
      return res.status(404).json({ message: "Operation not found" });
    }
    
    res.json(operation);
  } catch (err) {
    console.error("Error updating operation", err);
    res.status(400).json({ message: "Invalid data", error: err.message });
  }
});

// DELETE operation
router.delete("/:id", async (req, res) => {
  try {
    const operation = await Operation.findByIdAndDelete(req.params.id);
    
    if (!operation) {
      return res.status(404).json({ message: "Operation not found" });
    }
    
    res.json({ message: "Operation deleted successfully" });
  } catch (err) {
    console.error("Error deleting operation", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;