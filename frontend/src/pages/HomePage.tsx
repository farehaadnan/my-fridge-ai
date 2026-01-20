import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          <div className="text-6xl mb-6">🥘</div>
          
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            My Fridge AI
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            Detect Pakistani Foods with AI & Get Authentic Desi Recipes
          </p>

          
          <Link
            to="/detect"
            className="inline-block bg-black text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-600 transition-colors"
          >
            📸 Scan Your Fridge
          </Link>
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered</h3>
              <p className="text-gray-600">
                YOLOv8 model trained on Pakistani foods
              </p>
            </div>
            
            <div className="p-6">
              <div className="text-4xl mb-4">🇵🇰</div>
              <h3 className="text-xl font-semibold mb-2">Authentic Recipes</h3>
              <p className="text-gray-600">
                Curated collection of traditional desi dishes
              </p>
            </div>
            
            <div className="p-6">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2">Nutritious</h3>
              <p className="text-gray-600">
                Complete nutritional information for every recipe
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;