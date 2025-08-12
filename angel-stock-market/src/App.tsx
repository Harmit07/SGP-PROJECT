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
import TenantPayment from './components/TenantPayment';

function App() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  const showTenantPayment =
    typeof window !== 'undefined' && (window.location.hash.includes('tenant') || window.location.search.includes('tenant'));

  if (showTenantPayment) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TenantPayment />
      </div>
    );
  }

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
