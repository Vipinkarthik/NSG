import Alert from "../models/Alert.js";

// Get all alerts with pagination
export const getAllAlerts = async (req, res) => {
  try {
    const { limit = 100, skip = 0, type, severity, resolved, startDate, endDate } = req.query;

    let filter = {};
    if (type) filter.type = type;
    if (severity) filter.severity = severity;
    if (resolved !== undefined) filter.resolved = resolved === "true";
    
    // Add date range filter for all cameras
    if (startDate && endDate) {
      filter.timestamp = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const alerts = await Alert.find(filter)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await Alert.countDocuments(filter);

    res.json({
      success: true,
      total,
      count: alerts.length,
      alerts,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get alerts by camera
export const getAlertsByCamera = async (req, res) => {
  try {
    const { cameraId } = req.params;
    const { limit = 100, skip = 0 } = req.query;

    const alerts = await Alert.find({ camera: parseInt(cameraId) })
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await Alert.countDocuments({ camera: parseInt(cameraId) });

    res.json({
      success: true,
      total,
      count: alerts.length,
      alerts,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get alert by ID
export const getAlertById = async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);
    if (!alert) {
      return res.status(404).json({ success: false, message: "Alert not found" });
    }
    res.json({ success: true, alert });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Create alert (called by AI service)
export const createAlert = async (req, res) => {
  try {
    const {
      type,
      title,
      description,
      severity,
      camera,
      cameraName,
      weaponType,
      bagType,
      personName,
      personDOB,
      personCase,
      personLocation,
      confidence,
      timestamp,
      imageData,
      cameraLocation,
    } = req.body;

    if (!type || !title || camera === undefined) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const alert = new Alert({
      type,
      title,
      description,
      severity,
      camera,
      cameraName,
      weaponType,
      bagType,
      personName,
      personDOB,
      personCase,
      personLocation,
      confidence,
      timestamp,
      imageData,
      cameraLocation,
    });

    await alert.save();
    res.status(201).json({ success: true, alert });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Create multiple alerts (batch from AI service)
export const createBatchAlerts = async (req, res) => {
  try {
    const { alerts } = req.body;

    if (!Array.isArray(alerts) || alerts.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid alerts array" });
    }

    const createdAlerts = await Alert.insertMany(alerts);
    res.status(201).json({ success: true, count: createdAlerts.length, alerts: createdAlerts });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update alert (for marking as resolved)
export const updateAlert = async (req, res) => {
  try {
    const { id } = req.params;
    const { resolved, resolvedBy, notes } = req.body;

    const alert = await Alert.findByIdAndUpdate(
      id,
      {
        resolved,
        resolvedAt: resolved ? new Date() : null,
        resolvedBy,
        notes,
      },
      { new: true }
    );

    if (!alert) {
      return res.status(404).json({ success: false, message: "Alert not found" });
    }

    res.json({ success: true, alert });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete alert
export const deleteAlert = async (req, res) => {
  try {
    const alert = await Alert.findByIdAndDelete(req.params.id);
    if (!alert) {
      return res.status(404).json({ success: false, message: "Alert not found" });
    }
    res.json({ success: true, message: "Alert deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get alert statistics
export const getAlertStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter.timestamp = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const stats = await Alert.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
        },
      },
    ]);

    const bySeverity = await Alert.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: "$severity",
          count: { $sum: 1 },
        },
      },
    ]);

    const byCamera = await Alert.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: "$camera",
          count: { $sum: 1 },
        },
      },
    ]);

    const total = await Alert.countDocuments(dateFilter);
    const resolved = await Alert.countDocuments({ ...dateFilter, resolved: true });
    const unresolved = await Alert.countDocuments({ ...dateFilter, resolved: false });

    res.json({
      success: true,
      total,
      resolved,
      unresolved,
      byType: stats,
      bySeverity,
      byCamera,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get alerts for report generation (with date range)
export const getAlertsForReport = async (req, res) => {
  try {
    const { startDate, endDate, type, severity } = req.query;

    let filter = {};

    if (startDate && endDate) {
      filter.timestamp = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    if (type) filter.type = type;
    if (severity) filter.severity = severity;

    const alerts = await Alert.find(filter).sort({ timestamp: -1 });

    res.json({
      success: true,
      count: alerts.length,
      alerts,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get daily detection stats for heatmap (all cameras combined)
export const getDailyDetectionStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter.timestamp = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    // Group by date and camera, include all detection types
    const dailyStats = await Alert.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
            camera: "$camera"
          },
          count: { $sum: 1 },
          weapons: {
            $sum: { $cond: [{ $eq: ["$type", "WEAPON_DETECTED"] }, 1, 0] }
          },
          bags: {
            $sum: { $cond: [{ $eq: ["$type", "BAG_DETECTED"] }, 1, 0] }
          },
          persons: {
            $sum: { $cond: [{ $eq: ["$type", "PERSON_DETECTED"] }, 1, 0] }
          }
        }
      },
      { $sort: { "_id.date": 1 } }
    ]);

    // Aggregate by day (sum across all cameras)
    const dailyTotals = {};
    dailyStats.forEach(stat => {
      const date = stat._id.date;
      if (!dailyTotals[date]) {
        dailyTotals[date] = { count: 0, weapons: 0, bags: 0, persons: 0, cameras: new Set() };
      }
      dailyTotals[date].count += stat.count;
      dailyTotals[date].weapons += stat.weapons;
      dailyTotals[date].bags += stat.bags;
      dailyTotals[date].persons += stat.persons;
      dailyTotals[date].cameras.add(stat._id.camera);
    });

    // Convert to array format and stringify camera sets
    const result = Object.entries(dailyTotals).map(([date, data]) => ({
      date,
      totalDetections: data.count,
      weapons: data.weapons,
      bags: data.bags,
      persons: data.persons,
      camerasInvolved: Array.from(data.cameras).sort()
    }));

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
