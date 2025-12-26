import mongoose from "mongoose";

const admissionSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    room: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
    admissionDate: { type: Date, default: Date.now },
    reason: { type: String },
    status: { type: String, default: "Admitted" },
  },
  { timestamps: true }
);

const Admission = mongoose.model("Admission", admissionSchema);
export default Admission;
