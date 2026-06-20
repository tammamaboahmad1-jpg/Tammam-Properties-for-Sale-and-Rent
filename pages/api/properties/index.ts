import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../../lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { region, listing_type, min_price, max_price, property_type } = req.query;
    let query = supabase.from('properties').select('*, property_images(*)').eq('status', 'published').order('created_at', { ascending: false });
    if (region) query = query.eq('region', region as string);
    if (listing_type) query = query.eq('listing_type', listing_type as string);
    if (property_type) query = query.eq('property_type', property_type as string);
    const { data, error } = await query;
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === 'POST') {
    const payload = req.body;
    const phoneRegex = /(\+?\d[\d\-\s]{5,}\d)/g;
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi;
    if (phoneRegex.test(payload.description) || emailRegex.test(payload.description)) {
      return res.status(400).json({ error: 'Description contains phone or email — please remove it.' });
    }

    const { data, error } = await supabase.from('properties').insert([{
      title: payload.title,
      description: payload.description,
      price: payload.price,
      currency: payload.currency || 'EGP',
      property_type: payload.property_type,
      listing_type: payload.listing_type,
      region: payload.region,
      city: payload.city,
      address: payload.address,
      features: payload.features || [],
      status: 'pending'
    }]).select().single();

    if (error) return res.status(500).json({ error: error.message });

    await supabase.from('submissions_queue').insert([{ property_id: data.id, submitted_at: new Date().toISOString(), review_status: 'new' }]);

    return res.status(201).json({ message: 'Submission received', property: data });
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
