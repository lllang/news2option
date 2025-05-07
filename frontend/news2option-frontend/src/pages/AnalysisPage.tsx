import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchNewsById, fetchAnalysisById } from '../api/api';
import { News, NewsAnalysis } from '../types';
import AnalysisDetail from '../components/AnalysisDetail';
import { Button } from '../components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';

const AnalysisPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [news, setNews] = useState<News | null>(null);
  const [analysis, setAnalysis] = useState<NewsAnalysis | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadNewsAndAnalysis(parseInt(id));
    }
  }, [id]);

  const loadNewsAndAnalysis = async (newsId: number) => {
    try {
      setLoading(true);
      setError(null);
      
      try {
        const analysisData = await fetchAnalysisById(newsId);
        setAnalysis(analysisData);
        setNews(analysisData.news);
        return;
      } catch (e) {
        const newsData = await fetchNewsById(newsId);
        setNews(newsData);
        setError('No analysis available for this news article yet.');
      }
    } catch (error) {
      console.error('Error loading news or analysis:', error);
      setError('Failed to load news or analysis. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Button 
        variant="ghost" 
        className="mb-6 flex items-center" 
        onClick={handleBack}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to News
      </Button>

      {error ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
          <p className="text-yellow-800">{error}</p>
          {news && (
            <div className="mt-6">
              <h2 className="text-2xl font-bold mb-4">{news.title}</h2>
              <p className="text-gray-700">{news.content}</p>
            </div>
          )}
        </div>
      ) : analysis ? (
        <AnalysisDetail analysis={analysis} />
      ) : (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">Failed to load news and analysis.</p>
        </div>
      )}
    </div>
  );
};

export default AnalysisPage;
