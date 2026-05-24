import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE;
  const adminSecret = process.env.SUPABASE_ADMIN_SECRET;

  if (!supabaseUrl || !serviceRole || !adminSecret) {
    res.status(500).json({ error: 'Missing SUPABASE_SERVICE_ROLE, VITE_SUPABASE_URL or SUPABASE_ADMIN_SECRET in environment' });
    return;
  }

  // Basic header auth for admin clients OR cookie-based session
  const provided = req.headers['x-admin-secret'] || req.headers['x-admin-token'];
  const cookieHeader = req.headers['cookie'] || '';

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
  // parse cookie header for admin_token
  const m = cookieHeader.match(/admin_token=([^;]+)/);
  if (!authorized && m && verifyToken(m[1])) authorized = true;

  if (!authorized) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const supabase = createClient(supabaseUrl, serviceRole);

  try {
    if (req.method === 'POST') {
      // { article: {...}, categoryIds: [...] }
      const { article, categoryIds } = req.body || {};
      if (!article) return res.status(400).json({ error: 'Missing article payload' });
      const { data: art, error: err1 } = await supabase.from('articles').insert([article]).select().single();
      if (err1) return res.status(500).json({ error: err1.message });
      const articleId = art.id;
      if (categoryIds && categoryIds.length) {
        const refs = categoryIds.map(cid => ({ article_id: articleId, category_id: cid }));
        const { error: err2 } = await supabase.from('article_categories').insert(refs);
        if (err2) return res.status(500).json({ error: err2.message });
      }
      return res.status(200).json(art);
    }

    if (req.method === 'PATCH') {
      // { id, article, categoryIds }
      const { id, article, categoryIds } = req.body || {};
      if (!id || !article) return res.status(400).json({ error: 'Missing id or article payload' });
      const { data: art, error: err1 } = await supabase.from('articles').update(article).eq('id', id).select().single();
      if (err1) return res.status(500).json({ error: err1.message });
      // replace categories
      const { error: delErr } = await supabase.from('article_categories').delete().eq('article_id', id);
      if (delErr) return res.status(500).json({ error: delErr.message });
      if (categoryIds && categoryIds.length) {
        const refs = categoryIds.map(cid => ({ article_id: id, category_id: cid }));
        const { error: insErr } = await supabase.from('article_categories').insert(refs);
        if (insErr) return res.status(500).json({ error: insErr.message });
      }
      return res.status(200).json(art);
    }

    if (req.method === 'DELETE') {
      const { id } = req.body || {};
      if (!id) return res.status(400).json({ error: 'Missing id' });
      const { error } = await supabase.from('articles').delete().eq('id', id);
      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json({ success: true });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal error' });
  }
}
