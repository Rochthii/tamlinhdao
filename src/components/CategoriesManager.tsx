import React, { useEffect, useState } from 'react';
import { fetchCategories } from '../lib/supabase';

export default function CategoriesManager() {
  const [cats, setCats] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [newName, setNewName] = useState('');
  const [editing, setEditing] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      // fetch via client helper (anon) or fallback to admin API
      try {
        const data: any = await fetchCategories();
        if (data) { setCats(data); setLoading(false); return; }
      } catch (e) {}

      const resp = await fetch('/api/admin-categories', { credentials: 'same-origin' });
      if (!resp.ok) throw new Error('Failed');
      const data = await resp.json();
      setCats(data || []);
    } catch (e) {
      console.error('load categories', e);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const create = async () => {
    if (!newName.trim()) return;
    try {
      const resp = await fetch('/api/admin-categories', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: newName.trim() }) });
      if (!resp.ok) throw new Error('Create failed');
      setNewName('');
      await load();
    } catch (e) { console.error(e); alert('Tạo thất bại'); }
  };

  const saveEdit = async (id: string) => {
    if (!editName.trim()) return;
    try {
      const resp = await fetch('/api/admin-categories', { method: 'PATCH', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, updates: { name: editName.trim() } }) });
      if (!resp.ok) throw new Error('Update failed');
      setEditing(null); setEditName(''); await load();
    } catch (e) { console.error(e); alert('Cập nhật thất bại'); }
  };

  const remove = async (id: string) => {
    if (!confirm('Xóa nhóm sẽ gỡ liên kết khỏi bài viết. Tiếp tục?')) return;
    try {
      const resp = await fetch('/api/admin-categories', { method: 'DELETE', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
      if (!resp.ok) throw new Error('Delete failed');
      await load();
    } catch (e) { console.error(e); alert('Xóa thất bại'); }
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
