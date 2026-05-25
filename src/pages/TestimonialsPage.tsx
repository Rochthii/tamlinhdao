import React from 'react';
import { motion } from 'motion/react';
import { MessageSquare, Star } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import useSEO from '../hooks/useSEO';

export default function TestimonialsPage() {
  const { testimonials } = useAppContext();
  
  useSEO({
    title: 'Phản Hồi & Cảm Nhận Từ Bạn Hữu | ĐẠO',
    description: 'Những chia sẻ chân thành, khách quan từ các đạo hữu hữu duyên đã trải nghiệm dịch vụ Luận Bát Tự, Xem Tarot và Tham vấn tâm lý chữa lành tại ĐẠO Quán.',
    canonical: 'https://dao-spiritual.com/phan-hoi'
  });
  
  return (
    <div className="py-24 px-4 sm:px-6 lg:px-8 relative z-10 min-h-screen bg-dao-900">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-saffron-400/30 bg-dao-800 text-saffron-400 text-[10px] uppercase tracking-[0.3em] mb-8">
            <MessageSquare className="w-3 h-3" />
            <span>Sự Đồng Hành</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif text-white font-light tracking-wide mb-8">
            PHẢN HỒI
          </h1>
          <div className="w-px h-16 bg-gradient-to-b from-saffron-400/80 to-transparent mx-auto mb-8"></div>
          <p className="text-white/60 max-w-2xl mx-auto font-light text-base md:text-lg leading-relaxed">
            Những chia sẻ chân thành từ quý khách khi chọn Đạo làm nơi dừng chân, tháo gỡ khúc mắc và tìm lại sự cân bằng trong cuộc sống.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="dao-panel p-8 rounded-sm relative flex flex-col justify-between group overflow-hidden"
            >
               <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                 <Star className="w-24 h-24 text-saffron-400" />
               </div>
              <div className="relative z-10">
                <p className="text-sm italic text-white/70 mb-8 leading-relaxed font-serif relative">
                  <span className="text-4xl text-saffron-400/20 absolute -top-4 -left-2">"</span>
                  {testimonial.content}
                </p>
              </div>
              <div className="flex flex-col mt-auto pt-4 border-t border-saffron-400/10 relative z-10">
                <span className="text-xs font-bold text-saffron-400 uppercase tracking-widest block mb-1">{testimonial.name}</span>
                <span className="text-[10px] text-white/40 uppercase tracking-widest">{testimonial.service}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
