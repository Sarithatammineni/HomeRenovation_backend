// backend/lib/supabase.js
// Uses the SERVICE ROLE key — full DB access, server-side only.
// NEVER expose this key to the frontend / browser.
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL         = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('\n❌  Missing Supabase environment variables!');
  console.error('   SUPABASE_URL        :', SUPABASE_URL         ? '✅ set' : '❌ missing');
  console.error('   SUPABASE_SERVICE_KEY:', SUPABASE_SERVICE_KEY ? '✅ set' : '❌ missing');
  console.error('\n   → Create backend/.env from backend/.env.example and fill in values.\n');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

module.exports = supabase;
