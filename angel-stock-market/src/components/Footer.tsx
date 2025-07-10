import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  Youtube,
  ArrowUp,
  Shield,
  Award,
  Users
} from 'lucide-react';

const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerLinks = {
    products: [
      { name: 'Trading Platform', href: '#' },
      { name: 'Mobile App', href: '#' },
      { name: 'Investment Advisory', href: '#' },
      { name: 'Mutual Funds', href: '#' },
      { name: 'IPO', href: '#' },
      { name: 'Derivatives', href: '#' }
    ],
    support: [
      { name: 'Help Center', href: '#' },
      { name: 'Contact Support', href: '#contact' },
      { name: 'Trading Guide', href: '#' },
      { name: 'Video Tutorials', href: '#' },
      { name: 'Webinars', href: '#' },
      { name: 'Market Updates', href: '#' }
    ],
    company: [
      { name: 'About Us', href: '#about' },
      { name: 'Careers', href: '#' },
      { name: 'Press', href: '#' },
      { name: 'Blog', href: '#' },
      { name: 'Partners', href: '#' },
      { name: 'Investors', href: '#' }
    ],
    legal: [
      { name: 'Terms of Service', href: '#' },
      { name: 'Privacy Policy', href: '#' },
      { name: 'Risk Disclosure', href: '#' },
      { name: 'Regulatory', href: '#' },
      { name: 'Compliance', href: '#' },
      { name: 'Grievances', href: '#' }
    ]
  };

  const socialLinks = [
    { icon: Facebook, href: '#', color: 'hover:text-blue-600' },
    { icon: Twitter, href: '#', color: 'hover:text-sky-500' },
    { icon: Instagram, href: '#', color: 'hover:text-pink-600' },
    { icon: Linkedin, href: '#', color: 'hover:text-blue-700' },
    { icon: Youtube, href: '#', color: 'hover:text-red-600' }
  ];

  const certifications = [
    { icon: Shield, text: 'SEBI Registered' },
    { icon: Award, text: 'ISO Certified' },
    { icon: Users, text: 'NSE Member' }
  ];

  return (
    <footer className="relative bg-gray-900 dark:bg-black text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Company Info */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-2"
            >
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-gradient">Angel Stock</span>
              </div>
              
              <p className="text-gray-300 mb-6 leading-relaxed">
                India's leading digital stock broker offering zero brokerage equity trading, 
                advanced analytics, and comprehensive investment solutions for modern traders.
              </p>

              {/* Contact Info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-blue-400" />
                  <span className="text-gray-300 text-sm">
                    601, Ackruti Star, MIDC, Andheri (E), Mumbai - 400093
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300 text-sm">1800-208-2020</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-purple-400" />
                  <span className="text-gray-300 text-sm">support@angelstock.com</span>
                </div>
              </div>

              {/* Certifications */}
              <div className="flex flex-wrap gap-4">
                {certifications.map((cert, index) => (
                  <motion.div
                    key={cert.text}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1"
                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
                  >
                    <cert.icon className="w-4 h-4 text-blue-400" />
                    <span className="text-xs text-gray-300">{cert.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Links Sections */}
            {Object.entries(footerLinks).map(([category, links], categoryIndex) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: categoryIndex * 0.1 }}
              >
                <h3 className="text-lg font-semibold mb-4 capitalize text-white">
                  {category === 'products' ? 'Products' : 
                   category === 'support' ? 'Support' :
                   category === 'company' ? 'Company' : 'Legal'}
                </h3>
                <ul className="space-y-2">
                  {links.map((link, index) => (
                    <motion.li
                      key={link.name}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                    >
                      <a
                        href={link.href}
                        className="text-gray-400 hover:text-white transition-colors duration-200 text-sm block py-1"
                      >
                        {link.name}
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              {/* Social Links */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="flex items-center space-x-4"
              >
                <span className="text-gray-400 text-sm">Follow us:</span>
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    className={`p-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-gray-400 transition-all duration-300 ${social.color}`}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                  >
                    <social.icon className="w-4 h-4" />
                  </motion.a>
                ))}
              </motion.div>

              {/* Copyright */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="text-center md:text-right"
              >
                <p className="text-gray-400 text-sm">
                  © 2024 Angel Stock Market. All rights reserved.
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  Securities market investments are subject to market risks.
                </p>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Scroll to Top Button */}
        <motion.button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg z-50"
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <ArrowUp className="w-6 h-6 text-white" />
        </motion.button>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-gray-800/50 backdrop-blur-sm border-t border-gray-700"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="text-center">
              <p className="text-gray-400 text-xs leading-relaxed">
                <strong>Disclaimer:</strong> Investment in securities market are subject to market risks, read all the related documents carefully before investing. 
                Angel Stock Market is a trading name of Angel Broking Limited (Reg. No: INZ000156038, BSE: INB010996539, NSE: INB231010939, MCX: INE261010939, CDSL: IN-DP-384-2018, PMS: INP000000654, Research Analyst: INH000000164) 
                Member of BSE, NSE & MCX. Registered Address: 601, Ackruti Star, Central Road, MIDC, Andheri (East), Mumbai - 400093.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;