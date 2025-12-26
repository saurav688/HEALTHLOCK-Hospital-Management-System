import express from "express";
import Room from "../models/Room.js";

const router = express.Router();

router.get("/", async (_req, res) => {
  try {
    const rooms = await Room.find().sort({ roomNo: 1 });
    res.json(rooms);
  } catch (err) {
    console.error("Error fetching rooms", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const room = new Room(req.body);
    await room.save();
    res.status(201).json(room);
  } catch (err) {
    console.error("Error creating room", err);
    res.status(400).json({ message: "Invalid data", error: err.message });
  }
});

export default router;
