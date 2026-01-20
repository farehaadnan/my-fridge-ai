import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DetectionPage from './pages/DetectionPage';
import RecipesPage from './pages/RecipesPage';
import ViewFullRecipesPage from './pages/ViewFullRecipesPage';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/detect" element={<DetectionPage />} />
        <Route path="/recipes" element={<RecipesPage />} />
        <Route path="/recipe/:recipeId" element={<ViewFullRecipesPage />} />
      </Routes>
    </Router>
  );
}

export default App;