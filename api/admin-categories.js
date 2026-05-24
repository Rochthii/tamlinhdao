import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE;
  const adminSecret = process.env.SUPABASE_ADMIN_SECRET;

  if (!supabaseUrl || !serviceRole || !adminSecret) {
    res.status(500).json({ error: 'Missing SUPABASE_SERVICE_ROLE, VITE_SUPABASE_URL or SUPABASE_ADMIN_SECRET in environment' });
    return;
  }

  const cookieHeader = req.headers['cookie'] || '';
  const provided = req.headers['x-admin-secret'] || req.headers['x-admin-token'];

  const verifyToken = (token) => {
    if (!token) return false;
    const [tsStr, sig] = token.split('.');
    if (!tsStr || !sig) return false;
    const ts = parseInt(tsStr, 10);
    const now = Math.floor(Date.now() / 1000);
    const maxAge = 60 * 60; // 1 hour
    if (isNaN(ts) || (now - ts) > maxAge) return false;
    const expected = require('crypto').createHmac('sha256', adminSecret).update(String(ts)).digest('hex');
    return expected === sig;
  };

  let authorized = false;
  if (provided && provided === adminSecret) authorized = true;
  const m = cookieHeader.match(/admin_token=([^;]+)/);
  if (!authorized && m && verifyToken(m[1])) authorized = true;
  if (!authorized) return res.status(401).json({ error: 'Unauthorized' });

  const supabase = createClient(supabaseUrl, serviceRole);

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase.from('categories').select('*').order('name', { ascending: true });
      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      const { name, slug, description } = req.body || {};
      if (!name) return res.status(400).json({ error: 'Missing name' });
      const { data, error } = await supabase.from('categories').insert([{ name, slug: slug || name.toLowerCase().replace(/\s+/g, '-'), description }]).select().single();
      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json(data);
    }

    if (req.method === 'PATCH') {
      const { id, updates } = req.body || {};
      if (!id || !updates) return res.status(400).json({ error: 'Missing id or updates' });
      const { data, error } = await supabase.from('categories').update(updates).eq('id', id).select().single();
      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json(data);
    }

    if (req.method === 'DELETE') {
      const { id } = req.body || {};
      if (!id) return res.status(400).json({ error: 'Missing id' });
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json({ success: true });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal error' });
  }
}
