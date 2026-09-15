export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const search = (req.query?.search as string || "").trim();
    const limit = (req.query?.limit as string || "50").trim();
    const targetUrl = search
      ? `https://www.oranghilang.id/api/victim?search=${encodeURIComponent(search)}`
      : `https://www.oranghilang.id/api/victim?limit=${encodeURIComponent(limit)}`;

    const upstream = await fetch(targetUrl, {
      headers: {
        "Accept": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) RM-Segar/1.0"
      }
    });

    if (!upstream.ok) {
      return res.status(upstream.status).json({ items: [] });
    }

    const data = await upstream.json();
    return res.json(data);
  } catch (err: any) {
    return res.status(502).json({ items: [] });
  }
}
