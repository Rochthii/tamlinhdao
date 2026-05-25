/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, lazy, Suspense } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { fetchCategories } from './lib/supabase';
import ParticleBackground from './components/ParticleBackground';
import Hero from './components/Hero';
import AboutSummary from './components/AboutSummary';
import ResourcesSummary from './components/ResourcesSummary';
import ServicesSummary from './components/ServicesSummary';
import GiftsSummary from './components/GiftsSummary';
import TestimonialsSummary from './components/TestimonialsSummary';
import Contact from './components/Contact';
import Footer from './components/Footer';

// Lazy load pages for premium performance bundle
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ResourcesPage = lazy(() => import('./pages/ResourcesPage'));
const GiftsPage = lazy(() => import('./pages/GiftsPage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const TestimonialsPage = lazy(() => import('./pages/TestimonialsPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));

function GildedLoader() {
  return (
    <div className="min-h-[60vh] w-full flex flex-col items-center justify-center bg-dao-900/90 text-white relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-saffron-500 rounded-full blur-[100px] opacity-[0.06]"></div>
      </div>
      <div className="relative z-10 flex flex-col items-center gap-6">
        <div className="w-16 h-16 rounded-full border border-saffron-400/20 bg-dao-800 flex items-center justify-center shadow-[0_0_30px_rgba(214,176,82,0.1)] relative">
          <div className="w-10 h-10 border-[3px] border-saffron-400/20 border-t-saffron-400 rounded-full animate-spin"></div>
          <div className="w-4 h-4 bg-gilded rounded-full absolute"></div>
        </div>
        <p className="text-[10px] uppercase tracking-[0.25em] text-saffron-400/80 font-bold font-serif animate-pulse">
          Khởi Tâm Tịnh Lặng...
        </p>
      </div>
    </div>
  );
}

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

  // Load categories dynamically for the header dropdown
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const cats = await fetchCategories();
        if (cats) setCategories(cats);
      } catch (e) {
        console.error('Lỗi tải danh mục ngoài Header:', e);
      }
    })();
  }, []);

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
      <Suspense fallback={<GildedLoader />}>
        <Routes>
          <Route path="/admin/*" element={<AdminPage />} />
        </Routes>
      </Suspense>
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
        <div className="hidden md:flex gap-6 text-[10px] uppercase tracking-[0.2em] font-medium text-[#ffffff] items-center">
          <Link to="/" className={location.pathname === '/' ? "text-saffron-400 font-bold tracking-[0.2em] transition-colors" : "hover:text-saffron-400 transition-colors"}>Trang chủ</Link>
          
          {location.pathname === '/' ? (
            <a href="#about" className="hover:text-saffron-400 transition-colors">Giới thiệu</a>
          ) : (
            <Link to="/gioi-thieu" className={location.pathname === '/gioi-thieu' ? "text-saffron-400 transition-colors" : "hover:text-saffron-400 transition-colors"}>Giới thiệu</Link>
          )}
          
          {/* Tư liệu Dropdown */}
          <div className="relative group py-2">
            <Link to="/tu-lieu" className={`hover:text-saffron-400 transition-colors flex items-center gap-1.5 ${location.pathname === '/tu-lieu' ? "text-saffron-400" : ""}`}>
              Tư liệu
              <ChevronDown className="w-3 h-3 text-saffron-400/70 group-hover:rotate-180 transition-transform duration-300" />
            </Link>
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 hidden group-hover:block bg-[#7a1212]/95 border border-saffron-400/20 py-2 rounded-md shadow-2xl min-w-[200px] z-50 backdrop-blur-md">
              <Link to="/tu-lieu" className="block px-5 py-2.5 hover:bg-[#69120c] text-[#ffffff] hover:text-saffron-400 text-[10px] tracking-wider uppercase transition-colors">Tất cả tư liệu</Link>
              {categories.map(cat => (
                <Link 
                  key={cat.id} 
                  to={`/tu-lieu?category=${encodeURIComponent(cat.name)}`} 
                  className="block px-5 py-2.5 hover:bg-[#69120c] text-[#ffffff] hover:text-saffron-400 text-[10px] tracking-wider uppercase transition-colors"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
          
          {/* Hỗ Trợ Tâm Linh Dropdown */}
          <div className="relative group py-2">
            <Link to="/ho-tro" className={`hover:text-saffron-400 transition-colors flex items-center gap-1.5 ${location.pathname === '/ho-tro' ? "text-saffron-400" : ""}`}>
              Hỗ Trợ Tâm Linh
              <ChevronDown className="w-3 h-3 text-saffron-400/70 group-hover:rotate-180 transition-transform duration-300" />
            </Link>
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 hidden group-hover:block bg-[#7a1212]/95 border border-saffron-400/20 py-2 rounded-md shadow-2xl min-w-[280px] z-50 backdrop-blur-md">
              <Link to="/ho-tro#luan-van-menh" className="block px-5 py-2.5 hover:bg-[#69120c] text-[#ffffff] hover:text-saffron-400 text-[10px] tracking-wider uppercase transition-colors">Luận Vận Mệnh</Link>
              <Link to="/ho-tro#tham-van-tam-linh" className="block px-5 py-2.5 hover:bg-[#69120c] text-[#ffffff] hover:text-saffron-400 text-[10px] tracking-wider uppercase transition-colors">Tham Vấn Tâm Linh</Link>
              <Link to="/ho-tro#nghi-le" className="block px-5 py-2.5 hover:bg-[#69120c] text-[#ffffff] hover:text-saffron-400 text-[10px] tracking-wider uppercase transition-colors text-wrap leading-normal">Tư vấn và Hỗ trợ nghi lễ theo yêu cầu</Link>
            </div>
          </div>
          
          {/* Gieo Duyên Quà Tặng Dropdown */}
          <div className="relative group py-2">
            <Link to="/gieo-duyen" className={`hover:text-saffron-400 transition-colors flex items-center gap-1.5 ${location.pathname === '/gieo-duyen' ? "text-saffron-400" : ""}`}>
              Gieo Duyên Quà Tặng
              <ChevronDown className="w-3 h-3 text-saffron-400/70 group-hover:rotate-180 transition-transform duration-300" />
            </Link>
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 hidden group-hover:block bg-[#7a1212]/95 border border-saffron-400/20 py-2 rounded-md shadow-2xl min-w-[240px] z-50 backdrop-blur-md">
              <Link to="/gieo-duyen#loyal" className="block px-5 py-2.5 hover:bg-[#69120c] text-[#ffffff] hover:text-saffron-400 text-[10px] tracking-wider uppercase transition-colors">Khách hàng thân thuộc</Link>
              <Link to="/gieo-duyen#newcomer" className="block px-5 py-2.5 hover:bg-[#69120c] text-[#ffffff] hover:text-saffron-400 text-[10px] tracking-wider uppercase transition-colors">Gieo duyên người mới</Link>
            </div>
          </div>
          
          <Link to="/phan-hoi" className={location.pathname === '/phan-hoi' ? "text-saffron-400 transition-colors" : "hover:text-saffron-400 transition-colors"}>Feedback</Link>
          
          {location.pathname === '/' ? (
            <a href="#contact" className="hover:text-saffron-400 transition-colors">Liên hệ</a>
          ) : (
            <Link to="/#contact" className="hover:text-saffron-400 transition-colors">Liên hệ</Link>
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
              className="fixed top-0 right-0 bottom-0 w-72 bg-[#fbf4e3] z-50 shadow-[0_0_40px_rgba(0,0,0,0.15)] p-6 flex flex-col md:hidden border-l border-saffron-400/20"
            >
              {/* Sidebar Header */}
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-saffron-400/10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full border border-saffron-400/30 flex items-center justify-center bg-[#f4e8d1] shadow-[0_0_15px_rgba(214,176,82,0.15)]">
                    <div className="w-4 h-4 bg-gilded rounded-full"></div>
                  </div>
                  <span className="text-xl font-serif tracking-widest uppercase text-[#27140e] font-bold drop-shadow-sm">ĐẠO</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-[#27140e] hover:text-saffron-400 transition-colors cursor-pointer"
                  aria-label="Close Mobile Menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Sidebar Menu Items */}
              <nav className="flex flex-col gap-4 text-xs uppercase tracking-[0.2em] font-bold text-[#27140e]">
                {/* Trang Chủ */}
                <Link
                  to="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`py-3 px-4 rounded-lg transition-all duration-300 border flex items-center justify-between ${
                    location.pathname === '/'
                      ? 'bg-saffron-400/10 text-saffron-400 border-saffron-400/30 font-bold'
                      : 'bg-[#f4e8d1]/40 border-saffron-400/10 hover:border-saffron-400/30'
                  }`}
                >
                  <span>Trang chủ</span>
                  <span className="text-saffron-400">✦</span>
                </Link>

                {/* Giới Thiệu */}
                {location.pathname === '/' ? (
                  <a
                    href="#about"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="py-3 px-4 rounded-lg bg-[#f4e8d1]/40 border border-saffron-400/10 hover:border-saffron-400/30 transition-all duration-300 flex items-center justify-between"
                  >
                    <span>Giới thiệu</span>
                    <span className="text-saffron-400">✦</span>
                  </a>
                ) : (
                  <Link
                    to="/gioi-thieu"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`py-3 px-4 rounded-lg transition-all duration-300 border flex items-center justify-between ${
                      location.pathname === '/gioi-thieu'
                        ? 'bg-saffron-400/10 text-saffron-400 border-saffron-400/30 font-bold'
                        : 'bg-[#f4e8d1]/40 border-saffron-400/10 hover:border-saffron-400/30'
                    }`}
                  >
                    <span>Giới thiệu</span>
                    <span className="text-saffron-400">✦</span>
                  </Link>
                )}

                {/* Tư Liệu Đa cấp */}
                <div className="flex flex-col gap-1 rounded-lg border border-saffron-400/10 p-3.5 bg-[#f4e8d1]/30">
                  <span className="text-[#27140e] font-serif font-bold text-xs tracking-wider px-1 pb-2 border-b border-saffron-400/10 uppercase flex items-center justify-between">
                    Tư liệu đạo quán
                    <ChevronDown className="w-3.5 h-3.5 text-saffron-400" />
                  </span>
                  <div className="flex flex-col pl-3 border-l border-saffron-400/20 gap-3 mt-3 pb-1">
                    <Link to="/tu-lieu" onClick={() => setIsMobileMenuOpen(false)} className="text-[10px] tracking-widest text-[#27140e]/80 hover:text-saffron-400 transition-colors uppercase font-bold flex items-center justify-between">
                      <span>✦ Tất cả tư liệu</span>
                    </Link>
                    {categories.map(cat => (
                      <Link 
                        key={cat.id}
                        to={`/tu-lieu?category=${encodeURIComponent(cat.name)}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-[10px] tracking-widest text-[#27140e]/80 hover:text-saffron-400 transition-colors uppercase font-bold flex items-center justify-between"
                      >
                        <span>✦ {cat.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Hỗ Trợ Tâm Linh Đa cấp */}
                <div className="flex flex-col gap-1 rounded-lg border border-saffron-400/10 p-3.5 bg-[#f4e8d1]/30">
                  <span className="text-[#27140e] font-serif font-bold text-xs tracking-wider px-1 pb-2 border-b border-saffron-400/10 uppercase flex items-center justify-between">
                    Hỗ Trợ Tâm Linh
                    <ChevronDown className="w-3.5 h-3.5 text-saffron-400" />
                  </span>
                  <div className="flex flex-col pl-3 border-l border-saffron-400/20 gap-3 mt-3 pb-1">
                    <Link to="/ho-tro#luan-van-menh" onClick={() => setIsMobileMenuOpen(false)} className="text-[10px] tracking-widest text-[#27140e]/80 hover:text-saffron-400 transition-colors uppercase font-bold flex items-center justify-between">
                      <span>✦ Luận Vận Mệnh</span>
                    </Link>
                    <Link to="/ho-tro#tham-van-tam-linh" onClick={() => setIsMobileMenuOpen(false)} className="text-[10px] tracking-widest text-[#27140e]/80 hover:text-saffron-400 transition-colors uppercase font-bold flex items-center justify-between">
                      <span>✦ Tham Vấn Tâm Linh</span>
                    </Link>
                    <Link to="/ho-tro#nghi-le" onClick={() => setIsMobileMenuOpen(false)} className="text-[10px] tracking-widest text-[#27140e]/80 hover:text-saffron-400 transition-colors uppercase font-bold flex items-center justify-between text-left leading-normal">
                      <span>✦ Nghi lễ cầu an</span>
                    </Link>
                  </div>
                </div>

                {/* Gieo Duyên Quà Tặng Đa cấp */}
                <div className="flex flex-col gap-1 rounded-lg border border-saffron-400/10 p-3.5 bg-[#f4e8d1]/30">
                  <span className="text-[#27140e] font-serif font-bold text-xs tracking-wider px-1 pb-2 border-b border-saffron-400/10 uppercase flex items-center justify-between">
                    Gieo Duyên Quà Tặng
                    <ChevronDown className="w-3.5 h-3.5 text-saffron-400" />
                  </span>
                  <div className="flex flex-col pl-3 border-l border-saffron-400/20 gap-3 mt-3 pb-1">
                    <Link to="/gieo-duyen#loyal" onClick={() => setIsMobileMenuOpen(false)} className="text-[10px] tracking-widest text-[#27140e]/80 hover:text-saffron-400 transition-colors uppercase font-bold flex items-center justify-between">
                      <span>✦ Khách thân thuộc</span>
                    </Link>
                    <Link to="/gieo-duyen#newcomer" onClick={() => setIsMobileMenuOpen(false)} className="text-[10px] tracking-widest text-[#27140e]/80 hover:text-saffron-400 transition-colors uppercase font-bold flex items-center justify-between">
                      <span>✦ Gieo duyên mới</span>
                    </Link>
                  </div>
                </div>

                {/* Feedback */}
                <Link
                  to="/phan-hoi"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`py-3 px-4 rounded-lg transition-all duration-300 border flex items-center justify-between ${
                    location.pathname === '/phan-hoi'
                      ? 'bg-saffron-400/10 text-saffron-400 border-saffron-400/30 font-bold'
                      : 'bg-[#f4e8d1]/40 border-saffron-400/10 hover:border-saffron-400/30'
                  }`}
                >
                  <span>Feedback</span>
                  <span className="text-saffron-400">✦</span>
                </Link>

                {/* Liên hệ */}
                {location.pathname === '/' ? (
                  <a
                    href="#contact"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="py-3 px-4 rounded-lg bg-[#f4e8d1]/40 border border-saffron-400/10 hover:border-saffron-400/30 transition-all duration-300 flex items-center justify-between"
                  >
                    <span>Liên hệ</span>
                    <span className="text-saffron-400">✦</span>
                  </a>
                ) : (
                  <Link
                    to="/#contact"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="py-3 px-4 rounded-lg bg-[#f4e8d1]/40 border border-saffron-400/10 hover:border-saffron-400/30 transition-all duration-300 flex items-center justify-between"
                  >
                    <span>Liên hệ</span>
                    <span className="text-saffron-400">✦</span>
                  </Link>
                )}
              </nav>

              {/* Decorative Quote inside the Mobile menu */}
              <div className="mt-auto pt-6 border-t border-saffron-400/10 text-center">
                <p className="text-[9px] uppercase tracking-[0.2em] text-[#27140e]/40">Gieo Duyên Lành • Tạo Phúc Đức</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 relative z-10 w-full max-w-[1440px] mx-auto">
        <Suspense fallback={<GildedLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/gioi-thieu" element={<AboutPage />} />
            <Route path="/tu-lieu" element={<ResourcesPage />} />
            <Route path="/ho-tro" element={<ServicesPage />} />
            <Route path="/gieo-duyen" element={<GiftsPage />} />
            <Route path="/phan-hoi" element={<TestimonialsPage />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
