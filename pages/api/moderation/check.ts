import type { NextApiRequest, NextApiResponse } from 'next';
import { phoneOrEmailFound } from '../../../lib/moderation';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { text } = req.body;
  const issues = phoneOrEmailFound(text);
  return res.status(200).json({ issues });
}
