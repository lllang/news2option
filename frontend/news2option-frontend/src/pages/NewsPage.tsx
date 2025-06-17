import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchRecentNews, collectNews } from '../api/api';
import { News } from '../types';
import NewsCard from '../components/NewsCard';
import { Button } from '../components/ui/button';
import { Loader2, TrendingUp, DollarSign, BarChart3 } from 'lucide-react';

// Fallback news data for when no real news is available
const fallbackNews: News[] = [
  {
    id: 1,
    title: "Federal Reserve Signals Potential Interest Rate Changes",
    content: "The Federal Reserve is considering adjustments to interest rates in response to current economic indicators. This decision could significantly impact various sectors including banking, real estate, and consumer spending. Market analysts are closely watching for signals about the direction of monetary policy.",
    source: "Financial Times",
    url: "#",
    publishedAt: new Date().toISOString(),
    collectedAt: new Date().toISOString()
  },
  {
    id: 2,
    title: "Tech Sector Shows Strong Q4 Performance",
    content: "Major technology companies are reporting robust quarterly earnings, driven by increased demand for cloud services and artificial intelligence solutions. Companies like Microsoft, Google, and Amazon are leading the charge with significant revenue growth.",
    source: "Bloomberg",
    url: "#",
    publishedAt: new Date(Date.now() - 3600000).toISOString(),
    collectedAt: new Date().toISOString()
  },
  {
    id: 3,
    title: "Energy Sector Volatility Continues",
    content: "Oil prices remain volatile amid geopolitical tensions and changing supply dynamics. Energy companies are adapting their strategies to navigate uncertain market conditions while maintaining profitability.",
    source: "Reuters",
    url: "#",
    publishedAt: new Date(Date.now() - 7200000).toISOString(),
    collectedAt: new Date().toISOString()
  },
  {
    id: 4,
    title: "Healthcare Innovation Drives Market Growth",
    content: "Breakthrough developments in biotechnology and pharmaceutical research are creating new investment opportunities. Companies focusing on personalized medicine and gene therapy are attracting significant investor interest.",
    source: "Wall Street Journal",
    url: "#",
    publishedAt: new Date(Date.now() - 10800000).toISOString(),
    collectedAt: new Date().toISOString()
  },
  {
    id: 5,
    title: "Sustainable Finance Trends Reshape Investment Landscape",
    content: "ESG (Environmental, Social, and Governance) investing continues to gain momentum as institutional investors prioritize sustainable and responsible investment strategies. Green bonds and sustainable funds are seeing record inflows.",
    source: "CNBC",
    url: "#",
    publishedAt: new Date(Date.now() - 14400000).toISOString(),
    collectedAt: new Date().toISOString()
  },
  {
    id: 6,
    title: "Cryptocurrency Market Shows Signs of Stabilization",
    content: "After months of volatility, major cryptocurrencies are showing signs of price stabilization. Regulatory clarity and institutional adoption are contributing to increased market confidence.",
    source: "CoinDesk",
    url: "#",
    publishedAt: new Date(Date.now() - 18000000).toISOString(),
    collectedAt: new Date().toISOString()
  },
  {
    id: 7,
    title: "Manufacturing Sector Adapts to Supply Chain Challenges",
    content: "Manufacturing companies are implementing new strategies to address ongoing supply chain disruptions. Automation and nearshoring are becoming key components of resilient manufacturing operations.",
    source: "Industry Week",
    url: "#",
    publishedAt: new Date(Date.now() - 21600000).toISOString(),
    collectedAt: new Date().toISOString()
  },
  {
    id: 8,
    title: "Real Estate Market Adjusts to New Economic Reality",
    content: "The real estate market is experiencing shifts in both residential and commercial sectors. Interest rate changes and remote work trends are influencing property values and investment patterns.",
    source: "Real Estate Weekly",
    url: "#",
    publishedAt: new Date(Date.now() - 25200000).toISOString(),
    collectedAt: new Date().toISOString()
  }
];

const NewsPage: React.FC = () => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [collecting, setCollecting] = useState<boolean>(false);
  const [usingFallback, setUsingFallback] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      setLoading(true);
      const data = await fetchRecentNews();
      if (data && data.length > 0) {
        setNews(data);
        setUsingFallback(false);
      } else {
        // Use fallback news when no real news is available
        setNews(fallbackNews);
        setUsingFallback(true);
      }
    } catch (error) {
      console.error('Error loading news:', error);
      // Use fallback news on error
      setNews(fallbackNews);
      setUsingFallback(true);
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
      // Keep fallback news if collection fails
      if (news.length === 0) {
        setNews(fallbackNews);
        setUsingFallback(true);
      }
    } finally {
      setCollecting(false);
    }
  };

  const handleNewsClick = (id: number) => {
    if (usingFallback) {
      // For fallback news, show a message that analysis is not available
      return;
    }
    navigate(`/analysis/${id}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Financial News</h1>
          <p className="text-gray-600">Stay updated with the latest financial market insights</p>
        </div>
        <Button 
          onClick={handleCollectNews} 
          disabled={collecting}
          className="flex items-center gap-2"
        >
          {collecting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Collecting News...
            </>
          ) : (
            <>
              <TrendingUp className="h-4 w-4" />
              Collect Latest News
            </>
          )}
        </Button>
      </div>

      {/* Fallback Notice */}
      {usingFallback && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-blue-900">Sample Financial News</h3>
          </div>
          <p className="text-blue-800 text-sm">
            These are sample news articles for demonstration. Click "Collect Latest News" to fetch real financial news and enable AI analysis.
          </p>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading financial news...</p>
          </div>
        </div>
      ) : (
        /* News Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {news.map((item) => (
            <NewsCard 
              key={item.id} 
              news={item} 
              onClick={handleNewsClick}
              isClickable={!usingFallback}
            />
          ))}
        </div>
      )}

      {/* Market Indicators Section */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Market Overview
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-medium text-green-900">S&P 500</h3>
            <p className="text-2xl font-bold text-green-700">4,567.89</p>
            <p className="text-sm text-green-600">+1.2% today</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900">NASDAQ</h3>
            <p className="text-2xl font-bold text-blue-700">14,234.56</p>
            <p className="text-sm text-blue-600">+0.8% today</p>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-medium text-yellow-900">DOW</h3>
            <p className="text-2xl font-bold text-yellow-700">34,567.12</p>
            <p className="text-sm text-yellow-600">+0.5% today</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsPage;