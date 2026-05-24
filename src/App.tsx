/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ParticleBackground from './components/ParticleBackground';
import Hero from './components/Hero';
import AboutSummary from './components/AboutSummary';
import ResourcesSummary from './components/ResourcesSummary';
import ServicesSummary from './components/ServicesSummary';
import GiftsSummary from './components/GiftsSummary';
import TestimonialsSummary from './components/TestimonialsSummary';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AboutPage from './pages/AboutPage';
import ResourcesPage from './pages/ResourcesPage';
import GiftsPage from './pages/GiftsPage';
import ServicesPage from './pages/ServicesPage';
import TestimonialsPage from './pages/TestimonialsPage';

import AdminPage from './pages/AdminPage';

function Home() {
  return (
    <>
      <Hero />
      <AboutSummary />
      <ResourcesSummary />
      <ServicesSummary />
      <GiftsSummary />
      <TestimonialsSummary />
      <Contact />
    </>
  );
}

export default function App() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isAdmin = location.pathname.startsWith('/admin');

  useEffect(() => {
    if (!location.hash) return;
    const targetId = location.hash.replace('#', '');
    if (!targetId) return;
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [location.hash, location.pathname]);

  if (isAdmin) {
    return (
      <Routes>
        <Route path="/admin/*" element={<AdminPage />} />
      </Routes>
    );
  }

  return (
    <div className="min-h-screen relative font-sans leading-relaxed selection:bg-saffron-500 selection:text-white flex flex-col bg-dao-900">
      
      {/* SVG Gradient Definition for metallic gilded icons */}
      <svg width="0" height="0" className="absolute hidden">
        <defs>
          <linearGradient id="gilded-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e9a341" />
            <stop offset="30%" stopColor="#c92a23" />
            <stop offset="60%" stopColor="#69120c" />
            <stop offset="80%" stopColor="#d44538" />
            <stop offset="100%" stopColor="#27140e" />
          </linearGradient>
        </defs>
      </svg>

      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-saffron-500 rounded-full blur-[150px] opacity-[0.08]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-jade-400 rounded-full blur-[200px] opacity-[0.03]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(var(--color-saffron-400) 0.5px, transparent 0.5px)', backgroundSize: '32px 32px' }}></div>
      </div>
      <ParticleBackground />

      <nav className="h-16 flex items-center justify-between px-6 md:px-10 border-b border-saffron-400/10 relative z-20 bg-[#7a1212]/95 backdrop-blur-md sticky top-0 w-full shadow-md">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full border border-saffron-400/30 flex items-center justify-center bg-dao-800 shadow-[0_0_15px_rgba(214,176,82,0.1)] group">
            <div className="w-4 h-4 bg-gilded rounded-full"></div>
          </div>
          <span className="text-xl font-serif tracking-widest uppercase text-[#ffffff] hidden sm:block font-bold drop-shadow-md">ĐẠO</span>
        </Link>
        <div className="hidden md:flex gap-6 text-[10px] uppercase tracking-[0.2em] font-medium text-[#ffffff]">
          {location.pathname === '/' ? (
            <>
              <a href="#about" className="hover:text-saffron-400 transition-colors">Giới thiệu</a>
              <Link to="/tu-lieu" className="hover:text-saffron-400 transition-colors">Tư liệu</Link>
              <Link to="/ho-tro" className="hover:text-saffron-400 transition-colors">Hỗ trợ</Link>
              <Link to="/gieo-duyen" className="hover:text-saffron-400 transition-colors">Gieo duyên</Link>
              <Link to="/phan-hoi" className="hover:text-saffron-400 transition-colors">Phản hồi</Link>
              <a href="#contact" className="hover:text-saffron-400 transition-colors">Liên hệ</a>
            </>
          ) : (
            <>
              <Link to="/" className="hover:text-saffron-400 transition-colors">Trang chủ</Link>
              <Link to="/gioi-thieu" className={location.pathname === '/gioi-thieu' ? "text-saffron-400 transition-colors" : "hover:text-saffron-400 transition-colors"}>Giới thiệu</Link>
              <Link to="/tu-lieu" className={location.pathname === '/tu-lieu' ? "text-saffron-400 transition-colors" : "hover:text-saffron-400 transition-colors"}>Tư liệu</Link>
              <Link to="/ho-tro" className={location.pathname === '/ho-tro' ? "text-saffron-400 transition-colors" : "hover:text-saffron-400 transition-colors"}>Hỗ trợ</Link>
              <Link to="/gieo-duyen" className={location.pathname === '/gieo-duyen' ? "text-saffron-400 transition-colors" : "hover:text-saffron-400 transition-colors"}>Gieo duyên</Link>
              <Link to="/phan-hoi" className={location.pathname === '/phan-hoi' ? "text-saffron-400 transition-colors" : "hover:text-saffron-400 transition-colors"}>Phản hồi</Link>
            </>
          )}
        </div>
        
        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="md:hidden flex items-center justify-center p-2 rounded-md text-white hover:text-saffron-400 transition-colors cursor-pointer"
          aria-label="Open Mobile Menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Premium horizontal gold-metallic shimmer running effect */}
        <div className="absolute bottom-0 left-0 right-0 h-[3px] overflow-hidden bg-gradient-to-r from-[#e9a341] via-[#fff1be] to-[#eabb48] shadow-[0_1px_10px_rgba(233,163,65,0.4)]">
          <motion.div
            className="w-1/2 h-full bg-gradient-to-r from-transparent via-white/80 to-transparent"
            animate={{
              x: ['-100%', '250%'],
            }}
            transition={{
              repeat: Infinity,
              duration: 3.5,
              ease: 'easeInOut',
            }}
          />
        </div>
      </nav>

      {/* Mobile Drawer Sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Dark Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 z-45 md:hidden"
            />

            {/* Sidebar drawer panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
              className="fixed top-0 right-0 bottom-0 w-72 bg-[#7a1212] z-50 shadow-[0_0_40px_rgba(0,0,0,0.5)] p-6 flex flex-col md:hidden border-l border-saffron-400/20"
            >
              {/* Sidebar Header */}
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-saffron-400/20">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full border border-saffron-400/30 flex items-center justify-center bg-dao-800 shadow-[0_0_15px_rgba(214,176,82,0.1)]">
                    <div className="w-4 h-4 bg-gilded rounded-full"></div>
                  </div>
                  <span className="text-xl font-serif tracking-widest uppercase text-white font-bold drop-shadow-md">ĐẠO</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-white hover:text-saffron-400 transition-colors cursor-pointer"
                  aria-label="Close Mobile Menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Sidebar Menu Items */}
              <nav className="flex flex-col gap-3 text-sm uppercase tracking-[0.25em] font-semibold">
                {location.pathname === '/' ? (
                  <>
                    <a
                      href="#about"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-white hover:text-saffron-300 py-3.5 px-4 rounded-lg bg-[#69120c] hover:bg-[#8d1910] border border-saffron-400/20 hover:border-saffron-400 transition-all duration-300 flex items-center justify-between shadow-md group"
                    >
                      <span className="group-hover:translate-x-1.5 transition-transform duration-300 font-bold">Giới thiệu</span>
                      <span className="text-saffron-400">✦</span>
                    </a>
                    <Link
                      to="/tu-lieu"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-white hover:text-saffron-300 py-3.5 px-4 rounded-lg bg-[#69120c] hover:bg-[#8d1910] border border-saffron-400/20 hover:border-saffron-400 transition-all duration-300 flex items-center justify-between shadow-md group"
                    >
                      <span className="group-hover:translate-x-1.5 transition-transform duration-300 font-bold">Tư liệu</span>
                      <span className="text-saffron-400">✦</span>
                    </Link>
                    <Link
                      to="/ho-tro"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-white hover:text-saffron-300 py-3.5 px-4 rounded-lg bg-[#69120c] hover:bg-[#8d1910] border border-saffron-400/20 hover:border-saffron-400 transition-all duration-300 flex items-center justify-between shadow-md group"
                    >
                      <span className="group-hover:translate-x-1.5 transition-transform duration-300 font-bold">Hỗ trợ</span>
                      <span className="text-saffron-400">✦</span>
                    </Link>
                    <Link
                      to="/gieo-duyen"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-white hover:text-saffron-300 py-3.5 px-4 rounded-lg bg-[#69120c] hover:bg-[#8d1910] border border-saffron-400/20 hover:border-saffron-400 transition-all duration-300 flex items-center justify-between shadow-md group"
                    >
                      <span className="group-hover:translate-x-1.5 transition-transform duration-300 font-bold">Gieo duyên</span>
                      <span className="text-saffron-400">✦</span>
                    </Link>
                    <Link
                      to="/phan-hoi"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-white hover:text-saffron-300 py-3.5 px-4 rounded-lg bg-[#69120c] hover:bg-[#8d1910] border border-saffron-400/20 hover:border-saffron-400 transition-all duration-300 flex items-center justify-between shadow-md group"
                    >
                      <span className="group-hover:translate-x-1.5 transition-transform duration-300 font-bold">Phản hồi</span>
                      <span className="text-saffron-400">✦</span>
                    </Link>
                    <a
                      href="#contact"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-white hover:text-saffron-300 py-3.5 px-4 rounded-lg bg-[#69120c] hover:bg-[#8d1910] border border-saffron-400/20 hover:border-saffron-400 transition-all duration-300 flex items-center justify-between shadow-md group"
                    >
                      <span className="group-hover:translate-x-1.5 transition-transform duration-300 font-bold">Liên hệ</span>
                      <span className="text-saffron-400">✦</span>
                    </a>
                  </>
                ) : (
                  <>
                    <Link
                      to="/"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-white hover:text-saffron-300 py-3.5 px-4 rounded-lg bg-[#69120c] hover:bg-[#8d1910] border border-saffron-400/20 hover:border-saffron-400 transition-all duration-300 flex items-center justify-between shadow-md group"
                    >
                      <span className="group-hover:translate-x-1.5 transition-transform duration-300 font-bold">Trang chủ</span>
                      <span className="text-saffron-400">✦</span>
                    </Link>
                    <Link
                      to="/gioi-thieu"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`py-3.5 px-4 rounded-lg transition-all duration-300 flex items-center justify-between shadow-md group border ${
                        location.pathname === '/gioi-thieu'
                          ? 'bg-gilded text-[#ffffff] border-saffron-400 font-bold shadow-[0_0_15px_rgba(233,163,65,0.3)] animate-pulse'
                          : 'bg-[#69120c] text-white hover:bg-[#8d1910] border-saffron-400/20 hover:border-saffron-400'
                      }`}
                    >
                      <span className="group-hover:translate-x-1.5 transition-transform duration-300">Giới thiệu</span>
                      <span className={location.pathname === '/gioi-thieu' ? 'text-white' : 'text-saffron-400'}>✦</span>
                    </Link>
                    <Link
                      to="/tu-lieu"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`py-3.5 px-4 rounded-lg transition-all duration-300 flex items-center justify-between shadow-md group border ${
                        location.pathname === '/tu-lieu'
                          ? 'bg-gilded text-[#ffffff] border-saffron-400 font-bold shadow-[0_0_15px_rgba(233,163,65,0.3)] animate-pulse'
                          : 'bg-[#69120c] text-white hover:bg-[#8d1910] border-saffron-400/20 hover:border-saffron-400'
                      }`}
                    >
                      <span className="group-hover:translate-x-1.5 transition-transform duration-300">Tư liệu</span>
                      <span className={location.pathname === '/tu-lieu' ? 'text-white' : 'text-saffron-400'}>✦</span>
                    </Link>
                    <Link
                      to="/ho-tro"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`py-3.5 px-4 rounded-lg transition-all duration-300 flex items-center justify-between shadow-md group border ${
                        location.pathname === '/ho-tro'
                          ? 'bg-gilded text-[#ffffff] border-saffron-400 font-bold shadow-[0_0_15px_rgba(233,163,65,0.3)] animate-pulse'
                          : 'bg-[#69120c] text-white hover:bg-[#8d1910] border-saffron-400/20 hover:border-saffron-400'
                      }`}
                    >
                      <span className="group-hover:translate-x-1.5 transition-transform duration-300">Hỗ trợ</span>
                      <span className={location.pathname === '/ho-tro' ? 'text-white' : 'text-saffron-400'}>✦</span>
                    </Link>
                    <Link
                      to="/gieo-duyen"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`py-3.5 px-4 rounded-lg transition-all duration-300 flex items-center justify-between shadow-md group border ${
                        location.pathname === '/gieo-duyen'
                          ? 'bg-gilded text-[#ffffff] border-saffron-400 font-bold shadow-[0_0_15px_rgba(233,163,65,0.3)] animate-pulse'
                          : 'bg-[#69120c] text-white hover:bg-[#8d1910] border-saffron-400/20 hover:border-saffron-400'
                      }`}
                    >
                      <span className="group-hover:translate-x-1.5 transition-transform duration-300">Gieo duyên</span>
                      <span className={location.pathname === '/gieo-duyen' ? 'text-white' : 'text-saffron-400'}>✦</span>
                    </Link>
                    <Link
                      to="/phan-hoi"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`py-3.5 px-4 rounded-lg transition-all duration-300 flex items-center justify-between shadow-md group border ${
                        location.pathname === '/phan-hoi'
                          ? 'bg-gilded text-[#ffffff] border-saffron-400 font-bold shadow-[0_0_15px_rgba(233,163,65,0.3)] animate-pulse'
                          : 'bg-[#69120c] text-white hover:bg-[#8d1910] border-saffron-400/20 hover:border-saffron-400'
                      }`}
                    >
                      <span className="group-hover:translate-x-1.5 transition-transform duration-300">Phản hồi</span>
                      <span className={location.pathname === '/phan-hoi' ? 'text-white' : 'text-saffron-400'}>✦</span>
                    </Link>
                  </>
                )}
              </nav>

              {/* Decorative Quote inside the Mobile menu */}
              <div className="mt-auto pt-6 border-t border-saffron-400/10 text-center">
                <p className="text-[9px] uppercase tracking-[0.2em] text-white/40">Gieo Duyên Lành • Tạo Phúc Đức</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 relative z-10 w-full max-w-[1440px] mx-auto">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gioi-thieu" element={<AboutPage />} />
          <Route path="/tu-lieu" element={<ResourcesPage />} />
          <Route path="/ho-tro" element={<ServicesPage />} />
          <Route path="/gieo-duyen" element={<GiftsPage />} />
          <Route path="/phan-hoi" element={<TestimonialsPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
