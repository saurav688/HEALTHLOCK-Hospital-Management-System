import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    age: { type: Number },
    gender: { type: String },
    phone: { type: String },
    address: { type: String },
    department: { type: String },
    doctor: { type: String },
    status: { type: String, default: "Active" },
  },
  { timestamps: true }
);

const Patient = mongoose.model("Patient", patientSchema);
export default Patient;
