var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_genai = require("@google/genai");
var import_vite = require("vite");
var rateLimitMap = /* @__PURE__ */ new Map();
function checkRateLimit(ip, limit = 20, windowMs = 60 * 1e3) {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return { allowed: true };
  }
  if (record.count >= limit) {
    return { allowed: false, retryAfter: Math.ceil((record.resetTime - now) / 1e3) };
  }
  record.count += 1;
  return { allowed: true };
}
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) {
      rateLimitMap.delete(ip);
    }
  }
}, 5 * 60 * 1e3);
function sanitizeText(str, maxLength = 2e3) {
  if (typeof str !== "string") return "";
  const cleaned = str.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "").trim();
  return cleaned.slice(0, maxLength);
}
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.disable("x-powered-by");
  app.use(import_express.default.json({ limit: "500kb" }));
  app.use((_req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "SAMEORIGIN");
    res.setHeader("X-XSS-Protection", "1; mode=block");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
    res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    next();
  });
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", service: "RM Segar Backend", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
  });
  app.post("/api/chat", async (req, res) => {
    const clientIp = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.socket.remoteAddress || "unknown";
    const rateCheck = checkRateLimit(clientIp, 20, 60 * 1e3);
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
          message: "GEMINI_API_KEY is not configured on the server."
        });
      }
      const { message: rawMessage, history: rawHistory, language, menuList: rawMenuList } = req.body || {};
      if (!rawMessage || typeof rawMessage !== "string") {
        return res.status(400).json({ error: "Field 'message' is required and must be a string." });
      }
      const message = sanitizeText(rawMessage, 2e3);
      if (!message) {
        return res.status(400).json({ error: "Pesan tidak boleh kosong." });
      }
      const menuList = sanitizeText(rawMenuList || "", 5e3);
      const genAI = new import_genai.GoogleGenAI({
        apiKey: apiKey.trim(),
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build"
          }
        }
      });
      const systemInstruction = `Anda adalah "Koki Teng", kepala koki legendaris RM Segar (\u9C9C\u9986) yang berasal dari Sambas, Kalimantan Barat. Anda sangat ramah, humoris, hangat, dan gemar bercerita tentang kuliner khas daerah Anda dengan penuh gairah!
Anda ingin pelanggan merasa seperti mengobrol dengan koki sungguhan yang ramah di kedai makan, bukan robot CS yang kaku.

SANGAT PENTING: JAWABLAH DALAM BAHASA ${language === "en" ? "ENGLISH (Bahasa Inggris)" : language === "zh" ? "CHINESE/MANDARIN (Bahasa Mandarin)" : "INDONESIAN (Bahasa Indonesia)"} sesuai dengan preferensi bahasa pelanggan saat ini. Namun, selipkan juga beberapa dialek lokal Sambas/Kalbar atau ekspresi khas koki jika berbicara dalam Bahasa Indonesia untuk menambah kehangatan dan keaslian!

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
      const formattedHistory = Array.isArray(rawHistory) ? rawHistory.slice(-30).map((item) => ({
        role: item.role === "user" ? "user" : "model",
        parts: [{ text: sanitizeText(item.text || "", 2e3) }]
      })) : [];
      const chat = genAI.chats.create({
        model: "gemini-3.6-flash",
        config: {
          systemInstruction,
          thinkingConfig: { thinkingLevel: import_genai.ThinkingLevel.MINIMAL }
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
    } catch (error) {
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
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`RM Segar Full-Stack Server running on http://0.0.0.0:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
