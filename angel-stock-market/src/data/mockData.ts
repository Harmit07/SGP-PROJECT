import { Stock, Feature, Testimonial, NewsItem } from '../types';

export const mockStocks: Stock[] = [
  {
    id: '1',
    symbol: 'RELIANCE',
    name: 'Reliance Industries Limited',
    price: 2847.65,
    change: 23.45,
    changePercent: 0.83,
    high: 2855.00,
    low: 2820.30,
    open: 2824.20,
    volume: 2345678,
    marketCap: 19234567890,
    sector: 'Oil & Gas'
  },
  {
    id: '2',
    symbol: 'TCS',
    name: 'Tata Consultancy Services',
    price: 3456.78,
    change: -12.34,
    changePercent: -0.36,
    high: 3470.00,
    low: 3445.20,
    open: 3469.12,
    volume: 1876543,
    marketCap: 12567891234,
    sector: 'Information Technology'
  },
  {
    id: '3',
    symbol: 'INFY',
    name: 'Infosys Limited',
    price: 1523.90,
    change: 8.76,
    changePercent: 0.58,
    high: 1530.00,
    low: 1515.20,
    open: 1515.14,
    volume: 3456789,
    marketCap: 6543210987,
    sector: 'Information Technology'
  },
  {
    id: '4',
    symbol: 'HDFCBANK',
    name: 'HDFC Bank Limited',
    price: 1689.45,
    change: 15.67,
    changePercent: 0.94,
    high: 1695.00,
    low: 1673.80,
    open: 1673.78,
    volume: 2987654,
    marketCap: 9876543210,
    sector: 'Banking'
  },
  {
    id: '5',
    symbol: 'ICICIBANK',
    name: 'ICICI Bank Limited',
    price: 987.32,
    change: -5.43,
    changePercent: -0.55,
    high: 995.00,
    low: 985.10,
    open: 992.75,
    volume: 4567890,
    marketCap: 6789012345,
    sector: 'Banking'
  },
  {
    id: '6',
    symbol: 'HINDUNILVR',
    name: 'Hindustan Unilever Limited',
    price: 2634.89,
    change: 32.11,
    changePercent: 1.23,
    high: 2640.00,
    low: 2602.78,
    open: 2602.78,
    volume: 1234567,
    marketCap: 6234567890,
    sector: 'FMCG'
  },
  {
    id: '7',
    symbol: 'BHARTIARTL',
    name: 'Bharti Airtel Limited',
    price: 1234.56,
    change: -7.89,
    changePercent: -0.63,
    high: 1245.00,
    low: 1230.45,
    open: 1242.45,
    volume: 5678901,
    marketCap: 6789123456,
    sector: 'Telecom'
  },
  {
    id: '8',
    symbol: 'ASIANPAINT',
    name: 'Asian Paints Limited',
    price: 3145.67,
    change: 18.90,
    changePercent: 0.60,
    high: 3150.00,
    low: 3126.77,
    open: 3126.77,
    volume: 876543,
    marketCap: 3012345678,
    sector: 'Paints'
  }
];

export const features: Feature[] = [
  {
    id: '1',
    title: 'Real-time Trading',
    description: 'Execute trades instantly with our advanced real-time trading platform featuring lightning-fast order execution.',
    icon: 'Zap',
    gradient: 'from-blue-500 to-purple-600'
  },
  {
    id: '2',
    title: 'Advanced Charts',
    description: 'Analyze market trends with professional-grade charting tools and technical indicators.',
    icon: 'TrendingUp',
    gradient: 'from-green-500 to-blue-600'
  },
  {
    id: '3',
    title: 'Smart Portfolio',
    description: 'Manage your investments intelligently with AI-powered portfolio optimization and risk management.',
    icon: 'PieChart',
    gradient: 'from-purple-500 to-pink-600'
  },
  {
    id: '4',
    title: 'Market Research',
    description: 'Access comprehensive market research, analyst reports, and real-time news updates.',
    icon: 'Search',
    gradient: 'from-orange-500 to-red-600'
  },
  {
    id: '5',
    title: 'Mobile Trading',
    description: 'Trade on-the-go with our award-winning mobile app featuring all desktop functionalities.',
    icon: 'Smartphone',
    gradient: 'from-teal-500 to-cyan-600'
  },
  {
    id: '6',
    title: 'Secure Platform',
    description: 'Your investments are protected with bank-grade security and 256-bit SSL encryption.',
    icon: 'Shield',
    gradient: 'from-indigo-500 to-purple-600'
  }
];

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    role: 'Investment Manager',
    company: 'Mumbai Financial Services',
    content: 'Angel Stock Market has transformed my trading experience. The real-time analytics and user-friendly interface make it perfect for both beginners and professionals.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    rating: 5
  },
  {
    id: '2',
    name: 'Priya Sharma',
    role: 'Portfolio Manager',
    company: 'Delhi Investment Group',
    content: 'The advanced charting tools and market research features have significantly improved my investment decisions. Highly recommended for serious traders.',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face',
    rating: 5
  },
  {
    id: '3',
    name: 'Amit Patel',
    role: 'Day Trader',
    company: 'Independent Trader',
    content: 'Lightning-fast execution and minimal latency have given me a competitive edge in day trading. The mobile app is exceptional for trading on the move.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    rating: 5
  },
  {
    id: '4',
    name: 'Sneha Reddy',
    role: 'Financial Advisor',
    company: 'Bangalore Wealth Management',
    content: 'The portfolio management tools and risk analytics help me provide better advice to my clients. The platform is intuitive and feature-rich.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    rating: 4
  }
];

export const newsItems: NewsItem[] = [
  {
    id: '1',
    title: 'Market Reaches New All-Time High Amid Strong Economic Data',
    summary: 'Indian stock markets surged to record levels following positive economic indicators and strong corporate earnings.',
    source: 'Financial Express',
    publishedAt: '2024-01-15T10:30:00Z',
    url: '#',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=200&fit=crop'
  },
  {
    id: '2',
    title: 'Technology Sector Leads Market Rally with 3% Gains',
    summary: 'IT stocks outperformed broader markets as investors showed renewed confidence in technology companies.',
    source: 'Economic Times',
    publishedAt: '2024-01-15T09:15:00Z',
    url: '#',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop'
  },
  {
    id: '3',
    title: 'Banking Stocks Rise on Interest Rate Optimism',
    summary: 'Banking sector witnessed significant buying interest as investors anticipate favorable interest rate decisions.',
    source: 'Business Standard',
    publishedAt: '2024-01-15T08:45:00Z',
    url: '#',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=200&fit=crop'
  }
];

export const chartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Portfolio Value',
      data: [65000, 68000, 72000, 70000, 75000, 78000],
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      fill: true,
      tension: 0.4
    }
  ]
};

export const marketIndices = [
  { name: 'NIFTY 50', value: 21456.78, change: 156.34, changePercent: 0.73 },
  { name: 'SENSEX', value: 71234.56, change: 289.67, changePercent: 0.41 },
  { name: 'NIFTY BANK', value: 46789.12, change: -89.45, changePercent: -0.19 },
  { name: 'NIFTY IT', value: 34567.89, change: 234.56, changePercent: 0.68 }
];