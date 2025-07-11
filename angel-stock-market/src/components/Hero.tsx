import React from 'react';
import { motion, Variants, Transition } from 'framer-motion';
import {
  TrendingUp,
  BarChart3,
  Shield,
  Zap,
  ArrowRight,
  Star,
  Users,
  DollarSign
} from 'lucide-react';

interface HeroProps {
  onGetStartedClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ onGetStartedClick }) => {
  const floatingElements = [
    { icon: TrendingUp, color: 'text-green-500', delay: 0 },
    { icon: BarChart3, color: 'text-blue-500', delay: 0.2 },
    { icon: Shield, color: 'text-purple-500', delay: 0.4 },
    { icon: Zap, color: 'text-yellow-500', delay: 0.6 },
  ];

  const stats = [
    { label: 'Active Traders', value: '2M+', icon: Users },
    { label: 'Daily Volume', value: '₹50B+', icon: DollarSign },
    { label: 'Trust Rating', value: '4.9/5', icon: Star },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const springTransition: Transition = {
    type: "spring",
    stiffness: 300,
    damping: 24
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: springTransition
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 gradient-bg dark:gradient-bg-dark">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>
      </div>

      {/* Floating elements */}
      {floatingElements.map((element, index) => (
        <motion.div
          key={index}
          className={`absolute w-16 h-16 rounded-full glass ${element.color} flex items-center justify-center`}
          style={{
            left: `${10 + index * 20}%`,
            top: `${20 + index * 15}%`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: [0, -20, 0],
            rotate: [0, 360],
          }}
          transition={{
            delay: element.delay,
            duration: 1,
            y: {
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            },
            rotate: {
              duration: 8,
              repeat: Infinity,
              ease: 'linear',
            },
          }}
        >
          <element.icon className="w-8 h-8" />
        </motion.div>
      ))}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Main heading */}
          <motion.div variants={itemVariants} className="space-y-4">
            <motion.h1
              className="text-4xl md:text-6xl lg:text-7xl font-bold"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="text-gray-900 dark:text-white">Trade</span>{' '}
              <span className="text-gradient">Smarter</span>
              <br />
              <span className="text-gray-900 dark:text-white">Invest</span>{' '}
              <span className="text-gradient">Better</span>
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Experience the future of stock trading with Angel Stock Market.
              Real-time analytics, AI-powered insights, and seamless execution.
            </motion.p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.button
              onClick={onGetStartedClick}
              className="btn-primary group flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Start Trading</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </motion.button>

            <motion.button
              className="btn-secondary group flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Watch Demo</span>
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            </motion.button>
          </motion.div>

          {/* Stats */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-16">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="card-glass p-6 text-center hover-glow"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.2, duration: 0.6 }}
                whileHover={{ y: -5 }}
              >
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {stat.value}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Feature highlights */}
          <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-4 mt-12">
            {[
              'Zero Brokerage on Equity Delivery',
              'Advanced Charting Tools',
              'Real-time Market Data',
              'Mobile Trading App',
            ].map((feature, index) => (
              <motion.div
                key={feature}
                className="flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2 + index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                  {feature}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-500 rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;
