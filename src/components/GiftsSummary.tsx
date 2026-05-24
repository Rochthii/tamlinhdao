import { motion } from 'motion/react';
import { Gift, HeartHandshake, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function GiftsSummary() {
  return (
    <section id="gifts" className="py-24 px-4 sm:px-6 lg:px-8 relative z-10 bg-dao-800/50 border-y border-saffron-400/5">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 relative"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-saffron-400/10 rounded-full blur-[60px] pointer-events-none"></div>
          <div>
            <h3 className="text-saffron-400/60 text-[10px] uppercase tracking-[0.3em] mb-4">Tri Ân & Kết Nối</h3>
            <h2 className="text-3xl md:text-5xl font-serif text-white font-light">Gieo Duyên Quà Tặng</h2>
          </div>
          <Link to="/gieo-duyen" className="text-xs uppercase tracking-widest text-saffron-400 hover:text-saffron-200 transition-colors flex items-center gap-2 group shrink-0 relative z-10">
            Xem phần quà <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
          
          {/* Subtle connecting line */}
          <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-[80%] bg-gradient-to-b from-transparent via-saffron-400/20 to-transparent"></div>

          {/* Loyal Clients */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="dao-panel p-8 md:p-12 rounded-2xl relative overflow-hidden group flex flex-col h-full"
          >
             <div className="absolute top-0 right-0 w-32 h-32 bg-saffron-400/10 blur-[40px] rounded-full group-hover:bg-saffron-400/20 transition-colors"></div>
             
             <div className="w-14 h-14 rounded-full border border-saffron-400/30 bg-dao-900 flex items-center justify-center mb-8 shrink-0 relative z-10 text-saffron-400">
               <HeartHandshake className="w-6 h-6" />
             </div>
             <h3 className="text-2xl font-serif text-white mb-4 relative z-10">Khách Hàng Thân Thuộc</h3>
             
             <p className="text-white/60 text-sm font-light leading-relaxed mb-10 flex-1 relative z-10">
               Dành riêng cho những quý khách đã đồng hành. Tri ân bằng những tặng phẩm đặc biệt: vòng trầm hương tự nhiên, đá năng lượng thanh tẩy, hoặc lá bùa bình an.
             </p>
             
             <div className="relative z-10 mt-auto">
               <Link to="/gieo-duyen" className="w-full py-4 border border-saffron-400 text-saffron-400 rounded-lg text-xs uppercase tracking-widest font-bold hover:bg-saffron-400 hover:text-dao-900 transition-all flex justify-center items-center gap-2">
                 Thỉnh Lễ Tri Ân
               </Link>
             </div>
          </motion.div>

          {/* Newcomers */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="dao-panel p-8 md:p-12 rounded-2xl relative overflow-hidden group flex flex-col h-full"
          >
             <div className="absolute top-0 left-0 w-32 h-32 bg-jade-400/10 blur-[40px] rounded-full group-hover:bg-jade-400/20 transition-colors"></div>
             
             <div className="w-14 h-14 rounded-full border border-jade-400/30 bg-dao-900 flex items-center justify-center mb-8 shrink-0 relative z-10 text-jade-400">
               <Gift className="w-6 h-6" />
             </div>
             <h3 className="text-2xl font-serif text-white mb-4 relative z-10">Gieo Duyên Người Mới</h3>
             
             <p className="text-white/60 text-sm font-light leading-relaxed mb-10 flex-1 relative z-10">
               Chào mừng bạn đến với không gian của Đạo. Dành tặng những phần quà gieo duyên: Một quẻ dịch đầu tuần miễn phí mở lối trí tuệ, hay thông điệp vũ trụ.
             </p>
             
             <div className="relative z-10 mt-auto">
               <Link to="/gieo-duyen" className="w-full py-4 bg-saffron-400 text-dao-900 rounded-lg text-xs uppercase tracking-widest font-bold hover:bg-saffron-500 transition-all flex justify-center items-center gap-2 shadow-[0_0_20px_rgba(214,176,82,0.15)]">
                 <Sparkles className="w-4 h-4" /> Mở Quà Gieo Duyên
               </Link>
             </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
