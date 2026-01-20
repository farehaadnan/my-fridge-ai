from fastapi import APIRouter, UploadFile, File, HTTPException
from app.models.detector import FoodDetector
from app.models.schemas import DetectionResponse
from app.core.config import UPLOADS_DIR, ALLOWED_EXTENSIONS
import shutil
import uuid
from pathlib import Path

router = APIRouter()

# Initialize detector once (reused for all requests)
detector = FoodDetector()

@router.post("/detect", response_model=DetectionResponse)
async def detect_food(file: UploadFile = File(...)):
    """
    Detect food items in uploaded image
    """
    
    # Validate file type
    file_ext = Path(file.filename).suffix.lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400, 
            detail=f"Invalid file type. Allowed: {ALLOWED_EXTENSIONS}"
        )
    
    # Check file size
    file.file.seek(0, 2)  # Seek to end
    file_size = file.file.tell()  # Get size
    file.file.seek(0)  # Reset to start
    
    if file_size > 10 * 1024 * 1024:  # 10 MB
        raise HTTPException(status_code=400, detail="File too large (max 10MB)")
    
    # Initialize temp path
    temp_filepath = None
    
    try:
        # Generate unique filename with original extension
        temp_filename = f"temp_{uuid.uuid4()}{file_ext}"
        temp_filepath = UPLOADS_DIR / temp_filename
        
        # Save uploaded file
        with open(temp_filepath, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Run detection (use existing detector)
        results = detector.detect(str(temp_filepath))
        
    finally:
        # Clean up temp file
        if temp_filepath and temp_filepath.exists():
            temp_filepath.unlink()
    
    # Return response
    return DetectionResponse(
        success=True,
        message="Detection completed successfully",
        detected_items=results,
        total_count=len(results)
    )