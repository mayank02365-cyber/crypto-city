import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { path } = req.query;

  if (!path || typeof path !== 'string') {
    res.status(400).json({ error: 'Missing path parameter' });
    return;
  }

  try {
    const targetUrl = `https://api.coingecko.com/api/v3/${path.startsWith('/') ? path.slice(1) : path}`;
    
    // Set 60-second caching header
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120');

    const response = await fetch(targetUrl, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'CryptoCity-Fintech-App/1.0',
      },
    });

    if (!response.ok) {
      res.status(response.status).json({ error: `CoinGecko API returned status ${response.status}` });
      return;
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Internal proxy server error' });
  }
}
