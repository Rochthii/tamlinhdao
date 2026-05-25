import { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, ShieldCheck, HeartHandshake, Eye } from 'lucide-react';

export default function Footer() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <footer className="py-6 md:h-12 md:py-0 bg-dao-900 flex flex-col md:flex-row items-center justify-between px-6 md:px-10 border-t border-saffron-400/10 text-[9px] uppercase tracking-[0.2em] text-white/30 relative z-20 gap-4">
        <div className="mb-2 md:mb-0 text-center md:text-left flex items-center gap-4 flex-wrap justify-center md:justify-start">
          <span>© {new Date().getFullYear()} ĐẠO • Tu Dưỡng Tâm Tính</span>
          <span className="w-px h-3 bg-[#2d241c]/20 hidden md:block"></span>
          <span className="text-saffron-500 font-bold bg-[#ffded7]/30 px-2 py-0.5 rounded">Phát triển bởi: CRT</span>
        </div>
        <div className="flex flex-wrap gap-4 md:gap-6 justify-center">
          <Link to="/admin" className="hover:text-saffron-400 transition-colors">Quản Trị</Link>
          <button 
            onClick={() => setIsOpen(true)}
            className="hover:text-saffron-400 transition-colors cursor-pointer uppercase tracking-[0.2em]"
          >
            Điều Khoản & Bảo Mật
          </button>
          <a href="https://www.facebook.com/profile.php?id=61578175196192&locale=vi_VN" target="_blank" rel="noopener noreferrer" className="hover:text-saffron-400 transition-colors">Facebook</a>
          <a href="https://www.facebook.com/profile.php?id=61578175196192&locale=vi_VN" target="_blank" rel="noopener noreferrer" className="hover:text-saffron-400 transition-colors">Instagram</a>
          <a href="https://www.facebook.com/profile.php?id=61578175196192&locale=vi_VN" target="_blank" rel="noopener noreferrer" className="hover:text-saffron-400 transition-colors">Threads</a>
        </div>
      </footer>

      {/* Beautiful Modal Dialog */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-[9999] animate-fade-in"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="bg-[#fbf4e3] text-[#27140e] w-full max-w-2xl rounded-sm border border-saffron-400/30 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto relative animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-2 text-[#27140e]/50 hover:text-[#27140e] transition-colors hover:bg-saffron-400/10 rounded-full cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="text-center pb-6 border-b border-saffron-400/20 mb-6">
              <h3 className="text-saffron-500 text-[10px] uppercase tracking-[0.3em] mb-2 font-semibold">Zen & Spiritual Policy</h3>
              <h2 className="text-2xl sm:text-3xl font-serif text-[#27140e] font-light">Cam Kết Chiêm Nghiệm & Bảo Mật</h2>
              <div className="w-12 h-0.5 bg-saffron-400 mx-auto mt-4"></div>
            </div>

            {/* Content List */}
            <div className="space-y-6 text-sm font-light leading-relaxed">
              
              {/* Section 1: Privacy */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 mt-1">
                  <div className="p-2 bg-saffron-400/10 rounded-sm text-saffron-500">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <h4 className="font-serif font-bold text-base text-[#27140e] mb-1">1. Bảo Mật Thông Tin Tuyệt Đối</h4>
                  <p className="text-[#27140e]/80">
                    Chúng tôi cam kết bảo mật 100% mọi dữ liệu cá nhân của bạn, bao gồm: Danh xưng/Họ tên, Ngày tháng năm sinh, Giờ sinh (luận Bát Tự) và mọi chi tiết nhạy cảm được trao đổi trong suốt phiên xem Tarot hay tư vấn tâm linh. Tuyệt đối không chia sẻ thông tin cho bên thứ ba dưới bất kỳ hình thức nào.
                  </p>
                </div>
              </div>

              {/* Section 2: Disclaimer */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 mt-1">
                  <div className="p-2 bg-saffron-400/10 rounded-sm text-saffron-500">
                    <Eye className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <h4 className="font-serif font-bold text-base text-[#27140e] mb-1">2. Bản Chất Chiêm Nghiệm & Định Hướng</h4>
                  <p className="text-[#27140e]/80">
                    Mọi phiên tham vấn Tarot, luận giải vận mệnh hay Bát Tự tại ĐẠO đều hướng tới việc đồng hành, mở rộng góc nhìn tinh thần, giúp bạn thấu hiểu bản thân để đưa ra quyết định sáng suốt hơn. Những nội dung tư vấn này mang tính chất chiêm nghiệm chủ quan và <strong>không thay thế</strong> cho các chẩn đoán/điều trị y khoa, tư vấn tâm lý lâm sàng chuyên nghiệp hoặc bất kỳ lời khuyên pháp lý và tài chính chính thống nào.
                  </p>
                </div>
              </div>

              {/* Section 3: Ethics */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 mt-1">
                  <div className="p-2 bg-saffron-400/10 rounded-sm text-saffron-500">
                    <HeartHandshake className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <h4 className="font-serif font-bold text-base text-[#27140e] mb-1">3. Tôn Trọng Nhân Quả & Tự Do Ý Chí</h4>
                  <p className="text-[#27140e]/80">
                    ĐẠO hoạt động dựa trên tinh thần khoa học cổ học phương Đông chân chính, hoàn toàn bài trừ mê tín dị đoan. Chúng tôi không cung cấp bùa chú, không thực hiện cúng bái tâm linh trục lợi hay đưa ra những dự ngôn mê hoặc gây hoang mang lo sợ. Chúng tôi tin rằng vận mệnh của một người nằm trong tay họ; sự chuyển biến vận số luôn bắt đầu từ sự tự nhận thức, tâm đức lương thiện và nỗ lực thực tế.
                  </p>
                </div>
              </div>

            </div>

            {/* Footer buttons */}
            <div className="mt-8 pt-6 border-t border-saffron-400/20 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
              <span className="text-[#27140e]/60 font-serif">ĐẠO • Triết lý & Chiêm nghiệm sống</span>
              <button 
                onClick={() => setIsOpen(false)}
                className="bg-saffron-400 hover:bg-saffron-500 text-dao-900 font-bold px-6 py-2.5 rounded-sm uppercase tracking-wider transition-colors cursor-pointer"
              >
                Tôi Đã Hiểu & Đồng Ý
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
