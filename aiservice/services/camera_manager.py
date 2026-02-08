import cv2
import os
from dotenv import load_dotenv
from threading import Lock

load_dotenv()

camera_states = {
    1: {"cap": None, "enabled": False, "frame": None},
    2: {"cap": None, "enabled": False, "frame": None}
}

lock = Lock()

def get_camera_config():
    """Load camera configuration from .env"""
    return {
        1: {
            "enabled": os.getenv("CAM1_ENABLED", "true").lower() == "true",
            "index": int(os.getenv("CAM1_INDEX", "0")),
            "name": os.getenv("CAM1_NAME", "Local Camera"),
            "type": "local"
        },
        2: {
            "enabled": os.getenv("CAM2_ENABLED", "true").lower() == "true",
            "url": os.getenv("CAM2_URL", "http://192.168.29.12:8080/"),
            "name": os.getenv("CAM2_NAME", "IP Camera"),
            "type": "ip"
        }
    }

def enable_camera(camera_id):
    """Enable camera - called when user clicks Start"""
    global camera_states
    if camera_id not in [1, 2]:
        return False
    
    with lock:
        if camera_states[camera_id]["enabled"] and camera_states[camera_id]["cap"] is not None:
            return True
        
        try:
            config = get_camera_config()
            cam_config = config[camera_id]
            
            if not cam_config["enabled"]:
                print(f"❌ Camera {camera_id} not enabled in config")
                return False
            
            if camera_id == 1:
                # Local camera
                cap = cv2.VideoCapture(cam_config["index"], cv2.CAP_DSHOW)
                print(f"📹 Opening local camera (index {cam_config['index']})")
                
                # Configure for local camera
                cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
                cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)
                
                if cap.isOpened():
                    camera_states[camera_id]["cap"] = cap
                    camera_states[camera_id]["enabled"] = True
                    print(f"✅ Camera {camera_id} ({cam_config['name']}) enabled successfully")
                    return True
                else:
                    print(f"❌ Camera {camera_id} failed to open")
                    return False
            else:
                base_url = cam_config["url"].rstrip('/')
                streaming_urls = [
                    f"{base_url}/video",
                    f"{base_url}/stream",
                    f"{base_url}/mjpg/video.mjpg",
                    f"{base_url}/?action=stream",
                    f"{base_url}/videostream.asf",
                    f"{base_url}/live.mjpeg",
                ]
                
                cap = None
                successful_url = None
                
                for url in streaming_urls:
                    try:
                        print(f"📹 Attempting IP camera at {url}")
                        test_cap = cv2.VideoCapture(url)
                        test_cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)
                        
                        # Try to read a frame
                        ret, test_frame = test_cap.read()
                        
                        if ret and test_frame is not None:
                            print(f"✅ Successfully connected to IP camera at {url}")
                            cap = test_cap
                            successful_url = url
                            break
                        else:
                            print(f"⚠️  No valid frames from {url}")
                            test_cap.release()
                    except Exception as e:
                        print(f"⚠️  Failed to connect to {url}: {e}")
                        continue
                
                if cap is not None and successful_url is not None:
                    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
                    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)
                    cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)
                    
                    camera_states[camera_id]["cap"] = cap
                    camera_states[camera_id]["enabled"] = True
                    print(f"✅ Camera {camera_id} ({cam_config['name']}) enabled successfully on endpoint: {successful_url}")
                    return True
                else:
                    print(f"❌ Camera {camera_id} failed to open - tried all available endpoints")
                    if cap is not None:
                        cap.release()
                    return False
        except Exception as e:
            print(f"❌ Camera {camera_id} error: {e}")
            return False

def disable_camera(camera_id):
    """Disable camera - called when user clicks Stop"""
    global camera_states
    if camera_id not in [1, 2]:
        return
    
    with lock:
        if camera_states[camera_id]["cap"] is not None:
            camera_states[camera_id]["cap"].release()
            camera_states[camera_id]["enabled"] = False
            camera_states[camera_id]["cap"] = None
            camera_states[camera_id]["frame"] = None
            print(f"✅ Camera {camera_id} disabled")

def get_frame(camera_id):
    """Get frame from camera only if enabled"""
    global camera_states
    if camera_id not in [1, 2]:
        return None
    
    with lock:
        if not camera_states[camera_id]["enabled"] or camera_states[camera_id]["cap"] is None:
            return None
        
        cap = camera_states[camera_id]["cap"]
        if not cap.isOpened():
            # Try to reconnect IP camera on failure
            if camera_id == 2:
                print(f"⚠️  Camera {camera_id} connection lost, attempting reconnect...")
                camera_states[camera_id]["cap"] = None
                camera_states[camera_id]["enabled"] = False
            return None
        
        try:
            ret, frame = cap.read()
            if not ret or frame is None:
                # Connection issue, trigger reconnect
                if camera_id == 2:
                    print(f"⚠️  Camera {camera_id} frame read failed")
                return None
            
            return frame
        except Exception as e:
            print(f"⚠️  Error reading frame from camera {camera_id}: {e}")
            return None

def get_all_camera_frames():
    """Get frames from all enabled cameras"""
    global camera_states
    frames = {}
    
    for camera_id in [1, 2]:
        frame = get_frame(camera_id)
        if frame is not None:
            frames[camera_id] = frame
    
    return frames

def disable_all_cameras():
    """Disable all cameras"""
    for camera_id in [1, 2]:
        disable_camera(camera_id)
