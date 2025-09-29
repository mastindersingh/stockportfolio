import { apiClient } from './client';
import type { PortfolioResponse, StockRecommendation } from '../types';

export const fetchPortfolio = async (variant: 'master' | 'usa' | 'me'): Promise<PortfolioResponse> => {
  const { data } = await apiClient.get<PortfolioResponse>(`/portfolio/${variant}`);
  return data;
};

export const fetchRecommendations = async (): Promise<StockRecommendation[]> => {
  const { data } = await apiClient.get<{ recommendations: StockRecommendation[] }>('/stock-recommendations');
  return data.recommendations;
};
