import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE;

  if (!supabaseUrl || !serviceRole) {
    res.status(500).json({ error: 'Missing SUPABASE_SERVICE_ROLE or VITE_SUPABASE_URL in environment' });
    return;
  }

  const supabase = createClient(supabaseUrl, serviceRole);

  try {
    if (req.method === 'POST') {
      // { table: 'bookings', payload: { ... } }
      const { table, payload } = req.body || {};
      const allowed = ['bookings', 'testimonials', 'articles', 'services', 'gifts', 'members'];
      if (!table || !allowed.includes(table)) return res.status(403).json({ error: 'Table not allowed' });
      const { data, error } = await supabase.from(table).insert([payload]).select().single();
      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json(data);
    }

    if (req.method === 'PATCH') {
      // { table: 'bookings', id: '<uuid>', updates: { ... } }
      const { table, id, updates } = req.body || {};
      const allowed = ['bookings', 'testimonials', 'articles', 'services', 'gifts', 'members'];
      if (!table || !allowed.includes(table) || !id || !updates) return res.status(403).json({ error: 'Table not allowed or missing id/updates' });
      const { data, error } = await supabase.from(table).update(updates).eq('id', id).select().single();
      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json(data);
    }

    if (req.method === 'DELETE') {
      // { table: 'bookings', id: '<uuid>' }
      const { table, id } = req.body || {};
      const allowed = ['bookings', 'testimonials'];
      if (!table || !allowed.includes(table) || !id) return res.status(403).json({ error: 'Table not allowed or missing id' });
      const { data, error } = await supabase.from(table).delete().eq('id', id);
      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json({ success: true });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal error' });
  }
}
