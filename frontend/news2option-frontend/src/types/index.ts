export interface News {
  id: number;
  title: string;
  content: string;
  source: string;
  url: string;
  publishedAt: string;
  collectedAt: string;
}

export interface CompanyImpact {
  id: number;
  companyName: string;
  stockSymbol: string;
  impactType: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  impactScore: number;
}

export interface IndustryImpact {
  id: number;
  industryName: string;
  impactType: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  impactScore: number;
  companyImpacts: CompanyImpact[];
}

export interface NewsAnalysis {
  id: number;
  news: News;
  analysisContent: string;
  industryImpacts: IndustryImpact[];
  analyzedAt: string;
}

export interface RecommendedInvestment {
  id: number;
  industryName: string;
  companyName: string;
  stockSymbol: string;
  recommendationType: 'BUY' | 'SELL' | 'HOLD';
  confidenceScore: number;
  rationale: string;
}

export interface DailyInvestmentRecommendation {
  id: number;
  date: string;
  summary: string;
  overallSentiment: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  recommendedInvestments: RecommendedInvestment[];
}
