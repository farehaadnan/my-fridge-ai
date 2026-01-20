"""
Configuration settings for My Fridge AI API
"""
from pathlib import Path

# Base directories
BASE_DIR = Path(__file__).resolve().parent.parent.parent  # Points to backend/
APP_DIR = BASE_DIR / "app"
MODELS_DIR = APP_DIR / "models"

MODEL_PATH = str(MODELS_DIR / "best.pt")

UPLOADS_DIR = BASE_DIR / "uploads"  # For temporary uploaded images
CONFIDENCE_THRESHOLD = 0.25
IMAGE_SIZE = 640  # YOLO input size

# File upload settings
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png"}  # Use set for faster lookup
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB in bytes
MAX_IMAGE_DIMENSION = 4096  # Max width or height in pixels

# API settings
API_TITLE = "My Fridge AI API"
API_DESCRIPTION = "Pakistani food detection and recipe recommendation system"
API_VERSION = "1.0.0"

# Food classes (matches your training data)
FOOD_CLASSES = {
    0: {"en": "Tamatar", "ur": "ٹماٹر"},
    1: {"en": "Gajar", "ur": "گاجر"},
    2: {"en": "Gobi", "ur": "گوبھی"},
    3: {"en": "Anday", "ur": "انڈے"},
    4: {"en": "Hari Mirch", "ur": "ہری مرچ"},
    5: {"en": "Shimla Mirch", "ur": "شملہ مرچ"},
    6: {"en": "Kela", "ur": "کیلا"},
    7: {"en": "Seb", "ur": "سیب"},
    8: {"en": "Hari Piyaaz", "ur": "ہری پیاز"},
    9: {"en": "Maalta", "ur": "مالٹا"},
    10: {"en": "Kheera", "ur": "کھیرا"},
    11: {"en": "Piyaaz", "ur": "پیاز"},
    12: {"en": "Aloo", "ur": "آلو"},
    13: {"en": "lehsan-adrak-paste", "ur": "لہسن ادرک پیسٹ"},
    14: {"en": "sirka", "ur": "سرکہ"},
    15: {"en": "ketchup", "ur": "کیچپ"},
    16: {"en": "chili-sauce", "ur": "چلی سوس"},
    17: {"en": "soy-sauce", "ur": "سویا سوس"},
    18: {"en": "lehsan", "ur": "لہسن"},
    19: {"en": "doodh", "ur": "دودھ"},
    20: {"en": "dahi", "ur": "دہی"}
}

# Create necessary directories
UPLOADS_DIR.mkdir(exist_ok=True)