import axios from 'axios';

// Single, safe declaration with fallback
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://my-fridge-ai-backend.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Detect food from an image
export const detectFood = async (imageFile: File) => {
  const formData = new FormData();
  formData.append('file', imageFile);

  const response = await api.post('/detect', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

// Match recipes based on ingredients
export const matchRecipes = async (ingredients: string[]) => {
  const response = await api.post('/recipes/match', {
    ingredients,
    filters: {},
  });

  return response.data;
};

// Get all recipes
export const getAllRecipes = async () => {
  const response = await api.get('/recipes');
  return response.data;
};

// Get a recipe by ID
export const getRecipeById = async (id: string) => {
  const response = await api.get(`/recipes/${id}`);
  return response.data;
};

export default api;


