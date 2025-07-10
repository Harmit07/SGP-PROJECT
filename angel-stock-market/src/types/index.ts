export interface Stock {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  open: number;
  volume: number;
  marketCap: number;
  sector: string;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    fill?: boolean;
    tension?: number;
  }[];
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  publishedAt: string;
  url: string;
  image?: string;
}

export interface Watchlist {
  id: string;
  name: string;
  stocks: Stock[];
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  portfolio: Portfolio;
  watchlists: Watchlist[];
}

export interface Portfolio {
  totalValue: number;
  totalGain: number;
  totalGainPercent: number;
  holdings: Holding[];
}

export interface Holding {
  stock: Stock;
  quantity: number;
  averagePrice: number;
  currentValue: number;
  gain: number;
  gainPercent: number;
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
  gradient: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  avatar: string;
  rating: number;
}

export interface ContactForm {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export interface LoginForm {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}