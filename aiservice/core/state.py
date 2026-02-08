latest_result = {
    "suspect": None,
    "persons_count": 0,
    "bags_count": 0,
    "bags_details": [],
    "weapons_count": 0,
    "weapons_details": [],
    "linked_bags": 0,
    "timestamp": None
}

camera_frame = {
    "frame_1": None,
    "frame_2": None
}

# Alerts list - stores all detected alerts with timestamps
alerts_list = []

# Maximum alerts to keep in memory (prevents unbounded growth)
MAX_ALERTS = 1000
