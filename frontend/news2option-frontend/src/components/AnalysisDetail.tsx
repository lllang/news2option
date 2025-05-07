import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { NewsAnalysis, IndustryImpact, CompanyImpact } from '../types';

interface AnalysisDetailProps {
  analysis: NewsAnalysis;
}

const AnalysisDetail: React.FC<AnalysisDetailProps> = ({ analysis }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getImpactColor = (impactType: string) => {
    switch (impactType) {
      case 'POSITIVE':
        return 'bg-green-100 text-green-800';
      case 'NEGATIVE':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{analysis.news.title}</CardTitle>
        <CardDescription>
          <div className="flex justify-between">
            <span>Source: {analysis.news.source}</span>
            <Badge variant="outline">{formatDate(analysis.analyzedAt)}</Badge>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">News Content</h3>
            <p className="text-gray-700">{analysis.news.content}</p>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Analysis</h3>
            <p className="text-gray-700">{analysis.analysisContent}</p>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Industry Impacts</h3>
            <div className="space-y-4">
              {analysis.industryImpacts.map((industry) => (
                <div key={industry.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium text-md">{industry.industryName}</h4>
                    <div className="flex items-center gap-2">
                      <Badge className={getImpactColor(industry.impactType)}>
                        {industry.impactType}
                      </Badge>
                      <Badge variant="outline">Impact: {industry.impactScore}/10</Badge>
                    </div>
                  </div>
                  
                  <h5 className="text-sm font-medium mt-4 mb-2">Affected Companies</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {industry.companyImpacts.map((company) => (
                      <div key={company.id} className="border rounded p-2 flex justify-between items-center">
                        <div>
                          <span className="font-medium">{company.companyName}</span>
                          {company.stockSymbol && (
                            <span className="text-xs text-gray-500 ml-2">({company.stockSymbol})</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getImpactColor(company.impactType)} variant="outline">
                            {company.impactType}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {company.impactScore}/10
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalysisDetail;
