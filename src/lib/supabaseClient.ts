import { createClient } from '@supabase/supabase-js';

// Lấy từ Project Settings > API trong Supabase Dashboard.
// Hỗ trợ cả key định dạng mới (sb_publishable_...) và anon key truyền thống
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  'sb_publishable_TX_U-2Awo4GPVG_e3YQAdg_GA1T4iAC') as string | undefined;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  console.warn(
    '[supabase] Thiếu VITE_SUPABASE_URL hoặc VITE_SUPABASE_ANON_KEY trong .env — ' +
      'app sẽ dùng dữ liệu tĩnh/DummyJSON cho tới khi bạn cấu hình.'
  );
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key'
);
