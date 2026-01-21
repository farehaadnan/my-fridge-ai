import axios from 'axios';

const API_BASE_URL = `${process.env.REACT_APP_API_URL}/api`;


const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

export const matchRecipes = async (ingredients: string[]) => {
  const response = await api.post('/recipes/match', {
    ingredients,
    filters: {},
  });

  return response.data;
};

export const getAllRecipes = async () => {
  const response = await api.get('/recipes');
  return response.data;
};

export const getRecipeById = async (id: string) => {
  const response = await api.get(`/recipes/${id}`);
  return response.data;
};


export default api;
