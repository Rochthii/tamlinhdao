import { motion } from 'motion/react';
import { Compass, Flower2, Flame, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const iconsMapping: Record<string, any> = {
  Compass, Flower2, Flame, Sparkles
};

export default function ServicesSummary() {
  const { services } = useAppContext();

  return (
    <section id="services" className="py-24 px-4 sm:px-6 lg:px-8 relative z-10 bg-dao-800/40 border-y border-saffron-400/5">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 relative"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-saffron-400/10 rounded-full blur-[60px] pointer-events-none"></div>
          <div>
            <h3 className="text-saffron-400/60 text-[10px] uppercase tracking-[0.3em] mb-4">Chữa Lành & Dẫn Dắt</h3>
            <h2 className="text-3xl md:text-5xl font-serif text-white font-light">Hỗ Trợ Tâm Linh</h2>
          </div>
          <Link to="/ho-tro" className="text-xs uppercase tracking-widest text-saffron-400 hover:text-saffron-200 transition-colors flex items-center gap-2 group shrink-0 relative z-10">
            Xem chi tiết <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {services.slice(0, 3).map((service, index) => {
            const Icon = iconsMapping[service.iconName] || Sparkles;
            return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="dao-panel p-8 rounded-2xl relative overflow-hidden group flex flex-col h-full"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 ${service.bgDecor} blur-[40px] rounded-full group-hover:bg-opacity-50 transition-colors`}></div>
              
              <div className={`w-14 h-14 rounded-full border ${service.borderColor} bg-dao-900 flex items-center justify-center mb-8 shrink-0 relative z-10 ${service.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              
              <h3 className="text-2xl font-serif text-white mb-4 relative z-10">{service.title}</h3>
              
              <p className="text-white/60 text-sm font-light leading-relaxed mb-10 flex-1 relative z-10">
                {service.description}
              </p>
              
              <div className="relative z-10 mt-auto">
                <Link to="/ho-tro" className={`w-full py-4 border border-white/5 bg-dao-900/50 text-white hover:border-white/20 rounded-lg text-xs uppercase tracking-widest font-bold transition-all flex justify-center items-center gap-2 group/btn`}>
                  Tìm hiểu thêm <ArrowRight className={`w-4 h-4 ${service.color} group-hover/btn:translate-x-1 transition-transform`} />
                </Link>
              </div>
            </motion.div>
          )})}
        </div>
      </div>
    </section>
  );
}
