import type { NextApiRequest, NextApiResponse } from 'next';
import { createAdminSupabase } from '../../../lib/supabaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { property_id, url, caption, is_main } = req.body;
  if (!property_id || !url) return res.status(400).json({ error: 'Missing property_id or url' });

  try {
    const supabase = createAdminSupabase();
    const { data, error } = await supabase.from('property_images').insert([{
      property_id,
      url,
      caption: caption || null,
      is_main: !!is_main
    }]).select().single();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json({ message: 'Image attached', record: data });
  } catch (e: any) {
    return res.status(500).json({ error: e.message || String(e) });
  }
}
