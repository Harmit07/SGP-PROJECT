import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { TrendingUp, BarChart3, PieChart, Activity } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const TradingChart: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('1D');
  const [selectedChart, setSelectedChart] = useState('line');

  const timeframes = ['1D', '1W', '1M', '3M', '1Y'];
  const chartTypes = [
    { type: 'line', icon: Activity, label: 'Line' },
    { type: 'area', icon: TrendingUp, label: 'Area' },
    { type: 'bar', icon: BarChart3, label: 'Bar' },
    { type: 'candlestick', icon: PieChart, label: 'Candlestick' },
  ];

  // Generate sample data based on timeframe
  const generateData = (timeframe: string) => {
    const dataPoints = timeframe === '1D' ? 24 : timeframe === '1W' ? 7 : timeframe === '1M' ? 30 : timeframe === '3M' ? 90 : 365;
    const labels = [];
    const data = [];
    const basePrice = 2847.65;

    for (let i = 0; i < dataPoints; i++) {
      if (timeframe === '1D') {
        labels.push(`${i}:00`);
      } else if (timeframe === '1W') {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        labels.push(days[i]);
      } else {
        labels.push(`Day ${i + 1}`);
      }
      
      // Generate realistic price movements
      const change = (Math.random() - 0.5) * 50;
      const price = Math.max(basePrice + change * (i / dataPoints), basePrice * 0.8);
      data.push(price);
    }

    return { labels, data };
  };

  const chartData = generateData(selectedTimeframe);

  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: 'RELIANCE',
        data: chartData.data,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: selectedChart === 'area' ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
        fill: selectedChart === 'area',
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(59, 130, 246, 0.3)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: (context: any) => `₹${context.parsed.y.toFixed(2)}`,
        },
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false,
        },
        ticks: {
          color: 'rgba(156, 163, 175, 0.8)',
          maxTicksLimit: 8,
        },
      },
      y: {
        display: true,
        position: 'right' as const,
        grid: {
          color: 'rgba(156, 163, 175, 0.1)',
        },
        ticks: {
          color: 'rgba(156, 163, 175, 0.8)',
          callback: (value: any) => `₹${value.toFixed(0)}`,
        },
      },
    },
  };

  return (
    <section id="trading" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Advanced Trading <span className="text-gradient">Charts</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Professional-grade charting tools with real-time data and technical indicators
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="card-glass p-6 rounded-2xl"
        >
          {/* Chart Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">RELIANCE</h3>
                <p className="text-gray-600 dark:text-gray-400">Reliance Industries Limited</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">₹2,847.65</span>
                <div className="flex items-center space-x-1 text-green-500">
                  <TrendingUp className="w-4 h-4" />
                  <span className="font-medium">+23.45 (0.83%)</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              {/* Chart Type Selector */}
              <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                {chartTypes.map((chart) => (
                  <motion.button
                    key={chart.type}
                    onClick={() => setSelectedChart(chart.type)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      selectedChart === chart.type
                        ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <chart.icon className="w-4 h-4" />
                    <span>{chart.label}</span>
                  </motion.button>
                ))}
              </div>

              {/* Timeframe Selector */}
              <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                {timeframes.map((timeframe) => (
                  <motion.button
                    key={timeframe}
                    onClick={() => setSelectedTimeframe(timeframe)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      selectedTimeframe === timeframe
                        ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {timeframe}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="h-96 lg:h-[500px]">
            <Line data={data} options={options} />
          </div>

          {/* Chart Footer */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Open', value: '₹2,824.20' },
              { label: 'High', value: '₹2,855.00', color: 'text-green-500' },
              { label: 'Low', value: '₹2,820.30', color: 'text-red-500' },
              { label: 'Volume', value: '23.4M' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                <p className={`text-lg font-semibold ${stat.color || 'text-gray-900 dark:text-white'}`}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TradingChart;