import axios from 'axios';
import { Stock } from '../types';

// Alpha Vantage API (Free tier - 5 API requests per minute, 500 per day)
const ALPHA_VANTAGE_API_KEY = 'demo'; // Replace with your actual API key
const BASE_URL = 'https://www.alphavantage.co/query';

// Indian stock symbols mapping
export const INDIAN_STOCKS = {
  'RELIANCE.BSE': 'Reliance Industries Limited',
  'TCS.BSE': 'Tata Consultancy Services',
  'INFY.BSE': 'Infosys Limited',
  'HDFCBANK.BSE': 'HDFC Bank Limited',
  'ICICIBANK.BSE': 'ICICI Bank Limited',
  'HINDUNILVR.BSE': 'Hindustan Unilever Limited',
  'BHARTIARTL.BSE': 'Bharti Airtel Limited',
  'ASIANPAINT.BSE': 'Asian Paints Limited',
  'ITC.BSE': 'ITC Limited',
  'KOTAKBANK.BSE': 'Kotak Mahindra Bank'
};

// Real-time price simulation class
class RealTimeDataService {
  private subscribers: Map<string, ((data: Stock) => void)[]> = new Map();
  private intervals: Map<string, NodeJS.Timeout> = new Map();
  private stockPrices: Map<string, number> = new Map();

  constructor() {
    // Initialize with base prices
    this.initializePrices();
  }

  private initializePrices() {
    const basePrices = {
      'RELIANCE': 2847.65,
      'TCS': 3456.78,
      'INFY': 1523.90,
      'HDFCBANK': 1689.45,
      'ICICIBANK': 987.32,
      'HINDUNILVR': 2634.89,
      'BHARTIARTL': 1234.56,
      'ASIANPAINT': 3145.67,
      'ITC': 456.78,
      'KOTAKBANK': 1876.54
    };

    Object.entries(basePrices).forEach(([symbol, price]) => {
      this.stockPrices.set(symbol, price);
    });
  }

  // Simulate real-time price updates
  private simulateRealTimePrice(symbol: string): Stock {
    const currentPrice = this.stockPrices.get(symbol) || 1000;
    
    // Generate realistic price movement (-2% to +2%)
    const changePercent = (Math.random() - 0.5) * 4; // -2% to +2%
    const change = currentPrice * (changePercent / 100);
    const newPrice = Math.max(currentPrice + change, currentPrice * 0.95); // Minimum 5% drop protection
    
    // Update stored price
    this.stockPrices.set(symbol, newPrice);
    
    const stock: Stock = {
      id: symbol.toLowerCase(),
      symbol: symbol,
      name: INDIAN_STOCKS[`${symbol}.BSE` as keyof typeof INDIAN_STOCKS] || `${symbol} Limited`,
      price: newPrice,
      change: change,
      changePercent: changePercent,
      high: newPrice * (1 + Math.random() * 0.02),
      low: newPrice * (1 - Math.random() * 0.02),
      open: currentPrice,
      volume: Math.floor(Math.random() * 10000000) + 1000000,
      marketCap: newPrice * Math.floor(Math.random() * 1000000000) + 5000000000,
      sector: this.getSector(symbol)
    };

    return stock;
  }

  private getSector(symbol: string): string {
    const sectors: { [key: string]: string } = {
      'RELIANCE': 'Oil & Gas',
      'TCS': 'Information Technology',
      'INFY': 'Information Technology',
      'HDFCBANK': 'Banking',
      'ICICIBANK': 'Banking',
      'HINDUNILVR': 'FMCG',
      'BHARTIARTL': 'Telecom',
      'ASIANPAINT': 'Paints',
      'ITC': 'FMCG',
      'KOTAKBANK': 'Banking'
    };
    return sectors[symbol] || 'Others';
  }

  // Subscribe to real-time updates
  subscribe(symbol: string, callback: (data: Stock) => void) {
    if (!this.subscribers.has(symbol)) {
      this.subscribers.set(symbol, []);
    }
    
    this.subscribers.get(symbol)!.push(callback);
    
    // Start real-time updates if not already started
    if (!this.intervals.has(symbol)) {
      const interval = setInterval(() => {
        const stockData = this.simulateRealTimePrice(symbol);
        this.notifySubscribers(symbol, stockData);
      }, 2000 + Math.random() * 3000); // Random interval between 2-5 seconds
      
      this.intervals.set(symbol, interval);
    }

    // Send initial data
    callback(this.simulateRealTimePrice(symbol));
  }

  // Unsubscribe from updates
  unsubscribe(symbol: string, callback: (data: Stock) => void) {
    const subscribers = this.subscribers.get(symbol);
    if (subscribers) {
      const index = subscribers.indexOf(callback);
      if (index > -1) {
        subscribers.splice(index, 1);
      }
      
      // Stop updates if no more subscribers
      if (subscribers.length === 0) {
        const interval = this.intervals.get(symbol);
        if (interval) {
          clearInterval(interval);
          this.intervals.delete(symbol);
        }
        this.subscribers.delete(symbol);
      }
    }
  }

  private notifySubscribers(symbol: string, data: Stock) {
    const subscribers = this.subscribers.get(symbol);
    if (subscribers) {
      subscribers.forEach(callback => callback(data));
    }
  }

  // Fetch historical data (using Alpha Vantage)
  async fetchHistoricalData(symbol: string, timeframe: string = 'DAILY'): Promise<any> {
    try {
      const response = await axios.get(BASE_URL, {
        params: {
          function: timeframe === 'INTRADAY' ? 'TIME_SERIES_INTRADAY' : 'TIME_SERIES_DAILY',
          symbol: `${symbol}.BSE`,
          interval: timeframe === 'INTRADAY' ? '5min' : undefined,
          apikey: ALPHA_VANTAGE_API_KEY,
          outputsize: 'compact'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching historical data:', error);
      // Return mock data on error
      return this.generateMockHistoricalData(symbol, timeframe);
    }
  }

  // Generate mock historical data for demonstration
  private generateMockHistoricalData(symbol: string, timeframe: string) {
    const currentPrice = this.stockPrices.get(symbol) || 1000;
    const data: any = {};
    const timeSeriesKey = timeframe === 'INTRADAY' ? 'Time Series (5min)' : 'Time Series (Daily)';
    
    data[timeSeriesKey] = {};
    
    // Generate 30 days of data
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayChange = (Math.random() - 0.5) * 0.1; // ±5% daily change
      const price = currentPrice * (1 + dayChange * i * 0.01);
      
      data[timeSeriesKey][dateStr] = {
        '1. open': (price * (1 + (Math.random() - 0.5) * 0.02)).toFixed(2),
        '2. high': (price * (1 + Math.random() * 0.03)).toFixed(2),
        '3. low': (price * (1 - Math.random() * 0.03)).toFixed(2),
        '4. close': price.toFixed(2),
        '5. volume': Math.floor(Math.random() * 10000000).toString()
      };
    }
    
    return data;
  }

  // Fetch market indices (NIFTY, SENSEX)
  async fetchMarketIndices(): Promise<any[]> {
    // Simulate market indices data
    return [
      {
        name: 'NIFTY 50',
        value: 21456.78 + (Math.random() - 0.5) * 200,
        change: (Math.random() - 0.5) * 300,
        changePercent: (Math.random() - 0.5) * 2
      },
      {
        name: 'SENSEX',
        value: 71234.56 + (Math.random() - 0.5) * 1000,
        change: (Math.random() - 0.5) * 500,
        changePercent: (Math.random() - 0.5) * 1.5
      },
      {
        name: 'NIFTY BANK',
        value: 46789.12 + (Math.random() - 0.5) * 500,
        change: (Math.random() - 0.5) * 400,
        changePercent: (Math.random() - 0.5) * 2.5
      },
      {
        name: 'NIFTY IT',
        value: 34567.89 + (Math.random() - 0.5) * 300,
        change: (Math.random() - 0.5) * 250,
        changePercent: (Math.random() - 0.5) * 1.8
      }
    ];
  }

  // Get top gainers and losers
  getTopMovers(): { gainers: Stock[], losers: Stock[] } {
    const allStocks = Object.keys(INDIAN_STOCKS).map(symbol => 
      this.simulateRealTimePrice(symbol.split('.')[0])
    );

    const gainers = allStocks
      .filter(stock => stock.changePercent > 0)
      .sort((a, b) => b.changePercent - a.changePercent)
      .slice(0, 5);

    const losers = allStocks
      .filter(stock => stock.changePercent < 0)
      .sort((a, b) => a.changePercent - b.changePercent)
      .slice(0, 5);

    return { gainers, losers };
  }

  // Cleanup all subscriptions
  cleanup() {
    this.intervals.forEach(interval => clearInterval(interval));
    this.intervals.clear();
    this.subscribers.clear();
  }
}

// Export singleton instance
export const marketDataService = new RealTimeDataService();

// Export individual functions for easy use
export const {
  subscribe: subscribeToStock,
  unsubscribe: unsubscribeFromStock,
  fetchHistoricalData,
  fetchMarketIndices,
  getTopMovers,
  cleanup: cleanupMarketData
} = marketDataService;