import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Check, ArrowRight, Compass, Flower2, Flame, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import useSEO from '../hooks/useSEO';

// Structure for the 21 detailed pricing items
interface PricingItem {
  no: string;
  name: string;
  quantity: string;
  price: string;
  gift?: string;
  isCustomPrice?: boolean;
  free?: boolean;
}

const pricingData: Record<string, PricingItem[]> = {
  'luan-van-menh': [
    { no: '01', name: 'Tử Vi', quantity: 'Trọn bộ', price: '350,000đ', gift: 'Tặng combo xem chỉ tay & giải pháp cải vận' },
    { no: '01', name: 'Tử Vi', quantity: '1 vấn đề', price: '60,000đ', gift: 'Tặng giải pháp cải vận theo từng vấn đề' },
    { no: '02', name: 'Bát Tự', quantity: 'Trọn bộ', price: '300,000đ', gift: 'Tặng combo xem chỉ tay & giải pháp cải vận' },
    { no: '02', name: 'Bát Tự', quantity: '1 vấn đề', price: '55,000đ', gift: 'Tặng giải pháp cải vận theo từng vấn đề' },
    { no: '03', name: 'Bản Đồ Sao', quantity: 'Trọn bộ', price: '250,000đ', gift: 'Tặng combo xem chỉ tay & giải pháp cải vận' },
    { no: '03', name: 'Bản Đồ Sao', quantity: '1 vấn đề', price: '50,000đ', gift: 'Tặng giải pháp cải vận theo từng vấn đề' }
  ],
  'tham-van-tam-linh': [
    { no: '04', name: 'Tarot', quantity: 'Câu lẻ', price: '25,000đ', gift: 'Combo 3 câu 50,000đ' },
    { no: '05', name: 'Oracle', quantity: 'Câu lẻ', price: '25,000đ', gift: 'Combo 3 câu 50,000đ' },
    { no: '06', name: 'Scrying', quantity: 'Câu lẻ', price: '25,000đ', gift: 'Combo 3 câu 50,000đ' },
    { no: '07', name: 'Xem Tướng + Cảm Nhận Năng Lượng Qua Ảnh', quantity: 'Câu lẻ', price: '30,000đ', gift: 'Hóa đơn trên 150,000đ tặng Combo Xem' },
    { no: '08', name: 'Cảm Xạ', quantity: 'Câu lẻ', price: '25,000đ', gift: 'Hóa đơn trên 150,000đ tặng Combo Xem' },
    { no: '09', name: 'Kinh Dịch', quantity: 'Câu lẻ', price: '30,000đ', gift: 'Hóa đơn trên 150,000đ tặng Combo Xem' },
    { no: '10', name: 'Bài Tây', quantity: 'Câu lẻ', price: '30,000đ', gift: 'Hóa đơn trên 150,000đ tặng Combo Xem' },
    { no: '11', name: 'Bát Môn Độn Pháp', quantity: 'Câu lẻ', price: '30,000đ', gift: 'Hóa đơn trên 150,000đ tặng Combo Xem' },
    { no: '12', name: 'Soi Âm', quantity: 'Mỗi lần soi', price: 'Tùy Tâm', isCustomPrice: true, gift: 'Hỗ trợ tài trợ nếu hoàn cảnh khó khăn' },
    { no: '13', name: 'Soi Căn', quantity: 'Mỗi lần soi', price: 'Tùy Tâm', isCustomPrice: true, gift: 'Hỗ trợ tài trợ nếu hoàn cảnh khó khăn' },
    { no: '14', name: 'Tham Vấn Tâm Linh', quantity: 'Mỗi lần soi', price: 'Tùy Tâm', isCustomPrice: true, gift: 'Hỗ trợ tài trợ nếu hoàn cảnh khó khăn' }
  ],
  'nghi-le': [
    { no: '15', name: 'Cầu An, Cầu Siêu', quantity: 'Online & Trực tiếp', price: 'Tùy Tâm', isCustomPrice: true, gift: 'Hỗ trợ tài trợ nếu hoàn cảnh khó khăn' },
    { no: '16', name: 'Phong Thủy', quantity: 'Online & Trực tiếp', price: 'Tùy Tâm', isCustomPrice: true, gift: 'Hỗ trợ tài trợ nếu hoàn cảnh khó khăn' },
    { no: '17', name: 'Giải Bùa', quantity: 'Online & Trực tiếp', price: 'Tùy Tâm', isCustomPrice: true, gift: 'Hỗ trợ tài trợ nếu hoàn cảnh khó khăn' },
    { no: '18', name: 'Giải Quyết Các Vấn Đề Liên Quan Phần Âm', quantity: 'Online & Trực tiếp', price: 'Tùy Tâm', isCustomPrice: true, gift: 'Hỗ trợ tài trợ nếu hoàn cảnh khó khăn' },
    { no: '19', name: 'Cầu Tài Vận, Công Danh, Vận Hạn,...', quantity: 'Online & Trực tiếp', price: 'Tùy Tâm', isCustomPrice: true, gift: 'Hỗ trợ tài trợ nếu hoàn cảnh khó khăn' },
    { no: '20', name: 'Hướng Dẫn Quy Y, Tu Tập Phật Giáo,...', quantity: 'Online & Trực tiếp', price: 'Gieo Duyên', free: true, gift: 'Không nhận phí tu tập' },
    { no: '21', name: 'Các Nghi Lễ Khác', quantity: 'Online & Trực tiếp', price: 'Tùy Tâm', isCustomPrice: true, gift: 'Hỗ trợ tài trợ nếu hoàn cảnh khó khăn' }
  ]
};

const getPricingKey = (service: any): string => {
  if (!service) return '';
  const idStr = String(service.id || '');
  if (idStr === 'luan-van-menh' || idStr === 'tham-van-tam-linh' || idStr === 'nghi-le') {
    return idStr;
  }
  const titleStr = String(service.title || '').toLowerCase();
  if (titleStr.includes('luận') || titleStr.includes('mệnh')) {
    return 'luan-van-menh';
  }
  if (titleStr.includes('tham vấn') || titleStr.includes('tâm linh')) {
    return 'tham-van-tam-linh';
  }
  if (titleStr.includes('nghi lễ') || titleStr.includes('cầu an') || titleStr.includes('lễ')) {
    return 'nghi-le';
  }
  return '';
};

export default function ServicesPage() {
  const { services } = useAppContext();
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

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
          className="text-center mb-20 flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-saffron-400/30 bg-dao-800 text-saffron-400 text-[10px] uppercase tracking-[0.3em] mb-8 shadow-[0_0_15px_rgba(214,176,82,0.1)] animate-pulse">
            <Sparkles className="w-3 h-3" />
            <span>Phụng Sự Chuyên Sâu</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif text-white font-light tracking-wide mb-6">
            HỖ TRỢ
          </h1>
          <div className="w-px h-12 bg-gradient-to-b from-saffron-400/80 to-transparent mb-6"></div>
          
          <p className="text-white/60 max-w-3xl mx-auto font-light text-base md:text-lg leading-relaxed mb-10">
            Nơi hội tụ triết lý Cổ học Phương Đông và Phật giáo, mở ra cánh cửa thấu suốt bản thân, giải trừ phiền não và tái tạo trường năng lượng tích cực cho cuộc sống.
          </p>

          {/* Button to view Calligraphy sheet */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsLightboxOpen(true)}
            className="inline-flex items-center gap-3.5 px-7 py-3.5 rounded-sm border border-saffron-400/30 bg-gradient-to-r from-dao-800 to-dao-900 text-saffron-400 hover:text-saffron-300 text-xs font-bold uppercase tracking-widest transition-all cursor-pointer shadow-[0_4px_20px_rgba(214,176,82,0.15)] relative overflow-hidden group"
          >
            <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000"></div>
            <span className="relative">Xem Bản Thư Họa Nguyên Bản</span>
            <span className="text-saffron-400 relative group-hover:rotate-12 transition-transform">✦</span>
          </motion.button>
        </motion.div>

        {/* Services List - Custom Wrapper to fit inline pricing */}
        <div className="space-y-32">
          {services.map((service, index) => {
            const isEven = index % 2 === 0;
            const pricingKey = getPricingKey(service);
            const pricingItems = pricingData[pricingKey] || [];

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="flex flex-col gap-14 w-full"
                id={pricingKey || service.id}
              >
                {/* Visual and Content Alternating Block */}
                <div className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 lg:gap-20 items-center w-full`}>
                  {/* Visual Side */}
                  <div className="w-full lg:w-5/12 relative">
                     <div className={`absolute inset-0 translate-x-4 translate-y-4 rounded-sm border ${service.borderColor} transition-transform duration-700`}></div>
                     <div className="relative aspect-square md:aspect-[3/4] bg-dao-800 dao-panel overflow-hidden rounded-sm border border-white/5 flex flex-col items-center justify-center p-8">
                        <div className={`absolute inset-0 ${service.bgDecor} opacity-20 blur-3xl rounded-full scale-150 transform transition-transform duration-1000`}></div>
                        
                        {/* Elegant Typography Visual */}
                        <div className="w-px h-24 bg-gradient-to-b from-transparent to-current opacity-30 mb-8" style={{ color: service.color }}></div>
                        <h3 className={`font-serif text-5xl md:text-6xl ${service.color} tracking-[0.2em] font-light opacity-80 leading-relaxed writing-vertical-rl relative z-10`} style={{ writingMode: 'vertical-rl', textOrientation: 'upright' }}>
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
                         Đặt lịch tư vấn chung <ArrowRight className={`w-4 h-4 ${service.color} group-hover/btn:translate-x-1 transition-transform`} />
                       </Link>
                    </div>
                  </div>
                </div>

                {/* Granular Pricing Table Sub-block */}
                {pricingItems.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="w-full border-2 border-saffron-400/30 outline outline-1 outline-saffron-400/15 -outline-offset-6 bg-dao-800/90 rounded-sm p-5 md:p-8 relative overflow-hidden transition-all duration-500 shadow-[0_6px_30px_rgba(39,20,14,0.06)]"
                  >
                    {/* Glowing circular ambience matched with group color */}
                    <div className={`absolute -right-32 -bottom-32 w-64 h-64 rounded-full blur-[100px] opacity-10 ${service.bgDecor}`}></div>
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 pb-4 border-b border-saffron-400/20 gap-4">
                      <h4 className="text-sm font-serif uppercase tracking-[0.25em] text-saffron-400 flex items-center gap-2 font-bold">
                        <span>✦</span> Chi tiết Mệnh Giá Gieo Duyên
                      </h4>
                      <span className="text-[10px] text-white/70 uppercase tracking-widest font-mono font-bold">
                        {pricingItems.length} HẠNG MỤC PHỤNG SỰ
                      </span>
                    </div>

                    <div className="overflow-x-auto select-none">
                      <table className="w-full text-left border-collapse text-xs md:text-sm">
                        <thead>
                          <tr className="border-b-2 border-saffron-400/20 text-[10px] uppercase tracking-widest text-white/80 font-bold bg-saffron-400/[0.03]">
                            <th className="py-4 px-3 w-16">Mã</th>
                            <th className="py-4 px-4">Bộ Môn Dịch Vụ</th>
                            <th className="py-4 px-4">Hình Thức / Số Lượng</th>
                            <th className="py-4 px-4 text-right w-40">Mệnh Giá</th>
                            <th className="py-4 px-6 hidden md:table-cell max-w-xs">Ghi Chú & Quà Tặng</th>
                            <th className="py-4 px-4 text-center w-28">Đặt Lịch</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-saffron-400/10">
                          {pricingItems.map((item, idx) => (
                            <tr key={idx} className="hover:bg-saffron-400/[0.03] transition-colors group/row">
                              <td className="py-4.5 px-3 font-mono text-[11px] text-white/60 font-bold transition-colors">
                                {item.no}
                              </td>
                              <td className="py-4.5 px-4 font-serif font-bold text-white group-hover/row:text-saffron-400 transition-colors">
                                {item.name}
                              </td>
                              <td className="py-4.5 px-4 text-white/90 font-medium transition-colors">
                                {item.quantity}
                              </td>
                              <td className="py-4.5 px-4 text-right">
                                <span className={`px-3 py-1 rounded-sm text-[11px] font-mono border font-bold shadow-xs ${
                                  item.free 
                                    ? 'bg-emerald-600/10 border-emerald-600/30 text-emerald-800' 
                                    : item.isCustomPrice 
                                      ? 'bg-saffron-400/10 border-saffron-400/30 text-saffron-400' 
                                      : 'bg-saffron-400/5 border-saffron-400/25 text-saffron-400'
                                }`}>
                                  {item.price}
                                </span>
                              </td>
                              <td className="py-4.5 px-6 text-xs text-white/70 font-medium leading-relaxed hidden md:table-cell max-w-xs transition-colors">
                                {item.gift || '-'}
                              </td>
                              <td className="py-4.5 px-4 text-center">
                                <Link 
                                  to={`/?booking=${encodeURIComponent(`${item.no}. ${item.name} (${item.quantity})`)}#contact`}
                                  className="inline-flex items-center justify-center px-4 py-1.5 rounded-sm bg-saffron-400 hover:bg-saffron-500 text-dao-800 hover:text-white text-[10px] uppercase tracking-widest font-bold transition-all shadow-md active:scale-95 cursor-pointer"
                                >
                                  Gieo Duyên
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Special footnotes / incentives aligned beautifully at bottom of table */}
                    <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-saffron-400/15 pt-4 text-[10px] text-white/80 leading-relaxed">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 font-semibold">
                        {service.id === 'luan-van-menh' && (
                          <p>
                            <span className="text-saffron-400 font-bold">✦ Quà tặng:</span> Các dịch vụ trọn bộ tặng kèm combo xem chỉ tay & giải pháp cải vận.
                          </p>
                        )}
                        {service.id === 'tham-van-tam-linh' && (
                          <p>
                            <span className="text-saffron-400 font-bold">✦ Ưu đãi:</span> Combo 3 câu giá 50.000đ. Hóa đơn trên 150.000đ tặng Combo Xem.
                          </p>
                        )}
                        {service.id === 'nghi-le' && (
                          <p>
                            <span className="text-saffron-400 font-bold">✦ Hỗ trợ:</span> Nếu hoàn cảnh khó khăn, chúng tôi sẵn lòng tài trợ miễn phí toàn bộ khóa lễ.
                          </p>
                        )}
                      </div>
                      <p className="italic text-white/60 text-right font-medium">Tịnh tâm cầu đạo • Nhân quả tuần hoàn</p>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
        
      </div>

      {/* Traditional Calligraphy Sheet Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-16 bottom-0 left-0 right-0 z-50 flex flex-col items-center justify-center p-4 bg-black/90 backdrop-blur-md"
            onClick={() => setIsLightboxOpen(false)}
          >
            {/* Lightbox Scroll Frame Container */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="relative max-w-3xl w-full flex flex-col items-center gap-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header Floating Above Image (using explicit gold and cream hexes with integrated close button) */}
              <div className="w-full flex items-center justify-between px-2 mb-1 select-none">
                <div>
                  <span className="text-xs md:text-sm font-serif text-[#e9a341] uppercase tracking-[0.3em] font-bold block mb-0.5">
                    Bản Thư Họa Mệnh Giá Đạo Quán
                  </span>
                  <span className="text-[9px] font-mono text-[#fbf4e3]/60 uppercase tracking-widest block">
                    Nguyên Bản ✦ Cát Lập
                  </span>
                </div>

                {/* Integrated Close Button */}
                <button
                  onClick={() => setIsLightboxOpen(false)}
                  className="p-1.5 rounded-full bg-white/[0.04] hover:bg-[#c92a23] border border-[#fbf4e3]/20 transition-all cursor-pointer shadow-md group"
                  aria-label="Close Lightbox"
                >
                  <X className="w-4.5 h-4.5 text-[#fbf4e3] group-hover:text-[#ffffff] group-hover:rotate-90 transition-transform duration-300" />
                </button>
              </div>

              {/* Framed mounted calligraphy parchment image */}
              <div className="relative p-2.5 bg-[#fbf4e3] rounded-xs border-2 border-saffron-400/60 shadow-[0_0_55px_rgba(201,42,35,0.25)] max-h-[75vh] flex justify-center overflow-hidden">
                {/* Thin inner red border */}
                <div className="absolute inset-2 pointer-events-none border border-saffron-400/20 rounded-xs"></div>
                <img 
                  src="/bang-gia-chung.jpg" 
                  alt="Bảng Giá Chung Đạo Quán" 
                  className="max-h-[70vh] w-auto object-contain rounded-xs shadow-md"
                />
              </div>

              {/* Footer Floating Below Image (using explicit gold-yellow hex) */}
              <div className="text-center mt-2 select-none">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#eabb48] font-semibold">
                  Gieo Duyên Lành • Tạo Phúc Đức • Thuận Theo Bản Mệnh
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
