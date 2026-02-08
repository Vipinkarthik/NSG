from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from threading import Thread
import cv2
import base64
import json
from datetime import datetime
import time

from api.analysis import router
from services.tracker_multi import run_ai_loop
from services.camera_manager import enable_camera, disable_camera, disable_all_cameras
from services.alertsubmitter import submit_alerts_to_backend
from core.state import latest_result, camera_frame, alerts_list, MAX_ALERTS

app = FastAPI(title="NSG AI Surveillance Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")

# Start AI processing thread at startup
ai_thread = None
alert_submission_thread = None

def alert_submission_loop():
    """Background thread for periodically submitting alerts to backend"""
    while True:
        try:
            time.sleep(30)  # Submit every 30 seconds
            submit_alerts_to_backend()
        except Exception as e:
            print(f"Error in alert submission: {e}")
            time.sleep(30)

@app.on_event("startup")
async def startup_event():
    global ai_thread, alert_submission_thread
    ai_thread = Thread(target=run_ai_loop, daemon=True)
    ai_thread.start()
    print("✅ AI processing thread started (camera disabled by default)")
    
    alert_submission_thread = Thread(target=alert_submission_loop, daemon=True)
    alert_submission_thread.start()
    print("✅ Alert submission thread started")

@app.get("/")
def root():
    return {"status": "AI Service Running"}

@app.post("/api/camera/enable")
def camera_enable(camera_id: int = 1):
    """Enable camera when user clicks Start"""
    if camera_id not in [1, 2]:
        return {"status": "failed", "message": "Invalid camera ID. Use 1 or 2."}
    
    print(f"📹 Enabling camera {camera_id}...")
    success = enable_camera(camera_id)
    if success:
        time.sleep(0.5)
        return {
            "status": "enabled",
            "message": f"Camera {camera_id} enabled successfully",
            "camera_id": camera_id
        }
    else:
        return {
            "status": "failed",
            "message": f"Failed to enable camera {camera_id}",
            "camera_id": camera_id
        }

@app.post("/api/camera/disable")
def camera_disable(camera_id: int = 1):
    """Disable camera when user clicks Stop"""
    if camera_id not in [1, 2]:
        return {"status": "failed", "message": "Invalid camera ID. Use 1 or 2."}
    
    print(f"⛔ Disabling camera {camera_id}...")
    disable_camera(camera_id)
    camera_frame[f"frame_{camera_id}"] = None
    return {
        "status": "disabled",
        "message": f"Camera {camera_id} disabled successfully",
        "camera_id": camera_id
    }

@app.get("/api/camera/stream")
def camera_stream(camera_id: int = 1):
    """Stream camera feed with detections via Server-Sent Events for specified camera"""
    if camera_id not in [1, 2]:
        camera_id = 1
    
    frame_key = f"frame_{camera_id}"
    
    def generate():
        frame_count = 0
        last_frame_data = None
        empty_count = 0
        
        while True:
            try:
                frame = camera_frame.get(frame_key)
                
                # Only send if we have a new frame (different from last)
                if frame is not None:
                    try:
                        # Check if frame is different from last
                        if last_frame_data is not None and (frame == last_frame_data).all():
                            # Same frame as last, just wait
                            time.sleep(0.016)
                            empty_count += 1
                            if empty_count >= 60:  # Send keepalive after 1 second of same frame
                                yield f": keepalive\n\n"
                                empty_count = 0
                            continue
                    except:
                        pass  # Fallthrough to send frame
                    
                    # New frame! Send it
                    frame_count += 1
                    empty_count = 0
                    last_frame_data = frame.copy()
                    
                    # Resize frame for streaming
                    resized_frame = cv2.resize(frame, (1280, 720), interpolation=cv2.INTER_LINEAR)
                    
                    # Encode with quality 85
                    _, buffer = cv2.imencode('.jpg', resized_frame, [cv2.IMWRITE_JPEG_QUALITY, 85])
                    frame_base64 = base64.b64encode(buffer).decode('utf-8')
                    
                    data = {
                        "frame": frame_base64,
                        "camera_id": camera_id,
                        "suspect": latest_result.get("suspect"),
                        "persons_count": latest_result.get("persons_count", 0),
                        "bags_count": latest_result.get("bags_count", 0),
                        "weapons_count": latest_result.get("weapons_count", 0),
                        "weapons_details": latest_result.get("weapons_details", []),
                        "bags_details": latest_result.get("bags_details", []),
                        "timestamp": latest_result.get("timestamp"),
                        "linked_bags": latest_result.get("linked_bags", 0),
                        "frame_count": frame_count
                    }
                    yield f"data: {json.dumps(data)}\n\n"
                    time.sleep(0.033)  # ~30 FPS
                else:
                    # No frame yet, wait and send keepalive
                    time.sleep(0.05)
                    empty_count += 1
                    if empty_count >= 20:
                        yield f": waiting for frames\n\n"
                        empty_count = 0
                    
            except Exception as e:
                print(f"Stream error for camera {camera_id}: {e}")
                yield f"data: {json.dumps({'error': str(e), 'camera_id': camera_id})}\n\n"
                time.sleep(1)
    
    return StreamingResponse(generate(), media_type="text/event-stream")

@app.get("/api/detection/latest")
def get_latest_detection(camera_id: int = 1):
    """Get latest detection results for specified camera"""
    if camera_id not in [1, 2]:
        camera_id = 1
    
    return {
        "camera_id": camera_id,
        "suspect": latest_result.get("suspect"),
        "persons_count": latest_result.get("persons_count", 0),
        "bags_count": latest_result.get("bags_count", 0),
        "bags_details": latest_result.get("bags_details", []),
        "weapons_count": latest_result.get("weapons_count", 0),
        "weapons_details": latest_result.get("weapons_details", []),
        "timestamp": latest_result.get("timestamp"),
        "linked_bags": latest_result.get("linked_bags", 0)
    }

@app.get("/api/alerts")
def get_alerts(limit: int = 100, camera_id: int = None):
    """Get detected alerts (most recent first), optionally filtered by camera_id"""
    # Filter by camera_id if specified
    if camera_id and camera_id in [1, 2]:
        filtered_alerts = [a for a in alerts_list if a.get("camera_id") == camera_id]
    else:
        filtered_alerts = alerts_list
    
    # Return most recent alerts, limited by the limit parameter
    recent_alerts = sorted(filtered_alerts, key=lambda x: x.get("timestamp", ""), reverse=True)[:limit]
    return {
        "total": len(filtered_alerts),
        "alerts": recent_alerts,
        "camera_id": camera_id
    }

@app.delete("/api/alerts")
def clear_alerts():
    """Clear all alerts"""
    global alerts_list
    alerts_list = []
    return {"status": "cleared", "message": "All alerts have been cleared"}

@app.get("/api/health")
def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat()
    }


