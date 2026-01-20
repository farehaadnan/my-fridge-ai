export interface DetectionResult {
  name: string;
  name_urdu: string;
  confidence: number;
  bounding_box: number[];
  class_id: number;
}

export interface DetectionResponse {
  success: boolean;
  message: string;
  detected_items: DetectionResult[];
  total_count: number;
}

export interface RecipeIngredients {
  detectable: string[];
  non_detectable: string[];
  pantry: string[];
  optional: string[];
}

export interface Recipe {
  id: string;
  name: string;
  name_urdu: string;
  category: string;
  ingredients: RecipeIngredients;
  instructions: string[];
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  allergens: string[];
  cook_time: number;
  prep_time: number;
  difficulty: string;
  servings: number;
}

export interface RecipeMatch {
  recipe: Recipe;
  match_percentage: number;
  has_ingredients: string[];
  missing_ingredients: string[];
}

export interface RecipeMatchResponse {
  success: boolean;
  message: string;
  recipes: RecipeMatch[];
  total_count: number;
}