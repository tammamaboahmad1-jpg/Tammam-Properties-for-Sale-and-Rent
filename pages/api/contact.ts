import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { property_id, name, message, contact_method } = req.body;

  const { data, error } = await supabase.from('messages').insert([{
    property_id,
    name,
    message,
    contact_method,
    sent_to_admin: false
  }]).select().single();

  if (error) return res.status(500).json({ error: error.message });

  return res.status(201).json({ message: 'Message sent to admin', record: data });
}
