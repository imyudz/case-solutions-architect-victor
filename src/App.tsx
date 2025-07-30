import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HousesProvider } from './context/HousesProvider';
import { ErrorBoundary } from './components/ErrorBoundary';
import { HousesPage } from './pages/HousesPage';
import { HouseDetailPage } from './pages/HouseDetailPage';
import { usePageTracking } from './hooks/usePageTracking';

function AppContent() {
  usePageTracking();
  
  return (
    <div className="min-h-screen w-full">
      <Routes>
        <Route path="/" element={<Navigate to="/houses" replace />} />
        <Route path="/houses" element={<HousesPage />} />
        <Route path="/house/:id" element={<HouseDetailPage />} />
        <Route path="*" element={<Navigate to="/houses" replace />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <HousesProvider>
          <AppContent />
        </HousesProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
