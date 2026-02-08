import express from "express";
import {
  getAllAlerts,
  getAlertsByCamera,
  getAlertById,
  createAlert,
  createBatchAlerts,
  updateAlert,
  deleteAlert,
  getAlertStats,
  getAlertsForReport,
  getDailyDetectionStats,
} from "../controllers/alertController.js";

const router = express.Router();

// Get all alerts with filtering
router.get("/", getAllAlerts);

// Get daily detection stats for heatmap
router.get("/daily-stats", getDailyDetectionStats);

// Get alerts for report generation
router.get("/report", getAlertsForReport);

// Get alert statistics
router.get("/stats", getAlertStats);

// Get alerts by camera
router.get("/camera/:cameraId", getAlertsByCamera);

// Get alert by ID
router.get("/:id", getAlertById);

// Create alert
router.post("/", createAlert);

// Create batch alerts
router.post("/batch", createBatchAlerts);

// Update alert
router.put("/:id", updateAlert);

// Delete alert
router.delete("/:id", deleteAlert);

export default router;
