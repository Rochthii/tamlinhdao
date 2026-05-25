import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutDashboard, BookOpen, HeartHandshake, Flame, MessageSquare, Settings, LogOut, Plus, Edit2, Trash2, ArrowLeft, Lock, Mail, Eye, EyeOff, ShieldAlert, KeyRound, Users, Check, Clock, Sparkles, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { fetchTable, supabase } from '../lib/supabase';
import ArticleEditor from '../components/ArticleEditor';
import CategoriesManager from '../components/CategoriesManager';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { articles, services, gifts, testimonials, members, refreshData } = useAppContext();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Quản lý phiên đăng nhập thực tế từ Supabase
  useEffect(() => {
    if (!supabase) {
      setIsAuthChecking(false);
      // Fallback cho môi trường dev không có Supabase
      setIsLoggedIn(localStorage.getItem('admin_logged_in') === 'true');
      return;
    }

    // Kiểm tra session hiện tại khi mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
      setIsAuthChecking(false);
    });

    // Đăng ký lắng nghe thay đổi trạng thái auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Real-time Contact Bookings State
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true;
    if (!isLoggedIn) return;

    const formatItem = (item: any) => {
      let dateStr = 'Mới đây';
      if (item.created_at) {
        const dateObj = new Date(item.created_at);
        dateStr = dateObj.toLocaleDateString('vi-VN', {
          day: '2-digit', month: 'long', year: 'numeric'
        }) + ' ' + dateObj.toLocaleTimeString('vi-VN', {
          hour: '2-digit', 
          minute: '2-digit'
        });
      }
      return { id: item.id, ...item, formattedDate: dateStr };
    };

    const load = async () => {
      try {
        const data = await fetchTable('bookings');
        if (!mounted || !data) return;
        setBookings((data as any[]).map(formatItem));
      } catch (error) {
        console.error('Lỗi khi tải danh sách từ Supabase:', error);
      }
    };
    load();

    // Realtime subscription
    let channel: any = null;
    if (supabase) {
      channel = supabase.channel('public:bookings')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, (payload) => {
          if (!mounted) return;
          const ev = payload.eventType;
          if (ev === 'INSERT') setBookings(prev => [formatItem(payload.new), ...prev]);
          else if (ev === 'UPDATE') setBookings(prev => prev.map(b => (b.id === payload.new.id ? formatItem(payload.new) : b)));
          else if (ev === 'DELETE') setBookings(prev => prev.filter(b => b.id !== payload.old.id));
        })
        .subscribe();
    }

    return () => { 
      mounted = false; 
      if (channel && supabase) supabase.removeChannel(channel);
    };
  }, [isLoggedIn, supabase]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsSubmitting(true);

    if (supabase) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setLoginError('Xác thực thất bại: ' + error.message);
      }
      setIsSubmitting(false);
    } else {
      // Chế độ fallback nếu không có Supabase (Demo)
      const correctEmail = 'rochthi59@gmail.com';
      const correctPassword = 'Admin123';
      if (email.trim() === correctEmail && password === correctPassword) {
        localStorage.setItem('admin_logged_in', 'true');
        setIsLoggedIn(true);
      } else {
        setLoginError('Vui lòng kiểm tra lại tài khoản hoặc mật khẩu.');
      }
      setIsSubmitting(false);
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'Tổng Quan', icon: LayoutDashboard },
    { id: 'bookings', label: 'Yêu Cầu Hỗ Trợ', icon: Mail },
    { id: 'articles', label: 'Tư Liệu', icon: BookOpen },
    { id: 'categories', label: 'Nhóm / Chuyên Mục', icon: Check },
    { id: 'services', label: 'Hỗ Trợ', icon: Flame },
    { id: 'gifts', label: 'Gieo Duyên', icon: HeartHandshake },
    { id: 'testimonials', label: 'Phản Hồi', icon: MessageSquare },
    { id: 'members', label: 'Thành Viên', icon: Users },
  ];

  // Hiển thị trạng thái chờ khi đang kiểm tra session
  if (isAuthChecking) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#27140e]">
        <div className="w-10 h-10 border-4 border-saffron-400/20 border-t-saffron-400 rounded-full animate-spin"></div>
      </div>
    );
  }

  function CategoriesTab() {
    return (
      <div className="p-6">
        <h2 className="text-xl font-serif text-saffron-400 mb-4">Quản Lý Nhóm / Chuyên Mục</h2>
        <CategoriesManager />
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#27140e] relative overflow-hidden font-sans text-white p-4">
        {/* Mystic glowing orbs in the background */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#7a1212]/30 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#e9a341]/10 rounded-full blur-[150px] pointer-events-none"></div>
        
        {/* Diagonal premium gold shimmer lines behind card */}
        <div className="absolute inset-0 bg-[radial-gradient(#e9a341_1px,transparent_1.5px)] [background-size:24px_24px] opacity-5 pointer-events-none"></div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-full max-w-md relative z-10"
        >
          {/* Glowing frame decoration */}
          <div className="absolute -inset-1.5 bg-gradient-to-r from-[#7a1212] via-[#e9a341] to-[#69120c] rounded-2xl blur-lg opacity-40 animate-pulse animate-duration-10000"></div>

          <div className="relative bg-[#1c0d09] border border-saffron-400/20 rounded-2xl p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-sm">
            
            {/* Header / Logo */}
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 rounded-full border border-saffron-400/40 bg-[#7a1212]/40 flex items-center justify-center shadow-[0_0_20px_rgba(233,163,65,0.2)] mb-4 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gilded opacity-10 group-hover:opacity-20 transition-opacity"></div>
                <Lock className="w-6 h-6 text-[#e9a341]" />
              </div>
              <h2 className="text-2xl font-serif text-white font-bold tracking-widest uppercase">Xác Thực Danh Tánh</h2>
              <p className="text-[10px] uppercase tracking-[0.25em] text-saffron-400/70 mt-1.5 font-medium">CỔNG QUẢN TRỊ ĐẠO</p>
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {loginError && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mb-6 p-4 rounded-lg bg-red-950/60 border border-red-500/30 flex items-start gap-3"
                >
                  <ShieldAlert className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <span className="text-xs text-red-200/90 leading-relaxed font-medium">{loginError}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email field */}
              <div className="space-y-2">
                <label className="block text-[10px] uppercase tracking-widest text-[#fff1be]/60 font-semibold">Tài khoản (Email)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/30">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="rochthi59@gmail.com"
                    className="w-full bg-[#130704]/80 border border-saffron-400/20 focus:border-saffron-400 rounded-lg py-3.5 pl-11 pr-4 text-sm text-white placeholder-white/20 focus:outline-none transition-all duration-300 focus:shadow-[0_0_15px_rgba(233,163,65,0.15)]"
                  />
                </div>
              </div>

              {/* Password field */}
              <div className="space-y-2">
                <label className="block text-[10px] uppercase tracking-widest text-[#fff1be]/60 font-semibold">Mật khẩu</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/30">
                    <KeyRound className="w-4 h-4" />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#130704]/80 border border-saffron-400/20 focus:border-saffron-400 rounded-lg py-3.5 pl-11 pr-11 text-sm text-white placeholder-white/20 focus:outline-none transition-all duration-300 focus:shadow-[0_0_15px_rgba(233,163,65,0.15)]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/35 hover:text-white/70 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 relative overflow-hidden group py-3 rounded-lg text-sm uppercase tracking-widest font-bold text-white transition-all bg-gilded border border-saffron-400/40 hover:border-saffron-400 active:scale-[0.98] shadow-[0_5px_15px_rgba(0,0,0,0.4)] hover:shadow-[0_5px_20px_rgba(191,42,35,0.3)] duration-300 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Đang chứng thực...</span>
                  </div>
                ) : (
                  <span>Đăng Nhập</span>
                )}
              </button>

              <div className="text-center pt-3">
                <Link to="/" className="text-[10px] tracking-widest text-[#fff1be]/45 hover:text-saffron-400 transition-colors uppercase">
                  ← Quay lại trang chủ
                </Link>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-dao-900 overflow-hidden font-sans text-white relative">
      {/* Mobile sidebar overlay backdrop */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 w-64 bg-dao-800 border-r border-saffron-400/10 flex flex-col shrink-0 z-40 transition-transform duration-300 transform md:translate-x-0 md:relative md:flex ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 flex items-center gap-2 justify-between px-4 border-b border-saffron-400/10 shrink-0">
          <Link to="/" className="text-saffron-400 font-serif text-xl tracking-widest uppercase">Đạo Admin</Link>
          <button 
            onClick={() => setIsSidebarOpen(false)} 
            className="p-1.5 hover:bg-white/5 rounded-md md:hidden text-white/60 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6 space-y-6">
          {/* Phân nhóm 1: Hệ Thống Đạo Quán */}
          <div className="px-4 space-y-2 text-left">
            <h3 className="text-[9px] font-bold text-saffron-400/50 uppercase tracking-[0.25em] px-2 mb-2">Hệ Thống Đạo Quán</h3>
            <nav className="space-y-1">
              {tabs.filter(t => ['dashboard', 'bookings', 'members'].includes(t.id)).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-md text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-saffron-400/10 text-saffron-400 border border-saffron-400/20'
                      : 'text-white/60 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <tab.icon className="w-4 h-4 opacity-70" />
                    <span>{tab.label}</span>
                  </div>
                  {tab.id === 'bookings' && bookings.filter(b => b.status === 'pending').length > 0 && (
                    <span className="bg-rust-900 text-white text-[9px] px-1.5 py-0.5 rounded-full font-mono animate-pulse">
                      {bookings.filter(b => b.status === 'pending').length}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Phân nhóm 2: Nội Dung Tâm Thức */}
          <div className="px-4 space-y-2 text-left">
            <h3 className="text-[9px] font-bold text-saffron-400/50 uppercase tracking-[0.25em] px-2 mb-2">Nội Dung Tâm Thức</h3>
            <nav className="space-y-1">
              {tabs.filter(t => ['articles', 'categories', 'testimonials'].includes(t.id)).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-md text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-saffron-400/10 text-saffron-400 border border-saffron-400/20'
                      : 'text-white/60 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <tab.icon className="w-4 h-4 opacity-70" />
                    <span>{tab.label}</span>
                  </div>
                </button>
              ))}
            </nav>
          </div>

          {/* Phân nhóm 3: Tuyến Phục Sự */}
          <div className="px-4 space-y-2 text-left">
            <h3 className="text-[9px] font-bold text-saffron-400/50 uppercase tracking-[0.25em] px-2 mb-2">Tuyến Phục Sự</h3>
            <nav className="space-y-1">
              {tabs.filter(t => ['services', 'gifts'].includes(t.id)).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-md text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-saffron-400/10 text-saffron-400 border border-saffron-400/20'
                      : 'text-white/60 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <tab.icon className="w-4 h-4 opacity-70" />
                    <span>{tab.label}</span>
                  </div>
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="p-4 border-t border-saffron-400/10 shrink-0">
          <button
            onClick={async () => {
              if (supabase) await supabase.auth.signOut();
              localStorage.removeItem('admin_logged_in');
              setIsLoggedIn(false);
              window.location.href = '/';
            }}
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 rounded-md transition-colors w-full text-left cursor-pointer"
          >
            <LogOut className="w-5 h-5 opacity-70" />
            Đăng xuất & Trở về
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-dao-900/50">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-4 sm:px-8 bg-dao-800/80 border-b border-saffron-400/10 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 hover:bg-white/5 rounded-md md:hidden text-white/70 hover:text-white cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-base sm:text-xl font-serif text-white">{tabs.find(t => t.id === activeTab)?.label}</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-saffron-400/20 text-saffron-400 flex items-center justify-center font-bold text-xs border border-saffron-400/30">
              AD
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 relative">
          {activeTab === 'dashboard' && <DashboardTab bookings={bookings} setActiveTab={setActiveTab} />}
          {activeTab === 'bookings' && <BookingsTab bookings={bookings} />}
          {activeTab === 'articles' && <ArticlesTab />}
          {activeTab === 'categories' && <CategoriesTab />}
          {activeTab === 'services' && <ServicesTab />}
          {activeTab === 'gifts' && <GiftsTab />}
          {activeTab === 'testimonials' && <TestimonialsTab />}
          {activeTab === 'members' && <MembersTab />}
        </main>
      </div>
    </div>
  );
}

function DashboardTab({ bookings, setActiveTab }: { bookings: any[]; setActiveTab: (tab: string) => void }) {
  const { articles, services, gifts, testimonials, members } = useAppContext();

  const pendingBookings = bookings.filter(b => b.status === 'pending').length;
  const publishedArticles = articles.filter(a => (a as any).published !== false).length;
  const draftArticles = articles.length - publishedArticles;

  return (
    <div className="space-y-8 text-left">
      {/* Welcome Banner */}
      <div className="dao-panel p-8 border border-saffron-400/10 relative overflow-hidden rounded-xl bg-gradient-to-r from-dao-800/40 via-dao-900/40 to-transparent">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(circle_at_100%_0%,rgba(214,176,82,0.06)_0%,transparent_70%)] pointer-events-none"></div>
        <div className="relative z-10 space-y-2">
          <h2 className="text-2xl font-serif text-saffron-400">Nam Mô Đạo Tổ • Quản Trị Viên Đạo Quán</h2>
          <p className="text-xs text-white/50 font-light leading-relaxed max-w-2xl">
            Chào mừng bạn hữu đã quy lai cổng quản trị tâm linh. Nơi đây là cầu nối tiếp dẫn phước đức và tu dưỡng tri thức. Hãy kiểm tra các yêu cầu liên hệ hoặc tạo thêm bài viết bổ ích giúp bạn hữu gần xa.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Bookings Stat Card */}
        <div className="dao-panel p-6 rounded-xl border border-saffron-400/10 bg-dao-800/20 flex flex-col justify-between h-40">
          <div>
            <h3 className="text-white/40 text-[10px] uppercase tracking-widest font-bold mb-2">Yêu Cầu Hỗ Trợ</h3>
            <p className="text-4xl font-serif text-saffron-400">{bookings.length}</p>
          </div>
          <div className="flex justify-between items-center border-t border-saffron-400/5 pt-3 mt-3 text-xs">
            <span className="text-white/50 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rust-500 animate-pulse" /> {pendingBookings} Chờ Hỗ Trợ
            </span>
            <button onClick={() => setActiveTab('bookings')} className="text-saffron-400 font-bold hover:underline cursor-pointer">Chi tiết →</button>
          </div>
        </div>

        {/* Articles Stat Card */}
        <div className="dao-panel p-6 rounded-xl border border-saffron-400/10 bg-dao-800/20 flex flex-col justify-between h-40">
          <div>
            <h3 className="text-white/40 text-[10px] uppercase tracking-widest font-bold mb-2">Thư Viện Tư Liệu</h3>
            <p className="text-4xl font-serif text-saffron-400">{articles.length}</p>
          </div>
          <div className="flex justify-between items-center border-t border-saffron-400/5 pt-3 mt-3 text-xs">
            <span className="text-white/50">{publishedArticles} Đăng tải / {draftArticles} Nháp</span>
            <button onClick={() => setActiveTab('articles')} className="text-saffron-400 font-bold hover:underline cursor-pointer">Chi tiết →</button>
          </div>
        </div>

        {/* Services & Gifts Stat Card */}
        <div className="dao-panel p-6 rounded-xl border border-saffron-400/10 bg-dao-800/20 flex flex-col justify-between h-40">
          <div>
            <h3 className="text-white/40 text-[10px] uppercase tracking-widest font-bold mb-2">Hành Trang & Gieo Duyên</h3>
            <p className="text-4xl font-serif text-saffron-400">{(services?.length || 0) + (gifts?.length || 0)}</p>
          </div>
          <div className="flex justify-between items-center border-t border-saffron-400/5 pt-3 mt-3 text-xs">
            <span className="text-white/50">{services?.length || 0} Dịch vụ / {gifts?.length || 0} Quà tặng</span>
            <button onClick={() => setActiveTab('services')} className="text-saffron-400 font-bold hover:underline cursor-pointer">Chi tiết →</button>
          </div>
        </div>
      </div>

      {/* Quick Action Area */}
      <div className="dao-panel p-6 border border-saffron-400/10 rounded-xl bg-dao-800/10 text-left">
        <h3 className="text-xs uppercase tracking-widest font-bold text-saffron-400 mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4" /> Hành Động Nhanh
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <button
            onClick={() => setActiveTab('articles')}
            className="p-4 bg-dao-900 border border-saffron-400/10 hover:border-saffron-400/40 rounded-lg text-xs font-bold text-white hover:text-saffron-400 transition-all flex flex-col gap-1 text-left cursor-pointer animate-duration-500"
          >
            <span className="text-saffron-400">✦ Đăng bài viết mới</span>
            <span className="text-[10px] text-white/40 font-light">Mở rộng thư viện tri thức tâm linh</span>
          </button>
          
          <button
            onClick={() => setActiveTab('bookings')}
            className="p-4 bg-dao-900 border border-saffron-400/10 hover:border-saffron-400/40 rounded-lg text-xs font-bold text-white hover:text-saffron-400 transition-all flex flex-col gap-1 text-left cursor-pointer animate-duration-500"
          >
            <span className="text-saffron-400">✦ Xem yêu cầu mới nhất</span>
            <span className="text-[10px] text-white/40 font-light">Liên hệ trực tiếp trợ tín khách hữu duyên</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className="p-4 bg-dao-900 border border-saffron-400/10 hover:border-saffron-400/40 rounded-lg text-xs font-bold text-white hover:text-saffron-400 transition-all flex flex-col gap-1 text-left cursor-pointer animate-duration-500"
          >
            <span className="text-saffron-400">✦ Thiết lập chuyên mục</span>
            <span className="text-[10px] text-white/40 font-light">Tạo mới phân loại bài viết khoa học</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function ArticlesTab() {
  const { articles, addArticle, updateArticle, deleteArticle, refreshData } = useAppContext();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({ title: '', category: '', excerpt: '', date: '', readTime: '', author: '', content: '' });

  const filteredArticles = articles.filter(item => 
    (item.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.category || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.excerpt || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.author || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setIsAdding(false);
    setFormData({
      title: item.title || '',
      category: item.category || '',
      excerpt: item.excerpt || '',
      date: item.date || '',
      readTime: item.readTime || '',
      author: item.author || '',
      content: item.content || ''
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Bạn hữu thực sự muốn gỡ bỏ tư liệu này?')) {
      await deleteArticle(id);
      await refreshData();
    }
  };

  if (isAdding || editingId) {
    const initialArticle = isAdding ? null : articles.find(a => a.id === editingId) || null;
    return (
      <div className="space-y-6">
        <button onClick={() => { setIsAdding(false); setEditingId(null); }} className="flex items-center gap-2 text-white/50 hover:text-white transition-colors cursor-pointer">
          <ArrowLeft className="w-4 h-4" /> Quay lại
        </button>
        <div className="bg-dao-800/50 p-6 rounded-lg border border-saffron-400/10 space-y-4 max-w-5xl">
          <h2 className="text-xl font-serif text-saffron-400">{isAdding ? 'Thêm Bài Viết Mới' : 'Sửa Bài Viết'}</h2>
          <ArticleEditor
            initial={initialArticle}
            onCancel={() => { setIsAdding(false); setEditingId(null); }}
            onSaved={async () => { 
              await refreshData();
              setIsAdding(false);
              setEditingId(null);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <input 
          type="text" 
          placeholder="Tìm kiếm tư liệu..." 
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="bg-dao-800 border border-saffron-400/20 rounded-md py-2 px-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-saffron-400/60 transition-colors w-64" 
        />
        <button onClick={() => { setIsAdding(true); setFormData({ title: '', category: '', excerpt: '', date: '', readTime: '', author: 'Chăm Rốch Thi', content: '' }); }} className="flex items-center gap-2 bg-saffron-400 hover:bg-saffron-500 text-dao-900 px-4 py-2 rounded-md text-sm font-bold transition-colors cursor-pointer">
          <Plus className="w-4 h-4" /> Thêm bài viết
        </button>
      </div>

      <div className="bg-dao-800/50 border border-saffron-400/10 rounded-lg overflow-hidden">
        <div className="overflow-x-auto w-full scrollbar-thin scrollbar-thumb-saffron-400/20">
          <table className="w-full text-left border-collapse min-w-[850px]">
          <thead>
            <tr className="border-b border-saffron-400/10 bg-dao-800">
              <th className="py-3 px-4 text-xs uppercase tracking-widest text-white/50 font-medium w-2/5">Tiêu đề / Tóm tắt</th>
              <th className="py-3 px-4 text-xs uppercase tracking-widest text-white/50 font-medium">Tác giả</th>
              <th className="py-3 px-4 text-xs uppercase tracking-widest text-white/50 font-medium">Chuyên mục</th>
              <th className="py-3 px-4 text-xs uppercase tracking-widest text-white/50 font-medium">Thời gian</th>
              <th className="py-3 px-4 text-xs uppercase tracking-widest text-white/50 font-medium text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-saffron-400/5">
            {filteredArticles.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-white/40 text-sm">
                  Không tìm thấy bài viết nào.
                </td>
              </tr>
            ) : (
              filteredArticles.map((item) => (
                <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-4">
                    <div className="text-sm text-white font-medium">{item.title}</div>
                    <div className="text-xs text-white/40 mt-1 line-clamp-1">{item.excerpt}</div>
                  </td>
                  <td className="py-4 px-4 text-xs text-saffron-400 font-serif">
                    {item.author || <span className="italic text-white/30">Chưa rõ</span>}
                  </td>
                  <td className="py-4 px-4 text-sm text-white/60">{item.category}</td>
                  <td className="py-4 px-4">
                    <div className="text-sm text-white/60">{item.date}</div>
                    <div className="text-xs text-white/40">{item.readTime}</div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleEdit(item)} className="p-2 text-white/50 hover:text-saffron-400 transition-colors bg-dao-800 hover:bg-saffron-400/10 rounded-md border border-white/5 hover:border-saffron-400/30 cursor-pointer">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="p-2 text-white/50 hover:text-rust-500 transition-colors bg-dao-800 hover:bg-rust-900/30 rounded-md border border-white/5 hover:border-rust-900/50 cursor-pointer">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      </div>
    </motion.div>
  );
}

function ServicesTab() {
  const { services, addService, updateService, deleteService, refreshData } = useAppContext();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ title: '', subtitle: '', hanzi: '', description: '', features: '', iconName: '', color: 'text-saffron-400', borderColor: 'border-saffron-400/30', bgDecor: 'bg-saffron-400/5' });

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setIsAdding(false);
    setFormData({ ...item, features: item.features.join('\\n') });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Bạn hữu thực sự muốn gỡ bỏ dịch vụ này?')) {
      await deleteService(id);
      await refreshData();
    }
  };

  const handleSave = async () => {
    const dataToSave = { ...formData, features: formData.features.split('\\n').map(f => f.trim()).filter(Boolean) };
    if (isAdding) await addService(dataToSave);
    else if (editingId) await updateService(editingId, dataToSave);
    await refreshData();
    setIsAdding(false);
    setEditingId(null);
  };

  if (isAdding || editingId) {
    return (
      <div className="space-y-6">
        <button onClick={() => { setIsAdding(false); setEditingId(null); }} className="flex items-center gap-2 text-white/50 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Quay lại
        </button>
        <div className="bg-dao-800/50 p-6 rounded-lg border border-saffron-400/10 space-y-4 max-w-2xl">
          <h2 className="text-xl font-serif text-saffron-400">{isAdding ? 'Thêm Tuyến Dịch Vụ' : 'Sửa Dịch Vụ'}</h2>
          <div className="flex gap-4">
             <input className="flex-1 bg-dao-900 border border-saffron-400/20 rounded-md p-3 text-white" placeholder="Tên dịch vụ" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
             <input className="flex-1 bg-dao-900 border border-saffron-400/20 rounded-md p-3 text-white" placeholder="Tiêu đề phụ" value={formData.subtitle} onChange={e => setFormData({...formData, subtitle: e.target.value})} />
          </div>
          <div className="flex gap-4">
             <input className="flex-1 bg-dao-900 border border-saffron-400/20 rounded-md p-3 text-white" placeholder="Chữ Hán trực quan (Hanzi)" value={formData.hanzi} onChange={e => setFormData({...formData, hanzi: e.target.value})} />
             <input className="flex-1 bg-dao-900 border border-saffron-400/20 rounded-md p-3 text-white" placeholder="Tên Icon (vd: Flame, Compass)" value={formData.iconName} onChange={e => setFormData({...formData, iconName: e.target.value})} />
          </div>
          <textarea className="w-full bg-dao-900 border border-saffron-400/20 rounded-md p-3 text-white h-32" placeholder="Mô tả chi tiết" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          <textarea className="w-full bg-dao-900 border border-saffron-400/20 rounded-md p-3 text-white h-32" placeholder="Tính năng (mỗi dòng 1 thẻ)" value={formData.features} onChange={e => setFormData({...formData, features: e.target.value})} />
          <button onClick={handleSave} className="bg-saffron-400 text-dao-900 px-6 py-2 rounded-md font-bold hover:bg-saffron-500 transition-colors">Lưu lại</button>
        </div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <input type="text" placeholder="Tìm dịch vụ hỗ trợ..." className="bg-dao-800 border border-saffron-400/20 rounded-md py-2 px-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-saffron-400/60 transition-colors w-64" />
        <button onClick={() => { setIsAdding(true); setFormData({ title: '', subtitle: '', hanzi: '', description: '', features: '', iconName: '', color: 'text-saffron-400', borderColor: 'border-saffron-400/30', bgDecor: 'bg-saffron-400/5' }); }} className="flex items-center gap-2 bg-saffron-400 hover:bg-saffron-500 text-dao-900 px-4 py-2 rounded-md text-sm font-bold transition-colors">
          <Plus className="w-4 h-4" /> Thêm dịch vụ
        </button>
      </div>

      <div className="bg-dao-800/50 border border-saffron-400/10 rounded-lg overflow-hidden">
        <div className="overflow-x-auto w-full scrollbar-thin scrollbar-thumb-saffron-400/20">
          <table className="w-full text-left border-collapse min-w-[650px]">
          <thead>
            <tr className="border-b border-saffron-400/10 bg-dao-800">
              <th className="py-3 px-4 text-xs uppercase tracking-widest text-white/50 font-medium w-1/2">Thông tin dịch vụ</th>
              <th className="py-3 px-4 text-xs uppercase tracking-widest text-white/50 font-medium">Hành trang</th>
              <th className="py-3 px-4 text-xs uppercase tracking-widest text-white/50 font-medium text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-saffron-400/5">
            {services.map((item) => (
              <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="py-4 px-4">
                  <div className="text-sm font-serif text-white">{item.title}</div>
                  <div className="text-xs text-white/40 mt-1 line-clamp-1">{item.description}</div>
                </td>
                <td className="py-4 px-4 text-xs text-white/60">
                   {item.features.length} đề mục
                </td>
                <td className="py-4 px-4 flex justify-end gap-2">
                  <button onClick={() => handleEdit(item)} className="p-2 text-white/50 hover:text-saffron-400 transition-colors bg-dao-800 hover:bg-saffron-400/10 rounded-md border border-white/5 hover:border-saffron-400/30">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 text-white/50 hover:text-rust-500 transition-colors bg-dao-800 hover:bg-rust-900/30 rounded-md border border-white/5 hover:border-rust-900/50">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </motion.div>
  );
}

function GiftsTab() {
  const { gifts, addGift, updateGift, deleteGift, refreshData } = useAppContext();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ title: '', desc: '', type: 'newcomer', iconName: '', color: 'text-jade-400', bg: 'bg-jade-400/10' });

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setIsAdding(false);
    setFormData(item);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Bạn hữu thực sự muốn gỡ bỏ phần quà này?')) {
      await deleteGift(id);
      await refreshData();
    }
  };

  const handleSave = async () => {
    if (isAdding) await addGift(formData);
    else if (editingId) await updateGift(editingId, formData);
    await refreshData();
    setIsAdding(false);
    setEditingId(null);
  };

  if (isAdding || editingId) {
    return (
      <div className="space-y-6">
        <button onClick={() => { setIsAdding(false); setEditingId(null); }} className="flex items-center gap-2 text-white/50 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Quay lại
        </button>
        <div className="bg-dao-800/50 p-6 rounded-lg border border-saffron-400/10 space-y-4 max-w-2xl">
          <h2 className="text-xl font-serif text-saffron-400">{isAdding ? 'Thêm Phần Quà' : 'Sửa Phần Quà'}</h2>
          <div className="flex gap-4">
             <input className="flex-1 bg-dao-900 border border-saffron-400/20 rounded-md p-3 text-white" placeholder="Tên quà" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
             <select className="flex-1 bg-dao-900 border border-saffron-400/20 rounded-md p-3 text-white" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
               <option value="newcomer">Người mới</option>
               <option value="loyal">Khách hàng thân thiết</option>
             </select>
          </div>
          <input className="w-full bg-dao-900 border border-saffron-400/20 rounded-md p-3 text-white" placeholder="Tên Icon (vd: Gift, Sparkles)" value={formData.iconName} onChange={e => setFormData({...formData, iconName: e.target.value})} />
          <textarea className="w-full bg-dao-900 border border-saffron-400/20 rounded-md p-3 text-white h-32" placeholder="Mô tả" value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} />
          <button onClick={handleSave} className="bg-saffron-400 text-dao-900 px-6 py-2 rounded-md font-bold hover:bg-saffron-500 transition-colors">Lưu lại</button>
        </div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <input type="text" placeholder="Tìm phần quà gieo duyên..." className="bg-dao-800 border border-saffron-400/20 rounded-md py-2 px-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-saffron-400/60 transition-colors w-64" />
        <button onClick={() => { setIsAdding(true); setFormData({ title: '', desc: '', type: 'newcomer', iconName: '', color: 'text-jade-400', bg: 'bg-jade-400/10' }); }} className="flex items-center gap-2 bg-saffron-400 hover:bg-saffron-500 text-dao-900 px-4 py-2 rounded-md text-sm font-bold transition-colors">
          <Plus className="w-4 h-4" /> Thêm phần quà
        </button>
      </div>

      <div className="bg-dao-800/50 border border-saffron-400/10 rounded-lg overflow-hidden">
        <div className="overflow-x-auto w-full scrollbar-thin scrollbar-thumb-saffron-400/20">
          <table className="w-full text-left border-collapse min-w-[650px]">
          <thead>
            <tr className="border-b border-saffron-400/10 bg-dao-800">
              <th className="py-3 px-4 text-xs uppercase tracking-widest text-white/50 font-medium">Tên quà</th>
              <th className="py-3 px-4 text-xs uppercase tracking-widest text-white/50 font-medium">Mô tả</th>
              <th className="py-3 px-4 text-xs uppercase tracking-widest text-white/50 font-medium">Đối tượng</th>
              <th className="py-3 px-4 text-xs uppercase tracking-widest text-white/50 font-medium text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-saffron-400/5">
            {gifts.map((item) => (
              <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="py-4 px-4 text-sm text-white">{item.title}</td>
                <td className="py-4 px-4 text-xs text-white/40 line-clamp-2">{item.desc}</td>
                <td className="py-4 px-4">
                  <span className={`px-2 py-1 text-[10px] uppercase tracking-widest rounded-full ${item.type === 'newcomer' ? 'bg-jade-400/10 text-jade-400 border border-jade-400/20' : 'bg-saffron-400/10 text-saffron-400 border border-saffron-400/20'}`}>
                    {item.type === 'newcomer' ? 'Gieo duyên' : 'Tri ân'}
                  </span>
                </td>
                <td className="py-4 px-4 flex justify-end gap-2">
                  <button onClick={() => handleEdit(item)} className="p-2 text-white/50 hover:text-saffron-400 transition-colors bg-dao-800 hover:bg-saffron-400/10 rounded-md border border-white/5 hover:border-saffron-400/30">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 text-white/50 hover:text-rust-500 transition-colors bg-dao-800 hover:bg-rust-900/30 rounded-md border border-white/5 hover:border-rust-900/50">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </motion.div>
  );
}

function TestimonialsTab() {
  const { testimonials, addTestimonial, updateTestimonial, deleteTestimonial, refreshData } = useAppContext();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ name: '', service: '', content: '' });

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setIsAdding(false);
    setFormData(item);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Bạn hữu thực sự muốn gỡ bỏ phản hồi này?')) {
      await deleteTestimonial(id);
      await refreshData();
    }
  };

  const handleSave = async () => {
    if (isAdding) await addTestimonial(formData);
    else if (editingId) await updateTestimonial(editingId, formData);
    await refreshData();
    setIsAdding(false);
    setEditingId(null);
  };

  if (isAdding || editingId) {
    return (
      <div className="space-y-6">
        <button onClick={() => { setIsAdding(false); setEditingId(null); }} className="flex items-center gap-2 text-white/50 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Quay lại
        </button>
        <div className="bg-dao-800/50 p-6 rounded-lg border border-saffron-400/10 space-y-4 max-w-2xl">
          <h2 className="text-xl font-serif text-saffron-400">{isAdding ? 'Thêm Phản Hồi' : 'Sửa Phản Hồi'}</h2>
          <div className="flex gap-4">
             <input className="flex-1 bg-dao-900 border border-saffron-400/20 rounded-md p-3 text-white" placeholder="Tên / Pháp danh" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
             <input className="flex-1 bg-dao-900 border border-saffron-400/20 rounded-md p-3 text-white" placeholder="Sử dụng dịch vụ" value={formData.service} onChange={e => setFormData({...formData, service: e.target.value})} />
          </div>
          <textarea className="w-full bg-dao-900 border border-saffron-400/20 rounded-md p-3 text-white h-32" placeholder="Nội dung phản hồi" value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} />
          <button onClick={handleSave} className="bg-saffron-400 text-dao-900 px-6 py-2 rounded-md font-bold hover:bg-saffron-500 transition-colors">Lưu lại</button>
        </div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <input type="text" placeholder="Tìm phản hồi..." className="bg-dao-800 border border-saffron-400/20 rounded-md py-2 px-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-saffron-400/60 transition-colors w-64" />
        <button onClick={() => { setIsAdding(true); setFormData({ name: '', service: '', content: '' }); }} className="flex items-center gap-2 bg-saffron-400 hover:bg-saffron-500 text-dao-900 px-4 py-2 rounded-md text-sm font-bold transition-colors">
          <Plus className="w-4 h-4" /> Thêm phản hồi
        </button>
      </div>

      <div className="bg-dao-800/50 border border-saffron-400/10 rounded-lg overflow-hidden">
        <div className="overflow-x-auto w-full scrollbar-thin scrollbar-thumb-saffron-400/20">
          <table className="w-full text-left border-collapse min-w-[650px]">
          <thead>
            <tr className="border-b border-saffron-400/10 bg-dao-800">
              <th className="py-3 px-4 text-xs uppercase tracking-widest text-white/50 font-medium">Tên / Pháp danh</th>
              <th className="py-3 px-4 text-xs uppercase tracking-widest text-white/50 font-medium w-1/2">Phản hồi</th>
              <th className="py-3 px-4 text-xs uppercase tracking-widest text-white/50 font-medium text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-saffron-400/5">
            {testimonials.map((item) => (
              <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="py-4 px-4">
                  <div className="text-sm text-white">{item.name}</div>
                  <div className="text-[10px] uppercase tracking-widest text-white/40 mt-1">{item.service}</div>
                </td>
                <td className="py-4 px-4 text-xs italic text-white/60 line-clamp-3">
                  {item.content}
                </td>
                <td className="py-4 px-4 flex justify-end gap-2">
                  <button onClick={() => handleEdit(item)} className="p-2 text-white/50 hover:text-saffron-400 transition-colors bg-dao-800 hover:bg-saffron-400/10 rounded-md border border-white/5 hover:border-saffron-400/30">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 text-white/50 hover:text-rust-500 transition-colors bg-dao-800 hover:bg-rust-900/30 rounded-md border border-white/5 hover:border-rust-900/50">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </motion.div>
  );
}

function MembersTab() {
  const { members, addMember, updateMember, deleteMember, refreshData } = useAppContext();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({ name: '', role: '', email: '', joinDate: '' });

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setIsAdding(false);
    setFormData(item);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Bạn hữu thực sự muốn gỡ bỏ thành viên này?')) {
      await deleteMember(id);
      await refreshData();
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      alert('Vui lòng điền Họ tên / Pháp danh');
      return;
    }
    const finalJoinDate = formData.joinDate.trim() || new Date().toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).replace('tháng', 'Tháng');

    const dataToSave = {
      ...formData,
      joinDate: finalJoinDate
    };

    if (isAdding) await addMember(dataToSave);
    else if (editingId) await updateMember(editingId, dataToSave);
    await refreshData();
    setIsAdding(false);
    setEditingId(null);
  };

  const filteredMembers = (members || []).filter(member => 
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isAdding || editingId) {
    return (
      <div className="space-y-6">
        <button onClick={() => { setIsAdding(false); setEditingId(null); }} className="flex items-center gap-2 text-white/50 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Quay lại
        </button>
        <div className="bg-dao-800/50 p-6 rounded-lg border border-saffron-400/10 space-y-4 max-w-2xl">
          <h2 className="text-xl font-serif text-saffron-400">{isAdding ? 'Thêm Thành Viên Mới' : 'Sửa Thông Tin Thành Viên'}</h2>
          
          <div className="space-y-2">
            <label className="text-xs text-white/60 block">Họ tên / Pháp danh *</label>
            <input className="w-full bg-dao-900 border border-saffron-400/20 rounded-md p-3 text-white focus:border-saffron-400 focus:outline-none transition-colors" placeholder="Họ tên hoặc Pháp danh du sỹ" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>

          <div className="space-y-2">
            <label className="text-xs text-white/60 block">Vai trò / Chức danh</label>
            <input className="w-full bg-dao-900 border border-saffron-400/20 rounded-md p-3 text-white focus:border-saffron-400 focus:outline-none transition-colors" placeholder="Ví dụ: Đạo sinh, Đạo hữu, Quản sự, Tri khố..." value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} />
          </div>

          <div className="space-y-2">
            <label className="text-xs text-white/60 block">Thư điện tử (Email)</label>
            <input className="w-full bg-dao-900 border border-saffron-400/20 rounded-md p-3 text-white focus:border-saffron-400 focus:outline-none transition-colors" placeholder="email@example.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          </div>

          <div className="space-y-2">
            <label className="text-xs text-white/60 block">Ngày tham gia (để trống nếu lấy hôm nay)</label>
            <input className="w-full bg-dao-900 border border-saffron-400/20 rounded-md p-3 text-white focus:border-saffron-400 focus:outline-none transition-colors" placeholder="Ví dụ: 20 Tháng 5, 2026" value={formData.joinDate} onChange={e => setFormData({...formData, joinDate: e.target.value})} />
          </div>

          <button onClick={handleSave} className="bg-saffron-400 text-dao-900 px-6 py-2.5 rounded-md font-bold hover:bg-saffron-500 transition-colors shadow-md cursor-pointer">Lưu lại</button>
        </div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <input 
          type="text" 
          placeholder="Tìm thành viên..." 
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="bg-dao-800 border border-saffron-400/20 rounded-md py-2 px-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-saffron-400/60 transition-colors w-64" 
        />
        <button onClick={() => { setIsAdding(true); setFormData({ name: '', role: '', email: '', joinDate: '' }); }} className="flex items-center gap-2 bg-saffron-400 hover:bg-saffron-500 text-dao-900 px-4 py-2 rounded-md text-sm font-bold transition-colors cursor-pointer">
          <Plus className="w-4 h-4" /> Thêm thành viên
        </button>
      </div>

      <div className="bg-dao-800/50 border border-saffron-400/10 rounded-lg overflow-hidden">
        <div className="overflow-x-auto w-full scrollbar-thin scrollbar-thumb-saffron-400/20">
          <table className="w-full text-left border-collapse min-w-[850px]">
          <thead>
            <tr className="border-b border-saffron-400/10 bg-dao-800">
              <th className="py-3 px-4 text-xs uppercase tracking-widest text-white/50 font-medium col-span-2">Họ tên / Pháp danh</th>
              <th className="py-3 px-4 text-xs uppercase tracking-widest text-white/50 font-medium">Vai trò / Chức vụ</th>
              <th className="py-3 px-4 text-xs uppercase tracking-widest text-white/50 font-medium">Email</th>
              <th className="py-3 px-4 text-xs uppercase tracking-widest text-white/50 font-medium">Ngày gia nhập</th>
              <th className="py-3 px-4 text-xs uppercase tracking-widest text-white/50 font-medium text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-saffron-400/5">
            {filteredMembers.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-white/40 text-sm">
                  Không tìm thấy thành viên nào.
                </td>
              </tr>
            ) : (
              filteredMembers.map((item) => (
                <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-4 text-sm text-white font-serif">{item.name}</td>
                  <td className="py-4 px-4 text-xs">
                    <span className="px-2.5 py-1 rounded-full bg-saffron-400/10 text-saffron-400 border border-saffron-400/20 uppercase tracking-wider font-semibold text-[9px]">
                      {item.role || 'Thành viên'}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-xs text-white/60 font-mono">{item.email || 'N/A'}</td>
                  <td className="py-4 px-4 text-xs text-white/50">{item.joinDate}</td>
                  <td className="py-4 px-4 flex justify-end gap-2">
                    <button onClick={() => handleEdit(item)} className="p-2 text-white/50 hover:text-saffron-400 transition-colors bg-dao-800 hover:bg-saffron-400/10 rounded-md border border-white/5 hover:border-saffron-400/30 cursor-pointer">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="p-2 text-white/50 hover:text-rust-500 transition-colors bg-dao-800 hover:bg-rust-900/30 rounded-md border border-white/5 hover:border-rust-900/50 cursor-pointer">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      </div>
    </motion.div>
  );
}

function BookingsTab({ bookings }: { bookings: any[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'contacted'>('all');

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'pending' ? 'contacted' : 'pending';
      
      if (supabase) {
        const { error } = await supabase.from('bookings').update({ status: newStatus }).eq('id', id);
        if (error) throw error;
      } else {
        // Fallback local logic if needed
      }
    } catch (e) {
      console.error('Lỗi khi cập nhật trạng thái liên hệ:', e);
      alert('Có lỗi xảy ra khi cập nhật trạng thái.');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      if (supabase) {
        const { error } = await supabase.from('bookings').delete().eq('id', id);
        if (error) throw error;
      }
    } catch (e) {
      console.error('Lỗi khi xóa liên hệ:', e);
      alert('Có lỗi xảy ra khi xóa liên hệ.');
    }
  };

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = 
      (b.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.phone || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.message || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.dob || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = 
      filterStatus === 'all' || 
      b.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Controls */}
        <div className="flex items-center gap-4">
          <input 
            type="text" 
            placeholder="Tìm người liên hệ, sđt..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="bg-dao-800 border border-saffron-400/20 rounded-md py-2 px-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-saffron-400/60 transition-colors w-64" 
          />
          <div className="flex bg-dao-800 p-1 border border-saffron-400/10 rounded-md">
            <button 
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1 text-xs rounded transition-colors ${filterStatus === 'all' ? 'bg-saffron-400 text-dao-900 font-bold' : 'text-white/60 hover:text-white'}`}
            >
              Tất Cả
            </button>
            <button 
              onClick={() => setFilterStatus('pending')}
              className={`px-3 py-1 text-xs rounded transition-colors ${filterStatus === 'pending' ? 'bg-rust-900/60 text-white font-bold' : 'text-white/60 hover:text-white'}`}
            >
              Chờ Hỗ Trợ
            </button>
            <button 
              onClick={() => setFilterStatus('contacted')}
              className={`px-3 py-1 text-xs rounded transition-colors ${filterStatus === 'contacted' ? 'bg-moss-900/50 text-moss-200 font-bold' : 'text-white/60 hover:text-white'}`}
            >
              Đã Liên Hệ
            </button>
          </div>
        </div>
      </div>

      <div className="bg-dao-800/50 border border-saffron-400/10 rounded-lg overflow-hidden">
        <div className="overflow-x-auto w-full scrollbar-thin scrollbar-thumb-saffron-400/20">
          <table className="w-full text-left border-collapse min-w-[950px]">
          <thead>
            <tr className="border-b border-saffron-400/10 bg-dao-800">
              <th className="py-3 px-4 text-xs uppercase tracking-widest text-white/50 font-medium">Khách Hữu Duyên</th>
              <th className="py-3 px-4 text-xs uppercase tracking-widest text-white/50 font-medium">Năm sinh / Mệnh</th>
              <th className="py-3 px-4 text-xs uppercase tracking-widest text-white/50 font-medium col-span-1">Điện Thoại</th>
              <th className="py-3 px-4 text-xs uppercase tracking-widest text-white/50 font-medium w-1/3">Mong muốn / Trăn trở</th>
              <th className="py-3 px-4 text-xs uppercase tracking-widest text-white/50 font-medium">Trạng Thái</th>
              <th className="py-3 px-4 text-xs uppercase tracking-widest text-white/50 font-medium text-right">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-saffron-400/5">
            {filteredBookings.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-white/40 text-sm">
                  Không tìm thấy yêu cầu liên hệ nào.
                </td>
              </tr>
            ) : (
              filteredBookings.map((item) => (
                <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-4 text-sm text-white font-serif">
                    <div>{item.name}</div>
                    <div className="text-[10px] text-white/40 mt-1 flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3 text-saffron-400/40" /> {item.formattedDate}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-xs text-white/70">{item.dob || '—'}</td>
                  <td className="py-4 px-4 text-xs text-white/95 font-mono">{item.phone}</td>
                  <td className="py-4 px-4 text-xs text-white/60 leading-relaxed break-words whitespace-pre-line pr-6 max-h-24">
                    {item.message || <span className="italic text-white/30">Không có lời nhắn</span>}
                  </td>
                  <td className="py-4 px-4 text-xs">
                    {item.status === 'pending' ? (
                      <span className="px-2.5 py-1 rounded-full bg-rust-950/80 text-rust-300 border border-rust-900/40 uppercase tracking-wider font-semibold text-[9px] flex items-center gap-1.5 w-fit">
                        <span className="w-1.5 h-1.5 rounded-full bg-rust-500 animate-pulse" /> Chờ Hỗ Trợ
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-moss-900/60 text-[#a3e635] border border-[#a3e635]/20 uppercase tracking-wider font-semibold text-[9px] flex items-center gap-1.5 w-fit">
                        <Check className="w-3 h-3 text-[#a3e635]" /> Đã Liên Hệ
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex justify-end gap-2 items-center">
                      <button 
                        onClick={() => handleToggleStatus(item.id, item.status)} 
                        title={item.status === 'pending' ? 'Đánh dấu đã liên hệ' : 'Đánh dấu chờ xử lý'}
                        className={`p-2 transition-colors rounded-md border cursor-pointer ${
                          item.status === 'pending' 
                          ? 'text-white/50 hover:text-moss-400 bg-dao-800 hover:bg-moss-950/20 border-white/5 hover:border-moss-900' 
                          : 'text-saffron-400/70 hover:text-rust-500 bg-dao-800 hover:bg-rust-950/20 border-saffron-400/20 hover:border-rust-900/30'
                        }`}
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)} 
                        title="Xóa yêu cầu"
                        className="p-2 text-white/50 hover:text-rust-500 transition-colors bg-dao-800 hover:bg-rust-900/30 rounded-md border border-white/5 hover:border-rust-900/50 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      </div>
    </motion.div>
  );
}
