import React, { useEffect, useRef, useState } from 'react';
import { fetchCategories, createCategory } from '../lib/supabase';

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
  const [readTime, setReadTime] = useState(initial?.read_time || '');
  const [content, setContent] = useState(initial?.content || '');
  const [published, setPublished] = useState(initial?.published ?? true);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCats, setSelectedCats] = useState<string[]>(initial?.category_ids || []);
  const [newCatName, setNewCatName] = useState('');
  const [saving, setSaving] = useState(false);
  const editorRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const cats: any = await fetchCategories();
        if (cats) setCategories(cats);
      } catch (e) {}
    })();
  }, []);

  useEffect(() => {
    if (editorRef.current) editorRef.current.innerHTML = content || '';
  }, [editorRef]);

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
    if (editorRef.current) setContent(editorRef.current.innerHTML);
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
      // insert image into editor
      if (editorRef.current) {
        editorRef.current.innerHTML += `<p><img src="${url}" alt="" /></p>`;
        setContent(editorRef.current.innerHTML);
      }
    } catch (err) {
      console.error(err);
      alert('Upload ảnh thất bại');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const html = editorRef.current ? editorRef.current.innerHTML : content;
    const payload: any = { title, excerpt, content: html, author, read_time: readTime, published, published_at: published ? new Date() : null };
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
        throw new Error(err?.error || 'Save failed');
      }
      const result = await resp.json();
      onSaved(result);
    } catch (e) {
      console.error('save article', e);
      alert('Lưu bài thất bại. Kiểm tra console.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Tiêu đề bài viết" className="flex-1 p-3 bg-dao-900 border border-saffron-400/10 rounded" />
        <input value={author} onChange={e => setAuthor(e.target.value)} placeholder="Tác giả" className="w-56 p-3 bg-dao-900 border border-saffron-400/10 rounded" />
      </div>

      <input value={excerpt} onChange={e => setExcerpt(e.target.value)} placeholder="Tóm tắt ngắn" className="w-full p-3 bg-dao-900 border border-saffron-400/10 rounded" />

      <div>
        <div className="mb-2 font-semibold text-sm">Nội dung</div>
        <div className="mb-2 flex gap-2">
          <button onClick={() => exec('bold')} className="px-2 py-1 border rounded">B</button>
          <button onClick={() => exec('italic')} className="px-2 py-1 border rounded">I</button>
          <button onClick={() => exec('underline')} className="px-2 py-1 border rounded">U</button>
          <button onClick={() => exec('insertOrderedList')} className="px-2 py-1 border rounded">1.</button>
          <button onClick={() => exec('insertUnorderedList')} className="px-2 py-1 border rounded">•</button>
          <button onClick={() => {
            const url = prompt('Nhập URL');
            if (url) exec('createLink', url);
          }} className="px-2 py-1 border rounded">Link</button>
          <button onClick={handleFilePick} className="px-2 py-1 border rounded">Chèn ảnh</button>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        </div>
        <div ref={editorRef as any} contentEditable className="min-h-[240px] p-4 bg-white/5 text-white rounded" onInput={() => { if (editorRef.current) setContent(editorRef.current.innerHTML); }} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-white/60">Tags / Nhóm</label>
          <div className="flex gap-2 flex-wrap">
            {categories.map(c => (
              <button key={c.id} onClick={() => handleToggleCat(c.id)} className={`px-3 py-1 rounded-full ${selectedCats.includes(c.id) ? 'bg-saffron-400 text-dao-900' : 'bg-dao-800 text-white/70 border border-saffron-400/10'}`}>
                {c.name}
              </button>
            ))}
          </div>
          <div className="mt-2 flex gap-2">
            <input value={newCatName} onChange={e => setNewCatName(e.target.value)} placeholder="Tạo nhóm mới" className="flex-1 p-2 bg-dao-900 border border-saffron-400/10 rounded" />
            <button onClick={handleAddCategory} className="px-3 py-2 bg-saffron-400 text-dao-900 rounded">Tạo</button>
          </div>
        </div>

        <div>
          <label className="text-xs text-white/60">Cài đặt</label>
          <div className="mt-2 space-y-2">
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={published} onChange={e => setPublished(e.target.checked)} />
              <span>Đăng công khai</span>
            </div>
            <div className="flex items-center gap-2">
              <input value={readTime} onChange={e => setReadTime(e.target.value)} placeholder="Thời gian đọc" className="p-2 bg-dao-900 border border-saffron-400/10 rounded" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={handleSave} disabled={saving} className="px-6 py-2 bg-saffron-400 text-dao-900 rounded font-bold">{saving ? 'Đang lưu...' : 'Lưu & Đăng'}</button>
        <button onClick={onCancel} className="px-4 py-2 border rounded">Hủy</button>
      </div>
    </div>
  );
}
