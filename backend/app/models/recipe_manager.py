import json
from pathlib import Path
from typing import List, Optional
from app.models.schemas import Recipe, RecipeMatch, RecipeIngredients

class RecipeManager:
    def __init__(self):
        # Set data directory path
        self.data_dir = Path(__file__).parent.parent / "data"
        # Load recipes on initialization
        self.recipes = self.load_recipes()
    
    def load_recipes(self) -> List[Recipe]:
        """Load recipes from recipes.json"""
        recipes_path = self.data_dir / "recipes.json"
        
        with open(recipes_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        
        recipes_list = []
        for item in data:
            # Convert ingredients dict to RecipeIngredients object
            ing_dict = item["ingredients"]
            item["ingredients"] = RecipeIngredients(**ing_dict)
            
            # Create Recipe object
            recipe = Recipe(**item)
            recipes_list.append(recipe)
        
        return recipes_list
    
    def calculate_match(self, recipe: Recipe, user_ingredients: List[str], include_pantry: bool = True) -> RecipeMatch:
        """Calculate match percentage for a recipe"""
    
    # DETECTABLE ingredients (what CV can see in fridge)
        detectable_required = set(recipe.ingredients.detectable)
    
    # NON-DETECTABLE ingredients (need to buy)
        non_detectable = set(recipe.ingredients.non_detectable)
    
    # PANTRY staples (we ASSUME user has, but don't show as "has")
        pantry = set(recipe.ingredients.pantry) if include_pantry else set()
    
    # What user ACTUALLY has (detected OR manually added)
        user_set = set(user_ingredients)
    
    # ==== CALCULATE WHAT USER REALLY HAS ====
    
    # From DETECTABLE: What user actually has in fridge
        has_detectable = list(detectable_required & user_set)
        missing_detectable = list(detectable_required - user_set)
    
    # From NON-DETECTABLE: What user actually has
        has_non_detectable = list(non_detectable & user_set)
        missing_non_detectable = list(non_detectable - user_set)
    
    # Total "has" = ONLY what user actually provided
    # (NOT including pantry staples)
        total_has = has_detectable + has_non_detectable
    
    # Total "missing" = what user doesn't have
    # (pantry items NOT shown as missing because we assume they have them)
        total_missing = missing_detectable + missing_non_detectable
    
    # ==== CALCULATE MATCH PERCENTAGE ====
    
    # For matching: Consider detectable + non_detectable + pantry
        all_required = detectable_required | non_detectable
        all_user_has = user_set | pantry  # Include pantry for matching
    
        matched = all_required & all_user_has
    
        if len(all_required) == 0:
            match_percentage = 100.0
        else:
            match_percentage = (len(matched) / len(all_required)) * 100
    
        return RecipeMatch(
            recipe=recipe,
            has_ingredients=total_has,      # ONLY actual user ingredients
            missing_ingredients=total_missing,  # What they need to buy
            match_percentage=match_percentage
        )

    def match_recipes(self, user_ingredients: List[str], min_match: float = 50.0) -> List[RecipeMatch]:
        """Find recipes matching user's ingredients"""
        print(f"🔍 RECEIVED user_ingredients: {user_ingredients}")  # Add this
        match_list = []
        
        # Calculate match for each recipe
        for recipe in self.recipes:
            recipe_match = self.calculate_match(recipe, user_ingredients)
            
            # Only include if meets minimum threshold
            if recipe_match.match_percentage >= min_match:
                match_list.append(recipe_match)
        
        # Sort by match percentage (highest first)
        return sorted(match_list, key=lambda x: x.match_percentage, reverse=True)
    
    def get_recipe_by_id(self, recipe_id: str) -> Optional[Recipe]:
        """Get a specific recipe by ID"""
        for recipe in self.recipes:
            if recipe.id == recipe_id:
                return recipe
        return None