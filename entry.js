import { kv } from '@vercel/kv';

export const config = {
  api: {
    bodyParser: { sizeLimit: '1mb' }
  }
};

export default async function handler(req, res) {
  const id = String(req.query.id || '').toUpperCase().trim();
  if (!id) return res.status(400).json({ error: 'missing id' });

  if (req.method === 'GET') {
    const entry = await kv.get('voicebox:' + id);
    if (!entry) return res.status(404).json({ error: 'not found' });
    return res.status(200).json(entry);
  }

  if (req.method === 'PATCH') {
    const entry = await kv.get('voicebox:' + id);
    if (!entry) return res.status(404).json({ error: 'not found' });
    const patch = req.body || {};
    const allowed = ['status', 'reply'];
    const updated = { ...entry };
    for (const key of allowed) {
      if (key in patch) updated[key] = patch[key];
    }
    await kv.set('voicebox:' + id, updated);
    return res.status(200).json(updated);
  }

  res.setHeader('Allow', ['GET', 'PATCH']);
  return res.status(405).end('Method not allowed');
}
