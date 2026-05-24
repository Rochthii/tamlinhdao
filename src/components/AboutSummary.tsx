import { motion } from 'motion/react';
import { Leaf, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AboutSummary() {
  return (
    <section id="about" className="py-24 px-4 sm:px-6 lg:px-8 relative z-10 bg-dao-800/30 border-y border-saffron-400/5">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12">
        
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex-1"
        >
          <div className="relative p-2">
            <div className="absolute inset-0 border border-saffron-400/20 translate-x-4 translate-y-4 rounded-sm"></div>
            <div className="relative aspect-[3/4] bg-dao-800 border border-saffron-400/10 p-6 rounded-sm flex flex-col items-center justify-center overflow-hidden dao-panel">
              <Leaf className="w-16 h-16 text-moss-900 mb-6 opacity-80" strokeWidth={1} />
              <div className="w-1 h-32 bg-gradient-to-b from-saffron-400/0 via-saffron-400/40 to-saffron-400/0"></div>
              <h3 className="font-serif text-3xl writing-vertical-rl text-saffron-400 mt-6 tracking-widest leading-loose">
                Thuận Tự Nhiên
              </h3>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex-[1.5]"
        >
          <div className="flex flex-wrap items-end justify-between mb-8 gap-4">
            <div>
              <h3 className="text-saffron-400/60 text-[10px] uppercase tracking-[0.3em] mb-4">Cách Tiếp Cận</h3>
              <h2 className="text-3xl md:text-5xl font-serif text-white font-light">Giới Thiệu</h2>
            </div>
            <Link to="/gioi-thieu" className="text-xs uppercase tracking-widest text-saffron-400 hover:text-saffron-200 transition-colors flex items-center gap-2 group shrink-0 relative z-10">
              Xem chi tiết <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="space-y-6 text-white/60 font-light leading-relaxed text-sm">
            <p>
              "Đạo" không chỉ là tên gọi, mà còn là kim chỉ nam cho mọi hoạt động tư vấn và định hướng. Chúng tôi tin rằng vạn vật trong vũ trụ đều xoay vần theo chu kỳ và quy luật tự nhiên.
            </p>
            <p>
              Giao thoa giữa <strong>Phật Giáo</strong>, nhấn mạnh luật nhân quả và sự tự tại, cùng <strong>Đạo Giáo</strong> với triết lý cân bằng Âm - Dương, chúng tôi mong muốn mang đến những luận giải sâu sắc không dựa trên sự mê tín, mà dựa trên sự thấu hiểu bản thể.
            </p>
            <p>
              Tại đây, bạn sẽ tìm thấy một bến đỗ an lành để giải tỏa những uẩn khúc trong lòng, tìm lại sự thuần khiết nguyên sơ và lấy lại sự tự tin trên con đường phía trước.
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
