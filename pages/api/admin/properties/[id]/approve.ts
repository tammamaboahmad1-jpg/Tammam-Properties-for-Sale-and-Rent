import type { NextApiRequest, NextApiResponse } from 'next';
import { createAdminSupabase } from '../../../../lib/supabaseAdmin';
import { generateAIContentForProperty } from '../../../../lib/openai';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const adminSecret = req.headers['x-admin-secret'] as string;
  if (!adminSecret || adminSecret !== process.env.ADMIN_SECRET) return res.status(401).json({ error: 'Unauthorized' });

  const { id } = req.query;
  if (!id || Array.isArray(id)) return res.status(400).json({ error: 'Missing id' });

  const supabase = createAdminSupabase();
  const { data: prop, error: fetchErr } = await supabase.from('properties').select('*').eq('id', id).single();
  if (fetchErr || !prop) return res.status(404).json({ error: 'Property not found' });

  if (process.env.OPENAI_API_KEY) {
    try {
      const ai = await generateAIContentForProperty(prop);
      await supabase.from('properties').update({
        title: ai.title ?? prop.title,
        description: ai.description ?? prop.description,
        ai_generated: true,
        updated_at: new Date().toISOString()
      }).eq('id', id);
    } catch (e) {
      console.error('AI generation failed', e);
    }
  }

  const { error: updateErr } = await supabase.from('properties').update({ status: 'published', updated_at: new Date().toISOString() }).eq('id', id);
  if (updateErr) return res.status(500).json({ error: updateErr.message });

  await supabase.from('moderation_logs').insert([{ property_id: id, issue_type: 'approved', details: 'Approved by admin', automated_flag: false, reviewed: true, created_at: new Date().toISOString() }]);

  return res.status(200).json({ message: 'Property approved and published' });
}
