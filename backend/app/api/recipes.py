from fastapi import APIRouter, HTTPException
from typing import List, Optional
from app.models.recipe_manager import RecipeManager
from app.models.schemas import (
    Recipe,
    RecipeMatch,
    RecipeMatchRequest,
    RecipeMatchResponse
)

# Create router
router = APIRouter()

# Initialize recipe manager once (reused for all requests)
recipe_manager = RecipeManager()

# Endpoint 1: Match recipes
@router.post("/recipes/match", response_model=RecipeMatchResponse)
async def match_recipes(request: RecipeMatchRequest):
    # TIER 1: Always-available dry staples (for matching only)
    dry_pantry = [
        'namak', 'tel', 'haldi', 'laal_mirch', 'dhania_powder', 
        'zeera', 'garam_masala'
    ]
    
    # TIER 2: Common fresh ingredients (assume user has UNLESS it's detectable)
    # These are for matching, but WILL show as "missing" if not detected
    fresh_pantry = ['adrak', 'lehsun', 'piyaaz', 'lehsun_paste']
    
    # For MATCHING: assume user has both tiers
    all_available_for_matching = list(set(
        request.ingredients + dry_pantry + fresh_pantry
    ))
    
    # Match recipes
    matches = recipe_manager.match_recipes(
        user_ingredients=all_available_for_matching,
        min_match=30.0
    )
    
    # IMPORTANT: Now update each match to show REALISTIC "has" and "missing"
    # based on what user ACTUALLY provided (not assumed pantry)
    for match in matches:
        # Recalculate with ONLY user's actual ingredients
        actual_match = recipe_manager.calculate_match(
            recipe=match.recipe,
            user_ingredients=request.ingredients,  # ONLY what user provided
            include_pantry=False  # Don't assume anything
        )
        
        # Update the match object
        match.has_ingredients = actual_match.has_ingredients
        match.missing_ingredients = actual_match.missing_ingredients
        # Keep the original match_percentage for sorting
    
    return RecipeMatchResponse(
        success=True,
        message=f"Found {len(matches)} matching recipes",
        recipes=matches,
        total_count=len(matches)
    )
# Endpoint 2: Get all recipes
@router.get("/recipes", response_model=List[Recipe])
async def get_all_recipes(
    category: Optional[str] = None,
    difficulty: Optional[str] = None,
    max_time: Optional[int] = None
):
    """
    Get all recipes with optional filtering
    """
    recipes = recipe_manager.recipes
    
    # Apply category filter
    if category:
        recipes = [r for r in recipes if r.category == category]
    
    # Apply difficulty filter
    if difficulty:
        recipes = [r for r in recipes if r.difficulty == difficulty]
    
    # Apply time filter
    if max_time:
        recipes = [r for r in recipes if r.cook_time <= max_time]
    
    return recipes

# Endpoint 3: Get recipe by ID
@router.get("/recipes/{recipe_id}", response_model=Recipe)
async def get_recipe(recipe_id: str):
    """
    Get specific recipe by ID
    """
    recipe = recipe_manager.get_recipe_by_id(recipe_id)
    
    if not recipe:
        raise HTTPException(
            status_code=404, 
            detail=f"Recipe with id '{recipe_id}' not found"
        )
    
    return recipe

# Endpoint 4: Get all ingredients
@router.get("/ingredients")
async def get_ingredients():
    """
    Get all ingredient categories for manual selection
    """
    return {
        "detectable": [
            "tamatar", "gajar", "gobi", "anday",
            "hari_mirch", "shimla_mirch", "kela",
            "seb", "hari_piyaaz", "maalta", "kheera"
        ],
        "common": {
            "proteins": ["chicken", "beef", "mutton", "fish", "keema"],
            "dairy": ["dahi", "doodh", "paneer", "makhan"],
            "vegetables": ["aloo", "palak", "baingan", "piyaaz"],
            "grains": ["chawal", "daal", "aata", "maida"]
        },
        "pantry": [
            "namak", "tel", "ghee", "haldi", "laal_mirch",
            "dhania_powder", "zeera", "garam_masala"
        ]
    }