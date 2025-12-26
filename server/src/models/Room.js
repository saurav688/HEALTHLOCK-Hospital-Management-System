import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    roomNo: { type: String, required: true },
    type: { type: String },
    status: { type: String, default: "Available" },
    dailyCharge: { type: Number },
    otherCharges: { type: Number },
  },
  { timestamps: true }
);

const Room = mongoose.model("Room", roomSchema);
export default Room;
