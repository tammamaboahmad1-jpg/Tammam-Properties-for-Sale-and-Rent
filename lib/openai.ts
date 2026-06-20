import fetch from 'node-fetch';

type Prop = any;

export async function generateAIContentForProperty(prop: Prop) {
  if (!process.env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY not set');

  const prompt = `Write an Arabic attractive title (short) and a professional detailed description for a real estate listing. The property data:\nTitle: ${prop.title || ''}\nRegion: ${prop.region || ''}, City: ${prop.city || ''}\nType: ${prop.property_type || ''}, Listing: ${prop.listing_type || ''}\nPrice: ${prop.price || ''} ${prop.currency || ''}\nDescription (raw): ${prop.description || ''}\nProvide JSON with keys "title" and "description".`;

  const body = {
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 600,
    temperature: 0.7
  };

  const resp = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  if (!resp.ok) {
    const txt = await resp.text();
    throw new Error('OpenAI error: ' + txt);
  }
  const j = await resp.json();
  const content = j.choices?.[0]?.message?.content || '';
  try {
    const parsed = JSON.parse(content);
    return { title: parsed.title, description: parsed.description };
  } catch {
    return { title: prop.title, description: content };
  }
}
