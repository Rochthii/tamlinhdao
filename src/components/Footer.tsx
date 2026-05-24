import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="py-6 md:h-12 md:py-0 bg-dao-900 flex flex-col md:flex-row items-center justify-between px-6 md:px-10 border-t border-saffron-400/10 text-[9px] uppercase tracking-[0.2em] text-white/30 relative z-20 gap-4">
      <div className="mb-2 md:mb-0 text-center md:text-left flex items-center gap-4 flex-wrap justify-center md:justify-start">
        <span>© {new Date().getFullYear()} ĐẠO • Tu Dưỡng Tâm Tính</span>
        <span className="w-px h-3 bg-[#2d241c]/20 hidden md:block"></span>
        <Link to="/admin" className="hover:text-saffron-400 transition-colors hidden md:block">Quản Trị</Link>
        <span className="w-px h-3 bg-[#2d241c]/20 hidden md:block"></span>
        <span className="text-saffron-500 font-bold bg-[#ffded7]/30 px-2 py-0.5 rounded">Phát triển bởi: Chăm Rốch Thi</span>
      </div>
      <div className="flex gap-4 md:gap-6">
        <a href="#" className="hover:text-saffron-400 transition-colors">Facebook</a>
        <a href="#" className="hover:text-saffron-400 transition-colors">Instagram</a>
        <a href="#" className="hover:text-saffron-400 transition-colors">Threads</a>
        <Link to="/admin" className="hover:text-saffron-400 transition-colors block md:hidden">Quản Trị</Link>
      </div>
    </footer>
  );
}
