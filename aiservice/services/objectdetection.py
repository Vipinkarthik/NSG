from ultralytics import YOLO

try:
    yolo = YOLO("aiservice/models/yolov8l.pt")
except:
    try:
        yolo = YOLO("models/yolov8l.pt")
    except Exception as e:
        print(f"Error loading YOLO model: {e}")
        yolo = None

# COCO classes index mapping
BAG_CLASSES = [28, 31, 33]  # backpack, handbag, suitcase
WEAPON_CLASSES = {42: "knife", 73: "gun"}  # knife, rifle (firearms)
PERSON_CLASS = 0

def detect_objects(frame):
    """
    Detect persons, bags, and weapons in frame.
    Returns: dict with persons, bags list and weapons
    """
    if yolo is None:
        return {"persons": [], "bags": [], "weapons": []}
    
    try:
        results = yolo(frame, verbose=False, conf=0.5)
        if len(results) == 0:
            return {"persons": [], "bags": [], "weapons": []}
        
        result = results[0]
        persons = []
        bags = []
        weapons = []

        # Process EACH detection box
        for box in result.boxes:
            cls = int(box.cls[0])
            confidence = float(box.conf[0]) * 100
            label = yolo.names[cls]
            
            # Get box coordinates (x1, y1, x2, y2) as integers
            x1, y1, x2, y2 = map(int, box.xyxy[0].cpu().numpy())
            box_coords = {"x1": x1, "y1": y1, "x2": x2, "y2": y2}

            # Detect PERSON
            if cls == PERSON_CLASS:
                persons.append({
                    "box": box_coords,
                    "confidence": round(confidence, 2),
                    "label": label
                })
            
            # Detect WEAPONS (knife, gun, rifle)
            elif cls in WEAPON_CLASSES:
                weapons.append({
                    "box": box_coords,
                    "confidence": round(confidence, 2),
                    "type": WEAPON_CLASSES[cls]
                })
            elif label.lower() in ["knife", "gun", "rifle", "firearm", "pistol", "shotgun"]:
                weapons.append({
                    "box": box_coords,
                    "confidence": round(confidence, 2),
                    "type": label.lower()
                })
            
            # Detect BAGS (backpack, handbag, suitcase)
            if cls in BAG_CLASSES:
                bags.append({
                    "box": box_coords,
                    "confidence": round(confidence, 2),
                    "type": yolo.names[cls]
                })
            elif label.lower() in ["backpack", "handbag", "suitcase", "bag", "bagpack"]:
                bags.append({
                    "box": box_coords,
                    "confidence": round(confidence, 2),
                    "type": label.lower()
                })

        return {
            "persons": persons,
            "bags": bags,
            "weapons": weapons
        }
    
    except Exception as e:
        print(f"Error in object detection: {e}")
        return {"persons": [], "bags": [], "weapons": []}


