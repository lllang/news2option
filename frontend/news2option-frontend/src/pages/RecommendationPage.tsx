import React, { useState, useEffect } from 'react';
import { fetchLatestRecommendation, generateRecommendations } from '../api/api';
import { DailyInvestmentRecommendation } from '../types';
import RecommendationCard from '../components/RecommendationCard';
import { Button } from '../components/ui/button';
import { Loader2 } from 'lucide-react';

const RecommendationPage: React.FC = () => {
  const [recommendation, setRecommendation] = useState<DailyInvestmentRecommendation | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [generating, setGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRecommendation();
  }, []);

  const loadRecommendation = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchLatestRecommendation();
      setRecommendation(data);
    } catch (error) {
      console.error('Error loading recommendation:', error);
      setError('No investment recommendations found. Generate a new recommendation.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateRecommendation = async () => {
    try {
      setGenerating(true);
      setError(null);
      await generateRecommendations();
      await loadRecommendation();
    } catch (error) {
      console.error('Error generating recommendation:', error);
      setError('Failed to generate recommendations. Please try again later.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Investment Recommendations</h1>
        <Button 
          onClick={handleGenerateRecommendation} 
          disabled={generating}
        >
          {generating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            'Generate New Recommendation'
          )}
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : error ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-6 text-center">
          <p className="text-yellow-800 mb-4">{error}</p>
          <Button 
            onClick={handleGenerateRecommendation} 
            disabled={generating}
          >
            {generating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Recommendation'
            )}
          </Button>
        </div>
      ) : recommendation ? (
        <RecommendationCard recommendation={recommendation} />
      ) : (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">Failed to load recommendations.</p>
        </div>
      )}
    </div>
  );
};

export default RecommendationPage;
