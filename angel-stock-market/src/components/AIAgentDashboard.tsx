import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  AlertTriangle,
  Target,
  Eye,
  Zap,
  BarChart3,
  Clock,
  CheckCircle,
  XCircle,
  Minus,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import { 
  aiAgentService, 
  AIPrediction, 
  SentimentAnalysis, 
  TechnicalIndicator,
  AIInsight
} from '../services/aiAgentService';
import { marketDataService } from '../services/marketDataService';
import { Stock } from '../types';
import { format } from 'date-fns';

const AIAgentDashboard: React.FC = () => {
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [prediction, setPrediction] = useState<AIPrediction | null>(null);
  const [sentiment, setSentiment] = useState<SentimentAnalysis | null>(null);
  const [technicalIndicators, setTechnicalIndicators] = useState<TechnicalIndicator[]>([]);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [marketSummary, setMarketSummary] = useState(aiAgentService.generateMarketSummary());
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'predictions' | 'sentiment' | 'technical' | 'insights'>('predictions');

  // Mock stock data for demonstration
  const sampleStocks = [
    { symbol: 'RELIANCE', name: 'Reliance Industries', sector: 'Oil & Gas' },
    { symbol: 'TCS', name: 'Tata Consultancy Services', sector: 'Information Technology' },
    { symbol: 'INFY', name: 'Infosys Limited', sector: 'Information Technology' },
    { symbol: 'HDFCBANK', name: 'HDFC Bank', sector: 'Banking' },
    { symbol: 'ICICIBANK', name: 'ICICI Bank', sector: 'Banking' }
  ];

  useEffect(() => {
    // Load initial insights
    setInsights(aiAgentService.generateInsights());
    
    // Auto-refresh insights every 30 seconds
    const interval = setInterval(() => {
      setInsights(aiAgentService.generateInsights());
      setMarketSummary(aiAgentService.generateMarketSummary());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleStockSelect = async (stockSymbol: string) => {
    setLoading(true);
    
    // Subscribe to real-time data for selected stock
    marketDataService.subscribe(stockSymbol, (stockData: Stock) => {
      setSelectedStock(stockData);
      
      // Generate AI analysis
      const newPrediction = aiAgentService.generatePrediction(stockData);
      const newSentiment = aiAgentService.generateSentimentAnalysis(stockData);
      const newTechnicalIndicators = aiAgentService.generateTechnicalIndicators(stockData);
      
      setPrediction(newPrediction);
      setSentiment(newSentiment);
      setTechnicalIndicators(newTechnicalIndicators);
      setLoading(false);
    });
  };

  const refreshAnalysis = () => {
    if (selectedStock) {
      const newPrediction = aiAgentService.generatePrediction(selectedStock);
      const newSentiment = aiAgentService.generateSentimentAnalysis(selectedStock);
      const newTechnicalIndicators = aiAgentService.generateTechnicalIndicators(selectedStock);
      
      setPrediction(newPrediction);
      setSentiment(newSentiment);
      setTechnicalIndicators(newTechnicalIndicators);
    }
  };

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'BUY': return 'text-green-500 bg-green-50 dark:bg-green-900/20';
      case 'SELL': return 'text-red-500 bg-red-50 dark:bg-red-900/20';
      default: return 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'BULLISH': return 'text-green-500';
      case 'BEARISH': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getSignalIcon = (signal: string) => {
    switch (signal) {
      case 'BUY': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'SELL': return <TrendingDown className="w-4 h-4 text-red-500" />;
      default: return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'PREDICTION': return <Target className="w-5 h-5" />;
      case 'ALERT': return <AlertTriangle className="w-5 h-5" />;
      case 'INSIGHT': return <Eye className="w-5 h-5" />;
      case 'NEWS': return <Activity className="w-5 h-5" />;
      default: return <Brain className="w-5 h-5" />;
    }
  };

  const getInsightColor = (severity: string) => {
    switch (severity) {
      case 'SUCCESS': return 'border-green-500/30 bg-green-50/50 dark:bg-green-900/10';
      case 'WARNING': return 'border-yellow-500/30 bg-yellow-50/50 dark:bg-yellow-900/10';
      case 'DANGER': return 'border-red-500/30 bg-red-50/50 dark:bg-red-900/10';
      default: return 'border-blue-500/30 bg-blue-50/50 dark:bg-blue-900/10';
    }
  };

  return (
    <section id="ai-agent" className="py-20 bg-gray-50 dark:bg-gray-900">
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
              className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mr-4"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Brain className="w-8 h-8 text-white" />
            </motion.div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                AI Trading <span className="text-gradient">Assistant</span>
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Advanced predictions powered by machine learning
              </p>
            </div>
          </div>
        </motion.div>

        {/* Market Summary */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="card-glass p-6 rounded-2xl mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Market AI Summary</h3>
            <div className="flex items-center space-x-2">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${getSentimentColor(marketSummary.marketSentiment)}`}>
                {marketSummary.marketSentiment}
              </div>
              <div className="text-sm text-gray-500">
                Confidence: {marketSummary.aiConfidence.toFixed(0)}%
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Key Themes</h4>
              <ul className="space-y-2">
                {marketSummary.keyThemes.map((theme, index) => (
                  <li key={index} className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>{theme}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Risk Factors</h4>
              <ul className="space-y-2">
                {marketSummary.riskFactors.map((risk, index) => (
                  <li key={index} className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                    <span>{risk}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Opportunities</h4>
              <ul className="space-y-2">
                {marketSummary.opportunities.map((opportunity, index) => (
                  <li key={index} className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                    <Target className="w-4 h-4 text-blue-500" />
                    <span>{opportunity}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Stock Selection & Analysis */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stock Selector */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="card-glass p-6 rounded-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Select Stock for AI Analysis</h3>
                {selectedStock && (
                  <motion.button
                    onClick={refreshAnalysis}
                    className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <RefreshCw className="w-4 h-4" />
                  </motion.button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {sampleStocks.map((stock) => (
                  <motion.button
                    key={stock.symbol}
                    onClick={() => handleStockSelect(stock.symbol)}
                    className={`p-4 rounded-xl border-2 text-left transition-all duration-300 ${
                      selectedStock?.symbol === stock.symbol
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="font-semibold text-gray-900 dark:text-white">{stock.symbol}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{stock.name}</div>
                    <div className="text-xs text-gray-500 mt-1">{stock.sector}</div>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Analysis Tabs */}
            {selectedStock && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="card-glass rounded-2xl overflow-hidden"
              >
                {/* Tab Headers */}
                <div className="flex border-b border-gray-200 dark:border-gray-700">
                  {[
                    { key: 'predictions', label: 'AI Predictions', icon: Target },
                    { key: 'sentiment', label: 'Sentiment', icon: Activity },
                    { key: 'technical', label: 'Technical', icon: BarChart3 },
                    { key: 'insights', label: 'Insights', icon: Brain }
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key as any)}
                      className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 transition-all duration-300 ${
                        activeTab === tab.key
                          ? 'border-b-2 border-blue-500 bg-blue-50/50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      <tab.icon className="w-4 h-4" />
                      <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="p-6">
                  <AnimatePresence mode="wait">
                    {loading ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center justify-center py-12"
                      >
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"
                        />
                        <span className="ml-3 text-gray-600 dark:text-gray-400">Analyzing with AI...</span>
                      </motion.div>
                    ) : (
                      <>
                        {/* Predictions Tab */}
                        {activeTab === 'predictions' && prediction && (
                          <motion.div
                            key="predictions"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-4">
                                <div>
                                  <label className="text-sm text-gray-600 dark:text-gray-400">Current Price</label>
                                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                    ₹{prediction.currentPrice.toFixed(2)}
                                  </div>
                                </div>
                                <div>
                                  <label className="text-sm text-gray-600 dark:text-gray-400">Predicted Price ({prediction.timeHorizon})</label>
                                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                    ₹{prediction.predictedPrice.toFixed(2)}
                                  </div>
                                </div>
                                <div>
                                  <label className="text-sm text-gray-600 dark:text-gray-400">Target Price</label>
                                  <div className="text-xl font-semibold text-green-600 dark:text-green-400">
                                    ₹{prediction.targetPrice.toFixed(2)}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="space-y-4">
                                <div>
                                  <label className="text-sm text-gray-600 dark:text-gray-400">Recommendation</label>
                                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getRecommendationColor(prediction.recommendation)}`}>
                                    {prediction.recommendation}
                                  </div>
                                </div>
                                <div>
                                  <label className="text-sm text-gray-600 dark:text-gray-400">Confidence</label>
                                  <div className="flex items-center space-x-2">
                                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                      <div 
                                        className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500"
                                        style={{ width: `${prediction.confidence}%` }}
                                      />
                                    </div>
                                    <span className="text-sm font-medium">{prediction.confidence.toFixed(0)}%</span>
                                  </div>
                                </div>
                                <div>
                                  <label className="text-sm text-gray-600 dark:text-gray-400">Risk Level</label>
                                  <div className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                                    prediction.riskLevel === 'HIGH' ? 'text-red-600 bg-red-100 dark:bg-red-900/20' :
                                    prediction.riskLevel === 'MEDIUM' ? 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20' :
                                    'text-green-600 bg-green-100 dark:bg-green-900/20'
                                  }`}>
                                    {prediction.riskLevel}
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">AI Reasoning</label>
                              <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                {prediction.reasoning}
                              </p>
                            </div>
                          </motion.div>
                        )}

                        {/* Sentiment Tab */}
                        {activeTab === 'sentiment' && sentiment && (
                          <motion.div
                            key="sentiment"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                          >
                            <div className="text-center">
                              <div className={`text-4xl font-bold mb-2 ${getSentimentColor(sentiment.sentiment)}`}>
                                {sentiment.sentiment}
                              </div>
                              <div className="text-2xl font-semibold text-gray-600 dark:text-gray-400">
                                Score: {sentiment.score.toFixed(1)}
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                <div className="text-2xl font-bold text-blue-600">{sentiment.newsCount}</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">News Articles</div>
                              </div>
                              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                <div className="text-2xl font-bold text-purple-600">{sentiment.socialMentions}</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Social Mentions</div>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Key Factors</h4>
                              <div className="space-y-2">
                                {sentiment.factors.map((factor, index) => (
                                  <div key={index} className="flex items-center space-x-2">
                                    <ChevronRight className="w-4 h-4 text-blue-500" />
                                    <span className="text-gray-700 dark:text-gray-300">{factor}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {/* Technical Tab */}
                        {activeTab === 'technical' && technicalIndicators.length > 0 && (
                          <motion.div
                            key="technical"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-4"
                          >
                            {technicalIndicators.map((indicator, index) => (
                              <motion.div
                                key={indicator.name}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                              >
                                <div className="flex-1">
                                  <div className="font-semibold text-gray-900 dark:text-white">{indicator.name}</div>
                                  <div className="text-sm text-gray-600 dark:text-gray-400">{indicator.description}</div>
                                </div>
                                <div className="text-right">
                                  <div className="font-semibold text-gray-900 dark:text-white">
                                    {typeof indicator.value === 'number' ? indicator.value.toFixed(2) : indicator.value}
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    {getSignalIcon(indicator.signal)}
                                    <span className="text-sm">{indicator.signal}</span>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </motion.div>
                        )}
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </div>

          {/* AI Insights Feed */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="card-glass p-6 rounded-2xl h-fit"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">AI Insights Feed</h3>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-3 h-3 bg-green-500 rounded-full"
              />
            </div>
            
            <div className="space-y-4 max-h-96 overflow-y-auto scrollbar-hide">
              {insights.map((insight, index) => (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg border-l-4 ${getInsightColor(insight.severity)}`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="mt-1">
                      {getInsightIcon(insight.type)}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                        {insight.title}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                        {insight.content}
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{format(insight.timestamp, 'HH:mm')}</span>
                        </div>
                        <div className="flex space-x-1">
                          {insight.symbols.map((symbol) => (
                            <span key={symbol} className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs">
                              {symbol}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AIAgentDashboard;