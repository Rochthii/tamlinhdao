import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

// Default initial data
const initialArticles = [
  {
    id: 'a1',
    category: 'Triết Lý Đạo Giáo',
    title: 'Vô Vi: Nghệ thuật thuận theo tự nhiên trong đời sống hiện đại',
    excerpt: 'Hiểu đúng về Vô vi không phải là không làm gì, mà là làm hành động không khiên cưỡng, để vạn sự vận hành theo quy luật vốn có của nó.',
    date: '12 Tháng 4, 2024',
    readTime: '5 phút đọc',
    author: 'Chăm Rốch Thi',
    content: `Trong thế giới hiện đại cuộn xoáy với những áp lực vô hình và chủ nghĩa hiệu năng, ta thường nhầm tưởng "Vô Vi" (无为) nghĩa là buông xuôi, lười biếng hay hoàn toàn vô vọng thụ động. Tuy nhiên, theo Đạo Đức Kinh của L lão Tử, Vô Vi thực chất là làm hành động một cách tự nhiên nhất (Vô Vi nhi vô bất vi - Không làm gì mà không gì không làm).

**Thuận theo quy luật tự nhiên (ĐẠO)**
Như nước chảy đá mòn, nước không cố gắng đấu tranh chống lại tảng đá lớn, nó chỉ nhẹ nhàng lách qua hoặc bền bỉ chảy qua thời gian. Hành động Vô Vi trong đời sống hiện đại là việc ngừng cố gắng kiểm soát mọi kết quả vượt ngoài tầm tay. Khi ta gieo một hạt giống, ta tưới nước, bón phân nhưng không thể dùng sức kéo mầm cây lớn lên nhanh hơn quy luật của đất trời.

**Ứng dụng Vô Vi trong cuộc sống hằng ngày:**
1. *Bớt dính mắc vào kỳ vọng:* Nỗ lực hết lòng trong công việc nhưng khi kết quả đến, hãy đón nhận nó với tâm thế ung dung nhẹ nhõm.
2. *Lắng nghe nhịp điệu sinh học của cơ thể:* Khi mệt mỏi hãy nghỉ ngơi thế vì ép buộc bản thân bằng các chất lôi cuốn tạm thời để tiếp tục hoạt động quá tải.
3. *Sống trong hiện tại:* Thay vì lo lắng vô bờ bến về tương lai mờ mịt hay hối tiếc về quá khứ đã qua, hãy trọn vẹn từng hơi thở của giây phút hiện tại.

Vô Vi chính là nghệ thuật tối giản của tâm hồn. Khi bạn ngắt bớt những ham muốn thừa thãi, tự khắc cuộc sống sẽ trở nên thong dong, bình thản và tràn trề năng lượng sáng tạo chân thực.`
  },
  {
    id: 'a2',
    category: 'Phật Pháp Nhiệm Màu',
    title: 'Hiểu về Luật Nhân Quả và cách chuyển hóa nghiệp lực',
    excerpt: 'Nhân quả không phải là sự trừng phạt, mà là tấm gương phản chiếu hành động. Thay đổi góc nhìn giúp ta gieo những hạt giống thiện lành hơn.',
    date: '08 Tháng 4, 2024',
    readTime: '7 phút đọc',
    author: 'Thích Trí Đức',
    content: `Luật Nhân Quả (Karma) là một trong những cột trụ nền tảng của Phật giáo, mô tả quy luật vận hành tự nhiên của vụ trụ. Tuy nhiên, nhiều người vẫn nhìn nhận Nhân Quả như một hệ thống trừng phạt hay định mệnh an bài cứng nhắc.

**Nhân quả là tấm gương phản chiếu hành động**
"Gieo gió gặt bão", hành động thiện mang lại quả lành, hành động bất thiện gieo mầm khổ đau. Tuy nhiên, Nhân quả hoàn toàn không mang tính thần quyền phạt phạt, mà là phản hồi tự nhiên từ ý chí và hành vi của chúng ta. Nhân là hạt giống, Quả là trái chín, nhưng giữa Nhân và Quả còn có một nhân tố vô cùng quan trọng gọi là "Duyên" (điều kiện hội tụ).

**Cách thức chuyển hóa nghiệp lực:**
1. *Nhận diện nghiệp lực của bản thân:* Thành thật đối diện với những thói quen xấu, những phản ứng nóng giận hay vị kỷ dấy lên bên trong tâm ta hằng ngày.
2. *Chủ động tạo tác Duyệt Lành mới:* Thay vì oán trách số phận hay những vận hạn rủi ro bất ngờ, hãy siêng năng tích lũy phước đức bằng cách giúp đỡ người khác, bố thí, gieo duyên thiện lành.
3. *Sám hối và tha thứ:* Thực hành sám hối chân thành giúp tâm trí trở nên thanh tịnh, hóa giải oán kết thù hằn với những chúng sinh xung quanh.

Một khi thấu suốt được dòng chảy Nhân Quả, chúng ta không còn sợ hãi trước nghịch cảnh mà vững tin rằng: Bản thân chính là người nắm giữ chiếc chìa khóa tối thượng để kiến tạo nên một tương lai bình an và tràn đầy phước lộc.`
  },
  {
    id: 'a3',
    category: 'Cổ Học Phương Đông',
    title: 'Kinh Dịch và sự ứng dụng trong việc ra quyết định',
    excerpt: 'Không chỉ là bói toán, Kinh Dịch chứa đựng hệ tư tưởng uyên thâm về sự biến đổi không ngừng của vũ trụ và vạn vật.',
    date: '01 Tháng 4, 2024',
    readTime: '10 phút đọc',
    author: 'Chăm Rốch Thi',
    content: `Kinh Dịch (易经) - một trong ba tác phẩm vĩ đại nhất của cổ học Phương Đông cùng với Đạo Đức Kinh và Luận Ngữ - thường bị dân gian hiểu nhầm là sách bói toán thần bí. Kỳ thực, Kinh Dịch là cuốn sách ghi chép về các quy luật biến dịch (thay đổi) của vũ trụ và đời sống con người thông qua hệ thống 64 quẻ.

**Hiểu về lẽ Âm Dương và sự Biến Dịch**
Thế giới xung quanh chúng ta luôn xoay vần: Ngày qua đêm tới, lạnh đi nóng về, bĩ cực thái lai. Kinh Dịch dạy chúng ta cách quan sát xu thế vận động của thời cuộc để từ đó "kiến cơ nhi tác" (thấy thời cơ mà hành động).

**Ứng dụng Kinh Dịch khi đứng trước những lựa chọn lớn:**
1. *Giữ tâm trí sáng suốt (Tĩnh cư):* Trước khi ra một quyết định lớn, hãy gạt bỏ những ham muốn vị kỷ và nỗi sợ hãi chi phối. Trạng thái tâm tĩnh lặng như hồ nước phẳng lặng mới phản chiếu chính xác sự thật.
2. *Nhận diện vị thế bản thân trong thời vận:* Quẻ Dịch nhắc nhở ta về thời điểm thích hợp. Có những lúc cần phải lẩn khuất tích lũy lực lượng như "Tiềm long vật dụng", có lúc lại thuận buồm xuôi gió cần tiến bước quyết đoán.
3. *Thành thật với quẻ mệnh:* Dù sử dụng Kinh Dịch qua bói dịch cỏ thi hay gieo đồng xu cầu ý, điều cốt lõi vẫn là học cách chấp nhận sự xoay chuyển của vũ trụ để hành động không trái với đạo lý làm người.

Người nắm vững tinh túy của Kinh Dịch không cố chấp đi ngược lại dòng chảy của thời cuộc, cũng không xuôi tay đầu hàng, mà biết nâng buồm nương theo sóng gió để biến mọi nghịch cảnh trở thành cơ duyên bứt phá thiện lành.`
  },
  {
    id: 'a4',
    category: 'Thiền Định',
    title: '5 phút để quay về nội tại giữa bộn bề công việc',
    excerpt: 'Những kỹ thuật thiền chánh niệm đơn giản dành cho người bận rộn. Một hơi thở sâu có thể cứu vãn cả một ngày đầy căng thẳng.',
    date: '25 Tháng 3, 2024',
    readTime: '4 phút đọc',
    author: 'Diệu Tâm',
    content: `Trong nhịp sống công sở gấp gáp với hằng hà sa số các thông báo qua tin nhắn, email và các cuộc họp nối tiếp, tâm trí chúng ta rất dễ rơi vào trạng thái kiệt quệ hoàn toàn (burnout). 5 phút chánh niệm chính là liều thuốc giải cứu kỳ diệu mà ai cũng có thể tự thực hành ngay tại văn phòng của mình.

**Phương pháp "5 Phút Tĩnh Lặng":**
- **Phút thứ 1: Tìm tư thế vững chãi.** Hãy ngồi thẳng lưng trên ghế làm việc của bạn, đặt hai chân song song áp sát xuống mặt đất, hai tay buông nhẹ thoải mái trên đùi. Hơi khép hờ mắt để ngắt bớt sự nhiễu loạn thông tin từ bên ngoài.
- **Phút thứ 2: Đột ngột buông xả căng thẳng.** Đưa sự chú ý đến các cơ trên khuôn mặt, vùng vai và cổ. Chủ động thả lỏng cơ mặt, mở nhẹ chân mày, thả lỏng đôi vai đang co cứng vì ngồi gõ văn bản quá lâu.
- **Phút thứ 3-4: Tập trung vào hơi thở tự nhiên.** Hãy hít một hơi thật sâu bằng mũi, cảm nhận bụng phình nhẹ ra. Sau đó thở ra chậm rãi bằng miệng, cảm nhận mọi phiền lo đang trôi ra ngoài. Không cần cố kiểm soát hơi thở dài ngắn, chỉ nhìn ngắm hơi thở tự nhiên đi ra và đi vào của chính mình.
- **Phút thứ 5: Khởi tâm tri ân và mỉm cười rộng mỏ.** Nghĩ về một điều tốt đẹp nhỏ nhoi bạn cảm thấy biết ơn ngày hôm nay: một người đồng nghiệp pha trà mời bạn, thời tiết mát mẻ hay đơn giản là bạn vẫn khỏe mạnh và hít thở bình yên.

Chỉ với 5 phút ngắn ngủi quay về tiếp xúc sâu sắc với thân tâm, bạn đã bổ sung năng lượng thanh sạch vào tế bào tự chữa lành, hồi sinh sự tập trung sáng suốt vượt trội để đón nhận cuộc sống đầy sinh động.`
  },
  {
    id: 'a5',
    category: 'Triết Lý Đạo Giáo',
    title: 'Đạo Đức Kinh: Những bài học vượt thời gian',
    excerpt: 'Phân tích những câu nói nổi bật trong Đạo Đức Kinh của Lão Tử và ứng dụng thực tiễn trong kinh doanh, quản lý và đời sống gia đình.',
    date: '18 Tháng 3, 2024',
    readTime: '8 phút đọc',
    author: 'Chăm Rốch Thi',
    content: `Đạo Đức Kinh tuy có dung lượng rất khiêm tốn chỉ khoảng hơn 5000 chữ cổ nhân, nhưng lại chứa đựng kho tàng trí tuệ sừng sững vượt thời gian. Hơn 2500 năm đã trôi qua, những câu triết lý của Lão Tử vẫn là ngọn đuốc soi đường cực kỳ sắc sảo cho tư duy quản trị, quản lý lối sống hiện đại.

**Những câu nói cốt lõi vàng ngọc và ứng dụng thực tiễn:**

1. *"Thượng thiện nhược thủy" (Bực thiện cao nhất giống như nước)*
Ứng dụng: Nước nuôi dưỡng vạn vật mà không tranh giành, nước luôn chảy xuống chỗ thấp mà mọi người ghét thích bỏ qua. Trong cương vị người lãnh đạo hay thành viên gia đình, hãy khiêm tốn dấn thân giúp đỡ người khác mà không mong danh lợi. Sự dịu dàng, uyển chuyển bao giờ cũng vượt thắng cái sắc nhọn, thô ráp.

2. *"Tri túc giả phú" (Ai biết đủ là người giàu có nhất)*
Ứng dụng: Trong thời đại tràn ngập các chiêu trò tiếp thị tiêu dùng kích thích thèm khát sở hữu, chúng ta bị kéo vào cuộc đua kiếm tiền không bao giờ kết thúc. Biết đủ chính là bến đỗ bình yên của tâm lý. Khi nhận thức rõ ranh giới giữa "Ham muốn cần" và "Cơ bản đủ", bạn sẽ lập tức giải thoát bản thân ra khỏi xiềng xích của đồng tiền chi phối.

3. *"Hợp bão chi mộc, sinh ư hào mạt; cửu tầng chi đài, khởi ư lũy thổ" (Cây ôm cả tay ôm mọc lên từ mầm nhỏ, đài cao chín tầng khởi đầu từ một nắm đất)*
Ứng dụng: Đừng khinh thường những bước chân nhỏ hằng ngày. Cho dù là rèn luyện thiền định, tích lũy phước đức hay khởi nghiệp kinh doanh, chìa khóa vàng chính là sự kiên trì bền bỉ từ những việc li ti nhất hằng ngày.

Đạo Đức Kinh không bảo bạn phải bỏ trốn khỏi cuộc hành trình xã hội, mà dạy bạn cách bảo tồn sinh khí, tĩnh tại giữa phong ba bão táp để luôn giữ trọn vẹn sự thuần khiết nguyên sơ nhất.`
  },
  {
    id: 'a6',
    category: 'Phật Pháp Nhiệm Màu',
    title: 'Duyên Khởi: Vạn vật nương tựa nhau mà sinh, nương tựa nhau mà diệt',
    excerpt: 'Hiểu được nguyên lý duyên khởi sẽ giúp bạn bớt dính mắc, sống an nhiên hơn trước những biến cố của cuộc sống.',
    date: '10 Tháng 3, 2024',
    readTime: '6 phút đọc',
    author: 'Thích Trí Đức',
    content: `"Cái này có mặt thì cái kia có mặt, cái này sinh thì cái kia sinh. Cái này không có mặt thì cái kia không có mặt, cái này diệt thì cái kia diệt." - Đây chính là cốt lõi của Kinh Duyên Khởi (Pratītyasamutpāda) huyền diệu.

**Mọi sự trên đời không có tự tính độc lập tách rời**
Ta thường nghĩ ta độc lập, tách biệt với xã hội xung quanh. Nhưng hãy suy ngẫm: Để có được chén cơm ta ăn trưa nay, cần có người nông dân cấy lúa, có mây mang mưa tới tưới tắm, có mặt trời chiếu sáng sưởi ấm, có người giao hàng vận chuyển gian khổ. Một chén cơm là sự tụ hội hài hòa của hàng vạn nhân duyên vũ trụ đất trời.

Chúng ta cũng vậy. Nỗi buồn hay niềm vui của bạn không tự nhiên tự sinh ra mà chịu tác động từ môi trường, quá khứ, lời nói của người lân cận.

**Thực hành tu tập dựa trên trí tuệ Duyên Khởi:**
- *Học cách bớt vị kỷ, bảo vệ xung quanh:* Nhận thức sâu sắc sợi dây liên đới mật thiết khiến ta biết trân trọng thiên nhiên và yêu thương mọi người một cách khách quan nhất.
- *Đón nhận biến cố ung dung:* Khi một mối quan hệ đổ vỡ hay sự nghiệp gặp biến cố, ta hiểu rằng duyên lành đã hết. Không dằn vặt oán trách vô lý, vì sự hợp - tan chỉ là chuyển biến của các nhân duyên tạm thời mà thôi.
- *Chủ động gieo duyên tốt lành:* Dù là một nụ cười thân thiện, một ý nghĩ từ bi hay một hành động tử tế nhỏ, bạn cũng đang gửi đi một tần số năng lượng tốt đẹp tác động dây chuyền thay đổi thế giới xung quanh vô cùng nhiệm màu.

Thấu lý Duyên Khởi mang lại cho bạn trí tuệ của sự khoáng đạt, tự do thoát ly khỏi những xiềng xích hiểu lầm cố chấp hẹp hòi.`
  }
];

const initialServices = [
  {
    id: 'luan-van-menh',
    title: 'Luận Vận Mệnh',
    subtitle: 'Giải Mã Bản Đồ Phước Nghiệp',
    hanzi: '命 理', // Mệnh Lý
    description: 'Dựa trên Tứ Trụ, Bát Tự và triết lý Kinh Dịch, việc luận giải giúp bạn thấu hiểu "vốn liếng" bản mệnh một cách tường minh. Chúng tôi đánh giá sự hưng suy của từng thời lỳ, giải đáp cụ thể những trăn trở về sự nghiệp, tài lộc, gia đạo. Thấu hiểu quy luật Âm Dương Ngũ Hành để thuận theo dòng chảy trần gian.',
    features: ['Phân tích Bát Tự cá nhân', 'Lập quẻ Kinh Dịch hỏi sự', 'Định hướng cát hung đại vận'],
    color: 'text-saffron-400',
    borderColor: 'border-saffron-400/30',
    bgDecor: 'bg-saffron-400/5',
    iconName: 'Compass'
  },
  {
    id: 'tham-van-tam-linh',
    title: 'Tham Vấn Tâm Linh',
    subtitle: 'Chữa Lành & Chuyển Hóa',
    hanzi: '心 靈', // Tâm Linh
    description: 'Khi đứng trước ngã rẽ hay bế tắc nội tâm, bạn cần một điểm tựa sáng suốt. Bằng sự đối thoại từ bi dựa trên góc nhìn Nhân Quả và Phật Pháp Nhiệm Màu, chúng tôi sẽ cùng bạn gỡ bỏ những dính mắc, buông xả muộn phiền. Chỉ lối bằng tư duy Vô Vi, giúp bạn tự thân tìm lại sự tĩnh tại và cân bằng chân thực.',
    features: ['Tháo gỡ bế tắc tâm lý', 'Phân tích nhân duyên sự việc', 'Hỗ trợ phương pháp tĩnh tâm'],
    color: 'text-jade-400',
    borderColor: 'border-jade-400/30',
    bgDecor: 'bg-jade-400/5',
    iconName: 'Flower2'
  },
  {
    id: 'nghi-le',
    title: 'Tư Vấn & Hỗ Trợ Nghi Lễ Theo Yêu Cầu',
    subtitle: 'Cầu An & Gieo Phước',
    hanzi: '儀 礼', // Nghi Lễ
    description: 'Một không gian thanh khiết là nền tảng của vượng khí. Tư vấn và hỗ trợ các nghi thức thanh tẩy trần khí tà uế cho nơi ở, nơi làm việc. Hướng dẫn thiết lập ban thờ trang nghiêm, khai quang điểm nhãn vật phẩm, truyền thụ cách thức khấn nguyện sao cho linh ứng để tự gia chủ chư cát tị hung, nạp đầy phước đức.',
    features: ['Thanh tẩy không gian sống', 'Thiết lập ban thờ chuẩn mực', 'Hướng dẫn nghi thức cầu bình an'],
    color: 'text-rust-900',
    borderColor: 'border-rust-900/30',
    bgDecor: 'bg-rust-900/5',
    iconName: 'Flame'
  }
];

const initialGifts = [
  {
    id: 'g1',
    type: 'newcomer',
    iconName: 'Compass',
    title: 'Quẻ Dịch Đầu Tuần',
    desc: 'Xin một quẻ Dịch miễn phí vào mỗi sáng thứ Hai để lấy thêm định hướng và sự sáng suốt cho một tuần mới bình an.',
    color: 'text-jade-400',
    bg: 'bg-jade-400/10'
  },
  {
    id: 'g2',
    type: 'newcomer',
    iconName: 'Moon',
    title: 'Thông Điệp Vũ Trụ',
    desc: 'Lá bài Tarot hoặc Oracle mang theo thông điệp ngẫu nhiên bạn cần nghe ngay lúc này, giúp gỡ rối những suy nghĩ miên man.',
    color: 'text-rust-900',
    bg: 'bg-rust-900/10'
  },
  {
    id: 'g3',
    type: 'newcomer',
    iconName: 'BookOpen',
    title: 'Cẩm Nang Tu Tập',
    desc: 'Bộ tài liệu chắt lọc những câu chú cơ bản, kinh điển ngắn và cách thiết lập bàn thờ tâm linh tại gia cho người mới.',
    color: 'text-saffron-400',
    bg: 'bg-saffron-400/10'
  },
  {
    id: 'g4',
    type: 'loyal',
    iconName: 'Sparkles',
    title: 'Lá Bùa Bình An',
    desc: 'Được trì chú riêng theo tên tuổi và tứ trụ của bạn, mang theo bên mình để hóa giải những năng lượng tiêu cực.',
    color: 'text-saffron-400',
    bg: 'bg-saffron-400/10'
  },
  {
    id: 'g5',
    type: 'loyal',
    iconName: 'Leaf',
    title: 'Vòng Trầm / Đá Năng Lượng',
    desc: 'Những vật phẩm phong thủy được thanh tẩy, nạp năng lượng qua các khóa lễ nguyện cầu, giúp định tâm và an miên.',
    color: 'text-saffron-400',
    bg: 'bg-saffron-400/10'
  },
  {
    id: 'g6',
    type: 'loyal',
    iconName: 'Star',
    title: 'Luận Giải Định Kỳ Miễn Phí',
    desc: 'Dành cho khách hàng thân thiết: Miễn phí một lần luận giải tổng quan vào tháng sinh hoặc dịp giao thời đầu năm mới.',
    color: 'text-saffron-400',
    bg: 'bg-saffron-400/10'
  }
];

const initialTestimonials = [
  {
    id: 't1',
    name: 'Phật Tử Tại Gia',
    service: 'Tham Vấn Tâm Linh',
    content: '"Sự tư vấn rất nhẹ nhàng, từ bi mẫn tuệ. Tôi đã học được cách buông bỏ những muộn phiền không đáng có và tập trung vào tu dưỡng bản thân."',
  },
  {
    id: 't2',
    name: 'Khách Hàng Hữu Duyên',
    service: 'Luận Vận Mệnh',
    content: '"Phân tích lá số khoa học và kết hợp với triết lý nhân quả, không hề dọa dẫm hay mê tín. Giúp tôi có niềm tin mạnh mẽ vào những quyết định của mình."',
  },
  {
    id: 't3',
    name: 'Người Trẻ Đi Tìm Đạo',
    service: 'Nghi Lễ Cầu An',
    content: '"Nghi lễ thanh tịnh, ấm cúng. Không gian năng lượng sau phiên làm lễ rất trong trẻo, gia đình tôi thấy bình an hơn hẳn."',
  },
  {
    id: 't4',
    name: 'Chị Mai Lan',
    service: 'Luận Vận Mệnh & Phong Thuỷ',
    content: '"Tôi đã hiểu được thời vận của mình đang ở đâu để từ đó không còn mưu cầu quá sức. Gia đạo dường như cũng êm ấm hơn từ khi sắp xếp lại theo hướng dẫn của chị."',
  },
  {
    id: 't5',
    name: 'Minh Tuấn',
    service: 'Tham Vấn Tâm Linh',
    content: '"Góc nhìn Nhân Quả thực sự đã đánh thức tôi. Nhờ những lời khuyên sâu sắc, tôi đã rũ bỏ được gánh nặng tâm lý suốt nhiều năm."'
  },
  {
    id: 't6',
    name: 'Hương Trà',
    service: 'Gieo Duyên Đầu Năm',
    content: '"Phần quà vòng gỗ và quẻ dịch đầu năm tuy nhỏ nhưng mang lại cho tôi năng lượng rất bình yên. Cảm ơn Đạo đã gieo những hạt giống thiện lành."'
  }
];

const initialMembers = [
  {
    id: 'm1',
    name: 'Chăm Rốch Thi',
    role: 'Người Sáng Lập / Quản Trị Viên',
    email: 'rochthi59@gmail.com',
    joinDate: '15 Tháng 3, 2024'
  },
  {
    id: 'm2',
    name: 'Thích Trí Đức',
    role: 'Cố Vấn Tâm Linh',
    email: 'triduc.dao@gmail.com',
    joinDate: '20 Tháng 3, 2024'
  },
  {
    id: 'm3',
    name: 'Diệu Tâm',
    role: 'Phó Ban Quản Sự',
    email: 'dieutam.dao@gmail.com',
    joinDate: '01 Tháng 4, 2024'
  }
];

export type ArticleType = typeof initialArticles[0] & { published?: boolean; published_at?: any; image_url?: string };
export type ServiceType = typeof initialServices[0];
export type GiftType = typeof initialGifts[0];
export type TestimonialType = typeof initialTestimonials[0];
export type MemberType = typeof initialMembers[0];

interface AppContextType {
  articles: ArticleType[];
  services: ServiceType[];
  gifts: GiftType[];
  testimonials: TestimonialType[];
  members: MemberType[];
  updateArticle: (id: string, a: Omit<ArticleType, 'id'> & { published?: boolean }) => void;
  addArticle: (a: Omit<ArticleType, 'id'> & { published?: boolean }) => void;
  deleteArticle: (id: string) => void;
  addService: (s: Omit<ServiceType, 'id'>) => void;
  updateService: (id: string, s: Omit<ServiceType, 'id'>) => void;
  deleteService: (id: string) => void;
  addGift: (g: Omit<GiftType, 'id'>) => void;
  updateGift: (id: string, g: Omit<GiftType, 'id'>) => void;
  deleteGift: (id: string) => void;
  addTestimonial: (t: Omit<TestimonialType, 'id'>) => void;
  updateTestimonial: (id: string, t: Omit<TestimonialType, 'id'>) => void;
  deleteTestimonial: (id: string) => void;
  addMember: (m: Omit<MemberType, 'id'>) => void;
  updateMember: (id: string, m: Omit<MemberType, 'id'>) => void;
  deleteMember: (id: string) => void;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const formatViDate = (publishedAt: any, createdAt?: any) => {
  const targetDate = publishedAt || createdAt;
  if (!targetDate) return '12 Tháng 4, 2024';
  try {
    return new Date(targetDate).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).replace('tháng', 'Tháng');
  } catch (e) {
    return '12 Tháng 4, 2024';
  }
};

const mapArticles = (arts: any[]): ArticleType[] => {
  return arts.map(art => ({
    ...art,
    readTime: art.readTime || art.read_time || '5 phút đọc',
    date: art.date || formatViDate(art.published_at, art.created_at)
  }));
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [articles, setArticles] = useState<ArticleType[]>(initialArticles);
  const [services, setServices] = useState<ServiceType[]>(initialServices);
  const [gifts, setGifts] = useState<GiftType[]>(initialGifts);
  const [testimonials, setTestimonials] = useState<TestimonialType[]>(initialTestimonials);
  const [members, setMembers] = useState<MemberType[]>(initialMembers);

  // Load from Supabase directly
  useEffect(() => {
    const load = async () => {
      if (supabase) {
        try {
          const { data: arts } = await supabase.from('articles').select('*').order('published_at', { ascending: false });
          if (arts && arts.length > 0) setArticles(mapArticles(arts));

          const { data: svcs } = await supabase.from('services').select('*').order('created_at', { ascending: false });
          if (svcs && svcs.length > 0) setServices(svcs as ServiceType[]);

          const { data: gfs } = await supabase.from('gifts').select('*').order('created_at', { ascending: false });
          if (gfs && gfs.length > 0) setGifts(gfs as GiftType[]);

          const { data: tms } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false });
          if (tms && tms.length > 0) setTestimonials(tms as TestimonialType[]);

          const { data: mbs } = await supabase.from('members').select('*').order('created_at', { ascending: false });
          if (mbs && mbs.length > 0) setMembers(mbs as MemberType[]);
        } catch (err) {
          console.error('Error loading from Supabase:', err);
        }
      }
    };
    load();
  }, []);

  // Articles CRUD
  const addArticle = async (a: Omit<ArticleType, 'id'> & { published?: boolean }) => {
    if (supabase) {
      try {
        const payload: any = {
          title: a.title,
          category: a.category,
          excerpt: a.excerpt,
          content: a.content,
          author: a.author,
          read_time: a.readTime || (a as any).read_time,
          published: a.published ?? true,
          published_at: new Date(),
          image_url: a.image_url
        };
        const { data, error } = await supabase.from('articles').insert([payload]).select().single();
        if (error) throw error;
        setArticles(prev => [mapArticles([data])[0], ...prev]);
      } catch (err) {
        console.error('addArticle supabase error', err);
      }
    } else {
      setArticles(prev => [{ ...a, id: Date.now().toString() }, ...prev]);
    }
  };

  const updateArticle = async (id: string, a: Omit<ArticleType, 'id'> & { published?: boolean }) => {
    if (supabase) {
      try {
        const payload: any = {
          title: a.title,
          category: a.category,
          excerpt: a.excerpt,
          content: a.content,
          author: a.author,
          read_time: a.readTime || (a as any).read_time,
          image_url: a.image_url
        };
        const { data, error } = await supabase.from('articles').update(payload).eq('id', id).select().single();
        if (error) throw error;
        setArticles(prev => prev.map(item => (item.id === id ? mapArticles([data])[0] : item)));
      } catch (err) {
        console.error('updateArticle supabase error', err);
      }
    } else {
      setArticles(prev => prev.map(item => item.id === id ? { ...a, id } : item));
    }
  };

  const deleteArticle = async (id: string) => {
    if (supabase) {
      try {
        const { error } = await supabase.from('articles').delete().eq('id', id);
        if (error) throw error;
        setArticles(prev => prev.filter(item => item.id !== id));
      } catch (err) {
        console.error('deleteArticle supabase error', err);
      }
    } else {
      setArticles(prev => prev.filter(item => item.id !== id));
    }
  };

  // Services CRUD
  const addService = async (s: Omit<ServiceType, 'id'>) => {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('services').insert([s]).select().single();
        if (error) throw error;
        setServices(prev => [{ ...(data as any), id: (data as any).id }, ...prev]);
      } catch (err) {
        console.error('addService supabase error', err);
      }
    } else {
      setServices(prev => [{ ...s, id: Date.now().toString() }, ...prev]);
    }
  };

  const updateService = async (id: string, s: Omit<ServiceType, 'id'>) => {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('services').update(s).eq('id', id).select().single();
        if (error) throw error;
        setServices(prev => prev.map(item => item.id === id ? (data as any) : item));
      } catch (err) {
        console.error('updateService supabase error', err);
      }
    } else {
      setServices(prev => prev.map(item => item.id === id ? { ...s, id } : item));
    }
  };

  const deleteService = async (id: string) => {
    if (supabase) {
      try {
        const { error } = await supabase.from('services').delete().eq('id', id);
        if (error) throw error;
        setServices(prev => prev.filter(item => item.id !== id));
      } catch (err) {
        console.error('deleteService supabase error', err);
      }
    } else {
      setServices(prev => prev.filter(item => item.id !== id));
    }
  };

  // Gifts CRUD
  const addGift = async (g: Omit<GiftType, 'id'>) => {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('gifts').insert([g]).select().single();
        if (error) throw error;
        setGifts(prev => [{ ...(data as any), id: (data as any).id }, ...prev]);
      } catch (err) {
        console.error('addGift supabase error', err);
      }
    } else {
      setGifts(prev => [{ ...g, id: Date.now().toString() }, ...prev]);
    }
  };

  const updateGift = async (id: string, g: Omit<GiftType, 'id'>) => {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('gifts').update(g).eq('id', id).select().single();
        if (error) throw error;
        setGifts(prev => prev.map(item => item.id === id ? (data as any) : item));
      } catch (err) {
        console.error('updateGift supabase error', err);
      }
    } else {
      setGifts(prev => prev.map(item => item.id === id ? { ...g, id } : item));
    }
  };

  const deleteGift = async (id: string) => {
    if (supabase) {
      try {
        const { error } = await supabase.from('gifts').delete().eq('id', id);
        if (error) throw error;
        setGifts(prev => prev.filter(item => item.id !== id));
      } catch (err) {
        console.error('deleteGift supabase error', err);
      }
    } else {
      setGifts(prev => prev.filter(item => item.id !== id));
    }
  };

  // Testimonials CRUD
  const addTestimonial = async (t: Omit<TestimonialType, 'id'>) => {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('testimonials').insert([t]).select().single();
        if (error) throw error;
        setTestimonials(prev => [{ ...(data as any), id: (data as any).id }, ...prev]);
      } catch (err) {
        console.error('addTestimonial supabase error', err);
      }
    } else {
      setTestimonials(prev => [{ ...t, id: Date.now().toString() }, ...prev]);
    }
  };

  const updateTestimonial = async (id: string, t: Omit<TestimonialType, 'id'>) => {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('testimonials').update(t).eq('id', id).select().single();
        if (error) throw error;
        setTestimonials(prev => prev.map(item => item.id === id ? (data as any) : item));
      } catch (err) {
        console.error('updateTestimonial supabase error', err);
      }
    } else {
      setTestimonials(prev => prev.map(item => item.id === id ? { ...t, id } : item));
    }
  };

  const deleteTestimonial = async (id: string) => {
    if (supabase) {
      try {
        const { error } = await supabase.from('testimonials').delete().eq('id', id);
        if (error) throw error;
        setTestimonials(prev => prev.filter(item => item.id !== id));
      } catch (err) {
        console.error('deleteTestimonial supabase error', err);
      }
    } else {
      setTestimonials(prev => prev.filter(item => item.id !== id));
    }
  };

  // Members CRUD
  const addMember = async (m: Omit<MemberType, 'id'>) => {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('members').insert([m]).select().single();
        if (error) throw error;
        setMembers(prev => [{ ...(data as any), id: (data as any).id }, ...prev]);
      } catch (err) {
        console.error('addMember supabase error', err);
      }
    } else {
      setMembers(prev => [{ ...m, id: Date.now().toString() }, ...prev]);
    }
  };

  const updateMember = async (id: string, m: Omit<MemberType, 'id'>) => {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('members').update(m).eq('id', id).select().single();
        if (error) throw error;
        setMembers(prev => prev.map(item => item.id === id ? (data as any) : item));
      } catch (err) {
        console.error('updateMember supabase error', err);
      }
    } else {
      setMembers(prev => prev.map(item => item.id === id ? { ...m, id } : item));
    }
  };

  const deleteMember = async (id: string) => {
    if (supabase) {
      try {
        const { error } = await supabase.from('members').delete().eq('id', id);
        if (error) throw error;
        setMembers(prev => prev.filter(item => item.id !== id));
      } catch (err) {
        console.error('deleteMember supabase error', err);
      }
    } else {
      setMembers(prev => prev.filter(item => item.id !== id));
    }
  };

  const refreshData = async () => {
    if (supabase) {
      try {
        const { data: arts } = await supabase.from('articles').select('*').order('published_at', { ascending: false });
        if (arts && arts.length > 0) setArticles(mapArticles(arts));

        const { data: svcs } = await supabase.from('services').select('*').order('created_at', { ascending: false });
        if (svcs && svcs.length > 0) setServices(svcs as ServiceType[]);

        const { data: gfs } = await supabase.from('gifts').select('*').order('created_at', { ascending: false });
        if (gfs && gfs.length > 0) setGifts(gfs as GiftType[]);

        const { data: tms } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false });
        if (tms && tms.length > 0) setTestimonials(tms as TestimonialType[]);

        const { data: mbs } = await supabase.from('members').select('*').order('created_at', { ascending: false });
        if (mbs && mbs.length > 0) setMembers(mbs as MemberType[]);
      } catch (err) {
        console.error('Error refreshing data from Supabase:', err);
      }
    }
  };

  return (
    <AppContext.Provider value={{
      articles, services, gifts, testimonials, members,
      addArticle, updateArticle, deleteArticle,
      addService, updateService, deleteService,
      addGift, updateGift, deleteGift,
      addTestimonial, updateTestimonial, deleteTestimonial,
      addMember, updateMember, deleteMember,
      refreshData
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within an AppProvider');
  return context;
}
