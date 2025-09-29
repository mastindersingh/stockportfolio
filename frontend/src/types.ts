export interface PortfolioSummary {
  totalInvested: number;
  totalReturn: number;
  totalCurrentValue: number;
  percentageUp: number;
}

export interface StockHistoryPoint {
  date: string;
  close: number;
}

export interface StockHolding {
  ticker: string;
  longName?: string;
  sector?: string;
  marketCap?: number;
  earliestBuyDate?: string;
  weightedAvgPrice?: number;
  currentPrice?: number;
  totalQuantity?: number;
  performance?: string;
  percentageChange?: number;
  invested?: number;
  currentValue?: number;
  history: StockHistoryPoint[];
  graph?: string;
}

export interface PortfolioResponse {
  summary: PortfolioSummary;
  holdings: StockHolding[];
}

export interface Lesson {
  title: string;
  description: string;
  content: string;
}

export interface BlogPost {
  id: number;
  title: string;
  content: string;
  author?: string;
  datePosted?: string | null;
}

export interface StockRecommendation {
  name: string;
  price: number;
  recommendation: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface UserSession {
  authenticated: boolean;
  email?: string;
  userId?: number;
  subscriptionCode?: string | null;
}

export interface LoginResponse extends UserSession {}

export interface ContactPayload {
  name: string;
  email: string;
  message: string;
}
