import type { NextApiRequest, NextApiResponse } from 'next';
import { createAdminSupabase } from '../../../../lib/supabaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const adminSecret = req.headers['x-admin-secret'] as string;
  if (!adminSecret || adminSecret !== process.env.ADMIN_SECRET) return res.status(401).json({ error: 'Unauthorized' });

  const { id } = req.query;
  const { reason } = req.body || {};
  if (!id || Array.isArray(id)) return res.status(400).json({ error: 'Missing id' });

  const supabase = createAdminSupabase();
  const { error } = await supabase.from('properties').update({ status: 'rejected', updated_at: new Date().toISOString() }).eq('id', id);
  if (error) return res.status(500).json({ error: error.message });

  await supabase.from('moderation_logs').insert([{ property_id: id, issue_type: 'rejected', details: reason || 'Rejected by admin', automated_flag: false, reviewed: true }]);

  return res.status(200).json({ message: 'Property rejected' });
}
