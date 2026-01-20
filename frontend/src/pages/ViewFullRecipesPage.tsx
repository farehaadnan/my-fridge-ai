import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Users, Flame, ChefHat, AlertCircle } from 'lucide-react';

interface Recipe {
  id: string;
  name: string;
  name_urdu: string;
  category: string;
  ingredients: {
    detectable: string[];
    non_detectable: string[];
    pantry: string[];
    optional: string[];
  };
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

const RecipeDetailPage: React.FC = () => {
  const { recipeId } = useParams<{ recipeId: string }>();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8000/api/recipes/${recipeId}`);
        
        if (!response.ok) {
          throw new Error('Recipe not found');
        }
        
        const data = await response.json();
        setRecipe(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load recipe');
      } finally {
        setLoading(false);
      }
    };

    if (recipeId) {
      fetchRecipe();
    }
  }, [recipeId]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading recipe...</p>
        </div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Recipe Not Found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/recipes')}
            className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition"
          >
            Back to Recipes
          </button>
        </div>
      </div>
    );
  }

  const allIngredients = [
    ...recipe.ingredients.detectable,
    ...recipe.ingredients.non_detectable,
    ...recipe.ingredients.pantry
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-orange-500 transition"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Recipe Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">{recipe.name}</h1>
              <p className="text-2xl text-gray-500" dir="rtl">{recipe.name_urdu}</p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getDifficultyColor(recipe.difficulty)}`}>
              {recipe.difficulty}
            </span>
          </div>

          {/* Recipe Metadata */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="flex items-center bg-orange-50 rounded-lg p-3">
              <Clock className="w-5 h-5 text-orange-500 mr-2" />
              <div>
                <p className="text-xs text-gray-500">Total Time</p>
                <p className="font-semibold text-gray-800">{recipe.prep_time + recipe.cook_time} min</p>
              </div>
            </div>
            
            <div className="flex items-center bg-green-50 rounded-lg p-3">
              <Users className="w-5 h-5 text-green-500 mr-2" />
              <div>
                <p className="text-xs text-gray-500">Servings</p>
                <p className="font-semibold text-gray-800">{recipe.servings}</p>
              </div>
            </div>
            
            <div className="flex items-center bg-red-50 rounded-lg p-3">
              <Flame className="w-5 h-5 text-red-500 mr-2" />
              <div>
                <p className="text-xs text-gray-500">Calories</p>
                <p className="font-semibold text-gray-800">{recipe.nutrition.calories}</p>
              </div>
            </div>
            
            <div className="flex items-center bg-purple-50 rounded-lg p-3">
              <ChefHat className="w-5 h-5 text-purple-500 mr-2" />
              <div>
                <p className="text-xs text-gray-500">Cook Time</p>
                <p className="font-semibold text-gray-800">{recipe.cook_time} min</p>
              </div>
            </div>
          </div>

          {/* Nutrition Info */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-3">Nutrition per serving</h3>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-orange-500">{recipe.nutrition.protein}g</p>
                <p className="text-xs text-gray-600">Protein</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-500">{recipe.nutrition.carbs}g</p>
                <p className="text-xs text-gray-600">Carbs</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-500">{recipe.nutrition.fat}g</p>
                <p className="text-xs text-gray-600">Fat</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-500">{recipe.nutrition.fiber}g</p>
                <p className="text-xs text-gray-600">Fiber</p>
              </div>
            </div>
          </div>

          {/* Allergens */}
          {recipe.allergens.length > 0 && (
            <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded">
              <p className="font-semibold text-red-800 mb-1">Allergen Warning</p>
              <p className="text-sm text-red-700">
                Contains: {recipe.allergens.join(', ')}
              </p>
            </div>
          )}
        </div>

        {/* Ingredients Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">1</span>
            Ingredients
          </h2>
          
          <div className="space-y-4">
            {/* Main Ingredients */}
            {(recipe.ingredients.detectable.length > 0 || recipe.ingredients.non_detectable.length > 0) && (
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Main Ingredients</h3>
                <div className="grid gap-2">
                  {[...recipe.ingredients.detectable, ...recipe.ingredients.non_detectable].map((ing, idx) => (
                    <div key={idx} className="flex items-center bg-gray-50 rounded-lg p-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                      <span className="text-gray-800 capitalize">{ing.replace(/_/g, ' ')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pantry Items */}
            {recipe.ingredients.pantry.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Pantry Staples</h3>
                <div className="flex flex-wrap gap-2">
                  {recipe.ingredients.pantry.map((ing, idx) => (
                    <span key={idx} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                      {ing.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Optional Items */}
            {recipe.ingredients.optional.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Optional</h3>
                <div className="flex flex-wrap gap-2">
                  {recipe.ingredients.optional.map((ing, idx) => (
                    <span key={idx} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">
                      {ing.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Instructions Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">2</span>
            Instructions
          </h2>
          
          <div className="space-y-4">
            {recipe.instructions.map((instruction, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-semibold">
                    {idx + 1}
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed pt-1">{instruction}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate(-1)}
            className="bg-orange-500 text-white px-8 py-3 rounded-lg hover:bg-orange-600 transition shadow-lg"
          >
            Find More Recipes
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetailPage;