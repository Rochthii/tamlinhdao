import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Leaf, Wind, Droplets, Compass } from 'lucide-react';

const philosophy = [
  {
    icon: Wind,
    title: 'Vô Vi',
    short: 'Thuận dòng',
    description: 'Ứng xử thuận theo quy luật tự nhiên, không kháng cự những điều tất yếu. Nắm bắt được thời thế và sống trọn vẹn ở hiện tại.',
    color: 'text-moss-900',
    borderColor: 'border-moss-900/30'
  },
  {
    icon: Droplets,
    title: 'Nhân Quả',
    short: 'Gieo gặt',
    description: 'Thấu hiểu mọi sự kiện không phải ngẫu nhiên mà đều có nguyên nhân rễ sâu. Qua đó, biết cách gieo trồng phước báu cho tương lai.',
    color: 'text-jade-400',
    borderColor: 'border-jade-400/30'
  },
  {
    icon: Compass,
    title: 'Trung Đạo',
    short: 'Cân bằng',
    description: 'Không cực đoan về bất cứ phe nào. Duy trì trạng thái cân bằng trong cảm xúc, tư duy, và những phán đoán hàng ngày.',
    color: 'text-saffron-400',
    borderColor: 'border-saffron-400/30'
  }
];

export default function AboutPage() {
  useEffect(() => {
    document.title = "Về Chúng Tôi | Triết Lý Vô Vi & Nhân Quả | ĐẠO";
  }, []);

  return (
    <div className="py-24 px-4 sm:px-6 lg:px-8 relative z-10 min-h-screen bg-dao-900">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Title Set */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-saffron-400/30 bg-dao-800 text-saffron-400 text-[10px] uppercase tracking-[0.3em] mb-8">
            <Leaf className="w-3 h-3" />
            <span>Tinh Hoa Đạo Mầu</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif text-white font-light tracking-wide mb-8">
            GIỚI THIỆU
          </h1>
          <div className="w-px h-16 bg-gradient-to-b from-saffron-400/80 to-transparent mx-auto mb-8"></div>
        </motion.div>

        {/* Introduction Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="dao-panel p-8 md:p-12 border border-white/5 relative overflow-hidden mb-24"
        >
           <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(circle_at_100%_0%,rgba(214,176,82,0.1)_0%,transparent_70%)] pointer-events-none"></div>
           
           <h3 className="text-2xl font-serif text-saffron-400 mb-6">Đạo • Nơi Giao Thoa</h3>
           
           <div className="space-y-6 text-white/60 font-light leading-relaxed text-base md:text-lg text-justify">
             <p>
               Giữa nhịp sống vội vã và đầy biến động, con người thường xuyên đối mặt với sự mất cân bằng. Sự mưu cầu không dứt, những vấp ngã bất ngờ, hay những băn khoăn về định hướng tương lai khiến chúng ta dần đánh mất không gian tĩnh tại bên trong. "Đạo" ra đời từ sự thấu hiểu đó, như một trạm dừng chân an lạc.
             </p>
             <p>
               Chúng tôi kết hợp sự minh triết của <span className="text-saffron-400/80 font-medium">Kinh Dịch</span> (để nhìn thấu vận thời quy luật của tạo hóa), sự thuận tự nhiên của <span className="text-saffron-400/80 font-medium">Đạo Lão</span> (để học cách vận hành linh hoạt không cưỡng cầu), và lòng từ bi vô hạn của <span className="text-saffron-400/80 font-medium">Phật Pháp</span> (để chữa lành và nuôi dưỡng thiện nguyện). 
             </p>
             <p>
               "Đạo" không chỉ là tên gọi. Nó là con đường, là lý lẽ, là dòng chảy của vũ trụ. Thông qua nghệ thuật luận mệnh và tham vấn tâm lý, chúng tôi không đưa ra những lời phán xét hay mê tín. Điều chúng tôi mang tới là một <strong>bản đồ phước nghiệp</strong> chi tiết của bạn, đồng thời mở lối tĩnh tại tư duy, giúp bạn nhìn nhận mọi việc tường tận, từ đó đưa ra quyết định sáng suốt và thuận dòng vũ trụ.
             </p>
           </div>
        </motion.div>

        {/* Philosophy Features */}
        <div className="space-y-16">
          <div className="text-center">
            <h3 className="text-xl font-serif text-white mb-2">Triết Lý Cốt Lõi</h3>
            <p className="text-white/40 text-sm font-light">Những tinh thần kiến tạo nên nền tảng của Đạo</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {philosophy.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="dao-panel p-8 text-center relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className={`w-12 h-12 mx-auto rounded-full border ${item.borderColor} bg-dao-900 flex items-center justify-center mb-6 relative z-10`}>
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <h4 className="text-[10px] uppercase tracking-widest text-white/50 mb-2 relative z-10">{item.short}</h4>
                <h3 className="text-xl font-serif text-white mb-4 relative z-10">{item.title}</h3>
                <p className="text-white/50 text-sm font-light leading-relaxed relative z-10">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
