import cv2
from ultralytics import YOLO
from collections import defaultdict
import numpy as np
import torch


device = 'cuda' if torch.cuda.is_available() else 'cpu'
print(f"Using device: {device}")


model = YOLO("yolov8n.pt")
model.to(device)


camera_ip = "rtsp://admin:123adilet456@10.36.40.222:554/cam/realmonitor?channel=1&subtype=1"
cap = cv2.VideoCapture(camera_ip)


track_history = defaultdict(lambda: [])
previous_num_people = 0
if not cap.isOpened():
    print("Error: Could not open video stream.")
else:
    while True:
        ret, frame = cap.read()
        if not ret:
            print("Error: Failed to retrieve frame.")
            break
            
        
        results = model.track(frame, persist=True, classes=0, device=device)  
        
        if results and results[0].boxes.id is not None:
            
            boxes = results[0].boxes.xywh.cpu()
            track_ids = results[0].boxes.id.int().cpu().tolist()
            
            
            num_people = len(track_ids)
            if num_people != previous_num_people:
                print(f"Number of people changed from {previous_num_people} to {num_people}")
                previous_num_people = num_people
            
            annotated_frame = results[0].plot()
            
            
            cv2.putText(
                annotated_frame,
                f"People count: {num_people} | Device: {device}",
                (20, 40),
                cv2.FONT_HERSHEY_SIMPLEX,
                1,
                (0, 255, 0),
                2
            )
            
            
            for box, track_id in zip(boxes, track_ids):
                x, y, w, h = box
                track = track_history[track_id]
                track.append((float(x), float(y)))
                
                
                if len(track) > 30:
                    track.pop(0)
                    
                
                points = np.array(track, dtype=np.int32).reshape((-1, 1, 2))
                cv2.polylines(
                    annotated_frame,
                    [points],
                    isClosed=False,
                    color=(230, 230, 230),
                    thickness=2
                )
                
            cv2.imshow("IP Camera Feed with Detection", annotated_frame)
        else:
            cv2.imshow("IP Camera Feed with Detection", frame)
            
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
            
    cap.release()
    cv2.destroyAllWindows()