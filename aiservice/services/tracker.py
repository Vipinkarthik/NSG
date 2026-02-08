import time
from datetime import datetime
import cv2
import numpy as np
import json

from services.camera import get_frame
from services.facerecognition import recognize_face
from services.objectdetection import detect_objects
from core.state import latest_result, camera_frame, alerts_list

# Global tracking variables (exact IDLE logic)
suspect_id = None
suspect_box = None
suspect_bags = []
current_camera_index = 1  # Default camera index

def calculate_iou(boxA, boxB):
    """Calculate Intersection Over Union (exact IDLE logic)"""
    xA = max(boxA[0], boxB[0])
    yA = max(boxA[1], boxB[1])
    xB = min(boxA[2], boxB[2])
    yB = min(boxA[3], boxB[3])
    inter = max(0, xB - xA) * max(0, yB - yA)
    areaA = (boxA[2]-boxA[0]) * (boxA[3]-boxA[1])
    areaB = (boxB[2]-boxB[0]) * (boxB[3]-boxB[1])
    iou = inter / float(areaA + areaB - inter + 1e-6)
    return iou

def draw_detections(frame, face_box, suspect_name, current_persons, current_bags, current_weapons, linked_bags):
    """Draw bounding boxes on frame (exact IDLE colors and logic)"""
    frame_display = frame.copy()
    
    # Draw FACE BOX in GREEN
    if face_box is not None:
        x1, y1, x2, y2 = face_box
        cv2.rectangle(frame_display, (x1, y1), (x2, y2), (0, 255, 0), 2)
        cv2.putText(frame_display, suspect_name, (x1, y1-10), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
    
    # Draw ALL DETECTED PERSONS in CYAN
    for person in current_persons:
        if person.get("box") != face_box:
            x1, y1, x2, y2 = person["box"]["x1"], person["box"]["y1"], person["box"]["x2"], person["box"]["y2"]
            cv2.rectangle(frame_display, (x1, y1), (x2, y2), (255, 255, 0), 2)
            cv2.putText(frame_display, f"Person ({person['confidence']}%)", (x1, y1-10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 0), 2)
    
    # Draw ALL BAG BOXES in MAGENTA (not linked)
    for bag in current_bags:
        bag_coords = bag.get("box")
        box_tuple = (bag_coords["x1"], bag_coords["y1"], bag_coords["x2"], bag_coords["y2"])
        if box_tuple not in linked_bags:  # Only unlinked bags
            x1, y1, x2, y2 = bag_coords["x1"], bag_coords["y1"], bag_coords["x2"], bag_coords["y2"]
            cv2.rectangle(frame_display, (x1, y1), (x2, y2), (255, 0, 255), 2)
            cv2.putText(frame_display, f"BAG ({bag['confidence']}%)", (x1, y1-10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 0, 255), 2)
    
    # Draw LINKED BAGS in YELLOW (linked to suspect)
    for bag_box in linked_bags:
        x1, y1, x2, y2 = bag_box[0], bag_box[1], bag_box[2], bag_box[3]
        cv2.rectangle(frame_display, (x1, y1), (x2, y2), (0, 255, 255), 2)
        cv2.putText(frame_display, "Suspect Bag", (x1, y1-10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 255), 2)
    
    # Draw WEAPONS in RED
    for weapon in current_weapons:
        x1, y1, x2, y2 = weapon["box"]["x1"], weapon["box"]["y1"], weapon["box"]["x2"], weapon["box"]["y2"]
        cv2.rectangle(frame_display, (x1, y1), (x2, y2), (0, 0, 255), 3)
        cv2.putText(frame_display, f"WEAPON: {weapon['type'].upper()}", (x1, y1-10), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 255), 2)
    
    return frame_display

def run_ai_loop():
    """Main AI processing loop - runs continuously in background"""
    global suspect_id, suspect_box, suspect_bags, current_camera_index
    
    print("🤖 AI Loop started (waiting for camera to be enabled)...")
    frame_count = 0
    weapon_alert_sent = {}
    bag_alert_sent = {}
    person_alert_sent = {}
    
    while True:
        try:
            frame = get_frame()
            if frame is None:
                time.sleep(0.1)
                continue
            
            frame_count += 1
            height, width, _ = frame.shape
            
            person_detected = None
            
            # ============ FACE RECOGNITION ============
            face_result = recognize_face(frame, threshold=0.6)
            person_detected = face_result.get("person")
            face_box = face_result.get("box")
            
            # Update suspect tracking
            if person_detected:
                suspect_id = person_detected.name
                suspect_box = face_box
                if frame_count % 20 == 0:
                    print(f"✅ Suspect detected: {person_detected.name}")
            else:
                suspect_id = None
                suspect_box = None
            
            # ============ OBJECT DETECTION ============
            detection_result = detect_objects(frame)
            current_persons = detection_result.get("persons", [])
            current_bags = detection_result.get("bags", [])
            current_weapons = detection_result.get("weapons", [])
            
            if frame_count % 20 == 0:
                if current_weapons:
                    print(f"⚠️ {len(current_weapons)} Weapon(s) detected: {[w['type'] for w in current_weapons]}")
                if current_bags:
                    print(f"📦 {len(current_bags)} Bag(s) detected")
                if current_persons:
                    print(f"👤 {len(current_persons)} Person(s) detected")
            
            # ============ IOU-BASED BAG LINKING ============
            linked_bags = []
            bags_for_display = []
            
            if suspect_box and current_bags:
                for bag in current_bags:
                    bag_coords = (bag["box"]["x1"], bag["box"]["y1"], bag["box"]["x2"], bag["box"]["y2"])
                    iou_score = calculate_iou(suspect_box, bag_coords)
                    if iou_score > 0.05:
                        linked_bags.append(bag_coords)
                        if frame_count % 20 == 0:
                            print(f"🎒 Bag linked to suspect (IOU: {iou_score:.3f})")
            
            suspect_bags = linked_bags
            
            # ============ DRAW DETECTIONS ============
            frame_display = draw_detections(
                frame.copy(),
                face_box,
                suspect_id if person_detected else "Unknown",
                current_persons,
                current_bags,
                current_weapons,
                linked_bags
            )
            
            # ============ CREATE ALERTS FOR WEAPONS ============
            for weapon in current_weapons:
                weapon_key = f"{weapon['type']}_{weapon['box']}"
                if weapon_key not in weapon_alert_sent:
                    alert_data = {
                        "type": "WEAPON_DETECTED",
                        "title": f"WEAPON DETECTED: {weapon['type'].upper()}",
                        "description": f"{weapon['type'].upper()} detected with {weapon['confidence']}% confidence",
                        "camera": current_camera_index,
                        "weapon_type": weapon['type'],
                        "confidence": weapon['confidence'],
                        "timestamp": datetime.now().isoformat(),
                        "severity": "HIGH"
                    }
                    alerts_list.append(alert_data)
                    weapon_alert_sent[weapon_key] = True
                    if frame_count % 10 == 0:
                        print(f"🚨 WEAPON ALERT: {weapon['type']} at camera {current_camera_index}")
            
            # ============ CREATE ALERTS FOR BAGS ============
            for bag in current_bags:
                bag_key = f"{bag['type']}_{bag['box']}"
                if bag_key not in bag_alert_sent:
                    alert_data = {
                        "type": "BAG_DETECTED",
                        "title": f"BAG DETECTED: {bag['type'].upper()}",
                        "description": f"{bag['type']} detected with {bag['confidence']}% confidence",
                        "camera": current_camera_index,
                        "bag_type": bag['type'],
                        "confidence": bag['confidence'],
                        "timestamp": datetime.now().isoformat(),
                        "severity": "MEDIUM"
                    }
                    alerts_list.append(alert_data)
                    bag_alert_sent[bag_key] = True
            
            # ============ CREATE ALERTS FOR PERSONS ============
            if person_detected:
                person_key = person_detected.name
                if person_key not in person_alert_sent:
                    alert_data = {
                        "type": "PERSON_DETECTED",
                        "title": f"PERSON DETECTED: {person_detected.name}",
                        "description": f"Registered person {person_detected.name} detected",
                        "camera": current_camera_index,
                        "person_name": person_detected.name,
                        "person_dob": person_detected.dob,
                        "person_case": person_detected.case_history,
                        "person_location": person_detected.location,
                        "timestamp": datetime.now().isoformat(),
                        "severity": "HIGH"
                    }
                    alerts_list.append(alert_data)
                    person_alert_sent[person_key] = True
                    print(f"👤 PERSON ALERT: {person_detected.name} at camera {current_camera_index}")
            
            # ============ UPDATE STATE (for frontend) ============
            latest_result["suspect"] = {
                "name": person_detected.name if person_detected else None,
                "dob": person_detected.dob if person_detected else None,
                "case": person_detected.case_history if person_detected else None,
                "location": person_detected.location if person_detected else None,
            } if person_detected else None
            
            latest_result["persons_count"] = len(current_persons)
            latest_result["bags_count"] = len(current_bags)
            latest_result["bags_details"] = current_bags
            latest_result["weapons_count"] = len(current_weapons)
            latest_result["weapons_details"] = current_weapons
            latest_result["linked_bags"] = len(linked_bags)
            latest_result["timestamp"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            
            # Store frame for streaming
            camera_frame["frame"] = frame_display
            
            # Log periodically
            if frame_count % 20 == 0:
                print(f"Frame {frame_count}: Suspect={suspect_id}, Persons={len(current_persons)}, Bags={len(current_bags)}, Weapons={len(current_weapons)}")
            
            time.sleep(0.05)  # ~20 FPS
        
        except Exception as e:
            print(f"❌ Error in AI loop: {e}")
            import traceback
            traceback.print_exc()
            time.sleep(0.1)
