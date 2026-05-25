import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Check, ArrowRight, Compass, Flower2, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import useSEO from '../hooks/useSEO';

const iconsMapping: Record<string, any> = {
  Compass, Flower2, Flame, Sparkles
};

export default function ServicesPage() {
  const { services } = useAppContext();

  useSEO({
    title: 'Hỗ Trợ & Dịch Vụ Tham Vấn Tâm Linh, Luận Mệnh',
    description: 'Nơi hội tụ triết lý Cổ học Phương Đông và Phật giáo, mở ra các giải pháp chuyên sâu: Luận Bát Tự vận mệnh, Tham Vấn Chữa Lành Tâm Linh, Hỗ Trợ Thiết Lập Nghi Lễ cầu an gia đạo.',
    canonical: 'https://dao-spiritual.com/ho-tro',
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Service",
      "serviceType": "Tham Vấn Tâm Linh & Luận Mệnh Cổ Học",
      "provider": {
        "@type": "LocalBusiness",
        "name": "ĐẠO Quán",
        "image": "https://dao-spiritual.com/logo-og.jpg",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Hà Nội",
          "addressCountry": "VN"
        }
      },
      "areaServed": "VN",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Danh mục hỗ trợ",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Luận Vận Mệnh (Bát Tự / Kinh Dịch)",
              "description": "Giải mã phước nghiệp và định hướng cát hung."
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Tham Vấn Tâm Linh (Chữa Lành & Chuyển Hóa)",
              "description": "Tháo gỡ bế tắc nội tâm dựa trên Luật Nhân Quả và Vô Vi."
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Hỗ trợ Nghi Lễ (Cầu An & Gieo Phước)",
              "description": "Thiết lập bàn thờ gia tiên, nghi thức cầu an thanh tịnh."
            }
          }
        ]
      }
    }
  });

  return (
    <div className="py-24 px-4 sm:px-6 lg:px-8 relative z-10 min-h-screen bg-dao-900">
      {/* Background Ambience */}
      <div className="fixed top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(214,176,82,0.03)_0%,transparent_70%)] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header Title Set */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-saffron-400/30 bg-dao-800 text-saffron-400 text-[10px] uppercase tracking-[0.3em] mb-8 shadow-[0_0_15px_rgba(214,176,82,0.1)]">
            <Sparkles className="w-3 h-3" />
            <span>Phụng Sự Chuyên Sâu</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif text-white font-light tracking-wide mb-8">
            HỖ TRỢ
          </h1>
          <div className="w-px h-16 bg-gradient-to-b from-saffron-400/80 to-transparent mx-auto mb-8"></div>
          <p className="text-white/60 max-w-3xl mx-auto font-light text-base md:text-lg leading-relaxed">
            Nơi hội tụ triết lý Cổ học Phương Đông và Phật giáo, mở ra cánh cửa thấu suốt bản thân, giải trừ phiền não và tái tạo trường năng lượng tích cực cho cuộc sống.
          </p>
        </motion.div>

        {/* Services List - Alternating Layout */}
        <div className="space-y-32">
          {services.map((service, index) => {
            const isEven = index % 2 === 0;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 lg:gap-20 items-center group`}
              >
                {/* Visual Side */}
                <div className="w-full lg:w-5/12 relative">
                   <div className={`absolute inset-0 translate-x-4 translate-y-4 rounded-sm border ${service.borderColor} transition-transform duration-700 group-hover:translate-x-6 group-hover:translate-y-6`}></div>
                   <div className="relative aspect-square md:aspect-[3/4] bg-dao-800 dao-panel overflow-hidden rounded-sm border border-white/5 flex flex-col items-center justify-center p-8">
                      <div className={`absolute inset-0 ${service.bgDecor} opacity-20 blur-3xl rounded-full scale-150 transform transition-transform duration-1000 group-hover:scale-100`}></div>
                      
                      {/* Elegant Typography Visual */}
                      <div className="w-px h-24 bg-gradient-to-b from-transparent to-current opacity-30 mb-8" style={{ color: service.color }}></div>
                      <h3 className={`font-serif text-5xl md:text-6xl ${service.color} tracking-[0.2em] font-light opacity-80 leading-relaxed group-hover:scale-105 transition-transform duration-700 writing-vertical-rl relative z-10`} style={{ writingMode: 'vertical-rl', textOrientation: 'upright' }}>
                        {service.hanzi}
                      </h3>
                      <div className="w-px h-24 bg-gradient-to-t from-transparent to-current opacity-30 mt-8" style={{ color: service.color }}></div>
                   </div>
                </div>

                {/* Content Side */}
                <div className="w-full lg:w-7/12 flex flex-col justify-center">
                  <h4 className={`text-[11px] font-bold ${service.color} uppercase tracking-[0.3em] mb-4`}>
                    {service.subtitle}
                  </h4>
                  <h3 className="text-3xl md:text-4xl font-serif text-white mb-6 leading-tight">
                    {service.title}
                  </h3>
                  <p className="text-white/60 font-light leading-relaxed text-base md:text-lg mb-10 text-justify">
                    {service.description}
                  </p>
                  
                  <div className="space-y-4 mb-12">
                    {service.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-4">
                        <div className={`mt-1 shrink-0 w-5 h-5 rounded-full border ${service.borderColor} flex items-center justify-center`}>
                          <Check className={`w-3 h-3 ${service.color}`} strokeWidth={3} />
                        </div>
                        <span className="text-sm text-white/80">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div>
                     <Link to="/#contact" className="inline-flex items-center gap-3 px-8 py-4 dao-panel border border-white/10 hover:border-saffron-400/50 text-white rounded-sm text-xs uppercase tracking-widest font-bold transition-all group/btn hover:bg-saffron-400/5">
                       Đặt lịch tư vấn <ArrowRight className={`w-4 h-4 ${service.color} group-hover/btn:translate-x-1 transition-transform`} />
                     </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        
      </div>
    </div>
  );
}
