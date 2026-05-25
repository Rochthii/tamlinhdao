import React, { useEffect, useRef, useState } from 'react';
import { fetchCategories, createCategory } from '../lib/supabase';
import { User, Calendar, Clock, Sparkles, Eye, Edit3, BookOpen, Bold, Italic, Underline, List, ListOrdered, Link, Image as ImageIcon } from 'lucide-react';

export default function ArticleEditor({
  initial,
  onCancel,
  onSaved
}: {
  initial?: any,
  onCancel: () => void,
  onSaved: (result: any) => void
}) {
  const [title, setTitle] = useState(initial?.title || '');
  const [excerpt, setExcerpt] = useState(initial?.excerpt || '');
  const [author, setAuthor] = useState(initial?.author || 'Chăm Rốch Thi');
  const [readTime, setReadTime] = useState(initial?.read_time || '5 phút đọc');
  const [content, setContent] = useState(initial?.content || '');
  const [published, setPublished] = useState(initial?.published ?? true);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCats, setSelectedCats] = useState<string[]>(initial?.category_ids || []);
  const [newCatName, setNewCatName] = useState('');
  const [saving, setSaving] = useState(false);
  const editorRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  
  // Editor view tab state
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

  useEffect(() => {
    (async () => {
      try {
        const cats: any = await fetchCategories();
        if (cats) setCategories(cats);
      } catch (e) {
        console.error('Lỗi tải danh mục:', e);
      }
    })();
  }, []);

  useEffect(() => {
    if (activeTab === 'edit' && editorRef.current) {
      editorRef.current.innerHTML = content || '';
    }
  }, [activeTab, content]);

  const handleAddCategory = async () => {
    if (!newCatName.trim()) return;
    try {
      const c: any = await createCategory(newCatName.trim());
      setCategories(prev => [c, ...prev]);
      setSelectedCats(prev => [c.id, ...prev]);
      setNewCatName('');
    } catch (e) {
      console.error('create category', e);
    }
  };

  const handleToggleCat = (id: string) => {
    setSelectedCats(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  };

  const exec = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      setContent(html);
      autoEstimateReadTime(html);
    }
  };

  const handleFilePick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setUploading(true);
    try {
      const reader = new FileReader();
      const dataUrl: string = await new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error('Read error'));
        reader.readAsDataURL(f);
      });
      const match = dataUrl.match(/^data:(.+);base64,(.*)$/);
      if (!match) throw new Error('Unsupported file');
      const contentType = match[1];
      const base64 = match[2];
      const resp = await fetch('/api/upload-image', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: f.name, base64, contentType })
      });
      if (!resp.ok) throw new Error('Upload failed');
      const { url } = await resp.json();
      
      if (editorRef.current) {
        editorRef.current.innerHTML += `<p className="my-4"><img src="${url}" alt="" className="rounded border border-saffron-400/20 max-w-full h-auto mx-auto shadow-md" /></p>`;
        const html = editorRef.current.innerHTML;
        setContent(html);
        autoEstimateReadTime(html);
      }
    } catch (err) {
      console.error(err);
      alert('Upload ảnh thất bại');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Word count Vietnamese estimated read time auto-generator
  const autoEstimateReadTime = (htmlContent: string) => {
    if (!htmlContent) return;
    const text = htmlContent.replace(/<[^>]*>/g, ' '); // Strip HTML tags
    const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
    const wordsPerMinute = 200; // Vietnamese reading speed average
    const minutes = Math.max(1, Math.round(wordCount / wordsPerMinute));
    setReadTime(`${minutes} phút đọc`);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      alert('Vui lòng điền tiêu đề bài viết.');
      return;
    }
    if (!content.trim() && (!editorRef.current || !editorRef.current.innerHTML.trim())) {
      alert('Vui lòng viết nội dung bài viết.');
      return;
    }

    setSaving(true);
    const html = editorRef.current ? editorRef.current.innerHTML : content;
    
    // Format Vietnamese date string for new articles
    const dateStr = initial?.date || new Date().toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).replace('tháng', 'Tháng');

    const payload: any = {
      title: title.trim(),
      excerpt: excerpt.trim(),
      content: html,
      author: author.trim() || 'CRT',
      read_time: readTime,
      published,
      published_at: published ? new Date() : null,
      date: dateStr
    };

    try {
      let resp;
      if (initial && initial.id) {
        resp = await fetch('/api/admin-articles', {
          method: 'PATCH',
          credentials: 'same-origin',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: initial.id, article: payload, categoryIds: selectedCats })
        });
      } else {
        resp = await fetch('/api/admin-articles', {
          method: 'POST',
          credentials: 'same-origin',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ article: payload, categoryIds: selectedCats })
        });
      }
      
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err?.error || 'Lưu thất bại');
      }
      
      const result = await resp.json();
      onSaved(result);
    } catch (e: any) {
      console.error('save article error', e);
      alert('Lưu bài thất bại: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 text-white text-left font-sans">
      
      {/* Editor/Preview Switch Tab Controls */}
      <div className="flex border-b border-saffron-400/10 pb-4 justify-between items-center">
        <div className="flex gap-2 bg-dao-900 p-1 border border-saffron-400/10 rounded-lg">
          <button
            type="button"
            onClick={() => setActiveTab('edit')}
            className={`px-4 py-2 text-xs font-bold rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'edit'
                ? 'bg-saffron-400 text-dao-900 shadow-md'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            Soạn Thảo
          </button>
          <button
            type="button"
            onClick={() => {
              if (editorRef.current) setContent(editorRef.current.innerHTML);
              setActiveTab('preview');
            }}
            className={`px-4 py-2 text-xs font-bold rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'preview'
                ? 'bg-saffron-400 text-dao-900 shadow-md'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Eye className="w-4 h-4" />
            Xem Trước Trực Tiếp (Live Preview)
          </button>
        </div>

        <div className="text-[10px] uppercase tracking-widest text-saffron-400/60 font-semibold italic flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>Tĩnh tâm kiến tác</span>
        </div>
      </div>

      {activeTab === 'edit' ? (
        /* --- SOẠN THẢO (EDIT MODE) --- */
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-[#fff1be]/60 font-semibold">Tiêu đề bài viết *</label>
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Ví dụ: Vô Vi: Nghệ thuật thuận theo tự nhiên..."
                className="w-full p-3 bg-dao-900 border border-saffron-400/20 focus:border-saffron-400/80 rounded-lg text-sm text-white placeholder-white/20 focus:outline-none transition-all focus:shadow-[0_0_15px_rgba(233,163,65,0.1)]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-[#fff1be]/60 font-semibold">Danh xưng tác giả</label>
              <input
                value={author}
                onChange={e => setAuthor(e.target.value)}
                placeholder="Chăm Rốch Thi / Thích Trí Đức..."
                className="w-full p-3 bg-dao-900 border border-saffron-400/20 focus:border-saffron-400/80 rounded-lg text-sm text-white placeholder-white/20 focus:outline-none transition-all focus:shadow-[0_0_15px_rgba(233,163,65,0.1)]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-[#fff1be]/60 font-semibold">Tóm tắt ngắn (Trưng bày ở trang thư viện)</label>
            <input
              value={excerpt}
              onChange={e => setExcerpt(e.target.value)}
              placeholder="Ghi dòng dẫn dắt tâm ý bài viết ngắn..."
              className="w-full p-3 bg-dao-900 border border-saffron-400/20 focus:border-saffron-400/80 rounded-lg text-sm text-white placeholder-white/20 focus:outline-none transition-all"
            />
          </div>

          {/* WYSIWYG Editor area */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-[#fff1be]/60 font-semibold">Nội dung chi tiết (Soạn thảo văn bản)</label>
            
            {/* Formatting Toolbar */}
            <div className="flex flex-wrap gap-1 p-2 bg-dao-900 border border-saffron-400/10 rounded-t-lg">
              <button type="button" title="Chữ Đậm" onClick={() => exec('bold')} className="p-2 hover:bg-white/5 rounded text-white/80 hover:text-white transition-colors cursor-pointer"><Bold className="w-4 h-4" /></button>
              <button type="button" title="Chữ Nghiêng" onClick={() => exec('italic')} className="p-2 hover:bg-white/5 rounded text-white/80 hover:text-white transition-colors cursor-pointer"><Italic className="w-4 h-4" /></button>
              <button type="button" title="Gạch Chân" onClick={() => exec('underline')} className="p-2 hover:bg-white/5 rounded text-white/80 hover:text-white transition-colors cursor-pointer"><Underline className="w-4 h-4" /></button>
              <div className="w-px h-6 bg-white/10 mx-2 self-center"></div>
              <button type="button" title="Danh sách số" onClick={() => exec('insertOrderedList')} className="p-2 hover:bg-white/5 rounded text-white/80 hover:text-white transition-colors cursor-pointer"><ListOrdered className="w-4 h-4" /></button>
              <button type="button" title="Danh sách chấm" onClick={() => exec('insertUnorderedList')} className="p-2 hover:bg-white/5 rounded text-white/80 hover:text-white transition-colors cursor-pointer"><List className="w-4 h-4" /></button>
              <div className="w-px h-6 bg-white/10 mx-2 self-center"></div>
              <button
                type="button"
                title="Chèn liên kết"
                onClick={() => {
                  const url = prompt('Nhập URL đường dẫn:');
                  if (url) exec('createLink', url);
                }}
                className="p-2 hover:bg-white/5 rounded text-white/80 hover:text-white transition-colors cursor-pointer"
              >
                <Link className="w-4 h-4" />
              </button>
              
              <button
                type="button"
                title="Chèn hình ảnh"
                onClick={handleFilePick}
                disabled={uploading}
                className="p-2 hover:bg-white/5 rounded text-white/80 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
              >
                <ImageIcon className="w-4 h-4" />
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              {uploading && <span className="text-[10px] text-saffron-400 self-center ml-2 animate-pulse">Đang tải ảnh lên...</span>}
            </div>

            {/* Content editable editor div */}
            <div
              ref={editorRef as any}
              contentEditable
              data-placeholder="Nhập nội dung bài viết tâm linh của bạn ở đây..."
              onInput={() => {
                if (editorRef.current) {
                  const html = editorRef.current.innerHTML;
                  setContent(html);
                  autoEstimateReadTime(html);
                }
              }}
              className="min-h-[300px] p-4 bg-dao-900/40 border-x border-b border-saffron-400/10 rounded-b-lg text-white/90 placeholder-white/20 focus:outline-none focus:border-saffron-400/30 transition-all font-serif leading-relaxed text-justify overflow-y-auto outline-none"
            />
            <p className="text-[10px] text-white/30 italic">Lưu ý: Bạn hữu có thể dùng **chữ đậm** trong các tiêu đề phụ để tạo hiệu ứng thanh viền dọc tinh xảo.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Chuyên mục tag selector */}
            <div className="space-y-3">
              <label className="text-[10px] uppercase tracking-widest text-[#fff1be]/60 font-semibold block">Nhóm Chuyên Mục Bài Viết</label>
              <div className="flex gap-1.5 flex-wrap p-3 bg-dao-900/30 border border-saffron-400/10 rounded-lg min-h-[50px]">
                {categories.map(c => {
                  const selected = selectedCats.includes(c.id);
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => handleToggleCat(c.id)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                        selected
                          ? 'bg-saffron-400 text-dao-900 shadow-md font-bold'
                          : 'bg-dao-900 border border-saffron-400/10 text-white/50 hover:text-white hover:border-saffron-400/30'
                      }`}
                    >
                      {c.name}
                    </button>
                  );
                })}
                {categories.length === 0 && <span className="text-[10px] text-white/30 italic">Chưa có chuyên mục nào</span>}
              </div>
              <div className="flex gap-2">
                <input
                  value={newCatName}
                  onChange={e => setNewCatName(e.target.value)}
                  placeholder="Tạo nhóm mới..."
                  className="flex-1 p-2 bg-dao-900 border border-saffron-400/20 focus:border-saffron-400/50 rounded-lg text-xs text-white placeholder-white/30 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddCategory}
                  className="px-4 py-2 bg-saffron-400 hover:bg-saffron-500 text-dao-900 rounded-lg text-xs font-bold transition-all cursor-pointer"
                >
                  Tạo
                </button>
              </div>
            </div>

            {/* Right: Settings and publishing */}
            <div className="space-y-3">
              <label className="text-[10px] uppercase tracking-widest text-[#fff1be]/60 font-semibold block">Cài Đặt Xuất Bản</label>
              <div className="p-4 bg-dao-900/30 border border-saffron-400/10 rounded-lg space-y-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="published-check"
                    checked={published}
                    onChange={e => setPublished(e.target.checked)}
                    className="w-4 h-4 accent-saffron-400 rounded cursor-pointer"
                  />
                  <label htmlFor="published-check" className="text-xs text-white/80 font-bold select-none cursor-pointer">
                    Đăng công khai trực tiếp lên Thư Viện
                  </label>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] text-white/50 uppercase tracking-widest block">Thời gian đọc ước tính</label>
                  <div className="relative">
                    <input
                      value={readTime}
                      onChange={e => setReadTime(e.target.value)}
                      placeholder="Ví dụ: 5 phút đọc..."
                      className="w-full p-2.5 bg-dao-900 border border-saffron-400/20 focus:border-saffron-400/50 rounded-lg text-xs text-white focus:outline-none pl-8"
                    />
                    <Clock className="w-4 h-4 text-saffron-400/60 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* --- XEM TRƯỚC TRỰC TIẾP (PREVIEW MODE) --- */
        <div className="dao-panel p-8 md:p-12 border border-saffron-400/20 bg-dao-800/40 rounded-sm font-sans relative text-left">
          {/* Subtle decoration elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(circle_at_100%_0%,rgba(214,176,82,0.06)_0%,transparent_70%)] pointer-events-none"></div>

          <div className="mb-6 pb-6 border-b border-saffron-400/10">
            <span className="text-[9px] font-bold bg-dao-900 border border-saffron-400/20 text-saffron-400 uppercase tracking-widest px-2.5 py-1 rounded-full">
              Xem trước bài viết
            </span>
            
            <h1 className="text-3xl md:text-4xl font-serif text-white font-light tracking-wide mt-4 mb-4 leading-tight">
              {title || 'Chưa có tiêu đề bài viết'}
            </h1>
            
            <div className="flex items-center gap-6 text-xs text-white/40 font-light">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-saffron-400/70" /> 
                {author || 'Chưa rõ tác giả'}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-saffron-400/70" /> 
                Hôm nay
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-saffron-400/70" /> 
                {readTime || '5 phút đọc'}
              </span>
            </div>
          </div>

          {excerpt && (
            <p className="text-white/60 font-serif italic text-base leading-relaxed border-l-2 border-saffron-400/30 pl-4 mb-8 text-justify">
              {excerpt}
            </p>
          )}

          {/* Styled content simulator */}
          <div className="prose prose-invert max-w-none text-white/80 leading-relaxed text-justify font-serif">
            {content ? (
              <div 
                className="article-preview-content"
                dangerouslySetInnerHTML={{ 
                  __html: content 
                }} 
              />
            ) : (
              <p className="italic text-white/30 text-center py-10">Vui lòng viết nội dung ở mục Soạn Thảo để hiển thị bản xem trước.</p>
            )}
          </div>
        </div>
      )}

      {/* Button Action Rows */}
      <div className="flex gap-3 pt-6 border-t border-saffron-400/10">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 bg-saffron-400 hover:bg-saffron-500 disabled:opacity-50 disabled:cursor-not-allowed text-dao-900 rounded-lg text-xs uppercase tracking-widest font-bold transition-all shadow-[0_0_20px_rgba(214,176,82,0.15)] flex items-center gap-2 cursor-pointer"
        >
          {saving ? (
            <>
              <svg className="animate-spin h-3.5 w-3.5 text-dao-900" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Đang lưu...</span>
            </>
          ) : (
            <span>Lưu & Đăng Bài</span>
          )}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-3 border border-white/10 hover:border-white/30 text-white/70 hover:text-white rounded-lg text-xs uppercase tracking-widest font-bold transition-all cursor-pointer"
        >
          Hủy bỏ
        </button>
      </div>

    </div>
  );
}
