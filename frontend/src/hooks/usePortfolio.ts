import { useQuery } from '@tanstack/react-query';
import { fetchPortfolio } from '../api/portfolio';
import type { PortfolioResponse } from '../types';

export const usePortfolio = (variant: 'master' | 'usa' | 'me') =>
  useQuery<PortfolioResponse, Error>({
    queryKey: ['portfolio', variant],
    queryFn: () => fetchPortfolio(variant),
    staleTime: 1000 * 60 * 5
  });
