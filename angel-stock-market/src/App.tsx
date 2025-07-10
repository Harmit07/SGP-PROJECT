import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import StockTicker from './components/StockTicker';
import TradingChart from './components/TradingChart';
import Features from './components/Features';
import Testimonials from './components/Testimonials';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';
import LoginModal from './components/LoginModal';
import AIAgentDashboard from './components/AIAgentDashboard';
import RealTimeMarketData from './components/RealTimeMarketData';

function App() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <Header onLoginClick={openLoginModal} />
      
      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <Hero onGetStartedClick={openLoginModal} />
        
        {/* Stock Ticker */}
        <StockTicker />
        
        {/* Trading Chart Section */}
        <TradingChart />
        
        {/* Real-Time Market Data */}
        <div id="live-data">
          <RealTimeMarketData />
        </div>
        
        {/* AI Agent Dashboard */}
        <div id="ai-agent">
          <AIAgentDashboard />
        </div>
        
        {/* Features Section */}
        <Features />
        
        {/* Testimonials Section */}
        <Testimonials />
        
        {/* Contact Form Section */}
        <ContactForm />
      </main>
      
      {/* Footer */}
      <Footer />
      
      {/* Login Modal */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={closeLoginModal} 
      />
    </div>
  );
}

export default App;
