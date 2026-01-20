from pathlib import Path
from ultralytics import YOLO
from app.core.config import MODEL_PATH, CONFIDENCE_THRESHOLD, FOOD_CLASSES
from app.models.schemas import DetectionResult
from typing import List
class FoodDetector:
    """
    FoodDetector uses a YOLO model to detect food items in images.
    """
    def __init__(self):
        model_path = Path(__file__).parent / "fridge_detector_best.pt"
        self.model = YOLO(str(model_path))

    def detect(self, image_path: str) -> List[DetectionResult]:
        """
        Detect food items in the given image.

        Args:
            image_path (str): Path to the input image.
        Returns:
            List[DetectionResult]: List of detected food items.
        """
        results = self.model(image_path, conf=CONFIDENCE_THRESHOLD, verbose=False)
        detections = []

        for result in results:
            for box in result.boxes:
                class_id = int(box.cls[0])
                confidence = float(box.conf[0])
                bbox = box.xyxy[0].tolist()  # [x1, y1, x2, y2]

                food_info = FOOD_CLASSES.get(class_id, {"en": "Unknown", "ur": "نامعلوم"})
                detection = DetectionResult(
                    name=food_info["en"],
                    name_urdu=food_info["ur"],
                    confidence=confidence,
                    bounding_box=bbox,
                    class_id=class_id
                )
                detections.append(detection)

        return detections
# Example usage: