# Tammam Properties — Real Estate MVP

Stack: Next.js + TypeScript + Tailwind CSS, Supabase (Postgres + Storage)

Quick start:
1. Create a Supabase project and copy NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY.
2. Create a bucket named `property-images` in Supabase Storage.
3. Run the SQL in `schema.sql` using Supabase SQL editor.
4. Create a `.env.local` from `.env.example` and fill keys.
5. npm install && npm run dev

Note: Do NOT commit secrets. Keep `.env.local` out of the repo.
