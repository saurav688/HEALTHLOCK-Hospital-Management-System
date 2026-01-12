import express from "express";
import Department from "../models/Department.js";

const router = express.Router();

router.get("/", async (_req, res) => {
  try {
    const departments = await Department.find().sort({ name: 1 });
    res.json(departments);
  } catch (err) {
    console.error("Error fetching departments", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const department = new Department(req.body);
    await department.save();
    res.status(201).json(department);
  } catch (err) {
    console.error("Error creating department", err);
    res.status(400).json({ message: "Invalid data", error: err.message });
  }
});

// DELETE department
router.delete("/:id", async (req, res) => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id);
    
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }
    
    res.json({ message: "Department deleted successfully" });
  } catch (err) {
    console.error("Error deleting department", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;