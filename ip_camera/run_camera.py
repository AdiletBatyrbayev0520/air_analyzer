import cv2
from collections import defaultdict
import numpy as np
from config.yolo import load_model
from config.kafka import create_producer
from imshow import imshow, destroy_windows
model, device = load_model()
# producer = create_producer()
camera_ip = "rtsp://admin:123adilet456@10.36.40.222:554/cam/realmonitor?channel=1&subtype=1"
cap = cv2.VideoCapture(camera_ip)

track_history = defaultdict(lambda: [])
previous_num_people = 0

if not cap.isOpened():
    print("Error: Could not open video stream.")
else:
    print("Starting people detection and counting...")
    try:
        while True:
            ret, frame = cap.read()
            if not ret:
                print("Error: Failed to retrieve frame.")
                break
            
            results = model.track(frame, persist=True, classes=0, device=device)
            
            if results and results[0].boxes.id is not None:
                track_ids = results[0].boxes.id.int().cpu().tolist()


                num_people = len(track_ids)
                
                if num_people != previous_num_people:
                    print(f"Number of people changed from {previous_num_people} to {num_people}")
                    previous_num_people = num_people
                    # producer.send('people_count', num_people)

                imshow(results, num_people, device, track_history, track_ids)
            
            
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
                    
    except KeyboardInterrupt:
        print("\nGracefully shutting down...")
    finally:
        cap.release()
        destroy_windows()
        print("Resources released, shutdown complete.")