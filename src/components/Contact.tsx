import { motion } from 'motion/react';
import { MessageSquare, ArrowRight, CheckCircle2 } from 'lucide-react';
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', dob: '', phone: '', service: 'Đăng ký xem bài Tarot', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      setErrorMsg('Vui lòng nhập họ tên và số điện thoại liên lạc.');
      return;
    }
    setErrorMsg('');
    setIsSubmitting(true);
    
    try {
      if (supabase) {
        // Thử chèn đầy đủ thông tin theo cấu trúc schema mới
        let { error } = await supabase.from('bookings').insert([{
          name: formData.name,
          dob: formData.dob || '',
          phone: formData.phone,
          message: `[Dịch vụ mong muốn: ${formData.service}]\n\n${formData.message || ''}`,
          status: 'pending'
        }]);
        
        // Cơ chế tự động fallback thông minh: Nếu database thật của người dùng là bản cũ thiếu cột dob hoặc status
        if (error && (error.message.includes('dob') || error.message.includes('status'))) {
          console.warn('⚠️ Phát hiện database bookings thiếu cột dob hoặc status. Kích hoạt chế độ chèn dự phòng (fallback)...');
          
          const fallbackPayload = {
            name: formData.name,
            phone: formData.phone,
            message: `[Dịch vụ mong muốn: ${formData.service}]\n[Năm sinh/Cung mệnh: ${formData.dob || 'Không rõ'}]\n\n${formData.message || ''}`
          };
          
          const { error: fallbackError } = await supabase.from('bookings').insert([fallbackPayload]);
          error = fallbackError;
        }
        
        if (error) throw error;
        setIsSuccess(true);
        setFormData({ name: '', dob: '', phone: '', service: 'Đăng ký xem bài Tarot', message: '' });
      } else {
        throw new Error('Hệ thống cơ sở dữ liệu chưa được cấu hình. Vui lòng quay lại sau.');
      }
    } catch (error: any) {
      console.error('Lưu vào Supabase thất bại:', error);
      setErrorMsg(error?.message || 'Có lỗi xảy ra khi gửi thông tin. Vui lòng thử lại sau hoặc kiểm tra kết nối mạng của bạn.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 relative z-10 bg-dao-900 border-t border-saffron-400/10">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h3 className="text-saffron-400/60 text-[10px] uppercase tracking-[0.3em] mb-4">Giao Lộ Tâm Giao</h3>
          <h2 className="text-3xl md:text-5xl font-serif mb-6 text-white font-light">Liên Hệ</h2>
          <p className="text-white/50 max-w-2xl mx-auto font-light">
            Xin lưu lại thông tin để chúng tôi liên lạc và sắp xếp buổi hội ngộ. Vạn sự tùy duyên, chúc bạn luôn bình an.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex-1 dao-panel p-8 rounded-sm relative"
          >
            <h4 className="text-xs font-serif text-saffron-400 uppercase tracking-widest mb-6">Gửi Yêu Cầu Gặp Gỡ</h4>
            {isSuccess ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <CheckCircle2 className="w-16 h-16 text-moss-900 mb-4" />
                <h3 className="text-xl text-white font-serif mb-2">Lời Nhắn Đã Ghi Nhận</h3>
                <p className="text-sm text-white/50">Trợ tín sẽ liên lạc với bạn trong thời gian sớm nhất.</p>
                <button 
                  onClick={() => setIsSuccess(false)}
                  className="mt-8 text-[11px] text-saffron-400 uppercase tracking-widest hover:text-saffron-200 transition-colors border-b border-saffron-400/30"
                >
                  Gửi thêm thông điệp
                </button>
              </div>
            ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
              {errorMsg && <p className="text-rust-900 text-xs">{errorMsg}</p>}
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-[#fff1be]/60 font-semibold mb-2">Dịch vụ mong muốn hỗ trợ</label>
                <select
                  name="service"
                  value={formData.service}
                  onChange={handleInputChange}
                  className="w-full bg-dao-800/50 border border-saffron-400/20 rounded-sm px-4 py-3 text-sm outline-none focus:border-saffron-400/60 transition-all text-white placeholder-white/30 focus:bg-dao-800"
                >
                  <option value="Đăng ký xem bài Tarot">Đăng ký xem bài Tarot</option>
                  <option value="Tham vấn Tâm linh & Chữa lành">Tham vấn Tâm linh & Chữa lành</option>
                  <option value="Luận giải Vận mệnh (Bát Tự/Kinh Dịch)">Luận giải Vận mệnh (Bát Tự/Kinh Dịch)</option>
                  <option value="Yêu cầu Nghi lễ (Cầu an/Gieo phước)">Yêu cầu Nghi lễ (Cầu an/Gieo phước)</option>
                </select>
              </div>
              <div>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-dao-800/50 border border-saffron-400/20 rounded-sm px-4 py-3 text-sm outline-none focus:border-saffron-400/60 transition-all text-white placeholder-white/30"
                  placeholder="Danh xưng / Họ tên"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input 
                    type="text" 
                    name="dob"
                    value={formData.dob}
                    onChange={handleInputChange}
                    className="w-full bg-dao-800/50 border border-saffron-400/20 rounded-sm px-4 py-3 text-sm outline-none focus:border-saffron-400/60 transition-all text-white placeholder-white/30"
                    placeholder="Năm sinh / Cung Mệnh"
                  />
                </div>
                <div>
                  <input 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full bg-dao-800/50 border border-saffron-400/20 rounded-sm px-4 py-3 text-sm outline-none focus:border-saffron-400/60 transition-all text-white placeholder-white/30"
                    placeholder="Số điện thoại liên lạc"
                  />
                </div>
              </div>
              <div>
                <textarea 
                  rows={4}
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full bg-dao-800/50 border border-saffron-400/20 rounded-sm px-4 py-3 text-sm outline-none focus:border-saffron-400/60 transition-all text-white placeholder-white/30 resize-none"
                  placeholder="Mong muốn hay niềm trăn trở của bạn..."
                ></textarea>
              </div>
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-saffron-400 text-dao-900 py-4 rounded-sm text-xs font-bold uppercase tracking-widest hover:bg-saffron-500 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Đang Gửi...' : 'Gửi Tín Phước'} {!isSubmitting && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>
            )}
          </motion.div>

          {/* Quick Contact & Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-[350px] flex flex-col gap-6"
          >
            {/* Direct Contact */}
            <div className="dao-panel p-6 rounded-sm">
              <h4 className="text-xs font-serif text-saffron-400 uppercase tracking-widest mb-6">Liên Hệ Trực Tiếp</h4>
              <a href="https://www.facebook.com/profile.php?id=61578175196192&locale=vi_VN" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 bg-dao-800/60 hover:bg-saffron-400/10 border border-saffron-400/10 hover:border-saffron-400/30 text-white rounded-sm p-4 transition-all mb-4 group">
                <MessageSquare className="w-5 h-5 text-white/50 group-hover:text-saffron-400" />
                <div>
                  <p className="text-sm font-medium">Facebook Messenger</p>
                  <p className="text-[10px] text-white/40 mt-1 uppercase tracking-wider">Trò chuyện trực tiếp</p>
                </div>
              </a>
              <a href="https://www.facebook.com/profile.php?id=61578175196192&locale=vi_VN" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 bg-dao-800/60 hover:bg-rust-900/10 border border-saffron-400/10 hover:border-rust-900/30 text-white rounded-sm p-4 transition-all mb-4 group">
                <MessageSquare className="w-5 h-5 text-white/50 group-hover:text-rust-900" />
                <div>
                  <p className="text-sm font-medium">Instagram Direct</p>
                  <p className="text-[10px] text-white/40 mt-1 uppercase tracking-wider">Theo dõi & Nhắn tin</p>
                </div>
              </a>
              <a href="https://www.facebook.com/profile.php?id=61578175196192&locale=vi_VN" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 bg-dao-800/60 hover:bg-jade-400/10 border border-saffron-400/10 hover:border-jade-400/30 text-white rounded-sm p-4 transition-all group">
                <MessageSquare className="w-5 h-5 text-white/50 group-hover:text-jade-400" />
                <div>
                  <p className="text-sm font-medium">Threads</p>
                  <p className="text-[10px] text-white/40 mt-1 uppercase tracking-wider">Góc nhìn & Chia sẻ</p>
                </div>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
