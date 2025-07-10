import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { mockStocks, marketIndices } from '../data/mockData';

const StockTicker: React.FC = () => {
  const allStocks = [...marketIndices.map(index => ({
    ...index,
    symbol: index.name,
    price: index.value
  })), ...mockStocks];

  const formatNumber = (num: number) => {
    if (num >= 1000000000) {
      return `₹${(num / 1000000000).toFixed(1)}B`;
    } else if (num >= 1000000) {
      return `₹${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `₹${(num / 1000).toFixed(1)}K`;
    }
    return `₹${num.toFixed(2)}`;
  };

  return (
    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-y border-white/20 dark:border-gray-700/50 py-4 overflow-hidden">
      <div className="relative">
        <motion.div
          className="flex space-x-8 whitespace-nowrap"
          animate={{ x: [0, -2000] }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          {/* Duplicate the array to create seamless loop */}
          {[...allStocks, ...allStocks].map((stock, index) => (
            <motion.div
              key={`${stock.symbol}-${index}`}
              className="flex items-center space-x-3 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/30 dark:border-gray-700/30"
              whileHover={{ scale: 1.05, y: -2 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-gray-900 dark:text-white text-sm">
                  {stock.symbol}
                </span>
                <span className="text-gray-600 dark:text-gray-400 text-sm">
                  {formatNumber(stock.price)}
                </span>
              </div>
              
              <div className={`flex items-center space-x-1 ${
                stock.change >= 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {stock.change >= 0 ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                <span className="text-xs font-medium">
                  {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}
                </span>
                <span className="text-xs">
                  ({stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Gradient overlays for smooth fade effect */}
        <div className="absolute left-0 top-0 h-full w-20 bg-gradient-to-r from-white/80 to-transparent dark:from-gray-900/80 pointer-events-none"></div>
        <div className="absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-white/80 to-transparent dark:from-gray-900/80 pointer-events-none"></div>
      </div>
    </div>
  );
};

export default StockTicker;