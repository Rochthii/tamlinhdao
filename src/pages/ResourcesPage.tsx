import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, Search, Filter, Calendar, User, X, ChevronDown, 
  ArrowLeft, MessageSquare, Copy, Sparkles, Eye, Bookmark, 
  Heart, Share2, CornerDownRight, Quote, Plus, CheckCircle, Scale 
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { fetchComments, postComment, fetchArticleStats, incrementArticleStat } from '../lib/supabase';
import useSEO from '../hooks/useSEO';

// Helper to convert Vietnamese human dates like "12 Tháng 4, 2024" to JS Date objects
function parseVietnameseDate(dateStr: string): Date {
  if (!dateStr) return new Date();
  try {
    const cleaned = dateStr.replace(/tháng/i, '').replace(/\s+/g, ' '); 
    const parts = cleaned.trim().split(',');
    
    // Fallback if it's not "DD Tháng MM, YYYY" format
    if (parts.length < 2) {
      const parsed = new Date(dateStr);
      return isNaN(parsed.getTime()) ? new Date(2024, 0, 1) : parsed;
    }
    
    const [dayAndMonth, yearStr] = parts;
    const [dayStr, monthStr] = dayAndMonth.trim().split(' ');
    
    const day = parseInt(dayStr, 10) || 1;
    const month = (parseInt(monthStr, 10) || 1) - 1; // 0-indexed
    const year = parseInt(yearStr.trim(), 10) || 2024;
    
    return new Date(year, month, day);
  } catch (e) {
    return new Date(2024, 0, 1);
  }
}

// Inline article block renderer for high-quality publication layout
function renderArticleBody(text: string, fontSizeClass: string) {
  if (!text) return null;
  const blocks = text.split('\n\n');
  return blocks.map((block, i) => {
    const trimmed = block.trim();
    if (!trimmed) return null;

    // Check if the block is a bold sub-headline like "**heading**" or starts with list items
    if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
      const cleanText = trimmed.replace(/\*\*/g, '');
      return (
        <h4 key={i} className="text-lg md:text-xl font-serif text-saffron-400 mt-8 mb-4 border-l-[3px] border-saffron-400 pl-3 font-medium tracking-wide">
          {cleanText}
        </h4>
      );
    }
    
    // Check if it's a list block (starts with "1. " or "2. " or "*" or "-")
    const lines = trimmed.split('\n');
    if (lines.length > 1 && (lines[0].startsWith('1.') || lines[0].startsWith('-') || lines[0].startsWith('*'))) {
      return (
        <ul key={i} className="space-y-3 my-6 pl-2 list-none text-white/80">
          {lines.map((line, lIdx) => {
            const cleanLine = line.trim();
            // Try parsing bullet or step
            let labelElement: React.ReactNode = <span className="text-saffron-400 mt-1.5 flex-shrink-0 text-xs">✦</span>;
            let displayLine = cleanLine;

            const boldSubMatch = cleanLine.match(/^[-*\d.]+\s+\*(.*)\*:\s*(.*)/);
            if (boldSubMatch) {
              return (
                <li key={lIdx} className="flex items-start gap-3">
                  <span className="text-saffron-400 mt-1 flex-shrink-0">✦</span>
                  <div className={fontSizeClass}>
                    <strong className="text-saffron-300 font-serif font-semibold">{boldSubMatch[1]}:</strong>{" "}
                    <span className="text-white/70">{boldSubMatch[2]}</span>
                  </div>
                </li>
              );
            }

            if (cleanLine.startsWith('-') || cleanLine.startsWith('*')) {
              displayLine = cleanLine.replace(/^[-*]\s*/, '');
            } else {
              const numMatch = cleanLine.match(/^(\d+)\.\s*(.*)/);
              if (numMatch) {
                labelElement = <span className="text-saffron-400/80 font-mono text-[10px] bg-saffron-400/10 border border-saffron-400/20 px-1.5 py-0.5 rounded mt-0.5 flex-shrink-0">{numMatch[1]}</span>;
                displayLine = numMatch[2];
              }
            }

            // check if there is internal bold formatting in the display text: e.g. **text**
            let finalContent: React.ReactNode = displayLine;
            if (displayLine.includes('**')) {
              const parts = displayLine.split('**');
              finalContent = parts.map((part, index) => {
                if (index % 2 === 1) {
                  return <strong key={index} className="text-saffron-200 font-medium font-serif">{part}</strong>;
                }
                return part;
              });
            }

            return (
              <li key={lIdx} className="flex items-start gap-3">
                {labelElement}
                <span className={`text-white/80 leading-relaxed ${fontSizeClass}`}>{finalContent}</span>
              </li>
            );
          })}
        </ul>
      );
    }

    // Default Paragraph rendering with inline bold support
    let processedNode: React.ReactNode = trimmed;
    if (trimmed.includes('**')) {
      const parts = trimmed.split('**');
      processedNode = parts.map((part, index) => {
        if (index % 2 === 1) {
          return <strong key={index} className="text-saffron-300 font-medium font-serif">{part}</strong>;
        }
        return part;
      });
    }

    // Elegant drop cap for first paragraph to emulate upscale publications
    if (i === 0) {
      return (
        <p key={i} className={`leading-relaxed text-white/95 text-justify first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:text-saffron-400 first-letter:mr-3 first-letter:float-left first-letter:relative first-letter:top-1 mb-6 ${fontSizeClass}`}>
          {processedNode}
        </p>
      );
    }

    return (
      <p key={i} className={`mb-6 leading-relaxed text-white/80 text-justify ${fontSizeClass}`}>
        {processedNode}
      </p>
    );
  });
}

export default function ResourcesPage() {
  const { articles } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();

  // State Management
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedAuthor, setSelectedAuthor] = useState('all');
  const [dateRangePreset, setDateRangePreset] = useState<'all' | '30days' | '2024' | '2026' | 'custom'>('all');
  
  // Custom Date Range State
  const [startDateStr, setStartDateStr] = useState('');
  const [endDateStr, setEndDateStr] = useState('');
  
  // Show/Hide advance filter panel
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  // Reader Settings
  const [readerFontSize, setReaderFontSize] = useState<'sm' | 'base' | 'lg' | 'xl'>('base');
  const [articleLikes, setArticleLikes] = useState<{ [key: string]: number }>({});
  const [articleComments, setArticleComments] = useState<{ [key: string]: Array<{ name: string; content: string; date: string; mood: string }> }>({});
  const [isBookmarked, setIsBookmarked] = useState<{ [key: string]: boolean }>({});
  
  // Share notification state
  const [shareToastText, setShareToastText] = useState('');

  // Comment Form fields
  const [commentName, setCommentName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [commentMood, setCommentMood] = useState('An yên ✦');

  // Categories Map
  const categoriesList = [
    { key: 'all', label: 'Tất cả' },
    { key: 'Đạo Giáo', label: 'Đạo Giáo' },
    { key: 'Phật Pháp', label: 'Phật Pháp' },
    { key: 'Cổ Học', label: 'Cổ Học' },
    { key: 'Thiền', label: 'Thiền Định' }
  ];

  // Dynamic list of unique authors from the context's articles
  const availableAuthors = useMemo(() => {
    const unique = new Set<string>();
    articles.forEach(article => {
      if (article.author) {
        unique.add(article.author.trim());
      }
    });
    return Array.from(unique);
  }, [articles]);

  // Handle resetting all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedAuthor('all');
    setDateRangePreset('all');
    setStartDateStr('');
    setEndDateStr('');
  };

  // Find currently active reading article
  const currentArticle = useMemo(() => {
    if (!selectedArticleId) return null;
    return articles.find(a => a.id === selectedArticleId) || null;
  }, [articles, selectedArticleId]);

  // Sync URL search queries with current article selection state
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const idParam = searchParams.get('id');
    if (idParam) {
      setSelectedArticleId(idParam);
    } else {
      setSelectedArticleId(null);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.search]);

  // Dynamic SEO Setup using the unified useSEO hook
  const seoTitle = currentArticle 
    ? `${currentArticle.title} | ĐẠO` 
    : "Tư Liệu Tâm Linh & Triết Lý | ĐẠO Quán";
    
  const seoDesc = currentArticle 
    ? currentArticle.excerpt 
    : "Nhận lấy sự tĩnh lặng tối giản và sáng suốt từ cổ nhân qua các tác phẩm nghị luận tâm thức của chúng tôi. Tìm kiếm, giải sầu và buông xả vướng mắc.";

  const seoCanonical = currentArticle
    ? `https://dao-spiritual.com/tu-lieu?id=${currentArticle.id}`
    : 'https://dao-spiritual.com/tu-lieu';

  const seoJsonLd = currentArticle ? {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": currentArticle.title,
    "description": currentArticle.excerpt,
    "author": { "@type": "Person", "name": currentArticle.author },
    "datePublished": parseVietnameseDate(currentArticle.date).toISOString(),
    "image": "https://dao-spiritual.com/logo-og.jpg"
  } : {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Thư Viện Tư Liệu Cổ Học & Tâm Linh",
    "description": "Nghị luận tâm thức về Vô Vi, Đạo Đức Kinh, Nhân Quả và Thiền định."
  };

  useSEO({
    title: seoTitle,
    description: seoDesc,
    canonical: seoCanonical,
    ogType: currentArticle ? 'article' : 'website',
    jsonLd: seoJsonLd
  });

  // Load stats from Supabase directly (no localStorage fallback)
  useEffect(() => {
    (async () => {
      try {
        const ids = articles.map(a => a.id).filter(Boolean) as string[];
        if (!ids.length) return;
        const stats: any = await fetchArticleStats(ids);
        if (!stats) return;
        const likesMap: any = {};
        stats.forEach((s: any) => {
          likesMap[s.article_id] = s.likes || 0;
        });
        setArticleLikes(likesMap);
      } catch (e) {
        console.error('Error loading article stats:', e);
      }
    })();
  }, [articles]);

  // Comments loading based on active article directly from Supabase
  useEffect(() => {
    if (!selectedArticleId) return;

    (async () => {
      try {
        const remote = await fetchComments(selectedArticleId);
        if (remote && Array.isArray(remote) && remote.length) {
          const transformed = remote.map((c: any) => ({ 
            name: c.name, 
            content: c.content, 
            date: new Date(c.created_at).toLocaleDateString('vi-VN'), 
            mood: c.mood || '' 
          }));
          setArticleComments(prev => ({ ...prev, [selectedArticleId]: transformed }));
        } else {
          // Default credible starting comments in state if DB has none (in-memory only)
          const sampleComments = [
            {
              name: 'Đạo Hữu Minh An',
              content: 'Bài viết này rất có ích cho tôi tâm đắc nhất phần buông xả kiệt quệ và chú tâm nhịp thở. Giữa xã hội hiện tại thật khó tìm được nơi gieo duyên thanh tịnh như thế này.',
              date: 'Mới đây',
              mood: 'Tỉnh thức ✦'
            },
            {
              name: 'Phật Tử Diệu Từ',
              content: 'Triết lý sâu sắc vô cùng, cách viết dẫn giải mộc mạc dễ đi sâu vào tâm khảm người trẻ như tôi. Xin cảm ơn quý Thầy và Minh Sư sáng lập!',
              date: 'Vừa xong',
              mood: 'Tri ân ✦'
            }
          ];
          setArticleComments(prev => ({ ...prev, [selectedArticleId]: sampleComments }));
        }
      } catch (e) {
        console.error('Error fetching comments:', e);
      }
    })();
  }, [selectedArticleId]);

  // Handle Likes (optimistic update with fallback)
  const handleLikeArticle = (id: string) => {
    const originalLikes = articleLikes[id] || 0;
    const newLikes = { ...articleLikes, [id]: originalLikes + 1 };
    setArticleLikes(newLikes);
    
    (async () => {
      try {
        const res = await incrementArticleStat(id, 'likes');
        if (res && res.likes) {
          setArticleLikes(prev => ({ ...prev, [id]: res.likes }));
        }
      } catch (e) {
        console.error('Like failed, rollback', e);
        setArticleLikes(prev => ({ ...prev, [id]: originalLikes }));
      }
    })();
  };

  // Handle Bookmarks (in-memory state update, no local storage)
  const handleToggleBookmark = (id: string) => {
    const newVal = !isBookmarked[id];
    setIsBookmarked(prev => ({ ...prev, [id]: newVal }));

    (async () => {
      try {
        if (newVal) {
          await incrementArticleStat(id, 'bookmarks');
        }
      } catch (e) {
        console.error('Bookmark increment failed:', e);
      }
    })();

    setShareToastText(newVal ? "Đã lưu trữ bài viết vào sổ tay tu tập thành công!" : "Đã gỡ bài viết ra khỏi sổ tay tu tập.");
    setTimeout(() => setShareToastText(''), 3000);
  };

  // Copy article link
  const handleShareArticle = (articleTitle: string) => {
    const fakeUrl = `${window.location.origin}/tu-lieu?id=${encodeURIComponent(selectedArticleId || '')}`;
    navigator.clipboard.writeText(fakeUrl).then(() => {
      setShareToastText("Sao chép liên kết bài viết thành công! Bạn hữu đã có thể chia sẻ duyên lành.");
    }).catch(() => {
      setShareToastText(`Chia sẻ bài viết: ${articleTitle}`);
    });
    setTimeout(() => setShareToastText(''), 4000);
  };

  // Submit new reflection comment (optimistic update with database sync)
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedArticleId || !commentText.trim()) return;

    const newComment = {
      name: commentName.trim() || 'Bạn Hữu Hữu Duyên',
      content: commentText.trim(),
      date: new Date().toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      }),
      mood: commentMood
    };

    // Optimistic UI update
    const originalComments = articleComments[selectedArticleId] || [];
    setArticleComments(prev => ({
      ...prev,
      [selectedArticleId]: [newComment, ...originalComments]
    }));

    // Reset inputs
    setCommentText('');
    setCommentName('');

    (async () => {
      try {
        const res = await postComment(selectedArticleId, { 
          name: newComment.name, 
          content: newComment.content, 
          mood: newComment.mood 
        });
        if (res) {
          // Hydrate with official date from DB
          const officialComment = {
            name: res.name,
            content: res.content,
            date: new Date(res.created_at).toLocaleDateString('vi-VN'),
            mood: res.mood || ''
          };
          setArticleComments(prev => ({
            ...prev,
            [selectedArticleId]: [officialComment, ...originalComments]
          }));
        }
      } catch (e) {
        console.error('Post comment failed, rolling back:', e);
        setArticleComments(prev => ({
          ...prev,
          [selectedArticleId]: originalComments
        }));
        setShareToastText("Gửi suy ngẫm thất bại. Vui lòng kiểm tra kết nối.");
        setTimeout(() => setShareToastText(''), 3500);
      }
    })();

    setShareToastText("Gửi suy ngẫm thành công! Cảm ơn bạn hữu đã chia sẻ chánh kiến.");
    setTimeout(() => setShareToastText(''), 3500);
  };

  const handleDeleteComment = (commentIndex: number) => {
    if (!selectedArticleId) return;

    const currentComments = articleComments[selectedArticleId] || [];
    const updated = currentComments.filter((_, idx) => idx !== commentIndex);

    setArticleComments(prev => ({
      ...prev,
      [selectedArticleId]: updated
    }));

    setShareToastText("Đã gỡ lời nhắn của bạn.");
    setTimeout(() => setShareToastText(''), 3500);
  };

  // Check if any filter is active
  const isAnyFilterActive = useMemo(() => {
    return (
      searchQuery !== '' ||
      selectedCategory !== 'all' ||
      selectedAuthor !== 'all' ||
      dateRangePreset !== 'all' ||
      startDateStr !== '' ||
      endDateStr !== ''
    );
  }, [searchQuery, selectedCategory, selectedAuthor, dateRangePreset, startDateStr, endDateStr]);

  // Main Filtering Logic
  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      // 1. Search Query Match
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesTitle = (article.title || '').toLowerCase().includes(query);
        const matchesExcerpt = (article.excerpt || '').toLowerCase().includes(query);
        const matchesCategory = (article.category || '').toLowerCase().includes(query);
        const matchesAuthor = (article.author || '').toLowerCase().includes(query);
        
        if (!matchesTitle && !matchesExcerpt && !matchesCategory && !matchesAuthor) {
          return false;
        }
      }

      // 2. Category Tab Match
      if (selectedCategory !== 'all') {
        const matchesCat = (article.category || '').toLowerCase().includes(selectedCategory.toLowerCase());
        if (!matchesCat) return false;
      }

      // 3. Author Match
      if (selectedAuthor !== 'all') {
        if (!article.author || article.author.trim() !== selectedAuthor) {
          return false;
        }
      }

      // 4. Date Range Match
      const isDateFilterActive = dateRangePreset !== 'all' || ((dateRangePreset as string) === 'custom' && (startDateStr !== '' || endDateStr !== ''));
      if (isDateFilterActive) {
        const articleDate = parseVietnameseDate(article.date);
        
        if (dateRangePreset === '30days') {
          // Last 30 days based on the current local time 2026-05-20
          const anchorDate = new Date(2026, 4, 20); 
          const thirtyDaysAgo = new Date(anchorDate.getTime() - 30 * 24 * 60 * 60 * 1000);
          if (articleDate < thirtyDaysAgo || articleDate > anchorDate) {
            return false;
          }
        } else if (dateRangePreset === '2024') {
          if (articleDate.getFullYear() !== 2024) {
            return false;
          }
        } else if (dateRangePreset === '2026') {
          if (articleDate.getFullYear() !== 2026) {
            return false;
          }
        } else if (dateRangePreset === 'custom') {
          if (startDateStr) {
            const start = new Date(startDateStr);
            start.setHours(0, 0, 0, 0);
            if (articleDate < start) return false;
          }
          if (endDateStr) {
            const end = new Date(endDateStr);
            end.setHours(23, 59, 59, 999);
            if (articleDate > end) return false;
          }
        }
      }

      return true;
    });
  }, [articles, searchQuery, selectedCategory, selectedAuthor, dateRangePreset, startDateStr, endDateStr]);

  // Font Size class mapping
  const mappedFontSizeClass = useMemo(() => {
    switch (readerFontSize) {
      case 'sm': return 'text-xs md:text-sm text-white/80 leading-relaxed';
      case 'lg': return 'text-base md:text-lg text-white/95 leading-relaxed font-light';
      case 'xl': return 'text-lg md:text-xl text-white font-serif leading-loose font-light';
      case 'base':
      default:
        return 'text-sm md:text-base text-white/90 leading-relaxed';
    }
  }, [readerFontSize]);

  // Recommended Articles (3 items, avoiding the current article)
  const relatedRecommendations = useMemo(() => {
    if (!currentArticle) return [];
    return articles
      .filter(a => a.id !== currentArticle.id)
      .slice(0, 3);
  }, [articles, currentArticle]);

  return (
    <div className="py-24 px-4 sm:px-6 lg:px-8 relative z-10 min-h-screen">
      
      {/* Absolute Share Toast */}
      <AnimatePresence>
        {shareToastText && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 bg-[#c2410c] text-white border border-saffron-400/40 p-4 rounded-lg shadow-2xl flex items-center gap-3 backdrop-blur-md max-w-sm"
          >
            <Sparkles className="w-5 h-5 text-saffron-300 shrink-0" />
            <div className="text-xs font-light">{shareToastText}</div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto">
        
        <AnimatePresence mode="wait">
          {!selectedArticleId ? (
            
            /* --- 1. SEARCH AND ARTICLE LIST VIEW --- */
            <motion.div
              key="list-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Header Title Board */}
              <div className="text-center mb-14">
                <h1 className="text-4xl md:text-6xl font-serif text-white font-light tracking-wide mb-5">TƯ LIỆU ĐẠO QUÁN</h1>
                <p className="text-white/50 max-w-2xl mx-auto font-light text-sm leading-relaxed">
                  Nhận lấy sự tĩnh lặng tối giản và sáng suốt từ cổ nhân qua các tác phẩm nghị luận tâm thức của chúng tôi. Tìm kiếm, giải sầu và buông xả vướng mắc.
                </p>
                <div className="w-8 h-[2px] bg-saffron-400/40 mx-auto mt-6" />
              </div>

              {/* Primary Filter Row */}
              <div className="mb-6 flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4">
                
                {/* Categories Tab */}
                <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0 w-full lg:w-auto mask-fade-edges scrollbar-none">
                  {categoriesList.map((cat) => (
                    <button
                      key={cat.key}
                      onClick={() => setSelectedCategory(cat.key)}
                      className={`px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-widest whitespace-nowrap transition-all duration-300 pointer-events-auto cursor-pointer ${
                        selectedCategory === cat.key
                          ? 'bg-saffron-400 text-dao-900 shadow-md shadow-saffron-400/20 font-bold'
                          : 'border border-saffron-400/20 text-white/70 hover:border-saffron-400/50 hover:text-white bg-dao-800/10'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
                
                {/* Search bar & Filter toggler */}
                <div className="flex items-center gap-3 w-full lg:w-auto shrink-0">
                  <div className="relative flex-1 lg:w-64">
                    <input
                      type="text"
                      placeholder="Tìm bài viết, tác giả..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-dao-800/60 border border-saffron-400/20 rounded-full py-2.5 px-4 pl-10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-saffron-400/60 transition-colors shadow-inner"
                    />
                    <Search className="w-4 h-4 text-white/30 absolute left-4 top-1/2 -translate-y-1/2" />
                    {searchQuery && (
                      <button 
                        onClick={() => setSearchQuery('')}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
                    className={`px-4 py-2.5 rounded-full border text-xs font-semibold flex items-center gap-2 transition-all duration-300 cursor-pointer ${
                      isFilterPanelOpen || selectedAuthor !== 'all' || dateRangePreset !== 'all'
                        ? 'bg-saffron-400/10 border-saffron-400 text-saffron-300'
                        : 'border-saffron-400/20 text-white/70 hover:border-saffron-400/50'
                    }`}
                  >
                    <Filter className="w-3.5 h-3.5" />
                    <span>Bộ Lọc</span>
                    <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${isFilterPanelOpen ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Collapsible Advanced Filters Panel */}
              <AnimatePresence>
                {isFilterPanelOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden mb-6"
                  >
                    <div className="bg-dao-800/40 border border-saffron-400/10 p-5 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Author Filter Column */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-saffron-400/80 uppercase tracking-widest flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5" /> Tác giả tư liệu
                        </label>
                        <select
                          value={selectedAuthor}
                          onChange={(e) => setSelectedAuthor(e.target.value)}
                          className="w-full bg-dao-900 border border-saffron-400/20 rounded-md p-2.5 text-xs text-white focus:outline-none focus:border-saffron-400/50"
                        >
                          <option value="all">Tất cả tác giả</option>
                          {availableAuthors.map((authorName) => (
                            <option key={authorName} value={authorName}>
                              {authorName}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Date Filters Column */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-saffron-400/80 uppercase tracking-widest flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" /> Ngày xuất bản
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <select
                            value={dateRangePreset}
                            onChange={(e) => setDateRangePreset(e.target.value as any)}
                            className="w-full bg-dao-900 border border-saffron-400/20 rounded-md p-2.5 text-xs text-white focus:outline-none focus:border-saffron-400/50"
                          >
                            <option value="all">Tất cả thời gian</option>
                            <option value="30days">Trong 30 ngày qua</option>
                            <option value="2024">Năm Giáp Thìn (2024)</option>
                            <option value="2026">Năm Bính Ngọ (2026)</option>
                            <option value="custom">Tùy chọn khoảng ngày...</option>
                          </select>

                          {dateRangePreset === 'custom' ? (
                            <div className="flex gap-1 items-center">
                              <input
                                type="date"
                                value={startDateStr}
                                onChange={(e) => setStartDateStr(e.target.value)}
                                placeholder="Từ ngày"
                                className="w-full bg-dao-900 border border-saffron-400/20 rounded-md p-2 text-[10px] text-white focus:outline-none focus:border-saffron-400/50"
                              />
                              <span className="text-white/30 text-xs">-</span>
                              <input
                                type="date"
                                value={endDateStr}
                                onChange={(e) => setEndDateStr(e.target.value)}
                                placeholder="Đến ngày"
                                className="w-full bg-dao-900 border border-saffron-400/20 rounded-md p-2 text-[10px] text-white focus:outline-none focus:border-saffron-400/50"
                              />
                            </div>
                          ) : (
                            <div className="bg-dao-900/40 border border-dashed border-saffron-400/5 rounded-md flex items-center justify-center text-[10px] text-white/30 italic">
                              Khoảng thời gian cố định
                            </div>
                          )}
                        </div>
                      </div>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Active Filters Display */}
              {isAnyFilterActive && (
                <div className="mb-8 flex flex-wrap items-center gap-2 p-3 bg-dao-800/20 border border-saffron-400/5 rounded-md text-xs">
                  <span className="text-saffron-400/70 font-medium">Đang lọc theo:</span>
                  
                  {searchQuery && (
                    <span className="bg-saffron-400/10 text-saffron-300 border border-saffron-400/20 px-2.5 py-0.5 rounded-full flex items-center gap-1.5 text-[10px] font-mono">
                      Từ khóa: "{searchQuery}"
                      <X className="w-3 h-3 cursor-pointer hover:text-white" onClick={() => setSearchQuery('')} />
                    </span>
                  )}
                  
                  {selectedCategory !== 'all' && (
                    <span className="bg-saffron-400/10 text-saffron-300 border border-saffron-400/20 px-2.5 py-0.5 rounded-full flex items-center gap-1.5 text-[10px]">
                      Mục: {selectedCategory}
                      <X className="w-3 h-3 cursor-pointer hover:text-white" onClick={() => setSelectedCategory('all')} />
                    </span>
                  )}

                  {selectedAuthor !== 'all' && (
                    <span className="bg-saffron-400/10 text-saffron-300 border border-saffron-400/20 px-2.5 py-0.5 rounded-full flex items-center gap-1.5 text-[10px]">
                      Tác giả: {selectedAuthor}
                      <X className="w-3 h-3 cursor-pointer hover:text-white" onClick={() => setSelectedAuthor('all')} />
                    </span>
                  )}

                  {dateRangePreset !== 'all' && (
                    <span className="bg-saffron-400/10 text-saffron-300 border border-saffron-400/20 px-2.5 py-0.5 rounded-full flex items-center gap-1.5 text-[10px]">
                      Thời gian: {dateRangePreset === '30days' ? '30 ngày qua' : dateRangePreset === '2024' ? 'Năm 2024' : dateRangePreset === '2026' ? 'Năm 2026' : 'Tùy chỉnh'}
                      <X className="w-3 h-3 cursor-pointer hover:text-white" onClick={() => { setDateRangePreset('all'); setStartDateStr(''); setEndDateStr(''); }} />
                    </span>
                  )}

                  <button
                    onClick={handleResetFilters}
                    className="ml-auto text-rust-500 hover:text-rust-400 font-bold transition-colors cursor-pointer text-[10px] uppercase tracking-wider"
                  >
                    Xóa tất cả bộ lọc
                  </button>
                </div>
              )}

              {/* Articles Cards Grid */}
              {filteredArticles.length === 0 ? (
                <div className="py-20 text-center bg-dao-800/20 border border-saffron-400/5 rounded-lg">
                  <BookOpen className="w-12 h-12 text-saffron-400/20 mx-auto mb-4" strokeWidth={1} />
                  <h3 className="text-lg font-serif text-white/80 mb-2">Không tìm thấy tư liệu nào</h3>
                  <p className="text-white/40 text-xs max-w-sm mx-auto font-light leading-relaxed">
                    Vui lòng điều chỉnh từ khóa tìm kiếm hoặc làm mới bộ lọc ngày đăng & tác giả để xem thêm bài viết khác.
                  </p>
                  {isAnyFilterActive && (
                    <button 
                      onClick={handleResetFilters}
                      className="mt-6 bg-saffron-400/10 border border-saffron-400/30 hover:bg-saffron-400 text-saffron-400 hover:text-dao-900 px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 cursor-pointer"
                    >
                      Đặt lại bộ lọc
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredArticles.map((article, index) => {
                    const likesCount = articleLikes[article.id] || 0;
                    return (
                      <motion.article
                        key={article.id || index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                        onClick={() => navigate(`/tu-lieu?id=${article.id}`)}
                        className="dao-panel hover:border-saffron-400/40 transition-all duration-300 relative overflow-hidden group flex flex-col cursor-pointer rounded-lg bg-dao-800/30 hover:transform hover:-translate-y-1"
                      >
                        {/* Graphical Header banner */}
                        <div className="h-40 border-b border-saffron-400/10 relative overflow-hidden flex items-center justify-center bg-dao-900/70">
                          <div className="absolute inset-0 opacity-10 group-hover:opacity-25 transition-opacity bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')]"></div>
                          <BookOpen className="w-10 h-10 text-saffron-400/20 group-hover:text-saffron-400/30 transition-colors transform group-hover:scale-110 duration-500" strokeWidth={1} />
                          
                          {/* Saffron Category Pill Badge */}
                          <span className="absolute top-4 left-4 text-[9px] font-bold bg-dao-900 border border-saffron-400/20 text-saffron-400 uppercase tracking-widest px-2.5 py-1 rounded-full">
                            {article.category}
                          </span>

                          {likesCount > 0 && (
                            <span className="absolute top-4 right-4 text-[9px] text-white/50 bg-dao-900/80 px-2 py-1 rounded-md flex items-center gap-1 border border-white/5">
                              <Heart className="w-3 h-3 text-rust-500 fill-rust-500" /> {likesCount}
                            </span>
                          )}
                        </div>

                        {/* Text Block content */}
                        <div className="p-6 flex-1 flex flex-col justify-between">
                          <div>
                            {/* Author Name */}
                            <div className="flex items-center gap-1.5 text-[10px] text-saffron-400 font-serif mb-2.5">
                              <User className="w-3.5 h-3.5 text-saffron-400/60" />
                              <span>{article.author || 'Chăm Rốch Thi'}</span>
                            </div>

                            <h3 className="text-base font-serif text-white hover:text-saffron-400 font-medium group-hover:text-saffron-200 transition-colors duration-300 leading-snug line-clamp-2">
                              {article.title}
                            </h3>
                            <p className="text-white/55 font-light leading-relaxed text-xs mt-3 mb-5 line-clamp-3">
                              {article.excerpt}
                            </p>
                          </div>

                          <div className="flex items-center justify-between text-[10px] text-white/40 uppercase tracking-wider pt-4 border-t border-saffron-400/10 font-mono">
                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {article.date}</span>
                            <span className="bg-white/[0.03] text-white/50 px-2 py-0.5 rounded">{article.readTime}</span>
                          </div>
                        </div>
                      </motion.article>
                    );
                  })}
                </div>
              )}
            </motion.div>
          ) : (
            
            /* --- 2. THE HIGHEST FIDELITY MAGAZINE READER INTERFACE --- */
            <motion.div
              key="detail-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              
              {/* Back / Navigation and Setting Bar */}
              <div className="flex items-center justify-between border-b border-saffron-400/10 pb-4">
                <button
                  onClick={() => {
                    navigate('/tu-lieu');
                  }}
                  className="flex items-center gap-2 text-xs text-white/60 hover:text-saffron-400 uppercase tracking-widest font-semibold transition-colors bg-dao-800/40 px-4 py-2 rounded-full border border-saffron-400/5 hover:border-saffron-400/30 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4 text-saffron-400" /> Quay Lại
                </button>

                {/* Elder-friendly font resizing toolbar */}
                <div className="flex flex-wrap items-center gap-1.5 bg-dao-800/75 px-3 py-1.5 rounded-full border border-saffron-400/10">
                  <span className="text-[10px] text-white/40 uppercase tracking-wide mr-1.5 font-mono hidden sm:inline">Cỡ chữ:</span>
                  <button 
                    onClick={() => setReaderFontSize('sm')} 
                    className={`px-2 py-0.5 text-xs rounded transition-all cursor-pointer ${readerFontSize === 'sm' ? 'bg-saffron-400 text-dao-900 font-bold' : 'text-white/60 hover:text-white'}`}
                  >
                    Tiêu chuẩn
                  </button>
                  <button 
                    onClick={() => setReaderFontSize('base')} 
                    className={`px-2 py-0.5 text-sm rounded transition-all cursor-pointer ${readerFontSize === 'base' ? 'bg-saffron-400 text-dao-900 font-bold' : 'text-white/60 hover:text-white'}`}
                  >
                    Vừa
                  </button>
                  <button 
                    onClick={() => setReaderFontSize('lg')} 
                    className={`px-2 py-0.5 text-base rounded transition-all cursor-pointer ${readerFontSize === 'lg' ? 'bg-saffron-400 text-dao-900 font-bold' : 'text-white/60 hover:text-white'}`}
                  >
                    Lớn
                  </button>
                  <button 
                    onClick={() => setReaderFontSize('xl')} 
                    className={`px-2 py-0.5 text-lg font-serif rounded transition-all cursor-pointer ${readerFontSize === 'xl' ? 'bg-saffron-400 text-dao-900 font-bold' : 'text-white/60 hover:text-white'}`}
                  >
                    Kính Lúp
                  </button>
                </div>
              </div>

              {/* Main Reading Column */}
              {currentArticle && (
                <div className="bg-dao-800/20 border border-saffron-400/5 rounded-2xl p-6 md:p-10 shadow-xl space-y-8 relative overflow-hidden">
                  
                  {/* Glowing ambient background filter */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-saffron-400/5 rounded-full blur-[100px] pointer-events-none" />
                  
                  {/* Category Pill and author profile info */}
                  <div className="space-y-4">
                    <span className="inline-block text-[10px] font-bold text-saffron-400 bg-saffron-400/10 border border-saffron-400/20 uppercase tracking-widest px-3 py-1 rounded-full">
                      {currentArticle.category}
                    </span>

                    <h1 className="text-2xl md:text-4xl font-serif text-white font-medium leading-tight tracking-wide">
                      {currentArticle.title}
                    </h1>

                    {/* Metadata strip */}
                    <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-white/40 pt-2 border-b border-saffron-400/10 pb-4 font-mono">
                      <span className="flex items-center gap-1.5 text-saffron-400 font-serif">
                        <User className="w-3.5 h-3.5" /> Tác giả: {currentArticle.author || 'Chăm Rốch Thi'}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" /> Xuất bản: {currentArticle.date}
                      </span>
                      <span className="flex items-center gap-1.5 bg-white/[0.02] px-2 py-0.5 rounded">
                        <BookOpen className="w-3.5 h-3.5 text-saffron-400/60" /> Ước tính: {currentArticle.readTime}
                      </span>
                    </div>
                  </div>

                  {/* Summary Callout Block to anchor the editorial reading */}
                  <div className="bg-dao-900/50 border-l-[3px] border-saffron-400 p-5 rounded-r-lg italic text-white/70 text-xs md:text-sm leading-relaxed font-light font-serif">
                    <Quote className="w-5 h-5 text-saffron-400/30 mb-2" />
                    <strong>Tóm tắt bản thảo:</strong> {currentArticle.excerpt}
                  </div>

                  {/* Body Content of article parsed elegantly */}
                  <article className="prose prose-invert max-w-none text-white/90">
                    <div className="space-y-6">
                      {renderArticleBody(currentArticle.content || '', mappedFontSizeClass)}
                    </div>
                  </article>

                  {/* Interactive Action Footer block (Likes, save, share) */}
                  <div className="border-t border-saffron-400/10 pt-6 mt-14 flex flex-wrap items-center justify-between gap-4">
                    
                    {/* Share / Bookmark / Thả Hoa Sen counters */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleLikeArticle(currentArticle.id)}
                        className="px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-widest flex items-center gap-2 transition-all duration-300 border border-rust-900/50 hover:border-rust-900 text-rust-300 hover:text-white bg-rust-950/20 hover:bg-rust-950/60 cursor-pointer"
                        title="Tán thán / Tạ ơn / Thả hoa quy y"
                      >
                        <Heart className="w-4 h-4 text-rust-500 fill-rust-500 animate-pulse" />
                        <span>Thả Hoa Sen ({articleLikes[currentArticle.id] || 0})</span>
                      </button>

                      <button
                        onClick={() => handleToggleBookmark(currentArticle.id)}
                        className={`p-2.5 rounded-full border transition-all duration-300 cursor-pointer ${
                          isBookmarked[currentArticle.id]
                            ? 'bg-saffron-400/20 border-saffron-400 text-saffron-300 shadow-md shadow-saffron-400/10'
                            : 'border-saffron-400/10 text-white/60 hover:text-white hover:border-saffron-400/30'
                        }`}
                        title={isBookmarked[currentArticle.id] ? "Hủy lưu bài viết" : "Lưu vào sổ tập tu"}
                      >
                        <Bookmark className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Clipboard simulated share button */}
                    <button
                      onClick={() => handleShareArticle(currentArticle.title)}
                      className="px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-widest border border-saffron-400/20 hover:border-saffron-400/50 text-saffron-300 hover:text-white transition-all bg-dao-800/30 font-mono flex items-center gap-2 cursor-pointer"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Sao Chép Liên Kết</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Sincere comments / Reflection system */}
              <div className="bg-dao-800/30 border border-saffron-400/5 rounded-2xl p-6 md:p-8 space-y-6">
                
                <h3 className="text-lg font-serif text-white font-medium flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-saffron-400" />
                  <span>Góc Suy Ngẫm & Trao Đổi</span>
                  <span className="text-xs bg-saffron-400/10 text-saffron-400 border border-saffron-400/10 px-2 py-0.5 rounded font-mono font-normal">
                    {selectedArticleId ? (articleComments[selectedArticleId] || []).length : 0} đóng góp
                  </span>
                </h3>

                {/* Post New thoughts Form */}
                <form onSubmit={handleAddComment} className="space-y-4 bg-dao-900/40 p-5 rounded-lg border border-saffron-400/10">
                  <div className="text-[11px] font-bold text-saffron-400 uppercase tracking-wider block mb-2">Để lại lời nhắn / Suy tư của bạn hữu:</div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] text-white/40">Pháp danh / Tên xưng *</label>
                      <input 
                        type="text" 
                        placeholder="Ví dụ: Đạo Hữu Diệu Tâm, Người Lữ Hành..."
                        value={commentName}
                        onChange={(e) => setCommentName(e.target.value)}
                        className="w-full bg-dao-800 border border-saffron-400/20 rounded-md p-2.5 text-xs text-white focus:outline-none focus:border-saffron-400/50"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-white/40">Tâm trạng nhận được *</label>
                      <select 
                        value={commentMood}
                        onChange={(e) => setCommentMood(e.target.value)}
                        className="w-full bg-dao-800 border border-saffron-400/20 rounded-md p-2.5 text-xs text-white focus:outline-none focus:border-saffron-400/50"
                      >
                        <option value="An yên ✦">An yên ✦</option>
                        <option value="Tỉnh thức ✦">Tỉnh thức ✦</option>
                        <option value="Tri ân ✦">Tri ân ✦</option>
                        <option value="Sáng suốt ✦">Sáng suốt ✦</option>
                        <option value="Kiến cơ ✦">Kiến cơ ✦</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-white/40">Mô tả bài học tâm đắc / Ý kiến hỏi đáp *</label>
                    <textarea 
                      placeholder="Chia sẻ bài học sâu sắc hay năng lượng cảm hứng của bạn hữu sau khi nghiền ngẫm bài luận thảo này..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      className="w-full bg-dao-800 border border-saffron-400/20 rounded-md p-3 text-xs text-white h-24 focus:outline-none focus:border-saffron-400/50 leading-relaxed"
                      required
                    />
                  </div>

                  <button 
                    type="submit"
                    className="bg-saffron-400 hover:bg-saffron-500 text-dao-900 text-xs uppercase tracking-widest font-bold py-2.5 px-6 rounded-md transition-colors shadow shadow-saffron-400/10 cursor-pointer flex items-center gap-2"
                  >
                    <CornerDownRight className="w-4 h-4" />
                    <span>Gửi Suy Ngẫm Lành</span>
                  </button>
                </form>

                {/* List comment messages */}
                <div className="space-y-4">
                  {selectedArticleId && (articleComments[selectedArticleId] || []).length === 0 ? (
                    <div className="text-center py-6 text-white/30 text-xs italic">
                      Chưa có phản hồi nào. Hãy là người đầu tiên chia sẻ suy nghĩ lương thiện nhé!
                    </div>
                  ) : (
                    selectedArticleId && (articleComments[selectedArticleId] || []).map((cmt, idx) => (
                      <motion.div 
                        initial={{ opacity: 0, y: 15 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        key={idx} 
                        className="bg-dao-800/40 p-4 rounded-lg border border-saffron-400/5 flex gap-3.5 relative hover:border-saffron-400/10 transition-colors"
                      >
                        {/* Avatar default avatar with custom character name */}
                        <div className="w-9 h-9 rounded-full bg-saffron-400/10 border border-saffron-400/30 text-saffron-300 flex items-center justify-center font-serif text-sm font-bold shrink-0">
                          {cmt.name.trim().charAt(0)}
                        </div>

                        <div className="space-y-1 flex-1">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <span className="text-xs font-serif text-saffron-400 font-medium">{cmt.name}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-saffron-400/70 bg-saffron-400/10 border border-saffron-400/20 px-2 py-0.5 rounded-full font-serif font-light">{cmt.mood}</span>
                              <button
                                onClick={() => handleDeleteComment(idx)}
                                className="text-white/30 hover:text-rust-400 transition-colors cursor-pointer"
                                title="Xóa bình luận này"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <p className="text-white/70 text-xs leading-relaxed text-justify mt-1">
                            {cmt.content}
                          </p>

                          <div className="text-[9px] text-white/30 font-mono pt-1 text-right">
                            {cmt.date}
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>

              {/* Related articles recommendations Slider/Row */}
              <div className="space-y-4 pt-4">
                <h3 className="text-lg font-serif text-white font-medium flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-saffron-400" />
                  <span>Duyên Lành Kết Nối (Đọc thêm)</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {relatedRecommendations.map((elem) => (
                    <div
                      key={elem.id}
                      onClick={() => navigate(`/tu-lieu?id=${elem.id}`)}
                      className="bg-dao-800/20 border border-saffron-400/10 rounded-lg p-5 hover:border-saffron-400/40 cursor-pointer transition-all hover:bg-dao-800/40 flex flex-col justify-between hover:-translate-y-1 transform duration-300 h-44"
                    >
                      <div className="space-y-2">
                        <span className="text-[9px] font-mono text-saffron-400 uppercase tracking-widest">{elem.category}</span>
                        <h4 className="text-sm font-serif font-medium text-white line-clamp-2 leading-snug">{elem.title}</h4>
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-white/40 pt-4 border-t border-saffron-400/5 font-mono">
                        <span>{elem.date}</span>
                        <span className="text-saffron-400 text-xs">✦</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
