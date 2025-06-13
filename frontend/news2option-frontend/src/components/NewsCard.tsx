import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { ExternalLink } from "lucide-react";
import { News } from '../types';

interface NewsCardProps {
  news: News;
  onClick: (id: number) => void;
}

const NewsCard: React.FC<NewsCardProps> = ({ news, onClick }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <Card className="h-full flex flex-col transition-all duration-300 hover:shadow-lg hover:shadow-gray-200/50 cursor-pointer">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-bold line-clamp-2">{news.title}</CardTitle>
        </div>
        <CardDescription className="flex items-center justify-between">
          <span className="text-sm truncate">Source: {news.source}</span>
          <Badge variant="outline" className="text-xs">{formatDate(news.publishedAt)}</Badge>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="line-clamp-4 text-sm text-gray-600">{news.content}</p>
      </CardContent>
      <CardFooter className="flex justify-between gap-2">
        <Button variant="outline" size="sm" onClick={() => onClick(news.id)} className="flex-1">
          View Analysis
        </Button>
        <Button variant="ghost" size="icon" asChild>
          <a href={news.url} target="_blank" rel="noopener noreferrer">
            <ExternalLink size={16} />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NewsCard;
