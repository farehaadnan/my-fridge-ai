from ultralytics import YOLO
from app.core.config import MODEL_PATH

model = YOLO(MODEL_PATH)
