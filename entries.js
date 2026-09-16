import { kv } from '@vercel/kv';

export const config = {
  api: {
    bodyParser: { sizeLimit: '4mb' }
  }
};

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const ids = (await kv.get('voicebox:index')) || [];
    const entries = [];
    for (const id of ids) {
      const e = await kv.get('voicebox:' + id);
      if (e) entries.push(e);
    }
    return res.status(200).json(entries);
  }

  if (req.method === 'POST') {
    const entry = req.body;
    if (!entry || !entry.id || !entry.text || !entry.category) {
      return res.status(400).json({ error: 'invalid entry' });
    }
    await kv.set('voicebox:' + entry.id, entry);
    const ids = (await kv.get('voicebox:index')) || [];
    ids.unshift(entry.id);
    await kv.set('voicebox:index', ids);
    return res.status(200).json({ ok: true, id: entry.id });
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end('Method not allowed');
}
