import express from "express";
import path from "path";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Simple in-memory rate limiting map
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

// Clean up stale rate limit entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) {
      rateLimitMap.delete(ip);
    }
  }
}, 5 * 60 * 1000);

// Helper function to sanitize user text inputs against null bytes / control chars
function sanitizeText(str: string, maxLength = 2000): string {
  if (typeof str !== "string") return "";
  // Strip null characters and non-printable ASCII control characters except newlines/tabs
  const cleaned = str.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "").trim();
  return cleaned.slice(0, maxLength);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Disable powered-by header for security obfuscation
  app.disable("x-powered-by");

  // Strict request body size limit to mitigate DoS / payload bloat
  app.use(express.json({ limit: "500kb" }));

  // Security headers middleware
  app.use((_req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "SAMEORIGIN");
    res.setHeader("X-XSS-Protection", "1; mode=block");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
    res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    next();
  });

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", service: "RM Segar Backend", timestamp: new Date().toISOString() });
  });

  // Secure Proxy API route for Gemini AI Chat
  app.post("/api/chat", async (req, res) => {
    // 1. Rate Limiting per IP
    const clientIp = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || req.socket.remoteAddress || "unknown";
    const rateCheck = checkRateLimit(clientIp, 20, 60 * 1000); // 20 requests per minute
    if (!rateCheck.allowed) {
      res.setHeader("Retry-After", rateCheck.retryAfter || 60);
      return res.status(429).json({
        error: "TOO_MANY_REQUESTS",
        message: `Terlalu banyak permintaan. Silakan coba lagi dalam ${rateCheck.retryAfter || 60} detik.`
      });
    }

    try {
      const apiKey = process.env.GEMINI_API_KEY || (process.env as any).API_KEY;
      if (!apiKey || typeof apiKey !== "string" || apiKey.trim() === "") {
        return res.status(400).json({ 
          error: "API_KEY_MISSING", 
          message: "GEMINI_API_KEY is not configured on the server." 
        });
      }

      const { message: rawMessage, history: rawHistory, language, menuList: rawMenuList } = req.body || {};
      
      // 2. Strict Input Validation & Sanitization
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

      const systemInstruction = `Anda adalah "Koki A-Sian", kepala koki legendaris RM Segar (鲜馆) yang berasal dari Sambas, Kalimantan Barat. Anda sangat ramah, humoris, hangat, dan gemar bercerita tentang kuliner khas daerah Anda dengan penuh gairah!
Anda ingin pelanggan merasa seperti mengobrol dengan koki sungguhan yang ramah di kedai makan, bukan robot CS yang kaku.

SANGAT PENTING: JAWABLAH DALAM BAHASA ${language === 'en' ? 'ENGLISH (Bahasa Inggris)' : language === 'zh' ? 'CHINESE/MANDARIN (Bahasa Mandarin)' : 'INDONESIAN (Bahasa Indonesia)'} sesuai dengan preferensi bahasa pelanggan saat ini. Namun, selipkan juga beberapa dialek lokal Sambas/Kalbar atau ekspresi khas koki jika berbicara dalam Bahasa Indonesia untuk menambah kehangatan dan keaslian!

Gaya Berbicara Anda:
- Ramah, akrab, humoris, dan menggunakan sapaan hangat. Jika dalam Bahasa Indonesia, gunakan sapaan seperti "Adek", "Kakak", "Om", "Tante", atau "Kawan".
- Sangat menyukai makanan dan senang merekomendasikan hidangan berdasarkan selera pelanggan.
- Jika pengguna curhat atau ingin mengobrol hal-hal santai, responlah dengan nyambung, ceria, dan berikan analogi makanan yang seru! Jangan menolak obrolan santai, rangkul mereka seolah sedang mengobrol di meja bar restoran.
- Simpan ingatan dari obrolan ini untuk memberikan rekomendasi terbaik.

Berikut adalah daftar menu kami:
${menuList}

Aturan Sangat Penting:
1. Jawablah secara natural, komunikatif, dan interaktif seperti koki asli yang hangat dan bersemangat. Buat kalimat yang mengalir enak didengar, ramah, dan humoris jika cocok. Jangan kaku seperti robot cs. Jika hanya mengobrol/chit-chat, jadilah teman bincang yang asyik tentang kuliner Kalimantan Barat, resep bumbu khas Sambas, atau tips memasak.
2. JANGAN PERNAH MENGGUNAKAN TANDA BINTANG TEBAL (seperti **) dalam teks Anda. Tulis dalam teks biasa yang bersih tanpa tanda bintang apa pun.
3. Jika pelanggan ingin memesan makanan atau melakukan reservasi, tanyakan detailnya dengan ramah dan ringkas:
   - Pesanan: Nama menu, kuantitas.
   - Reservasi: Nama, tanggal/hari, jam, jumlah orang.
4. Jika detail sudah lengkap dan pelanggan mengonfirmasi, tampilkan ringkasan singkat dengan gaya koki yang riang dan WAJIB sertakan format tag berikut persis di bagian akhir teks Anda (satu baris):
   - Jika Pesanan: [KIRIM_WA: pesanan | Halo RM Segar, saya ingin memesan: <nama_menu> (<qty>x). Terima kasih!]
   - Jika Reservasi: [KIRIM_WA: reservasi | Halo RM Segar, saya ingin melakukan reservasi atas nama <nama> untuk tanggal <tanggal> jam <jam> sebanyak <jumlah_orang> orang. Terima kasih!]
5. Jangan tampilkan tag [KIRIM_WA] sebelum semua data lengkap dan dikonfirmasi.`;

      // 3. Sanitize and cap conversation history (max last 30 turns)
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
      res.setHeader("Transfer-Encoding", "chunked");

      for await (const chunk of responseStream) {
        if (chunk.text) {
          res.write(chunk.text);
        }
      }
      res.end();
    } catch (error: any) {
      console.error("Server API Chat Error:", error);
      if (!res.headersSent) {
        const errorMsg = error?.message || "Internal server error";
        const isApiKeyError = errorMsg.includes("API key not valid") || errorMsg.includes("API_KEY_INVALID");
        res.status(isApiKeyError ? 400 : 500).json({ 
          error: isApiKeyError ? "API_KEY_INVALID" : "CHAT_ERROR",
          message: errorMsg 
        });
      } else {
        res.end();
      }
    }
  });

  // Vite middleware for development vs static serve for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`RM Segar Full-Stack Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
