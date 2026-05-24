import crypto from 'crypto';

function signTimestamp(secret, ts) {
  return crypto.createHmac('sha256', secret).update(String(ts)).digest('hex');
}

export default async function handler(req, res) {
  const adminUser = process.env.SUPABASE_ADMIN_USER;
  const adminPass = process.env.SUPABASE_ADMIN_PASS;
  const adminSecret = process.env.SUPABASE_ADMIN_SECRET;

  if (!adminUser || !adminPass || !adminSecret) {
    res.status(500).json({ error: 'Missing admin credentials in env' });
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'Missing username/password' });

  if (username === adminUser && password === adminPass) {
    const ts = Math.floor(Date.now() / 1000);
    const sig = signTimestamp(adminSecret, ts);
    const token = `${ts}.${sig}`;

    // set cookie (1 hour)
    const maxAge = 60 * 60;
    res.setHeader('Set-Cookie', `admin_token=${token}; HttpOnly; Path=/; Max-Age=${maxAge}; SameSite=Lax`);
    return res.status(200).json({ success: true });
  }

  return res.status(401).json({ error: 'Invalid credentials' });
}
