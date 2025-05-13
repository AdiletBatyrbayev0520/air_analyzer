import cv2
import numpy as np
def imshow(results, num_people, device, track_history, track_ids):
    boxes = results[0].boxes.xywh.cpu()
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
    
    cv2.imshow("People Detection", annotated_frame)

def destroy_windows():
    cv2.destroyAllWindows()
