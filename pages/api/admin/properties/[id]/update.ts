import type { NextApiRequest, NextApiResponse } from 'next';
import { createAdminSupabase } from '../../../../lib/supabaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const adminSecret = req.headers['x-admin-secret'] as string;
  if (!adminSecret || adminSecret !== process.env.ADMIN_SECRET) return res.status(401).json({ error: 'Unauthorized' });

  const { id } = req.query;
  const payload = req.body;
  if (!id || Array.isArray(id)) return res.status(400).json({ error: 'Missing id' });

  try {
    const supabase = createAdminSupabase();
    const { data, error } = await supabase.from('properties').update({
      title: payload.title,
      description: payload.description,
      price: payload.price,
      currency: payload.currency,
      property_type: payload.property_type,
      listing_type: payload.listing_type,
      region: payload.region,
      city: payload.city,
      address: payload.address,
      features: payload.features || []
    }).eq('id', id).select().single();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ message: 'Property updated', property: data });
  } catch (e: any) {
    return res.status(500).json({ error: e.message || String(e) });
  }
}
