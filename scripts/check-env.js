#!/usr/bin/env node
const required = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'];
const missing = required.filter(k => !process.env[k]);
if (missing.length) {
  console.warn('\n[check-env] Warning: missing env vars:', missing.join(', '));
  console.warn('If you are running locally, copy .env.example → .env.local and fill values.');
  process.exitCode = 0; // don't fail build by default
} else {
  console.log('[check-env] All required env vars present.');
}
