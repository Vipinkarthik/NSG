import express from "express";

const router = express.Router();
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:8000";

// GET /api/detection/latest?camera_id=1
router.get("/latest", async (req, res) => {
  try {
    const camera_id = parseInt(req.query.camera_id) || 1;
    const url = `${AI_SERVICE_URL}/api/detection/latest?camera_id=${camera_id}`;

    console.log(`🔁 Fetching detection for camera ${camera_id}...`);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000); // 2 second timeout

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`AI Service returned ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.warn(`⚠️ Detection data unavailable (AI Service may not be running): ${err.message}`);
    // Return empty detection data for graceful degradation
    res.status(503).json({
      camera_id: parseInt(req.query.camera_id) || 1,
      suspect: null,
      persons_count: 0,
      bags_count: 0,
      bags_details: [],
      weapons_count: 0,
      weapons_details: [],
      timestamp: null,
      linked_bags: 0,
      status: "stream-only"
    });
  }
});

export default router;
