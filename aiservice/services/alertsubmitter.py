import asyncio
import requests
from datetime import datetime
from core.state import alerts_list, MAX_ALERTS

BACKEND_URL = "http://localhost:5001/api/alerts"

def cleanup_alerts():
    """Keep alerts list bounded to MAX_ALERTS"""
    global alerts_list
    if len(alerts_list) > MAX_ALERTS:
        alerts_list = alerts_list[-MAX_ALERTS:]

def submit_alerts_to_backend():
    """Submit all pending alerts to MongoDB via backend"""
    global alerts_list
    
    if not alerts_list:
        return
    
    try:
        # Prepare alerts for submission
        alerts_to_submit = []
        for alert in alerts_list:
            alert_data = {
                "type": alert.get("type"),
                "title": alert.get("title"),
                "description": alert.get("description"),
                "severity": alert.get("severity", "MEDIUM"),
                "camera": alert.get("camera"),
                "cameraName": f"Camera {alert.get('camera', 0)}",
                "weaponType": alert.get("weapon_type"),
                "bagType": alert.get("bag_type"),
                "personName": alert.get("person_name"),
                "personDOB": alert.get("person_dob"),
                "personCase": alert.get("person_case"),
                "personLocation": alert.get("person_location"),
                "confidence": alert.get("confidence"),
                "timestamp": alert.get("timestamp"),
            }
            alerts_to_submit.append(alert_data)
        
        if alerts_to_submit:
            # Submit batch to backend
            response = requests.post(
                f"{BACKEND_URL}/batch",
                json={"alerts": alerts_to_submit},
                timeout=5
            )
            
            if response.status_code == 201:
                print(f"✅ Submitted {len(alerts_to_submit)} alerts to backend")
                # Clear local alerts after successful submission
                alerts_list = []
            else:
                print(f"⚠️ Failed to submit alerts: {response.status_code}")
    
    except requests.exceptions.ConnectionError:
        print("⚠️ Backend not available, alerts will be stored locally")
    except Exception as e:
        print(f"❌ Error submitting alerts: {e}")
    
    finally:
        cleanup_alerts()

async def periodic_alert_submission():
    """Periodically submit alerts to backend every 30 seconds"""
    while True:
        try:
            await asyncio.sleep(30)  # Submit every 30 seconds
            submit_alerts_to_backend()
        except Exception as e:
            print(f"Error in periodic submission: {e}")
            await asyncio.sleep(30)
