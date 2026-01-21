import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
//import { matchRecipes } from '../services/api';
import type { RecipeMatch } from '../types';
import { useSearchParams } from 'react-router-dom';

const RecipesPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [recipes, setRecipes] = useState<RecipeMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [userIngredients, setUserIngredients] = useState<string[]>([]); // ADD THIS

  useEffect(() => {
    const fetchRecipes = async () => {
      // Get ingredients from URL params
      const ingredientsParam = searchParams.get('ingredients');
      const ingredients = ingredientsParam ? ingredientsParam.split(',') : [];

      // SAVE IT TO STATE
      setUserIngredients(ingredients);

      if (ingredients.length === 0) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch('http://localhost:8000/api/recipes/match', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ingredients })
        });

        const data = await response.json();
        setRecipes(data.recipes || []);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [searchParams]);
  
  const navigate = useNavigate();

  const isLoading = loading;
  const error = !loading && recipes.length === 0 ? 'No recipes found with the given ingredients.' : null;
  
  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">🔄</div>
          <p className="text-xl text-gray-600">Finding recipes...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/detect')}
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-green-600"
          >
            ← Back to Detection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/detect')}
            className="text-primary hover:text-green-600 mb-4 flex items-center"
          >
            ← Back to Detection
          </button>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🍳 Recipe Suggestions
          </h1>
          
          {/* Show detected ingredients - FIX: Use userIngredients state */}
          {userIngredients.length > 0 && (
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-sm text-gray-600 mb-2">Your ingredients:</p>
              <div className="flex flex-wrap gap-2">
                {userIngredients.map((ingredient, index) => (
                  <span
                    key={index}
                    className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium capitalize"
                  >
                    {ingredient.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* No recipes found */}
        {recipes.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">😔</div>
            <h2 className="text-2xl font-bold mb-4">No Recipes Found</h2>
            <p className="text-gray-600 mb-6">
              We couldn't find any recipes with these ingredients.
              Try adding more items!
            </p>
            <button
              onClick={() => navigate('/detect')}
              className="bg-black text-white px-6 py-3 rounded-lg hover:bg-green-600"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Recipe Cards */}
        <div className="space-y-6">
          {recipes.map((match, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              {/* Recipe Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    {match.recipe.name}
                  </h2>
                  <p className="text-gray-600">{match.recipe.name_urdu}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary">
                    {match.match_percentage.toFixed(0)}%
                  </div>
                  <p className="text-sm text-gray-500">match</p>
                </div>
              </div>

              {/* Match Info */}
              <div className="mb-4">
                {/* Match Progress Bar with Label */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-600">Match</span>
                    <span className="text-xs font-semibold text-gray-800">
                      {Math.round(match.match_percentage)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div 
                      className={`h-3 rounded-full transition-all duration-700 ease-out ${
                        match.match_percentage >= 75 
                          ? 'bg-gradient-to-r from-green-400 to-green-600'
                          : match.match_percentage >= 50 
                          ? 'bg-gradient-to-r from-yellow-400 to-yellow-600'
                          : 'bg-gradient-to-r from-orange-400 to-orange-600'
                      }`}
                      style={{ width: `${match.match_percentage}%` }}
                    ></div>
                  </div>
                </div>
                {/* Has Ingredients */}
                {match.has_ingredients.length > 0 && (
                  <div className="mb-2">
                    <span className="text-sm font-semibold text-green-700">
                      ✅ You have:
                    </span>
                    
                    <span className="text-sm text-gray-700 ml-2 capitalize">
                      {match.has_ingredients.map(ing => ing.replace(/_/g, ' ')).join(', ')}
                    </span>
                  </div>
                )}

                {/* Missing Ingredients */}
                {match.missing_ingredients.length > 0 && (
                  <div>
                    <span className="text-sm font-semibold text-orange-700">
                      ⚠️ Missing:
                    </span>
                    <span className="text-sm text-gray-700 ml-2 capitalize">
                      {match.missing_ingredients.map(ing => ing.replace(/_/g, ' ')).join(', ')}
                    </span>
                  </div>
                )}
              </div>

              {/* Recipe Info */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                <span>⏱️ {match.recipe.cook_time} mins</span>
                <span>🔥 {match.recipe.nutrition.calories} cal</span>
                <span>
                  ⭐ {match.recipe.difficulty === 'easy' ? '⭐' : match.recipe.difficulty === 'intermediate' ? '⭐⭐' : '⭐⭐⭐'}
                </span>
                <span>🍽️ {match.recipe.servings} servings</span>
              </div>

              {/* View Recipe Button */}
              <button
                onClick={() => navigate(`/recipe/${match.recipe.id}`)}
                className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition"
              >
                👉 View Full Recipe
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


export default RecipesPage;
