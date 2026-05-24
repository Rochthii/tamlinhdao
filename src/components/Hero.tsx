import { motion } from 'motion/react';
import { Flower2, Sun } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center py-16 px-6 md:px-10 z-10 overflow-hidden">
      
      {/* Abstract oriental graphic behind text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-saffron-400/5 blur-[1px] opacity-40 flex items-center justify-center animate-[spin_120s_linear_infinite]">
        <div className="w-[70%] h-[70%] rounded-full border border-rust-900/30 border-dashed animate-[spin_80s_linear_infinite_reverse]"></div>
        <div className="absolute w-[40%] h-[40%] rounded-full border border-moss-900/20"></div>
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="flex justify-center mb-6"
        >
          <div className="p-4 rounded-full dao-panel inline-flex items-center justify-center backdrop-blur-md">
            <Sun className="w-8 h-8 opacity-80" stroke="url(#gilded-gradient)" strokeWidth={1} />
          </div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1, ease: 'easeOut' }}
          className="text-gilded text-xs sm:text-sm uppercase tracking-[0.4em] mb-4 opacity-90 font-medium"
        >
          Đạo Pháp Tự Nhiên
        </motion.h2>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
          className="text-5xl md:text-6xl lg:text-8xl font-serif leading-tight mb-8 text-gilded font-light tracking-wide"
        >
          ĐẠO
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
          className="text-white/60 md:text-lg mb-10 max-w-2xl mx-auto font-light leading-relaxed"
        >
          Hướng tới sự bình an trong tâm hồn. Cung cấp góc nhìn minh triết từ nền tảng triết lý Phương Đông, Phật Giáo và Đạo Giáo giúp bạn thấu hiểu nhân quả và vận mệnh.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: 'easeOut' }}
          className="flex flex-col sm:flex-row gap-5 justify-center items-center"
        >
          <a href="#services" className="inline-flex items-center justify-center px-10 py-3 bg-gilded text-dao-900 rounded-md text-xs uppercase tracking-widest font-bold hover:brightness-110 transition-all shadow-[0_0_20px_rgba(214,175,74,0.3)] gap-2">
            <Flower2 className="w-4 h-4" />
            Khám Phá Tâm Linh
          </a>
          <a href="#contact" className="inline-flex items-center justify-center px-10 py-3 border border-saffron-400/40 text-gilded rounded-md text-xs uppercase tracking-widest font-medium hover:bg-white/5 transition-all">
            Gieo Duyên Tương Ngộ
          </a>
        </motion.div>
      </div>

    </section>
  );
}
