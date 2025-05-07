import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchRecentNews, collectNews } from '../api/api';
import { News } from '../types';
import NewsCard from '../components/NewsCard';
import { Button } from '../components/ui/button';
import { Loader2 } from 'lucide-react';

const NewsPage: React.FC = () => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [collecting, setCollecting] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      setLoading(true);
      const data = await fetchRecentNews();
      setNews(data);
    } catch (error) {
      console.error('Error loading news:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCollectNews = async () => {
    try {
      setCollecting(true);
      await collectNews();
      await loadNews();
    } catch (error) {
      console.error('Error collecting news:', error);
    } finally {
      setCollecting(false);
    }
  };

  const handleNewsClick = (id: number) => {
    navigate(`/analysis/${id}`);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Financial News</h1>
        <Button 
          onClick={handleCollectNews} 
          disabled={collecting}
        >
          {collecting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Collecting News...
            </>
          ) : (
            'Collect Latest News'
          )}
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : news.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600">No news articles found.</p>
          <p className="text-gray-500 mt-2">Click "Collect Latest News" to fetch financial news.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item) => (
            <NewsCard key={item.id} news={item} onClick={handleNewsClick} />
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsPage;
