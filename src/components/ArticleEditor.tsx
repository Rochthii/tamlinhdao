import React, { useEffect, useRef, useState } from 'react';
import { fetchCategories, createCategory, createArticleWithCategories, updateArticleWithCategories, uploadImageToSupabase } from '../lib/supabase';
import { 
  User, Calendar, Clock, Sparkles, Eye, Edit3, BookOpen, 
  Bold, Italic, Underline, List, ListOrdered, Link, Image as ImageIcon, X,
  Heading1, Heading2, Heading3, AlignLeft, AlignCenter, AlignRight, AlignJustify, 
  Quote, Minus, Undo, Redo, Table, Eraser, Code, Strikethrough
} from 'lucide-react';

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
  const [author, setAuthor] = useState(initial?.author || '');
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
  
  // Cover Image States
  const [imageUrl, setImageUrl] = useState(initial?.image_url || '');
  const [uploadingCover, setUploadingCover] = useState(false);
  const coverInputRef = useRef<HTMLInputElement | null>(null);
  
  // Editor view tab state
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

  // Word-like rich text editor HTML source mode state
  const [showHtmlSource, setShowHtmlSource] = useState(false);

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
    if (activeTab === 'edit' && editorRef.current && !showHtmlSource) {
      editorRef.current.innerHTML = content || '';
    }
  }, [activeTab, content, showHtmlSource]);

  const toggleHtmlSource = () => {
    if (!showHtmlSource) {
      if (editorRef.current) {
        setContent(editorRef.current.innerHTML);
      }
      setShowHtmlSource(true);
    } else {
      setShowHtmlSource(false);
    }
  };

  const handleHeading = (heading: 'h1' | 'h2' | 'h3' | 'h4' | 'p') => {
    if (heading === 'p') {
      exec('formatBlock', '<p>');
    } else {
      exec('formatBlock', `<${heading}>`);
    }
  };

  const handleAlignment = (align: 'left' | 'center' | 'right' | 'justify') => {
    if (align === 'left') exec('justifyLeft');
    if (align === 'center') exec('justifyCenter');
    if (align === 'right') exec('justifyRight');
    if (align === 'justify') exec('justifyFull');
  };

  const handleColor = (colorHex: string) => {
    exec('foreColor', colorHex);
  };

  const handleInsertTable = () => {
    const size = prompt('Nhập số dòng và số cột (ví dụ: 3x3):', '3x3');
    if (!size) return;
    const [rows, cols] = size.split('x').map(Number);
    if (isNaN(rows) || isNaN(cols) || rows <= 0 || cols <= 0) {
      alert('Định dạng không hợp lệ. Vui lòng nhập số dòng x số cột (ví dụ: 3x3).');
      return;
    }
    
    let tableHtml = '<table style="width:100%; border-collapse:collapse; margin:16px 0; border:1px solid rgba(201,42,35,0.2);">';
    for (let r = 0; r < rows; r++) {
      tableHtml += '<tr>';
      for (let c = 0; c < cols; c++) {
        const isHeader = r === 0;
        const cellTag = isHeader ? 'th' : 'td';
        const cellBg = isHeader ? 'background-color:rgba(201,42,35,0.05); font-weight:bold;' : '';
        tableHtml += `<${cellTag} style="border:1px solid rgba(201,42,35,0.2); padding:10px; text-align:left; ${cellBg}">`;
        tableHtml += isHeader ? `Tiêu đề ${c + 1}` : `Nội dung ô [${r + 1}, ${c + 1}]`;
        tableHtml += `</${cellTag}>`;
      }
      tableHtml += '</tr>';
    }
    tableHtml += '</table><p><br></p>';
    
    if (showHtmlSource) {
      setContent(prev => prev + tableHtml);
    } else {
      exec('insertHTML', tableHtml);
    }
  };

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
      const url = await uploadImageToSupabase(f);
      if (!url) throw new Error('Không thể khởi tạo đường dẫn ảnh công khai');
      
      if (editorRef.current) {
        editorRef.current.innerHTML += `<p class="my-4"><img src="${url}" alt="" class="rounded border border-saffron-400/20 max-w-full h-auto mx-auto shadow-md" /></p>`;
        const html = editorRef.current.innerHTML;
        setContent(html);
        autoEstimateReadTime(html);
      }
    } catch (err: any) {
      console.error(err);
      alert('Tải ảnh lên thất bại: ' + (err.message || 'Vui lòng kiểm tra dung lượng hoặc quyền lưu trữ'));
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
      date: dateStr,
      image_url: imageUrl.trim()
    };

    try {
      let result;
      if (initial && initial.id) {
        result = await updateArticleWithCategories(initial.id, payload, selectedCats);
      } else {
        result = await createArticleWithCategories(payload, selectedCats);
      }
      
      if (!result) {
        throw new Error('Lưu thất bại hoặc không kết nối được cơ sở dữ liệu');
      }
      
      onSaved(result);
    } catch (e: any) {
      console.error('save article error', e);
      alert('Lưu bài thất bại: ' + (e.message || 'Lỗi không xác định'));
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
          {/* Cover Image Upload Area */}
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-saffron-400 font-bold block mb-1.5">Ảnh đại diện bài viết (Hình chữ nhật nằm ngang)</label>
            <div className="flex flex-col sm:flex-row gap-4 items-center bg-dao-900/30 p-4 border border-saffron-400/10 rounded-lg text-white">
              {imageUrl ? (
                <div className="relative w-full sm:w-48 h-28 rounded-lg overflow-hidden border border-saffron-400/20 shrink-0">
                  <img src={imageUrl} alt="Cover preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setImageUrl('')}
                    className="absolute top-1.5 right-1.5 p-1 bg-black/70 hover:bg-red-600 rounded-full text-white transition-colors cursor-pointer"
                    title="Gỡ ảnh"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => coverInputRef.current?.click()}
                  disabled={uploadingCover}
                  className="w-full sm:w-48 h-28 rounded-lg border border-dashed border-saffron-400/25 hover:border-saffron-400/60 bg-dao-900/50 flex flex-col items-center justify-center gap-1.5 text-white/40 hover:text-saffron-300 transition-all cursor-pointer shrink-0"
                >
                  {uploadingCover ? (
                    <span className="text-[10px] animate-pulse">Đang tải lên...</span>
                  ) : (
                    <>
                      <ImageIcon className="w-6 h-6 opacity-60" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-center">Tải ảnh đại diện</span>
                    </>
                  )}
                </button>
              )}
              
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  setUploadingCover(true);
                  try {
                    const url = await uploadImageToSupabase(f);
                    if (url) setImageUrl(url);
                  } catch (err: any) {
                    console.error(err);
                    alert('Tải ảnh đại diện thất bại: ' + (err.message || 'Vui lòng kiểm tra quyền Storage'));
                  } finally {
                    setUploadingCover(false);
                    if (coverInputRef.current) coverInputRef.current.value = '';
                  }
                }}
                className="hidden"
              />

              <div className="flex-1 space-y-2 w-full text-left">
                <p className="text-[10px] text-stone-500 italic">
                  Hình ảnh đại diện sẽ được trưng bày tại Thư viện tư liệu. Hỗ trợ định dạng JPG, PNG, WEBP (Khuyên dùng).
                </p>
                <div className="relative">
                  <input
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Hoặc dán URL ảnh có sẵn..."
                    className="w-full p-2.5 bg-dao-900 border border-saffron-400/20 focus:border-saffron-400 rounded-lg text-xs text-white placeholder-white/20 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs uppercase tracking-widest text-saffron-400 font-bold block mb-1.5">Tiêu đề bài viết *</label>
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Ví dụ: Vô Vi: Nghệ thuật thuận theo tự nhiên..."
                className="w-full p-3 bg-dao-900 border border-saffron-400/20 focus:border-saffron-400/80 rounded-lg text-sm text-white placeholder-white/20 focus:outline-none transition-all focus:shadow-[0_0_15px_rgba(233,163,65,0.1)]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-saffron-400 font-bold block mb-1.5">Danh xưng tác giả</label>
              <input
                value={author}
                onChange={e => setAuthor(e.target.value)}
                placeholder="Chăm Rốch Thi / Thích Trí Đức..."
                className="w-full p-3 bg-dao-900 border border-saffron-400/20 focus:border-saffron-400/80 rounded-lg text-sm text-white placeholder-white/20 focus:outline-none transition-all focus:shadow-[0_0_15px_rgba(233,163,65,0.1)]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-saffron-400 font-bold block mb-1.5">Tóm tắt ngắn (Trưng bày ở trang thư viện)</label>
            <input
              value={excerpt}
              onChange={e => setExcerpt(e.target.value)}
              placeholder="Ghi dòng dẫn dắt tâm ý bài viết ngắn..."
              className="w-full p-3 bg-dao-900 border border-saffron-400/20 focus:border-saffron-400/80 rounded-lg text-sm text-white placeholder-white/20 focus:outline-none transition-all"
            />
          </div>

          {/* WYSIWYG Editor area */}
          <div className="space-y-2 text-left">
            <label className="text-xs uppercase tracking-widest text-saffron-400 font-bold block mb-1.5">Nội dung chi tiết (Soạn thảo văn bản)</label>
            
            {/* Formatting Toolbar */}
            <div className="flex flex-wrap gap-y-2 gap-x-1 p-2.5 bg-dao-900 border border-saffron-400/20 rounded-t-lg items-center shadow-sm select-none">
              
              {/* Nhóm Thao Tác (Undo/Redo) */}
              <div className="flex items-center gap-0.5 bg-white/5 p-1 rounded border border-saffron-400/5">
                <button type="button" title="Hoàn tác (Undo)" onClick={() => exec('undo')} className="p-1.5 hover:bg-saffron-400/10 rounded text-stone-700 hover:text-saffron-400 transition-colors cursor-pointer"><Undo className="w-3.5 h-3.5" /></button>
                <button type="button" title="Làm lại (Redo)" onClick={() => exec('redo')} className="p-1.5 hover:bg-saffron-400/10 rounded text-stone-700 hover:text-saffron-400 transition-colors cursor-pointer"><Redo className="w-3.5 h-3.5" /></button>
              </div>

              <div className="w-px h-6 bg-saffron-400/10 mx-1"></div>

              {/* Nhóm Định Dạng Phông & Tiêu Đề */}
              <div className="flex items-center gap-0.5 bg-white/5 p-1 rounded border border-saffron-400/5">
                <button type="button" title="Tiêu đề lớn (H1)" onClick={() => handleHeading('h1')} className="p-1.5 hover:bg-saffron-400/10 rounded text-stone-700 hover:text-saffron-400 font-serif font-bold text-xs cursor-pointer">H1</button>
                <button type="button" title="Tiêu đề vừa (H2)" onClick={() => handleHeading('h2')} className="p-1.5 hover:bg-saffron-400/10 rounded text-stone-700 hover:text-saffron-400 font-serif font-bold text-xs cursor-pointer">H2</button>
                <button type="button" title="Tiêu đề nhỏ (H3)" onClick={() => handleHeading('h3')} className="p-1.5 hover:bg-saffron-400/10 rounded text-stone-700 hover:text-saffron-400 font-serif font-bold text-xs cursor-pointer">H3</button>
                <button type="button" title="Đoạn văn (P)" onClick={() => handleHeading('p')} className="p-1.5 hover:bg-saffron-400/10 rounded text-stone-700 hover:text-saffron-400 font-serif font-bold text-xs cursor-pointer">P</button>
              </div>

              <div className="w-px h-6 bg-saffron-400/10 mx-1"></div>

              {/* Nhóm Kiểu Chữ (Bold, Italic, Underline, Strikethrough) */}
              <div className="flex items-center gap-0.5 bg-white/5 p-1 rounded border border-saffron-400/5">
                <button type="button" title="Chữ Đậm" onClick={() => exec('bold')} className="p-1.5 hover:bg-saffron-400/10 rounded text-stone-700 hover:text-saffron-400 transition-colors cursor-pointer"><Bold className="w-3.5 h-3.5" /></button>
                <button type="button" title="Chữ Nghiêng" onClick={() => exec('italic')} className="p-1.5 hover:bg-saffron-400/10 rounded text-stone-700 hover:text-saffron-400 transition-colors cursor-pointer"><Italic className="w-3.5 h-3.5" /></button>
                <button type="button" title="Gạch Chân" onClick={() => exec('underline')} className="p-1.5 hover:bg-saffron-400/10 rounded text-stone-700 hover:text-saffron-400 transition-colors cursor-pointer"><Underline className="w-3.5 h-3.5" /></button>
                <button type="button" title="Gạch Ngang" onClick={() => exec('strikeThrough')} className="p-1.5 hover:bg-saffron-400/10 rounded text-stone-700 hover:text-saffron-400 transition-colors cursor-pointer"><Strikethrough className="w-3.5 h-3.5" /></button>
              </div>

              <div className="w-px h-6 bg-saffron-400/10 mx-1"></div>

              {/* Nhóm Căn Lề */}
              <div className="flex items-center gap-0.5 bg-white/5 p-1 rounded border border-saffron-400/5">
                <button type="button" title="Căn Trái" onClick={() => handleAlignment('left')} className="p-1.5 hover:bg-saffron-400/10 rounded text-stone-700 hover:text-saffron-400 transition-colors cursor-pointer"><AlignLeft className="w-3.5 h-3.5" /></button>
                <button type="button" title="Căn Giữa" onClick={() => handleAlignment('center')} className="p-1.5 hover:bg-saffron-400/10 rounded text-stone-700 hover:text-saffron-400 transition-colors cursor-pointer"><AlignCenter className="w-3.5 h-3.5" /></button>
                <button type="button" title="Căn Phải" onClick={() => handleAlignment('right')} className="p-1.5 hover:bg-saffron-400/10 rounded text-stone-700 hover:text-saffron-400 transition-colors cursor-pointer"><AlignRight className="w-3.5 h-3.5" /></button>
                <button type="button" title="Căn Đều (Báo chí)" onClick={() => handleAlignment('justify')} className="p-1.5 hover:bg-saffron-400/10 rounded text-stone-700 hover:text-saffron-400 transition-colors cursor-pointer"><AlignJustify className="w-3.5 h-3.5" /></button>
              </div>

              <div className="w-px h-6 bg-saffron-400/10 mx-1"></div>

              {/* Nhóm Danh Sách & Khối Trích Dẫn */}
              <div className="flex items-center gap-0.5 bg-white/5 p-1 rounded border border-saffron-400/5">
                <button type="button" title="Danh sách số" onClick={() => exec('insertOrderedList')} className="p-1.5 hover:bg-saffron-400/10 rounded text-stone-700 hover:text-saffron-400 transition-colors cursor-pointer"><ListOrdered className="w-3.5 h-3.5" /></button>
                <button type="button" title="Danh sách chấm" onClick={() => exec('insertUnorderedList')} className="p-1.5 hover:bg-saffron-400/10 rounded text-stone-700 hover:text-saffron-400 transition-colors cursor-pointer"><List className="w-3.5 h-3.5" /></button>
                <button type="button" title="Khối Trích Dẫn" onClick={() => exec('formatBlock', '<blockquote>')} className="p-1.5 hover:bg-saffron-400/10 rounded text-stone-700 hover:text-saffron-400 transition-colors cursor-pointer"><Quote className="w-3.5 h-3.5" /></button>
                <button type="button" title="Đường kẻ phân tách (Kẻ ngang)" onClick={() => exec('insertHorizontalRule')} className="p-1.5 hover:bg-saffron-400/10 rounded text-stone-700 hover:text-saffron-400 transition-colors cursor-pointer"><Minus className="w-3.5 h-3.5" /></button>
              </div>

              <div className="w-px h-6 bg-saffron-400/10 mx-1"></div>

              {/* Nhóm Đa Phương Tiện & Bảng Biểu */}
              <div className="flex items-center gap-0.5 bg-white/5 p-1 rounded border border-saffron-400/5">
                <button
                  type="button"
                  title="Chèn liên kết"
                  onClick={() => {
                    const url = prompt('Nhập URL đường dẫn:');
                    if (url) exec('createLink', url);
                  }}
                  className="p-1.5 hover:bg-saffron-400/10 rounded text-stone-700 hover:text-saffron-400 transition-colors cursor-pointer"
                >
                  <Link className="w-3.5 h-3.5" />
                </button>
                
                <button
                  type="button"
                  title="Chèn hình ảnh"
                  onClick={handleFilePick}
                  disabled={uploading}
                  className="p-1.5 hover:bg-saffron-400/10 rounded text-stone-700 hover:text-saffron-400 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                </button>
                
                <button
                  type="button"
                  title="Chèn bảng biểu Word"
                  onClick={handleInsertTable}
                  className="p-1.5 hover:bg-saffron-400/10 rounded text-stone-700 hover:text-saffron-400 transition-colors cursor-pointer"
                >
                  <Table className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="w-px h-6 bg-saffron-400/10 mx-1"></div>

              {/* Nhóm Màu Sắc Trực Quan (ForeColors) */}
              <div className="flex items-center gap-1 bg-white/5 p-1.5 rounded border border-saffron-400/5">
                <span className="text-[9px] text-stone-500 font-bold hidden xl:inline">Màu:</span>
                <button type="button" title="Màu Chu Sa (Cinnabar Red)" onClick={() => handleColor('#c92a23')} className="w-3.5 h-3.5 rounded-full border border-black/10 cursor-pointer hover:scale-110 transition-transform bg-[#c92a23]" />
                <button type="button" title="Màu Vàng Chỉ Dụ (Talisman)" onClick={() => handleColor('#eabb48')} className="w-3.5 h-3.5 rounded-full border border-black/10 cursor-pointer hover:scale-110 transition-transform bg-[#eabb48]" />
                <button type="button" title="Màu Cam Ánh Nến (Candle)" onClick={() => handleColor('#f18d36')} className="w-3.5 h-3.5 rounded-full border border-black/10 cursor-pointer hover:scale-110 transition-transform bg-[#f18d36]" />
                <button type="button" title="Màu Gỗ Đen Sậm" onClick={() => handleColor('#27140e')} className="w-3.5 h-3.5 rounded-full border border-black/10 cursor-pointer hover:scale-110 transition-transform bg-[#27140e]" />
                <button type="button" title="Màu Đồng Cổ" onClick={() => handleColor('#806c44')} className="w-3.5 h-3.5 rounded-full border border-black/10 cursor-pointer hover:scale-110 transition-transform bg-[#806c44]" />
              </div>

              <div className="w-px h-6 bg-saffron-400/10 mx-1"></div>

              {/* Nhóm Tiện Ích (Xóa định dạng & Mã nguồn) */}
              <div className="flex items-center gap-0.5 bg-white/5 p-1 rounded border border-saffron-400/5 ml-auto">
                <button type="button" title="Xóa định dạng" onClick={() => exec('removeFormat')} className="p-1.5 hover:bg-saffron-400/10 rounded text-stone-700 hover:text-saffron-400 transition-colors cursor-pointer"><Eraser className="w-3.5 h-3.5" /></button>
                <button 
                  type="button" 
                  title={showHtmlSource ? "Chuyển sang Soạn thảo trực quan" : "Xem Mã nguồn HTML"} 
                  onClick={toggleHtmlSource} 
                  className={`p-1.5 rounded transition-all cursor-pointer ${showHtmlSource ? 'bg-saffron-400 text-dao-900 font-bold' : 'hover:bg-saffron-400/10 text-stone-700 hover:text-saffron-400'}`}
                >
                  <Code className="w-3.5 h-3.5" />
                </button>
              </div>

              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </div>

            {/* Content editor display */}
            {showHtmlSource ? (
              <textarea
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                  autoEstimateReadTime(e.target.value);
                }}
                className="w-full min-h-[350px] p-4 bg-dao-900/40 border-x border-b border-saffron-400/10 rounded-b-lg text-white placeholder-white/20 focus:outline-none focus:border-saffron-400/30 transition-all font-mono text-xs leading-relaxed overflow-y-auto outline-none resize-y"
                placeholder="Nhập hoặc chỉnh sửa mã nguồn HTML tại đây..."
              />
            ) : (
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
                className="min-h-[350px] p-4 bg-dao-900/40 border-x border-b border-saffron-400/10 rounded-b-lg text-white placeholder-white/20 focus:outline-none focus:border-saffron-400/30 transition-all font-serif leading-relaxed text-justify overflow-y-auto outline-none"
              />
            )}
            
            <p className="text-[10px] text-stone-500 italic mt-1.5">Lưu ý: Bạn hữu có thể dùng **chữ đậm** trong các tiêu đề phụ để tạo hiệu ứng thanh viền dọc tinh xảo.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Chuyên mục tag selector */}
            <div className="space-y-3 text-left">
              <label className="text-xs uppercase tracking-widest text-saffron-400 font-bold block mb-1.5">Nhóm Chuyên Mục Bài Viết</label>
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
                {categories.length === 0 && <span className="text-[10px] text-stone-500 italic">Chưa có chuyên mục nào</span>}
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
            <div className="space-y-3 text-left">
              <label className="text-xs uppercase tracking-widest text-saffron-400 font-bold block mb-1.5">Cài Đặt Xuất Bản</label>
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
                  <label className="text-xs uppercase tracking-widest text-saffron-400/80 font-bold block mb-1">Thời gian đọc ước tính</label>
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
