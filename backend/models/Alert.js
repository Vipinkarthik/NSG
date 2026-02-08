import mongoose from "mongoose";

const alertSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["WEAPON_DETECTED", "BAG_DETECTED", "PERSON_DETECTED", "ANOMALY"],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    severity: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
      default: "MEDIUM",
    },
    camera: {
      type: Number,
      required: true,
    },
    cameraName: {
      type: String,
      default: "Camera Unknown",
    },
    weaponType: {
      type: String, // knife, gun, rifle, etc.
    },
    bagType: {
      type: String, // backpack, handbag, suitcase
    },
    personName: {
      type: String, // registered person name
    },
    personDOB: {
      type: String,
    },
    personCase: {
      type: String,
    },
    personLocation: {
      type: String,
    },
    confidence: {
      type: Number, // Detection confidence 0-100
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    imageData: {
      type: String, // Base64 encoded image
    },
    cameraLocation: {
      type: String, // GPS or description
    },
    resolved: {
      type: Boolean,
      default: false,
    },
    resolvedAt: {
      type: Date,
    },
    resolvedBy: {
      type: String,
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Alert", alertSchema);
