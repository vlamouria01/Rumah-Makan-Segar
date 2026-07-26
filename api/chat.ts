import { GoogleGenAI, ThinkingLevel } from "@google/genai";

// In-memory rate limiting map for Vercel serverless instance
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string, limit = 20, windowMs = 60 * 1000): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return { allowed: true };
  }

  if (record.count >= limit) {
    return { allowed: false, retryAfter: Math.ceil((record.resetTime - now) / 1000) };
  }

  record.count += 1;
  return { allowed: true };
}

function sanitizeText(str: string, maxLength = 2000): string {
  if (typeof str !== "string") return "";
  const cleaned = str.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "").trim();
  return cleaned.slice(0, maxLength);
}

export default async function handler(req: any, res: any) {
  // Comprehensive security response headers
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Rate limiting check
  const clientIp = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || req.socket?.remoteAddress || "unknown";
  const rateCheck = checkRateLimit(clientIp, 20, 60 * 1000);
  if (!rateCheck.allowed) {
    res.setHeader("Retry-After", rateCheck.retryAfter || 60);
    return res.status(429).json({
      error: "TOO_MANY_REQUESTS",
      message: `Terlalu banyak permintaan. Silakan coba lagi dalam ${rateCheck.retryAfter || 60} detik.`
    });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
    if (!apiKey || typeof apiKey !== "string" || apiKey.trim() === "") {
      return res.status(400).json({ 
        error: "API_KEY_MISSING", 
        message: "GEMINI_API_KEY is not configured on Vercel Environment Variables." 
      });
    }

    const { message: rawMessage, history: rawHistory, language, menuList: rawMenuList } = req.body || {};
    if (!rawMessage || typeof rawMessage !== "string") {
      return res.status(400).json({ error: "Field 'message' is required and must be a string." });
    }

    const message = sanitizeText(rawMessage, 2000);
    if (!message) {
      return res.status(400).json({ error: "Pesan tidak boleh kosong." });
    }

    const menuList = sanitizeText(rawMenuList || "", 5000);

    const genAI = new GoogleGenAI({ 
      apiKey: apiKey.trim(),
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });

    const systemInstruction = `Anda adalah "Koki Teng", kepala koki legendaris RM Segar (鲜馆) yang berasal dari Sambas, Kalimantan Barat. Anda sangat ramah, hangat, dan to-the-point!

SANGAT PENTING: JAWABLAH SECARA SINGKAT, PADAT, DAN JELAS! Jangan panjang lebar atau bertele-tele. Maksimal 1-3 kalimat saja per jawaban, langsung pada inti pertanyaan/saran menu.

JAWABLAH DALAM BAHASA ${language === 'en' ? 'ENGLISH (Bahasa Inggris)' : language === 'zh' ? 'CHINESE/MANDARIN (Bahasa Mandarin)' : 'INDONESIAN (Bahasa Indonesia)'} sesuai dengan preferensi bahasa pelanggan saat ini. Jika Bahasa Indonesia, selipkan sedikit sapaan hangat khas koki (seperti "Kawan", "Kakak").

Gaya Berbicara Anda:
- Singkat, padat, jelas, ramah, dan langsung menjawab inti pertanyaan tanpa kata-kata berbunga-bunga yang terlalu panjang.
- Sangat paham menu dan langsung merekomendasikan hidangan terbaik sesuai keinginan pelanggan secara efisien.

Berikut adalah daftar menu kami:
${menuList}

Aturan Sangat Penting:
1. Jawablah secara SINGKAT, PADAT, dan JELAS (maksimal 2-3 kalimat per pesan). Langsung to the point.
2. JANGAN PERNAH MENGGUNAKAN TANDA BINTANG TEBAL (seperti **) dalam teks Anda. Tulis dalam teks biasa yang bersih tanpa tanda bintang apa pun.
3. Jika pelanggan ingin memesan makanan atau melakukan reservasi, tanyakan detailnya secara ringkas dan cepat:
   - Pesanan: Nama menu, kuantitas.
   - Reservasi: Nama, tanggal/hari, jam, jumlah orang.
4. Jika detail sudah lengkap dan pelanggan mengonfirmasi, tampilkan ringkasan singkat satu baris dan WAJIB sertakan format tag berikut persis di bagian akhir teks Anda (satu baris):
   - Jika Pesanan: [KIRIM_WA: pesanan | Halo RM Segar, saya ingin memesan: <nama_menu> (<qty>x). Terima kasih!]
   - Jika Reservasi: [KIRIM_WA: reservasi | Halo RM Segar, saya ingin melakukan reservasi atas nama <nama> untuk tanggal <tanggal> jam <jam> sebanyak <jumlah_orang> orang. Terima kasih!]
5. Jangan tampilkan tag [KIRIM_WA] sebelum semua data lengkap dan dikonfirmasi.`;

    const formattedHistory = Array.isArray(rawHistory) 
      ? rawHistory.slice(-30).map((item: any) => ({
          role: item.role === 'user' ? 'user' : 'model',
          parts: [{ text: sanitizeText(item.text || '', 2000) }]
        })) 
      : [];

    const chat = genAI.chats.create({
      model: "gemini-3.6-flash",
      config: {
        systemInstruction: systemInstruction,
        thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL }
      },
      history: formattedHistory
    });

    const responseStream = await chat.sendMessageStream({ message });

    res.setHeader("Content-Type", "text/plain; charset=utf-8");

    for await (const chunk of responseStream) {
      if (chunk.text) {
        res.write(chunk.text);
      }
    }
    res.end();
  } catch (error: any) {
    console.error("Vercel API Chat Error:", error);
    if (!res.headersSent) {
      const errorMsg = error?.message || "Internal server error";
      res.status(500).json({ error: "CHAT_ERROR", message: errorMsg });
    } else {
      res.end();
    }
  }
}
