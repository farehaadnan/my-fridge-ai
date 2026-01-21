import React, { useState } from 'react';
import { Camera, Upload, Plus, X, ChefHat, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface IngredientCategory {
  detectable: string[];
  common: {
    proteins: string[];
    dairy: string[];
    vegetables: string[];
    grains: string[];
  };
  pantry: string[];
}

const DetectionPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [detectedIngredients, setDetectedIngredients] = useState<string[]>([]);
  const [manualIngredients, setManualIngredients] = useState<string[]>([]);
  const [isDetecting, setIsDetecting] = useState(false);
  const [showManualSelector, setShowManualSelector] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Available ingredients (you can fetch this from your API endpoint /api/ingredients)
  const availableIngredients: IngredientCategory = {
  detectable: [
    'tamatar', 'gajar', 'gobi', 'anday', 'hari_mirch', 
    'shimla_mirch', 'kela', 'seb', 'hari_piyaaz', 'maalta', 'kheera',
    'palak', 'baingan', 'bhindi', 'arvi', 'karela', 'kaddu', 'tori',
    'methi', 'saag', 'narangi', 'angoor', 'anar', 'aam', 'tarbuz'
  ],
  common: {
    proteins: [
      'chicken', 'beef', 'mutton', 'fish', 'keema', 
      'prawns', 'machli', 'gosht', 'murgh'
    ],
    dairy: [
      'dahi', 'doodh', 'paneer', 'makhan', 'cream', 
      'cheese', 'lassi', 'malai', 'khoya'
    ],
    vegetables: [
      'aloo', 'palak', 'baingan', 'piyaaz', 'adrak', 'lehsun',
      'matar', 'sem', 'lobia', 'chana', 'rajma', 'moong',
      'masoor', 'urad', 'channe_ki_daal', 'moong_ki_daal'
    ],
    grains: [
      'chawal', 'daal', 'aata', 'maida', 'sooji', 'besan',
      'daliya', 'oats', 'quinoa', 'basmati', 'brown_rice'
    ]
  },
  pantry: [
    'namak', 'tel', 'ghee', 'haldi', 'laal_mirch',
    'dhania_powder', 'zeera', 'garam_masala', 'kali_mirch',
    'elaichi', 'laung', 'dalchini', 'tej_patta', 'saunf',
    'rai', 'methi_dana', 'ajwain', 'kalonji', 'sirka',
    'soya_sauce', 'tomato_paste', 'chilli_sauce'
  ]
};
  // Flatten all ingredients for search
  const allIngredients = [
    ...availableIngredients.detectable,
    ...availableIngredients.common.proteins,
    ...availableIngredients.common.dairy,
    ...availableIngredients.common.vegetables,
    ...availableIngredients.common.grains
  ];

  const filteredIngredients = allIngredients.filter(ing => 
    ing.toLowerCase().includes(searchQuery.toLowerCase()) &&
    !detectedIngredients.includes(ing) &&
    !manualIngredients.includes(ing)
  );

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      // Clear previous detections
      setDetectedIngredients([]);
    }
  };

  const handleDetect = async () => {
  if (!selectedImage) return;

  setIsDetecting(true);
  const formData = new FormData();
  formData.append('file', selectedImage);

  try {
    // Use environment variable for API URL
    const API_URL = import.meta.env.VITE_API_URL || 'https://my-fridge-ai-backend.onrender.com/';
    
    console.log('🔍 API URL:', API_URL); // Debug log
    
    const response = await fetch(`${API_URL}/api/detect`, {
      method: 'POST',
      body: formData,
    });

    console.log('📡 Response status:', response.status); // Debug log

    if (!response.ok) {
      throw new Error(`Detection failed: ${response.status}`);
    }

    const data = await response.json();
    console.log('🔍 Detection API response:', data);
    
    // Extract ingredient names from DetectionResult objects
    let ingredients: string[] = [];
    
    if (data.detected_items && Array.isArray(data.detected_items)) {
      // Backend returns array of DetectionResult objects with 'name' field
      ingredients = data.detected_items.map((item: any) => item.name.toLowerCase());
    }
    
    console.log('🔍 Extracted ingredients:', ingredients);
    
    setDetectedIngredients(ingredients);
    
    if (ingredients.length === 0) {
      alert('No ingredients detected in the image. Try adding them manually or upload a clearer image.');
    }
  } catch (error) {
    console.error('❌ Detection error:', error);
    alert('Failed to detect ingredients. Please try again or add ingredients manually.');
  } finally {
    setIsDetecting(false);
  }
};
  const handleAddManualIngredient = (ingredient: string) => {
    if (!manualIngredients.includes(ingredient)) {
      setManualIngredients([...manualIngredients, ingredient]);
    }
  };

  const handleRemoveManualIngredient = (ingredient: string) => {
    setManualIngredients(manualIngredients.filter(ing => ing !== ingredient));
  };

  const handleRemoveDetectedIngredient = (ingredient: string) => {
    setDetectedIngredients(detectedIngredients.filter(ing => ing !== ingredient));
  };

  const handleFindRecipes = () => {
    const allSelectedIngredients = [...detectedIngredients, ...manualIngredients];
    
    console.log('🔍 All selected ingredients:', allSelectedIngredients);
    
    if (allSelectedIngredients.length === 0) {
      alert('Please detect or add some ingredients first!');
      return;
    }

    // Navigate using React Router with ingredients as URL params
    const ingredientsParam = allSelectedIngredients.join(',');
    console.log('🔍 Navigating with ingredients:', ingredientsParam);
    navigate(`/recipes?ingredients=${ingredientsParam}`);
  };

  const totalIngredients = detectedIngredients.length + manualIngredients.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <ChefHat className="w-12 h-12 text-orange-500" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Ingredient Detection
          </h1>
          <p className="text-gray-600">
            Upload an image or manually select your ingredients
          </p>
        </div>

        {/* Image Upload Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            📸 Step 1: Upload Image (Optional)
          </h2>
          
          {!imagePreview ? (
            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-orange-500 transition bg-gray-50 hover:bg-orange-50">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-12 h-12 text-gray-400 mb-3" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageSelect}
              />
            </label>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-xl"
                />
                <button
                  onClick={() => {
                    setImagePreview(null);
                    setSelectedImage(null);
                    setDetectedIngredients([]);
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <button
                onClick={handleDetect}
                disabled={isDetecting}
                className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition disabled:bg-gray-400 flex items-center justify-center gap-2"
              >
                {isDetecting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Detecting...
                  </>
                ) : (
                  <>
                    <Camera className="w-5 h-5" />
                    Detect Ingredients
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Detected Ingredients */}
        {detectedIngredients.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                {detectedIngredients.length}
              </span>
              Detected from Image
            </h2>
            <div className="flex flex-wrap gap-2">
              {detectedIngredients.map((ing, idx) => (
                <div
                  key={idx}
                  className="bg-green-100 text-green-800 px-4 py-2 rounded-full flex items-center gap-2 capitalize"
                >
                  {ing.replace(/_/g, ' ')}
                  <button
                    onClick={() => handleRemoveDetectedIngredient(ing)}
                    className="hover:bg-green-200 rounded-full p-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Manual Selection */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              ✋ Step 2: Add Manually
            </h2>
            <button
              onClick={() => setShowManualSelector(!showManualSelector)}
              className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Ingredient
            </button>
          </div>

          {/* Manual Ingredients List */}
          {manualIngredients.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                  {manualIngredients.length}
                </span>
                <span className="text-sm text-gray-600">Manually Added</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {manualIngredients.map((ing, idx) => (
                  <div
                    key={idx}
                    className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full flex items-center gap-2 capitalize"
                  >
                    {ing.replace(/_/g, ' ')}
                    <button
                      onClick={() => handleRemoveManualIngredient(ing)}
                      className="hover:bg-blue-200 rounded-full p-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ingredient Selector */}
          {showManualSelector && (
            <div className="border-2 border-gray-200 rounded-xl p-4 bg-gray-50">
              {/* Search Bar */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search ingredients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Ingredient Grid */}
              <div className="max-h-64 overflow-y-auto">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {filteredIngredients.map((ing, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        handleAddManualIngredient(ing);
                        setSearchQuery('');
                      }}
                      className="bg-white border border-gray-300 hover:border-orange-500 hover:bg-orange-50 px-3 py-2 rounded-lg text-left transition capitalize text-sm"
                    >
                      {ing.replace(/_/g, ' ')}
                    </button>
                  ))}
                </div>
                {filteredIngredients.length === 0 && (
                  <p className="text-center text-gray-500 py-8">
                    No ingredients found
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Find Recipes Button */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Total ingredients selected: <span className="font-bold text-orange-500">{totalIngredients}</span>
            </p>
            <button
              onClick={handleFindRecipes}
              disabled={totalIngredients === 0}
              className="bg-gradient-to-r from-orange-500 to-green-500 text-white px-8 py-4 rounded-xl hover:from-orange-600 hover:to-green-600 transition disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed text-lg font-semibold shadow-lg flex items-center justify-center gap-3 mx-auto"
            >
              <Search className="w-6 h-6" />
              Find Recipes ({totalIngredients} ingredients)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


export default DetectionPage;

