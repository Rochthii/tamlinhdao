-- Supabase schema and seed
-- Run in Supabase SQL editor (or via psql) to create tables and sample seed data

-- Extension for gen_random_uuid (if using pgcrypto)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Articles
CREATE TABLE IF NOT EXISTS articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text,
  excerpt text,
  content text,
  author text,
  read_time text,
  published boolean DEFAULT true,
  published_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz
);

-- Services
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subtitle text,
  hanzi text,
  description text,
  features text[],
  icon_name text,
  color text,
  border_color text,
  bg_decor text,
  created_at timestamptz DEFAULT now()
);

-- Gifts
CREATE TABLE IF NOT EXISTS gifts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text,
  icon_name text,
  title text,
  description text,
  color text,
  bg text,
  created_at timestamptz DEFAULT now()
);

-- Testimonials
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  service text,
  content text,
  approved boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Members
CREATE TABLE IF NOT EXISTS members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  role text,
  email text,
  join_date text,
  created_at timestamptz DEFAULT now()
);

-- Bookings (used by Admin realtime / list)
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  email text,
  phone text,
  message text,
  created_at timestamptz DEFAULT now()
);

-- Sample seed data (lightweight)
INSERT INTO articles (title, category, excerpt, content, author, read_time)
VALUES
('Vô Vi: Nghệ thuật thuận theo tự nhiên', 'Triết Lý Đạo Giáo', 'Hiểu đúng về Vô vi', 'Nội dung mẫu cho bài viết Vô Vi...', 'Chăm Rốch Thi', '5 phút đọc'),
('Hiểu về Luật Nhân Quả', 'Phật Pháp Nhiệm Màu', 'Nhân quả như tấm gương phản chiếu', 'Nội dung mẫu Luật Nhân Quả...', 'Thích Trí Đức', '7 phút đọc');

INSERT INTO services (title, subtitle, hanzi, description, features, icon_name, color, border_color, bg_decor)
VALUES
('Luận Vận Mệnh','Giải Mã Bản Đồ Phước Nghiệp','命 理','Mô tả dịch vụ...', ARRAY['Phân tích Bát Tự','Lập quẻ Kinh Dịch'], 'Compass','text-saffron-400','border-saffron-400/30','bg-saffron-400/5'),
('Tham Vấn Tâm Linh','Chữa Lành & Chuyển Hóa','心 靈','Mô tả tham vấn...', ARRAY['Tháo gỡ bế tắc','Hỗ trợ phương pháp tĩnh tâm'],'Flower2','text-jade-400','border-jade-400/30','bg-jade-400/5');

INSERT INTO gifts (type, icon_name, title, description, color, bg)
VALUES
('newcomer','Compass','Quẻ Dịch Đầu Tuần','Quẻ Dịch miễn phí mỗi sáng thứ Hai','text-jade-400','bg-jade-400/10'),
('loyal','Star','Luận Giải Định Kỳ Miễn Phí','Miễn phí một lần luận giải tổng quan','text-saffron-400','bg-saffron-400/10');

INSERT INTO testimonials (name, service, content)
VALUES
('Phật Tử Tại Gia','Tham Vấn Tâm Linh','Sự tư vấn rất nhẹ nhàng, từ bi mẫn tuệ.'),
('Khách Hàng Hữu Duyên','Luận Vận Mệnh','Phân tích lá số khoa học và kết hợp với triết lý nhân quả.');

INSERT INTO members (name, role, email, join_date)
VALUES
('Chăm Rốch Thi','Người Sáng Lập / Quản Trị Viên','rochthi59@gmail.com','15 Tháng 3, 2024'),
('Thích Trí Đức','Cố Vấn Tâm Linh','triduc.dao@gmail.com','20 Tháng 3, 2024');

-- Example booking
INSERT INTO bookings (name, email, phone, message)
VALUES ('Người Liên Hệ','contact@example.com','0123456789','Xin tư vấn về luận mệnh.');

-- Notes:
-- After creating tables, consider enabling Row Level Security (RLS) and creating policies that allow
-- anonymous SELECT for public read (e.g., articles) while restricting INSERT/DELETE to server-side service role or authenticated users.
-- Example policy (in SQL editor):
-- ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow anon select" ON articles FOR SELECT USING (true);
-- CREATE POLICY "Allow service_role" ON articles FOR ALL USING (auth.role() = 'service_role');

COMMIT;
-- Supabase schema for ĐẠO project
-- Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Trigger function to update updated_at
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Articles table
CREATE TABLE IF NOT EXISTS articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text,
  excerpt text,
  content text,
  author text,
  publish_date date,
  read_time text,
  published boolean DEFAULT false,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);

-- Services table
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subtitle text,
  hanzi text,
  description text,
  features text[],
  icon_name text,
  color text,
  border_color text,
  bg_decor text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Gifts table
CREATE TABLE IF NOT EXISTS gifts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  type text,
  icon_name text,
  color text,
  bg text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  service text,
  content text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Members table
CREATE TABLE IF NOT EXISTS members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text,
  email text,
  join_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Bookings (contact form submissions)
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  dob text,
  phone text NOT NULL,
  message text,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at);

-- Attach triggers to set updated_at on tables that have it
CREATE TRIGGER trg_set_updated_at_articles
BEFORE UPDATE ON articles
FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

CREATE TRIGGER trg_set_updated_at_services
BEFORE UPDATE ON services
FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

CREATE TRIGGER trg_set_updated_at_gifts
BEFORE UPDATE ON gifts
FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

CREATE TRIGGER trg_set_updated_at_testimonials
BEFORE UPDATE ON testimonials
FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

CREATE TRIGGER trg_set_updated_at_members
BEFORE UPDATE ON members
FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

-- Simple seed helpers (examples)
-- INSERT INTO articles (title, category, excerpt, content, author, publish_date, read_time, published, published_at)
-- VALUES ('Tiêu đề mẫu', 'Triết Lý Đạo Giáo', 'Tóm tắt...', 'Nội dung...', 'Chăm Rốch Thi', now()::date, '5 phút đọc', true, now());

-- End of schema

-- Comments table for article reflections
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  name text NOT NULL,
  content text NOT NULL,
  mood text,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_comments_article_id ON comments(article_id);

-- Aggregate stats for articles (likes/bookmarks/views)
CREATE TABLE IF NOT EXISTS article_stats (
  article_id uuid PRIMARY KEY REFERENCES articles(id) ON DELETE CASCADE,
  likes integer DEFAULT 0,
  bookmarks integer DEFAULT 0,
  views integer DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_article_stats_updated_at ON article_stats(updated_at);

-- Trigger to update updated_at for article_stats
CREATE TRIGGER trg_set_updated_at_article_stats
BEFORE UPDATE ON article_stats
FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

-- Example seed for article_stats and comments (adjust article_id to match real ids in your DB)
-- INSERT INTO article_stats (article_id, likes, bookmarks, views) VALUES ('00000000-0000-0000-0000-000000000000', 5, 2, 120);
-- INSERT INTO comments (article_id, name, content, mood) VALUES ('00000000-0000-0000-0000-000000000000', 'Bạn Hữu', 'Bài viết rất hay', 'Tri ân');

-- Sample categories seed
INSERT INTO categories (name, slug, description) VALUES
('Triết Lý Đạo Giáo','triet-ly-dao-giao','Tư liệu liên quan đến Đạo Giáo và triết lý Vô Vi'),
('Phật Pháp','phat-phap','Tài liệu về Phật Pháp, Nhân Quả và tu tập'),
('Thiền','thien-dinh','Bài viết hướng dẫn thiền và thực hành tĩnh tâm'),
('Cổ Học','co-hoc','Văn hoá và học thuật cổ phương Đông');

-- Recommended Row-Level Security (RLS) policies
-- NOTE: run these in Supabase SQL editor. Adjust roles/conditions per your auth model.
-- Enable RLS on tables you want to protect (e.g., articles, comments, bookings)
-- Example: allow anonymous/public SELECT on published content, but restrict INSERT/UPDATE/DELETE to server-side service_role or authenticated admins.

-- Articles: public can read published articles
-- ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow anon select published" ON articles
--   FOR SELECT USING (published = true);

-- Allow service_role full access (service_role bypasses RLS when using the service key)

-- Comments: allow SELECT for public, INSERT only via authenticated users or via server endpoint
-- ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow anon select comments" ON comments FOR SELECT USING (true);
-- CREATE POLICY "Allow authenticated insert" ON comments FOR INSERT USING (auth.role() = 'authenticated');

-- Article_stats: allow public SELECT, but updates should be done server-side
-- ALTER TABLE article_stats ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow anon select stats" ON article_stats FOR SELECT USING (true);

-- Bookings (contact form): do NOT expose public INSERT unless you want anonymous submissions; prefer server endpoint
-- ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow service_role insert" ON bookings FOR ALL USING (auth.role() = 'service_role');

-- If you use Supabase Auth for admin users, create a role mapping or use custom claims to allow admin operations from the client for authorized users.

-- After applying RLS, verify behavior and use server-side service role for writes that must be trusted (e.g., publish, delete, stats increment).

-- Categories table (groups / sections)
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  slug text UNIQUE,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name);

-- Many-to-many association between articles and categories (an article can have multiple categories/tags)
CREATE TABLE IF NOT EXISTS article_categories (
  article_id uuid NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  category_id uuid NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (article_id, category_id)
);
CREATE INDEX IF NOT EXISTS idx_article_categories_article ON article_categories(article_id);
CREATE INDEX IF NOT EXISTS idx_article_categories_category ON article_categories(category_id);
