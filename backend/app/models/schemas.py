"""
Pydantic schemas for API request/response models
"""
from pydantic import BaseModel, Field
from typing import List, Optional

class DetectionResult(BaseModel):
    """
    Represents a single detected food item
    """
    name: str = Field(..., description="Food name in English")
    name_urdu: str = Field(..., description="Food name in Urdu")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Detection confidence score")
    bounding_box: List[float] = Field(..., description="Bounding box coordinates [x1, y1, x2, y2]")
    class_id: int = Field(..., ge=0, description="Class ID")  # ✅ Removed le=10
    
    class Config:
        json_schema_extra = {
            "example": {
                "name": "Tamatar",
                "name_urdu": "ٹماٹر",
                "confidence": 0.95,
                "bounding_box": [100.5, 150.2, 300.8, 400.3],
                "class_id": 0
            }
        }

class DetectionResponse(BaseModel):
    """
    API response for food detection
    """
    success: bool = Field(..., description="Whether detection was successful")
    message: str = Field(..., description="Status message")
    detected_items: List[DetectionResult] = Field(default=[], description="List of detected items")
    total_count: int = Field(..., ge=0, description="Number of items detected")
    
    class Config:
        json_schema_extra = {
            "example": {
                "success": True,
                "message": "Detection completed successfully",
                "detected_items": [
                    {
                        "name": "Tamatar",
                        "name_urdu": "ٹماٹر",
                        "confidence": 0.95,
                        "bounding_box": [100.5, 150.2, 300.8, 400.3],
                        "class_id": 0
                    }
                ],
                "total_count": 1
            }
        }
# 1. Recipe Schema
# Recipe Ingredients Schema
class RecipeIngredients(BaseModel):
    """
    Categorized ingredients for a recipe
    """
    detectable: List[str] = Field(default=[], description="AI-detectable ingredients")
    non_detectable: List[str] = Field(default=[], description="Manually added ingredients")
    pantry: List[str] = Field(default=[], description="Pantry items")
    optional: List[str] = Field(default=[], description="Optional ingredients")
    
    class Config:
        json_schema_extra = {
            "example": {
                "detectable": ["tamatar", "hari_piyaaz"],
                "non_detectable": ["chicken"],
                "pantry": ["namak", "tel"],
                "optional": ["dahi"]
            }
        }

# Recipe Schema
class Recipe(BaseModel):
    id: str = Field(..., description="Unique recipe ID")
    name: str = Field(..., description="Recipe name in English")
    name_urdu: str = Field(..., description="Recipe name in Urdu")
    category: str = Field(..., description="Recipe category")
    ingredients: RecipeIngredients = Field(..., description="Categorized ingredients")
    instructions: List[str] = Field(..., description="Cooking instructions")
    nutrition: dict = Field(..., description="Nutritional information")
    allergens: List[str] = Field(default=[], description="Allergens")
    cook_time: int = Field(..., description="Cook time in minutes")
    prep_time: int = Field(..., description="Prep time in minutes")
    difficulty: str = Field(..., description="Difficulty level")
    servings: int = Field(..., description="Number of servings")

# Recipe Match Result
class RecipeMatch(BaseModel):
    recipe: Recipe
    match_percentage: float
    missing_ingredients: List[str]
    has_ingredients: List[str]

# Recipe Match Request
class RecipeMatchRequest(BaseModel):
    ingredients: List[str]
    filters: Optional[dict] = None

# Recipe Match Response
class RecipeMatchResponse(BaseModel):
    success: bool
    message: str
    recipes: List[RecipeMatch]
    total_count: int