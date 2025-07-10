import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  BarChart3,
  RefreshCw,
  Clock,
  DollarSign,
  Zap,
  Globe
} from 'lucide-react';
import { marketDataService, INDIAN_STOCKS } from '../services/marketDataService';
import { Stock } from '../types';
import { format } from 'date-fns';

interface MarketIndex {
  name: string;
  value: number;
  change: number;
  changePercent: number;
}

const RealTimeMarketData: React.FC = () => {
  const [liveStocks, setLiveStocks] = useState<Stock[]>([]);
  const [marketIndices, setMarketIndices] = useState<MarketIndex[]>([]);
  const [topMovers, setTopMovers] = useState<{ gainers: Stock[], losers: Stock[] }>({ gainers: [], losers: [] });
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    // Subscribe to multiple stocks for real-time updates
    const stockSymbols = Object.keys(INDIAN_STOCKS).map(key => key.split('.')[0]);
    const subscriptions: Array<(data: Stock) => void> = [];

    // Subscribe to first 6 stocks for live display
    stockSymbols.slice(0, 6).forEach(symbol => {
      const callback = (stockData: Stock) => {
        setLiveStocks(prev => {
          const filtered = prev.filter(s => s.symbol !== symbol);
          return [...filtered, stockData].sort((a, b) => a.symbol.localeCompare(b.symbol));
        });
        setLastUpdated(new Date());
      };
      
      subscriptions.push(callback);
      marketDataService.subscribe(symbol, callback);
    });

    // Fetch market indices
    const updateMarketData = async () => {
      const indices = await marketDataService.fetchMarketIndices();
      setMarketIndices(indices);
      
      const movers = marketDataService.getTopMovers();
      setTopMovers(movers);
    };

    updateMarketData();

    // Update market data every 10 seconds
    const interval = setInterval(() => {
      updateMarketData();
    }, 10000);

    return () => {
      clearInterval(interval);
      // Cleanup subscriptions
      stockSymbols.slice(0, 6).forEach((symbol, index) => {
        marketDataService.unsubscribe(symbol, subscriptions[index]);
      });
    };
  }, []);

  const refreshData = async () => {
    setIsRefreshing(true);
    
    // Simulate refresh delay
    setTimeout(() => {
      const movers = marketDataService.getTopMovers();
      setTopMovers(movers);
      setLastUpdated(new Date());
      setIsRefreshing(false);
    }, 1000);
  };

  const getChangeColor = (change: number) => {
    return change >= 0 ? 'text-green-500' : 'text-red-500';
  };

  const getChangeBgColor = (change: number) => {
    return change >= 0 
      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
      : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
  };

  const formatChange = (change: number, isPercent: boolean = false) => {
    const prefix = change >= 0 ? '+' : '';
    const suffix = isPercent ? '%' : '';
    return `${prefix}${change.toFixed(2)}${suffix}`;
  };

  return (
    <section className="py-20 bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <motion.div
              className="w-16 h-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl flex items-center justify-center mr-4"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            >
              <Activity className="w-8 h-8 text-white" />
            </motion.div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                Live Market <span className="text-gradient">Data</span>
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Real-time Indian stock market updates
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>Last updated: {format(lastUpdated, 'HH:mm:ss')}</span>
            </div>
            <motion.button
              onClick={refreshData}
              disabled={isRefreshing}
              className="flex items-center space-x-1 px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Market Indices */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <Globe className="w-6 h-6 mr-2 text-blue-500" />
            Market Indices
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {marketIndices.map((index, idx) => (
              <motion.div
                key={index.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`card-glass p-6 rounded-2xl border ${getChangeBgColor(index.change)}`}
              >
                <div className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  {index.name}
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {index.value.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                </div>
                <div className={`flex items-center space-x-1 ${getChangeColor(index.change)}`}>
                  {index.change >= 0 ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span className="text-sm font-medium">
                    {formatChange(index.change)} ({formatChange(index.changePercent, true)})
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Live Stock Prices */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <Zap className="w-6 h-6 mr-2 text-yellow-500" />
            Live Stock Prices
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveStocks.map((stock, idx) => (
              <motion.div
                key={stock.symbol}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className={`card-glass p-6 rounded-2xl border ${getChangeBgColor(stock.change)}`}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {stock.symbol}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {stock.name}
                    </div>
                  </div>
                  <div className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-300">
                    {stock.sector}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Price</span>
                    <span className="text-xl font-bold text-gray-900 dark:text-white">
                      ₹{stock.price.toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Change</span>
                    <div className={`flex items-center space-x-1 ${getChangeColor(stock.change)}`}>
                      {stock.change >= 0 ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      <span className="font-medium">
                        {formatChange(stock.change)} ({formatChange(stock.changePercent, true)})
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-200 dark:border-gray-700">
                    <div>
                      <div className="text-xs text-gray-500">High</div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        ₹{stock.high.toFixed(2)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Low</div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        ₹{stock.low.toFixed(2)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <div className="text-xs text-gray-500">Volume</div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {stock.volume.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Top Gainers & Losers */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Top Gainers */}
          <div className="card-glass p-6 rounded-2xl">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
              Top Gainers
            </h3>
            
            <div className="space-y-4">
              {topMovers.gainers.map((stock, idx) => (
                <motion.div
                  key={stock.symbol}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg"
                >
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {stock.symbol}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      ₹{stock.price.toFixed(2)}
                    </div>
                  </div>
                  <div className="text-right text-green-600">
                    <div className="font-bold">
                      +{stock.changePercent.toFixed(2)}%
                    </div>
                    <div className="text-sm">
                      +₹{stock.change.toFixed(2)}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Top Losers */}
          <div className="card-glass p-6 rounded-2xl">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <TrendingDown className="w-5 h-5 mr-2 text-red-500" />
              Top Losers
            </h3>
            
            <div className="space-y-4">
              {topMovers.losers.map((stock, idx) => (
                <motion.div
                  key={stock.symbol}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg"
                >
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {stock.symbol}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      ₹{stock.price.toFixed(2)}
                    </div>
                  </div>
                  <div className="text-right text-red-600">
                    <div className="font-bold">
                      {stock.changePercent.toFixed(2)}%
                    </div>
                    <div className="text-sm">
                      ₹{stock.change.toFixed(2)}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default RealTimeMarketData;