import React, { useEffect, useState } from 'react';
import { fetchCategories, createCategory, supabase } from '../lib/supabase';

export default function CategoriesManager() {
  const [cats, setCats] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [newName, setNewName] = useState('');
  const [editing, setEditing] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const data: any = await fetchCategories();
      setCats(data || []);
    } catch (e) {
      console.error('load categories', e);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const create = async () => {
    if (!newName.trim()) return;
    try {
      const res = await createCategory(newName.trim());
      if (!res) throw new Error('Create failed');
      setNewName('');
      await load();
    } catch (e: any) { 
      console.error(e); 
      alert('Tạo thất bại: ' + (e.message || 'Lỗi không xác định')); 
    }
  };

  const saveEdit = async (id: string) => {
    if (!editName.trim()) return;
    if (!supabase) {
      alert('Lỗi: Chưa kết nối cơ sở dữ liệu Supabase');
      return;
    }
    try {
      const { error } = await supabase.from('categories').update({ 
        name: editName.trim(), 
        slug: editName.trim().toLowerCase().replace(/\s+/g, '-') 
      }).eq('id', id);
      if (error) throw error;
      setEditing(null); setEditName(''); await load();
    } catch (e: any) { 
      console.error(e); 
      alert('Cập nhật thất bại: ' + (e.message || 'Lỗi không xác định')); 
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Xóa nhóm sẽ gỡ liên kết khỏi bài viết. Tiếp tục?')) return;
    if (!supabase) {
      alert('Lỗi: Chưa kết nối cơ sở dữ liệu Supabase');
      return;
    }
    try {
      // Xóa liên kết khóa ngoại trước
      const { error: relError } = await supabase.from('article_categories').delete().eq('category_id', id);
      if (relError) throw relError;

      // Xóa chuyên mục sau
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) throw error;
      
      await load();
    } catch (e: any) { 
      console.error(e); 
      alert('Xóa thất bại: ' + (e.message || 'Lỗi không xác định')); 
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Tên nhóm mới" className="p-2 bg-dao-900 border border-saffron-400/10 rounded flex-1" />
        <button onClick={create} className="px-3 py-2 bg-saffron-400 text-dao-900 rounded">Tạo</button>
      </div>

      <div className="bg-dao-800/30 p-4 rounded">
        {loading ? <div>Đang tải...</div> : (
          <ul className="space-y-2">
            {cats.map(c => (
              <li key={c.id} className="flex items-center justify-between">
                {editing === c.id ? (
                  <div className="flex gap-2 items-center">
                    <input value={editName} onChange={e => setEditName(e.target.value)} className="p-2 bg-dao-900 rounded" />
                    <button onClick={() => saveEdit(c.id)} className="px-2 py-1 bg-saffron-400 text-dao-900 rounded">Lưu</button>
                    <button onClick={() => setEditing(null)} className="px-2 py-1 border rounded">Hủy</button>
                  </div>
                ) : (
                  <>
                    <div>{c.name}</div>
                    <div className="flex gap-2">
                      <button onClick={() => { setEditing(c.id); setEditName(c.name); }} className="px-2 py-1 border rounded">Sửa</button>
                      <button onClick={() => remove(c.id)} className="px-2 py-1 bg-red-600 text-white rounded">Xóa</button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
