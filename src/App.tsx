import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Cover from './pages/Cover';
import RecipeLibrary from './pages/RecipeLibrary';
import RecipeDetail from './pages/RecipeDetail';
import RecipeDesignOptions from './pages/RecipeDesignOptions';

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ width: 360, height: 800, margin: '0 auto', overflowY: 'auto', overflowX: 'hidden', position: 'relative' }}>
        <Routes>
          <Route path="/" element={<Cover />} />
          <Route path="/recipes" element={<RecipeLibrary />} />
          <Route path="/recipes/:id" element={<RecipeDetail />} />
          <Route path="/design-options" element={<RecipeDesignOptions />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
