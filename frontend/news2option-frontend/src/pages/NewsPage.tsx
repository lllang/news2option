import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchRecentNews, collectNews } from '../api/api';
import { News } from '../types';
import NewsCard from '../components/NewsCard';
import { Button } from '../components/ui/button';
import { Loader2 } from 'lucide-react';

// 兜底新闻数据
const fallbackNews: News[] = [
  {
    id: -1,
    title: "Global Markets Show Mixed Signals Amid Economic Uncertainty",
    content: "Financial markets worldwide are displaying mixed performance as investors navigate through ongoing economic uncertainties. Key indicators suggest cautious optimism in some sectors while others face headwinds from inflation concerns and geopolitical tensions.",
    source: "Financial Times",
    url: "#",
    publishedAt: new Date().toISOString(),
    collectedAt: new Date().toISOString()
  },
  {
    id: -2,
    title: "Technology Sector Leads Innovation in Sustainable Finance",
    content: "Leading technology companies are pioneering new approaches to sustainable finance, with artificial intelligence and blockchain technologies driving efficiency improvements in green investment strategies.",
    source: "Bloomberg",
    url: "#",
    publishedAt: new Date(Date.now() - 3600000).toISOString(),
    collectedAt: new Date().toISOString()
  },
  {
    id: -3,
    title: "Central Banks Signal Coordinated Approach to Interest Rates",
    content: "Major central banks are indicating a more coordinated approach to monetary policy, with recent statements suggesting alignment on interest rate strategies to combat inflation while supporting economic growth.",
    source: "Reuters",
    url: "#",
    publishedAt: new Date(Date.now() - 7200000).toISOString(),
    collectedAt: new Date().toISOString()
  },
  {
    id: -4,
    title: "Emerging Markets Attract Increased Investment Flows",
    content: "Emerging market economies are experiencing renewed investor interest as global capital seeks higher yields and growth opportunities, with particular focus on Asian and Latin American markets.",
    source: "Wall Street Journal",
    url: "#",
    publishedAt: new Date(Date.now() - 10800000).toISOString(),
    collectedAt: new Date().toISOString()
  }
];

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
      // 如果没有获取到新闻数据或数据为空，使用兜底新闻
      if (!data || data.length === 0) {
        setNews(fallbackNews);
      } else {
        setNews(data);
      }
    } catch (error) {
      console.error('Error loading news:', error);
      // 发生错误时也使用兜底新闻
      setNews(fallbackNews);
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
      // 收集新闻失败时，确保显示兜底新闻
      setNews(fallbackNews);
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {news.map((item) => (
            <NewsCard key={item.id} news={item} onClick={handleNewsClick} />
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsPage;
