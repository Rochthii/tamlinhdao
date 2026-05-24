import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE;
  const adminSecret = process.env.SUPABASE_ADMIN_SECRET;

  if (!supabaseUrl || !serviceRole || !adminSecret) {
    res.status(500).json({ error: 'Missing SUPABASE_SERVICE_ROLE, VITE_SUPABASE_URL or SUPABASE_ADMIN_SECRET in environment' });
    return;
  }

  // simple admin auth (header or cookie)
  const provided = req.headers['x-admin-secret'] || req.headers['x-admin-token'];
  const cookieHeader = req.headers['cookie'] || '';
  const verifyToken = (token) => {
    if (!token) return false;
    const [tsStr, sig] = token.split('.');
    if (!tsStr || !sig) return false;
    const ts = parseInt(tsStr, 10);
    const now = Math.floor(Date.now() / 1000);
    const maxAge = 60 * 60;
    if (isNaN(ts) || (now - ts) > maxAge) return false;
    const expected = require('crypto').createHmac('sha256', adminSecret).update(String(ts)).digest('hex');
    return expected === sig;
  };
  let authorized = false;
  if (provided && provided === adminSecret) authorized = true;
  const m = cookieHeader.match(/admin_token=([^;]+)/);
  if (!authorized && m && verifyToken(m[1])) authorized = true;
  if (!authorized) return res.status(401).json({ error: 'Unauthorized' });

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { fileName, base64, contentType } = req.body || {};
  if (!fileName || !base64) return res.status(400).json({ error: 'Missing fileName or base64' });

  const supabase = createClient(supabaseUrl, serviceRole);

  try {
    const buffer = Buffer.from(base64, 'base64');
    const cleanName = fileName.replace(/[^a-zA-Z0-9_.-]/g, '_');
    const path = `articles/${Date.now()}_${cleanName}`;
    const bucket = 'article-images';

    const { data, error } = await supabase.storage.from(bucket).upload(path, buffer, { contentType, upsert: false });
    if (error) {
      console.error('upload error', error);
      return res.status(500).json({ error: error.message || 'Upload failed' });
    }

    const publicUrl = `${supabaseUrl.replace(/\/$/, '')}/storage/v1/object/public/${bucket}/${encodeURIComponent(path)}`;
    return res.status(200).json({ url: publicUrl, path });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal error' });
  }
}
