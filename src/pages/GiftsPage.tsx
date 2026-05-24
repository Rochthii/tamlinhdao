import { motion } from 'motion/react';
import { Gift, HeartHandshake, Sparkles, Star, Moon, Compass, Leaf, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const iconsMapping: Record<string, any> = {
  Compass, Moon, BookOpen, Sparkles, Leaf, Star
};

export default function GiftsPage() {
  const { gifts } = useAppContext();
  
  const newcomersGifts = gifts.filter(g => g.type === 'newcomer');
  const loyalGifts = gifts.filter(g => g.type === 'loyal');

  return (
    <div className="py-24 px-4 sm:px-6 lg:px-8 relative z-10 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 relative"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-saffron-400/10 rounded-full blur-[60px] pointer-events-none"></div>
          <h1 className="text-4xl md:text-6xl font-serif text-white font-light tracking-wide mb-6">GIEO DUYÊN</h1>
          <p className="text-white/60 max-w-2xl mx-auto font-light text-sm leading-relaxed">
            Vạn sự vô tình gặp gỡ đều là duyên. Những phần quà tâm linh là tấm lòng của Đạo gửi gắm sự an lành, may mắn đến với người hữu duyên trên con đường tìm kiếm sự tĩnh lặng nội tại.
          </p>
        </motion.div>

        {/* Newcomers Section */}
        <div className="mb-24">
           <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-4 mb-10"
           >
             <div className="w-12 h-12 rounded-full bg-jade-400/10 flex items-center justify-center border border-jade-400/20">
               <Gift className="w-5 h-5 text-jade-400" />
             </div>
             <h2 className="text-2xl font-serif text-white">Gieo Duyên Người Mới</h2>
           </motion.div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {newcomersGifts.map((gift, i) => {
                const Icon = iconsMapping[gift.iconName] || Gift;
                return (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="dao-panel p-8 rounded-lg text-center flex flex-col items-center group hover:border-jade-400/30 transition-all"
                >
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${gift.bg}`}>
                    <Icon className={`w-7 h-7 ${gift.color}`} strokeWidth={1} />
                  </div>
                  <h3 className="text-lg font-serif text-white mb-3">{gift.title}</h3>
                  <p className="text-sm text-white/50 font-light flex-1">{gift.desc}</p>
                   <Link
                     to="/#contact"
                     className={`mt-6 inline-flex items-center justify-center px-6 py-2 border border-white/10 rounded-full text-[10px] uppercase tracking-widest ${gift.color} hover:bg-white/5 transition-colors`}
                   >
                     Nhận Quà
                   </Link>
                </motion.div>
              )})}
           </div>
        </div>

        {/* Loyal Section */}
        <div className="relative">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-full bg-saffron-400/5 blur-[100px] pointer-events-none rounded-full"></div>
           <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-4 mb-10 relative z-10"
           >
             <div className="w-12 h-12 rounded-full bg-saffron-400/10 flex items-center justify-center border border-saffron-400/20">
               <HeartHandshake className="w-5 h-5 text-saffron-400" />
             </div>
             <h2 className="text-2xl font-serif text-white">Tri Ân Người Hữu Duyên</h2>
           </motion.div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
              {loyalGifts.map((gift, i) => {
                const Icon = iconsMapping[gift.iconName] || Star;
                return (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="dao-panel p-8 rounded-lg group hover:border-saffron-400/40 relative overflow-hidden"
                >
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-saffron-400/10 rounded-full blur-[20px] group-hover:bg-saffron-400/20 transition-all"></div>
                  <Icon className={`w-8 h-8 ${gift.color} mb-6`} strokeWidth={1} />
                  <h3 className="text-lg font-serif text-white mb-3">{gift.title}</h3>
                  <p className="text-sm text-white/50 font-light">{gift.desc}</p>
                </motion.div>
              )})}
           </div>
           
           <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mt-12 text-center"
           >
              <p className="text-white/40 text-xs uppercase tracking-widest mb-6">Xin liên hệ để thỉnh quà tri ân</p>
              <Link to="/#contact" className="inline-flex py-3 px-8 bg-saffron-400 text-dao-900 rounded-sm text-xs uppercase tracking-widest font-bold hover:bg-saffron-500 transition-all shadow-[0_0_20px_rgba(214,176,82,0.15)]">
                Nhắn Tin Trợ Tín
              </Link>
           </motion.div>
        </div>

      </div>
    </div>
  );
}
