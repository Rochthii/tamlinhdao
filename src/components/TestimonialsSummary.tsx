import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function TestimonialsSummary() {
  const { testimonials } = useAppContext();
  const displayedTestimonials = testimonials.slice(0, 3);
  return (
    <section id="testimonials" className="py-24 px-4 sm:px-6 lg:px-8 relative z-10 bg-dao-800/20">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 relative"
        >
          <div>
            <h3 className="text-saffron-400/60 text-[10px] uppercase tracking-[0.3em] mb-4">Đồng Bào Hữu Duyên</h3>
            <h2 className="text-3xl md:text-5xl font-serif text-white font-light">Phản Hồi Trải Nghiệm</h2>
          </div>
          <Link to="/phan-hoi" className="text-xs uppercase tracking-widest text-saffron-400 hover:text-saffron-200 transition-colors flex items-center gap-2 group shrink-0 relative z-10">
            Xem tất cả <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayedTestimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="dao-panel p-8 rounded-sm relative flex flex-col justify-between"
            >
              <div>
                <p className="text-[13px] italic text-white/70 mb-8 leading-relaxed font-serif">
                  {testimonial.content}
                </p>
              </div>
              <div className="flex flex-col mt-auto pt-4 border-t border-saffron-400/10">
                <span className="text-[11px] font-bold text-saffron-400 uppercase tracking-widest block mb-1">{testimonial.name}</span>
                <span className="text-[9px] text-white/40 uppercase tracking-widest">{testimonial.service}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
