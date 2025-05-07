import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import NewsPage from './pages/NewsPage';
import AnalysisPage from './pages/AnalysisPage';
import RecommendationPage from './pages/RecommendationPage';
import { Button } from './components/ui/button';
import { Newspaper, TrendingUp } from 'lucide-react';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <header className="bg-white shadow">
            <div className="container mx-auto px-4 py-4">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">News2Option</h1>
                <nav className="flex space-x-4">
                  <Button variant="ghost" asChild>
                    <Link to="/" className="flex items-center">
                      <Newspaper className="mr-2 h-4 w-4" />
                      News
                    </Link>
                  </Button>
                  <Button variant="ghost" asChild>
                    <Link to="/recommendations" className="flex items-center">
                      <TrendingUp className="mr-2 h-4 w-4" />
                      Recommendations
                    </Link>
                  </Button>
                </nav>
              </div>
            </div>
          </header>

          <main className="py-6">
            <Routes>
              <Route path="/" element={<NewsPage />} />
              <Route path="/analysis/:id" element={<AnalysisPage />} />
              <Route path="/recommendations" element={<RecommendationPage />} />
            </Routes>
          </main>

          <footer className="bg-white border-t mt-12 py-6">
            <div className="container mx-auto px-4">
              <p className="text-center text-gray-500">
                News2Option &copy; {new Date().getFullYear()} - Financial News Analysis and Investment Recommendations
              </p>
            </div>
          </footer>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
