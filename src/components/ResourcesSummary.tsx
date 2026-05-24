import { motion } from 'motion/react';
import { ArrowRight, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function ResourcesSummary() {
  const { articles } = useAppContext();
  const displayedArticles = articles.slice(0, 3);

  return (
    <section id="resources" className="py-24 px-4 sm:px-6 lg:px-8 relative z-10 bg-dao-800/50 border-y border-saffron-400/5">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6"
        >
          <div>
            <h3 className="text-saffron-400/60 text-[10px] uppercase tracking-[0.3em] mb-4">Góc Chia Sẻ</h3>
            <h2 className="text-3xl md:text-5xl font-serif text-white font-light">Tư Liệu</h2>
          </div>
          <Link to="/tu-lieu" className="text-xs uppercase tracking-widest text-saffron-400 hover:text-saffron-200 transition-colors flex items-center gap-2 group">
            Xem tất cả bài viết <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayedArticles.map((article, index) => (
            <Link
              key={article.id || index}
              to={`/tu-lieu?id=${article.id}`}
              className="group block"
            >
              <motion.article
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="dao-panel hover:border-saffron-400/40 transition-all relative overflow-hidden flex flex-col cursor-pointer rounded-lg h-full"
              >
                <div className="h-48 border-b border-saffron-400/10 relative overflow-hidden flex items-center justify-center bg-dao-900/50">
                   <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')]"></div>
                   <BookOpen className="w-12 h-12 text-saffron-400/20 group-hover:text-saffron-400/40 transition-colors transform group-hover:scale-110 duration-500" strokeWidth={1} />
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-[10px] font-bold text-saffron-400 uppercase tracking-widest mb-3">{article.category}</div>
                    <h3 className="text-lg font-serif text-white mb-3 group-hover:text-saffron-200 transition-colors leading-snug font-medium line-clamp-2">{article.title}</h3>
                    <p className="text-white/50 font-light leading-relaxed text-xs mb-6 line-clamp-3">
                      {article.excerpt}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-white/40 uppercase tracking-wider pt-4 border-t border-saffron-400/10">
                    <span>{article.date}</span>
                    <span>{article.readTime}</span>
                  </div>
                </div>
              </motion.article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
