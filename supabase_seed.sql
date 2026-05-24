-- Seed data for ĐẠO project (for Supabase)

-- Articles
INSERT INTO articles (id, title, category, excerpt, content, author, publish_date, read_time, published, published_at, created_at, updated_at) VALUES
  (gen_random_uuid(), 'Vô Vi: Nghệ thuật thuận theo tự nhiên trong đời sống hiện đại', 'Triết Lý Đạo Giáo', 'Hiểu đúng về Vô vi không phải là không làm gì, mà là làm hành động không khiên cưỡng...', $$Trong thế giới hiện đại cuộn xoáy với những áp lực vô hình và chủ nghĩa hiệu năng, ta thường nhầm tưởng "Vô Vi" (无为) nghĩa là buông xuôi...$$, 'Chăm Rốch Thi', NULL, '5 phút đọc', true, now(), now(), now()),
  (gen_random_uuid(), 'Hiểu về Luật Nhân Quả và cách chuyển hóa nghiệp lực', 'Phật Pháp Nhiệm Màu', 'Nhân quả không phải là sự trừng phạt, mà là tấm gương phản chiếu hành động...', $$Luật Nhân Quả (Karma) là một trong những cột trụ nền tảng của Phật giáo, mô tả quy luật vận hành tự nhiên của vụ trụ...$$, 'Thích Trí Đức', NULL, '7 phút đọc', true, now(), now(), now()),
  (gen_random_uuid(), 'Kinh Dịch và sự ứng dụng trong việc ra quyết định', 'Cổ Học Phương Đông', 'Không chỉ là bói toán, Kinh Dịch chứa đựng hệ tư tưởng uyên thâm...', $$Kinh Dịch (易经) - một trong ba tác phẩm vĩ đại nhất của cổ học Phương Đông...$$, 'Chăm Rốch Thi', NULL, '10 phút đọc', true, now(), now(), now()),
  (gen_random_uuid(), '5 phút để quay về nội tại giữa bộn bề công việc', 'Thiền Định', 'Những kỹ thuật thiền chánh niệm đơn giản dành cho người bận rộn...', $$Trong nhịp sống công sở gấp gáp với hằng hà sa số các thông báo qua tin nhắn, email và các cuộc họp nối tiếp...$$, 'Diệu Tâm', NULL, '4 phút đọc', true, now(), now(), now()),
  (gen_random_uuid(), 'Đạo Đức Kinh: Những bài học vượt thời gian', 'Triết Lý Đạo Giáo', 'Phân tích những câu nói nổi bật trong Đạo Đức Kinh...', $$Đạo Đức Kinh tuy có dung lượng rất khiêm tốn chỉ khoảng hơn 5000 chữ cổ nhân, nhưng lại chứa đựng kho tàng trí tuệ sừng sững vượt thời gian...$$, 'Chăm Rốch Thi', NULL, '8 phút đọc', true, now(), now(), now()),
  (gen_random_uuid(), 'Duyên Khởi: Vạn vật nương tựa nhau mà sinh, nương tựa nhau mà diệt', 'Phật Pháp Nhiệm Màu', 'Hiểu được nguyên lý duyên khởi sẽ giúp bạn bớt dính mắc...', $$"Cái này có mặt thì cái kia có mặt, cái này sinh thì cái kia sinh..." - Đây chính là cốt lõi của Kinh Duyên Khởi (Pratītyasamutpāda) huyền diệu...$$, 'Thích Trí Đức', NULL, '6 phút đọc', true, now(), now(), now());

-- Services
INSERT INTO services (id, title, subtitle, hanzi, description, features, icon_name, color, border_color, bg_decor, created_at, updated_at) VALUES
  (gen_random_uuid(), 'Luận Vận Mệnh', 'Giải Mã Bản Đồ Phước Nghiệp', '命 理', $$Dựa trên Tứ Trụ, Bát Tự và triết lý Kinh Dịch, việc luận giải giúp bạn thấu hiểu "vốn liếng" bản mệnh một cách tường minh...$$, ARRAY['Phân tích Bát Tự cá nhân','Lập quẻ Kinh Dịch hỏi sự','Định hướng cát hung đại vận'], 'Compass', 'text-saffron-400', 'border-saffron-400/30', 'bg-saffron-400/5', now(), now()),
  (gen_random_uuid(), 'Tham Vấn Tâm Linh', 'Chữa Lành & Chuyển Hóa', '心 靈', $$Khi đứng trước ngã rẽ hay bế tắc nội tâm, bạn cần một điểm tựa sáng suốt...$$, ARRAY['Tháo gỡ bế tắc tâm lý','Phân tích nhân duyên sự việc','Hỗ trợ phương pháp tĩnh tâm'], 'Flower2', 'text-jade-400', 'border-jade-400/30', 'bg-jade-400/5', now(), now()),
  (gen_random_uuid(), 'Tư Vấn & Hỗ Trợ Nghi Lễ Theo Yêu Cầu', 'Cầu An & Gieo Phước', '儀 礼', $$Một không gian thanh khiết là nền tảng của vượng khí. Tư vấn và hỗ trợ các nghi thức thanh tẩy...$$, ARRAY['Thanh tẩy không gian sống','Thiết lập ban thờ chuẩn mực','Hướng dẫn nghi thức cầu bình an'], 'Flame', 'text-rust-900', 'border-rust-900/30', 'bg-rust-900/5', now(), now());

-- Gifts
INSERT INTO gifts (id, title, description, type, icon_name, color, bg, created_at, updated_at) VALUES
  (gen_random_uuid(), 'Quẻ Dịch Đầu Tuần', 'Xin một quẻ Dịch miễn phí vào mỗi sáng thứ Hai...', 'newcomer', 'Compass', 'text-jade-400', 'bg-jade-400/10', now(), now()),
  (gen_random_uuid(), 'Thông Điệp Vũ Trụ', 'Lá bài Tarot hoặc Oracle mang theo thông điệp ngẫu nhiên...', 'newcomer', 'Moon', 'text-rust-900', 'bg-rust-900/10', now(), now()),
  (gen_random_uuid(), 'Cẩm Nang Tu Tập', 'Bộ tài liệu chắt lọc những câu chú cơ bản...', 'newcomer', 'BookOpen', 'text-saffron-400', 'bg-saffron-400/10', now(), now()),
  (gen_random_uuid(), 'Lá Bùa Bình An', 'Được trì chú riêng theo tên tuổi và tứ trụ của bạn...', 'loyal', 'Sparkles', 'text-saffron-400', 'bg-saffron-400/10', now(), now()),
  (gen_random_uuid(), 'Vòng Trầm / Đá Năng Lượng', 'Những vật phẩm phong thủy được thanh tẩy...', 'loyal', 'Leaf', 'text-saffron-400', 'bg-saffron-400/10', now(), now()),
  (gen_random_uuid(), 'Luận Giải Định Kỳ Miễn Phí', 'Dành cho khách hàng thân thiết: Miễn phí một lần luận giải...', 'loyal', 'Star', 'text-saffron-400', 'bg-saffron-400/10', now(), now());

-- Testimonials
INSERT INTO testimonials (id, name, service, content, created_at, updated_at) VALUES
  (gen_random_uuid(), 'Phật Tử Tại Gia', 'Tham Vấn Tâm Linh', $$"Sự tư vấn rất nhẹ nhàng, từ bi mẫn tuệ. Tôi đã học được cách buông bỏ những muộn phiền..."$$, now(), now()),
  (gen_random_uuid(), 'Khách Hàng Hữu Duyên', 'Luận Vận Mệnh', $$"Phân tích lá số khoa học và kết hợp với triết lý nhân quả, không hề dọa dẫm hay mê tín..."$$, now(), now()),
  (gen_random_uuid(), 'Người Trẻ Đi Tìm Đạo', 'Nghi Lễ Cầu An', $$"Nghi lễ thanh tịnh, ấm cúng. Không gian năng lượng sau phiên làm lễ rất trong trẻo..."$$, now(), now()),
  (gen_random_uuid(), 'Chị Mai Lan', 'Luận Vận Mệnh & Phong Thuỷ', $$"Tôi đã hiểu được thời vận của mình đang ở đâu để từ đó không còn mưu cầu quá sức..."$$, now(), now()),
  (gen_random_uuid(), 'Minh Tuấn', 'Tham Vấn Tâm Linh', $$"Góc nhìn Nhân Quả thực sự đã đánh thức tôi..."$$, now(), now()),
  (gen_random_uuid(), 'Hương Trà', 'Gieo Duyên Đầu Năm', $$"Phần quà vòng gỗ và quẻ dịch đầu năm tuy nhỏ nhưng mang lại cho tôi năng lượng rất bình yên..."$$, now(), now());

-- Members
INSERT INTO members (id, name, role, email, join_date, created_at, updated_at) VALUES
  (gen_random_uuid(), 'Chăm Rốch Thi', 'Người Sáng Lập / Quản Trị Viên', 'rochthi59@gmail.com', NULL, now(), now()),
  (gen_random_uuid(), 'Thích Trí Đức', 'Cố Vấn Tâm Linh', 'triduc.dao@gmail.com', NULL, now(), now()),
  (gen_random_uuid(), 'Diệu Tâm', 'Phó Ban Quản Sự', 'dieutam.dao@gmail.com', NULL, now(), now());

-- End of seed file
