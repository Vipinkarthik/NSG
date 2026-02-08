import express from "express";

const router = express.Router();

// AIService configuration - adjust based on your setup
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:8000";

/**
 * POST /api/camera/enable
 * Enable camera on AIService
 */
router.post("/enable", async (req, res) => {
  try {
    const { camera_id = 1 } = req.query;
    
    console.log(`📹 Backend: Proxying enable request for camera ${camera_id} to AIService...`);
    
    const response = await fetch(`${AI_SERVICE_URL}/api/camera/enable?camera_id=${camera_id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    });
    
    const data = await response.json();
    console.log(`✅ AIService response:`, data);
    
    res.json(data);
  } catch (error) {
    console.error("❌ Error enabling camera:", error.message);
    res.status(500).json({
      status: "failed",
      message: `Failed to enable camera: ${error.message}`
    });
  }
});

/**
 * POST /api/camera/disable
 * Disable camera on AIService
 */
router.post("/disable", async (req, res) => {
  try {
    const { camera_id = 1 } = req.query;
    
    console.log(`⛔ Backend: Proxying disable request for camera ${camera_id} to AIService...`);
    
    const response = await fetch(`${AI_SERVICE_URL}/api/camera/disable?camera_id=${camera_id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    });
    
    const data = await response.json();
    console.log(`✅ AIService disabled camera ${camera_id}`);
    
    res.json(data);
  } catch (error) {
    console.error("❌ Error disabling camera:", error.message);
    res.status(500).json({
      status: "failed",
      message: `Failed to disable camera: ${error.message}`
    });
  }
});

/**
 * GET /api/camera/stream
 * Stream camera feed via SSE (Server-Sent Events)
 * This proxies the SSE stream from AIService to the client
 */
router.get("/stream", async (req, res) => {
  try {
    const { camera_id = 1 } = req.query;
    
    console.log(`📡 Backend: Setting up SSE stream for camera ${camera_id}...`);
    
    // Set up SSE headers
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("Access-Control-Allow-Origin", "*");
    
    // Fetch the stream from AIService
    const aiServiceStream = await fetch(
      `${AI_SERVICE_URL}/api/camera/stream?camera_id=${camera_id}`
    );
    
    if (!aiServiceStream.ok) {
      console.error(`❌ AIService returned status: ${aiServiceStream.status}`);
      res.status(aiServiceStream.status).end();
      return;
    }
    
    console.log(`✅ Connected to AIService stream for camera ${camera_id}`);
    
    // Pipe the AIService stream to the client
    aiServiceStream.body.pipe(res);
    
    // Handle client disconnect
    req.on("close", () => {
      console.log(`📴 Client disconnected from camera ${camera_id} stream`);
      aiServiceStream.body.destroy();
    });
    
  } catch (error) {
    console.error("❌ Stream error:", error.message);
    res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
    res.end();
  }
});

export default router;
