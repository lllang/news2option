import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { ExternalLink, Clock, Eye } from "lucide-react";
import { News } from '../types';

interface NewsCardProps {
  news: News;
  onClick: (id: number) => void;
  isClickable?: boolean;
}

const NewsCard: React.FC<NewsCardProps> = ({ news, onClick, isClickable = true }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const handleCardClick = () => {
    if (isClickable) {
      onClick(news.id);
    }
  };

  const handleAnalysisClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isClickable) {
      onClick(news.id);
    }
  };

  const handleExternalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Card 
      className={`h-full flex flex-col transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border border-gray-200 bg-white ${
        isClickable ? 'cursor-pointer hover:border-blue-300' : 'cursor-default'
      }`}
      onClick={handleCardClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <Badge variant="outline" className="text-xs font-medium bg-blue-50 text-blue-700 border-blue-200">
            {news.source}
          </Badge>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Clock className="h-3 w-3" />
            {formatTimeAgo(news.publishedAt)}
          </div>
        </div>
        <CardTitle className="text-lg font-bold leading-tight line-clamp-2 text-gray-900 hover:text-blue-700 transition-colors">
          {news.title}
        </CardTitle>
        <CardDescription className="text-sm text-gray-600">
          {formatDate(news.publishedAt)}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-grow pb-4">
        <p className="text-sm text-gray-700 line-clamp-4 leading-relaxed">
          {news.content}
        </p>
      </CardContent>
      
      <CardFooter className="pt-0 flex justify-between items-center gap-2">
        <Button 
          variant={isClickable ? "default" : "secondary"} 
          size="sm"
          onClick={handleAnalysisClick}
          disabled={!isClickable}
          className="flex items-center gap-1 flex-1"
        >
          <Eye className="h-3 w-3" />
          {isClickable ? 'View Analysis' : 'Analysis Unavailable'}
        </Button>
        
        {news.url !== "#" && (
          <Button 
            variant="ghost" 
            size="sm"
            asChild
            onClick={handleExternalClick}
            className="p-2"
          >
            <a 
              href={news.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default NewsCard;