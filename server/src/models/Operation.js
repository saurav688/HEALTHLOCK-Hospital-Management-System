import mongoose from "mongoose";

const operationSchema = new mongoose.Schema(
  {
    patient: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Patient", 
      required: true 
    },
    operationType: { 
      type: String, 
      required: true 
    },
    doctor: { 
      type: String, 
      required: true 
    },
    operationDate: { 
      type: Date, 
      required: true 
    },
    status: { 
      type: String, 
      enum: ["Scheduled", "In Progress", "Completed", "Cancelled"], 
      default: "Scheduled" 
    },
    room: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Room" 
    },
    duration: { 
      type: Number, // Duration in minutes
      default: 60 
    },
    notes: { 
      type: String 
    },
    preOpInstructions: { 
      type: String 
    },
    postOpInstructions: { 
      type: String 
    }
  },
  { timestamps: true }
);

const Operation = mongoose.model("Operation", operationSchema);
export default Operation;