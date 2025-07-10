import { Stock } from '../types';

// AI Prediction types
export interface AIPrediction {
  symbol: string;
  currentPrice: number;
  predictedPrice: number;
  targetPrice: number;
  timeHorizon: '1D' | '1W' | '1M' | '3M';
  confidence: number; // 0-100
  recommendation: 'BUY' | 'SELL' | 'HOLD';
  reasoning: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface SentimentAnalysis {
  symbol: string;
  sentiment: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  score: number; // -100 to 100
  newsCount: number;
  socialMentions: number;
  factors: string[];
}

export interface TechnicalIndicator {
  name: string;
  value: number;
  signal: 'BUY' | 'SELL' | 'NEUTRAL';
  description: string;
}

export interface AIInsight {
  id: string;
  title: string;
  content: string;
  type: 'PREDICTION' | 'ALERT' | 'INSIGHT' | 'NEWS';
  severity: 'INFO' | 'WARNING' | 'SUCCESS' | 'DANGER';
  timestamp: Date;
  symbols: string[];
}

class AIAgentService {
  private newsHeadlines = [
    "Q3 earnings season shows strong growth across IT sector",
    "RBI monetary policy meeting scheduled for next week",
    "FII inflows continue to support market sentiment",
    "Banking sector shows resilience amid global concerns",
    "Oil prices impact energy sector stocks",
    "Monsoon forecast positive for agricultural stocks",
    "Digital transformation driving IT stock valuations",
    "Infrastructure spending boost expected",
    "Export growth supports pharmaceutical sector",
    "Auto sector recovery gaining momentum"
  ];

  private marketFactors = [
    "Strong quarterly earnings",
    "Positive management guidance",
    "Sector rotation trends",
    "Global market sentiment",
    "FII/DII activity",
    "Government policy changes",
    "Commodity price movements",
    "Currency fluctuations",
    "Economic indicators",
    "Technical breakouts"
  ];

  // Generate AI prediction for a stock
  generatePrediction(stock: Stock, timeHorizon: '1D' | '1W' | '1M' | '3M' = '1W'): AIPrediction {
    const currentPrice = stock.price;
    
    // Simulate AI prediction based on various factors
    const trend = this.analyzeTrend(stock);
    const volatility = this.calculateVolatility(stock);
    const sectorSentiment = this.getSectorSentiment(stock.sector);
    
    // Generate prediction range based on timeframe
    const predictionRange = this.getPredictionRange(timeHorizon);
    const baseChange = (Math.random() - 0.5) * predictionRange;
    
    // Adjust based on trend and sentiment
    const trendAdjustment = trend * 0.3;
    const sentimentAdjustment = sectorSentiment * 0.2;
    
    const finalChange = baseChange + trendAdjustment + sentimentAdjustment;
    const predictedPrice = currentPrice * (1 + finalChange);
    const targetPrice = predictedPrice * (1 + (Math.random() - 0.5) * 0.1);
    
    // Calculate confidence based on various factors
    const confidence = Math.max(60, Math.min(95, 
      80 - (volatility * 10) + (Math.abs(trend) * 10)
    ));
    
    // Determine recommendation
    let recommendation: 'BUY' | 'SELL' | 'HOLD';
    if (finalChange > 0.05) recommendation = 'BUY';
    else if (finalChange < -0.05) recommendation = 'SELL';
    else recommendation = 'HOLD';
    
    // Generate reasoning
    const reasoning = this.generateReasoning(stock, finalChange, trend, sectorSentiment);
    
    // Assess risk level
    const riskLevel = volatility > 0.3 ? 'HIGH' : volatility > 0.15 ? 'MEDIUM' : 'LOW';

    return {
      symbol: stock.symbol,
      currentPrice,
      predictedPrice,
      targetPrice,
      timeHorizon,
      confidence,
      recommendation,
      reasoning,
      riskLevel
    };
  }

  // Generate sentiment analysis
  generateSentimentAnalysis(stock: Stock): SentimentAnalysis {
    const sectors = {
      'Information Technology': 0.2,
      'Banking': 0.1,
      'Oil & Gas': -0.1,
      'FMCG': 0.15,
      'Telecom': 0.05,
      'Paints': 0.1
    };
    
    const baseSentiment = sectors[stock.sector as keyof typeof sectors] || 0;
    const randomFactor = (Math.random() - 0.5) * 0.4;
    const sentimentScore = (baseSentiment + randomFactor) * 100;
    
    let sentiment: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
    if (sentimentScore > 20) sentiment = 'BULLISH';
    else if (sentimentScore < -20) sentiment = 'BEARISH';
    else sentiment = 'NEUTRAL';
    
    const factors = this.getRandomFactors(3);
    
    return {
      symbol: stock.symbol,
      sentiment,
      score: sentimentScore,
      newsCount: Math.floor(Math.random() * 50) + 10,
      socialMentions: Math.floor(Math.random() * 1000) + 100,
      factors
    };
  }

  // Generate technical indicators
  generateTechnicalIndicators(stock: Stock): TechnicalIndicator[] {
    const indicators: TechnicalIndicator[] = [
      {
        name: 'RSI (14)',
        value: 30 + Math.random() * 40,
        signal: 'NEUTRAL',
        description: 'Relative Strength Index indicates momentum'
      },
      {
        name: 'MACD',
        value: (Math.random() - 0.5) * 10,
        signal: 'NEUTRAL',
        description: 'Moving Average Convergence Divergence'
      },
      {
        name: 'Moving Average (50)',
        value: stock.price * (0.95 + Math.random() * 0.1),
        signal: 'NEUTRAL',
        description: '50-day Simple Moving Average'
      },
      {
        name: 'Bollinger Bands',
        value: Math.random(),
        signal: 'NEUTRAL',
        description: 'Price position within Bollinger Bands'
      },
      {
        name: 'Volume Ratio',
        value: 0.5 + Math.random(),
        signal: 'NEUTRAL',
        description: 'Current volume vs average volume'
      }
    ];

    // Assign signals based on values
    indicators.forEach(indicator => {
      switch (indicator.name) {
        case 'RSI (14)':
          if (indicator.value < 30) indicator.signal = 'BUY';
          else if (indicator.value > 70) indicator.signal = 'SELL';
          break;
        case 'MACD':
          indicator.signal = indicator.value > 0 ? 'BUY' : 'SELL';
          break;
        case 'Moving Average (50)':
          indicator.signal = stock.price > indicator.value ? 'BUY' : 'SELL';
          break;
        case 'Bollinger Bands':
          if (indicator.value < 0.2) indicator.signal = 'BUY';
          else if (indicator.value > 0.8) indicator.signal = 'SELL';
          break;
        case 'Volume Ratio':
          indicator.signal = indicator.value > 1.2 ? 'BUY' : 'NEUTRAL';
          break;
      }
    });

    return indicators;
  }

  // Generate AI insights and alerts
  generateInsights(): AIInsight[] {
    const insights: AIInsight[] = [];
    
    // Generate 5-8 random insights
    const insightCount = 5 + Math.floor(Math.random() * 4);
    
    for (let i = 0; i < insightCount; i++) {
      const insight = this.createRandomInsight();
      insights.push(insight);
    }
    
    return insights.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  private createRandomInsight(): AIInsight {
    const types: AIInsight['type'][] = ['PREDICTION', 'ALERT', 'INSIGHT', 'NEWS'];
    const severities: AIInsight['severity'][] = ['INFO', 'WARNING', 'SUCCESS', 'DANGER'];
    
    const type = types[Math.floor(Math.random() * types.length)];
    const severity = severities[Math.floor(Math.random() * severities.length)];
    
    const headlines = {
      PREDICTION: [
        "AI predicts 15% upside potential for IT sector",
        "Banking stocks expected to outperform next quarter",
        "Energy sector showing strong technical signals",
        "FMCG stocks may face headwinds in Q4"
      ],
      ALERT: [
        "Unusual options activity detected in RELIANCE",
        "High volume breakout in TCS above resistance",
        "HDFC Bank approaching key support level",
        "Sector rotation detected from IT to Banking"
      ],
      INSIGHT: [
        "Market correlation analysis shows defensive shift",
        "FII flows indicating sustained buying interest",
        "Earnings revision trends favor large caps",
        "Technical patterns suggest range-bound market"
      ],
      NEWS: this.newsHeadlines
    };
    
    const typeHeadlines = headlines[type];
    const title = typeHeadlines[Math.floor(Math.random() * typeHeadlines.length)];
    
    const symbols = ['RELIANCE', 'TCS', 'INFY', 'HDFCBANK', 'ICICIBANK'];
    const relatedSymbols = symbols.slice(0, 1 + Math.floor(Math.random() * 3));
    
    // Generate timestamp (last 24 hours)
    const timestamp = new Date();
    timestamp.setTime(timestamp.getTime() - Math.random() * 24 * 60 * 60 * 1000);
    
    return {
      id: Math.random().toString(36).substr(2, 9),
      title,
      content: this.generateInsightContent(type, title),
      type,
      severity,
      timestamp,
      symbols: relatedSymbols
    };
  }

  private generateInsightContent(type: AIInsight['type'], title: string): string {
    const contents = {
      PREDICTION: "Our AI models indicate strong momentum based on technical patterns and fundamental analysis. Consider position sizing and risk management.",
      ALERT: "Real-time monitoring has detected significant market movement. This could indicate institutional activity or news impact.",
      INSIGHT: "Advanced analytics reveal underlying market dynamics that may not be immediately visible through traditional analysis.",
      NEWS: "Market-moving news that could impact trading decisions. Stay informed about developments affecting your positions."
    };
    
    return contents[type];
  }

  private analyzeTrend(stock: Stock): number {
    // Simulate trend analysis (-1 to 1)
    const changePercent = stock.changePercent / 100;
    const volumeWeight = Math.min(stock.volume / 5000000, 2); // Volume impact
    return changePercent * volumeWeight;
  }

  private calculateVolatility(stock: Stock): number {
    // Simulate volatility calculation (0 to 1)
    const priceRange = (stock.high - stock.low) / stock.price;
    return Math.min(priceRange * 2, 1);
  }

  private getSectorSentiment(sector: string): number {
    const sectorSentiments = {
      'Information Technology': 0.3,
      'Banking': 0.1,
      'Oil & Gas': -0.2,
      'FMCG': 0.2,
      'Telecom': 0.0,
      'Paints': 0.15
    };
    
    return sectorSentiments[sector as keyof typeof sectorSentiments] || 0;
  }

  private getPredictionRange(timeHorizon: string): number {
    const ranges = {
      '1D': 0.03,  // ±3%
      '1W': 0.08,  // ±8%
      '1M': 0.15,  // ±15%
      '3M': 0.25   // ±25%
    };
    
    return ranges[timeHorizon as keyof typeof ranges] || 0.1;
  }

  private generateReasoning(stock: Stock, change: number, trend: number, sentiment: number): string {
    const reasons = [];
    
    if (change > 0.1) {
      reasons.push("Strong upward momentum predicted");
    } else if (change < -0.1) {
      reasons.push("Downward pressure anticipated");
    } else {
      reasons.push("Consolidation expected");
    }
    
    if (trend > 0.2) {
      reasons.push("positive technical trend");
    } else if (trend < -0.2) {
      reasons.push("negative technical indicators");
    }
    
    if (sentiment > 0.2) {
      reasons.push("favorable sector sentiment");
    } else if (sentiment < -0.2) {
      reasons.push("sector headwinds");
    }
    
    reasons.push(`based on AI analysis of ${Math.floor(Math.random() * 50) + 20} data points`);
    
    return reasons.join(", ");
  }

  private getRandomFactors(count: number): string[] {
    const shuffled = [...this.marketFactors].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  // Market summary with AI insights
  generateMarketSummary(): {
    marketSentiment: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
    keyThemes: string[];
    riskFactors: string[];
    opportunities: string[];
    aiConfidence: number;
  } {
    const sentiments = ['BULLISH', 'BEARISH', 'NEUTRAL'];
    const marketSentiment = sentiments[Math.floor(Math.random() * sentiments.length)] as 'BULLISH' | 'BEARISH' | 'NEUTRAL';
    
    return {
      marketSentiment,
      keyThemes: [
        "Technology sector leadership",
        "Banking sector consolidation",
        "Energy transition trends",
        "Infrastructure investment cycle"
      ],
      riskFactors: [
        "Global inflation concerns",
        "Interest rate volatility",
        "Geopolitical tensions",
        "Currency fluctuations"
      ],
      opportunities: [
        "Defensive sector rotation",
        "Value stock emergence",
        "Small cap recovery",
        "Export-oriented companies"
      ],
      aiConfidence: 75 + Math.random() * 20
    };
  }
}

// Export singleton instance
export const aiAgentService = new AIAgentService();