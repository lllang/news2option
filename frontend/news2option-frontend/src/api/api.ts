import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchAllNews = async () => {
  const response = await api.get('/news');
  return response.data;
};

export const fetchRecentNews = async () => {
  const response = await api.get('/news/recent');
  return response.data;
};

export const fetchNewsById = async (id: number) => {
  const response = await api.get(`/news/${id}`);
  return response.data;
};

export const searchNews = async (query: string) => {
  const response = await api.get(`/news/search?query=${query}`);
  return response.data;
};

export const collectNews = async () => {
  const response = await api.post('/news/collect');
  return response.data;
};

export const fetchAllAnalyses = async () => {
  const response = await api.get('/analysis');
  return response.data;
};

export const fetchRecentAnalyses = async () => {
  const response = await api.get('/analysis/recent');
  return response.data;
};

export const fetchAnalysisById = async (id: number) => {
  const response = await api.get(`/analysis/${id}`);
  return response.data;
};

export const fetchAllRecommendations = async () => {
  const response = await api.get('/recommendations');
  return response.data;
};

export const fetchLatestRecommendation = async () => {
  const response = await api.get('/recommendations/latest');
  return response.data;
};

export const fetchRecommendationByDate = async (date: string) => {
  const response = await api.get(`/recommendations/date/${date}`);
  return response.data;
};

export const generateRecommendations = async () => {
  const response = await api.post('/recommendations/generate');
  return response.data;
};

export default api;
