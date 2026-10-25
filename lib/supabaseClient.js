import { createClient } from '@supabase/supabase-js'

// ✅ Gunakan import.meta.env untuk Vite (bukan process.env)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validasi sederhana
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase credentials tidak ditemukan di .env')
  console.warn('Pastikan file .env berisi:')
  console.warn('VITE_SUPABASE_URL=...')
  console.warn('VITE_SUPABASE_ANON_KEY=...')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)