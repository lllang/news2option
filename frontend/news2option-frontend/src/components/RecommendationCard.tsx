import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { DailyInvestmentRecommendation, RecommendedInvestment } from '../types';

interface RecommendationCardProps {
  recommendation: DailyInvestmentRecommendation;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'BULLISH':
        return 'bg-green-100 text-green-800';
      case 'BEARISH':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRecommendationColor = (type: string) => {
    switch (type) {
      case 'BUY':
        return 'bg-green-100 text-green-800';
      case 'SELL':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Investment Recommendations</CardTitle>
          <Badge variant="outline">{formatDate(recommendation.date)}</Badge>
        </div>
        <CardDescription className="flex items-center gap-2">
          Overall Market Sentiment: 
          <Badge className={getSentimentColor(recommendation.overallSentiment)}>
            {recommendation.overallSentiment}
          </Badge>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Market Summary</h3>
            <p className="text-gray-700">{recommendation.summary}</p>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Recommended Investments</h3>
            <div className="space-y-4">
              {recommendation.recommendedInvestments.map((investment) => (
                <div key={investment.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h4 className="font-medium text-md">{investment.companyName}</h4>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>{investment.industryName}</span>
                        {investment.stockSymbol && (
                          <span className="font-mono">({investment.stockSymbol})</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getRecommendationColor(investment.recommendationType)}>
                        {investment.recommendationType}
                      </Badge>
                      <Badge variant="outline">Confidence: {investment.confidenceScore}/10</Badge>
                    </div>
                  </div>
                  <p className="text-sm mt-2">{investment.rationale}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecommendationCard;
