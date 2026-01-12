import mongoose from "mongoose";

const checkupSchema = new mongoose.Schema(
  {
    patient: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Patient", 
      required: true 
    },
    doctor: { 
      type: String, 
      required: true 
    },
    diagnosis: { 
      type: String, 
      required: true 
    },
    status: { 
      type: String, 
      enum: ["Pending", "In Progress", "Completed"], 
      default: "Pending" 
    },
    checkupDate: { 
      type: Date, 
      default: Date.now 
    },
    notes: { 
      type: String 
    }
  },
  { timestamps: true }
);

const Checkup = mongoose.model("Checkup", checkupSchema);
export default Checkup;