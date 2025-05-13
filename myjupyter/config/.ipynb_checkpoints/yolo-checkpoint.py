from ultralytics import YOLO
import torch

def load_model():
    device = 'cuda' if torch.cuda.is_available() else 'cpu'
    print(f"Using device: {device}")

    model = YOLO("yolov8n.pt")
    model.to(device)
    return model, device
