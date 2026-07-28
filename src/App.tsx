import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  ShoppingBag, 
  MapPin, 
  Search, 
  Plus, 
  Minus, 
  X, 
  ChevronRight, 
  Utensils, 
  Coffee, 
  Home,
  Heart,
  User,
  Star,
  ArrowRight,
  ChevronLeft,
  Settings,
  LogOut,
  History,
  Trash2,
  Check,
  Soup,
  GlassWater,
  Zap,
  Sparkles,
  Bot,
  Send,
  MessageCircle,
  MessageSquare,
  Users,
  Share2,
  BookOpen,
  Globe,
  Download,
  Gamepad2,
  Trophy,
  Dices
} from 'lucide-react';
import { motion, AnimatePresence, useDragControls } from 'motion/react';
import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { MENU_ITEMS, MenuItem } from './constants';

export const TRANSLATIONS = {
  id: {
    title: "RM Segar",
    tagline: "Cita Rasa Autentik Kalimantan Barat",
    searchPlaceholder: "Cari bakmie, kwetiao, minuman...",
    all: "Semua",
    popular: "Paling Populer",
    about: "Tentang",
    profile: "Profil",
    home: "Beranda",
    cart: "Keranjang",
    emptyCart: "Keranjang Anda kosong",
    checkout: "Pesan Sekarang via WhatsApp",
    history: "Riwayat Pesanan",
    aboutButton: "Tentang RM Segar",
    guideButton: "Panduan Penggunaan",
    logout: "Keluar",
    login: "Masuk Akun",
    guest: "Tamu",
    notLoggedIn: "Belum Masuk",
    adminDashboard: "Dashboard Admin",
    languageSetting: "Pengaturan Bahasa",
    phoneLanguage: "Bahasa Sistem (Otomatis)",
    add: "Tambah",
    added: "Ditambahkan",
    totalPrice: "Total Harga",
    tableNumber: "Nomor Meja",
    deliveryMethod: "Metode Pengambilan",
    dineIn: "Makan di Sini",
    takeaway: "Ambil Sendiri (Takeaway)",
    delivery: "Kirim ke Alamat",
    address: "Alamat Pengiriman",
    whatsappConfirm: "📍 Anda akan dikonfirmasi lewat WhatsApp",
    notes: "Catatan Tambahan (opsional)",
    optionHot: "Panas",
    optionIce: "Es",
    back: "Kembali",
    search: "Cari",
    favorite: "Favorit",
    chatChef: "Ngobrol dengan Koki Teng AI!",
    recommendation: "Rekomendasi",
    aboutText: "RM Segar adalah restoran Chinese Food khas Kalimantan Barat yang menyajikan hidangan autentik berkualitas tinggi.",
    nonHalalWarning: "Menu kami mengandung bahan-bahan yang Tidak Halal.",
    importantInfo: "Informasi Penting",
    katalogUnggulan: "Katalog Menu Unggulan",
    katalogDesc: "Sajian legendaris kami yang paling dicari pelanggan setia RM Segar Sambas.",
    bumbuAutentik: "Bumbu Autentik Sambas",
    lihatMenu: "Lihat Menu",
    recomMie: "Rekomendasi mie",
    recomNasi: "Menu nasi favorit",
    recomMinuman: "Minuman segar",
    recomPedas: "Menu paling pedas",
    kokiTitle: "Koki Teng AI RM Segar",
    kokiDesc: "Asisten kuliner pintar Anda dari Koki Teng untuk memesan hidangan terbaik.",
    forgotPassword: "Lupa Sandi",
    verifyToken: "Verifikasi Token",
    kokiAsk: "Bingung mau makan apa?",
    kokiStart: "Mulai Chat Rekomendasi",
    kokiGreeting: "Halo! Saya Koki Teng. Bingung mau makan apa hari ini? Beritahu saya apa yang Anda suka, dan saya akan carikan menu yang paling pas buat Anda! 🐼🍜",
    kokiError: "Ups, Koki Teng sedang sibuk menyiapkan pesanan. Coba lagi nanti ya!",
    searchTitle: "Pencarian",
    searchResultsFor: "Hasil pencarian untuk",
    searchNoResults: "Menu tidak ditemukan"
  },
  en: {
    title: "RM Segar",
    tagline: "Authentic Taste of West Kalimantan",
    searchPlaceholder: "Search bakmie, kwetiao, drinks...",
    all: "All",
    popular: "Most Popular",
    about: "About",
    profile: "Profile",
    home: "Home",
    cart: "Cart",
    emptyCart: "Your cart is empty",
    checkout: "Order Now via WhatsApp",
    history: "Order History",
    aboutButton: "About RM Segar",
    guideButton: "User Guide",
    logout: "Log Out",
    login: "Log In",
    guest: "Guest",
    notLoggedIn: "Not Logged In",
    adminDashboard: "Admin Dashboard",
    languageSetting: "Language Settings",
    phoneLanguage: "System Language (Auto)",
    add: "Add",
    added: "Added",
    totalPrice: "Total Price",
    tableNumber: "Table Number",
    deliveryMethod: "Order Method",
    dineIn: "Dine In",
    takeaway: "Takeaway",
    delivery: "Delivery",
    address: "Delivery Address",
    whatsappConfirm: "📍 You will receive a WhatsApp confirmation",
    notes: "Additional Notes (optional)",
    optionHot: "Hot",
    optionIce: "Ice",
    back: "Back",
    search: "Search",
    favorite: "Favorites",
    chatChef: "Chat with Chef Teng AI!",
    recommendation: "Recommendation",
    aboutText: "RM Segar is a Chinese Food restaurant from West Kalimantan serving high-quality, authentic dishes.",
    nonHalalWarning: "Our menu contains non-halal ingredients.",
    importantInfo: "Important Information",
    katalogUnggulan: "Featured Menu Catalog",
    katalogDesc: "Our legendary dishes highly sought after by RM Segar Sambas loyal customers.",
    bumbuAutentik: "Authentic Sambas Spices",
    lihatMenu: "View Menu",
    recomMie: "Noodle recommendations",
    recomNasi: "Favorite rice dishes",
    recomMinuman: "Fresh drinks",
    recomPedas: "Spiciest options",
    kokiTitle: "Chef Teng AI RM Segar",
    kokiDesc: "Your smart culinary assistant from Chef Teng to order the best dishes.",
    forgotPassword: "Forgot Password",
    verifyToken: "Verify Token",
    kokiAsk: "Not sure what to eat?",
    kokiStart: "Start Recommendation Chat",
    kokiGreeting: "Hello! I am Chef Teng. Not sure what to eat today? Tell me what you like, and I'll find the perfect dish for you! 🐼🍜",
    kokiError: "Oops, Chef Teng is busy preparing orders. Please try again later!",
    searchTitle: "Search",
    searchResultsFor: "Search results for",
    searchNoResults: "No menu items found"
  },
  zh: {
    title: "RM Segar (鲜馆)",
    tagline: "正宗西加里曼丹风味",
    searchPlaceholder: "搜索肉面、粿条、饮料...",
    all: "全部",
    popular: "最受欢迎",
    about: "关于我们",
    profile: "个人中心",
    home: "首页",
    cart: "购物车",
    emptyCart: "您的购物车是空的",
    checkout: "立即通过 WhatsApp 下单",
    history: "订单历史",
    aboutButton: "关于鲜馆 (RM Segar)",
    guideButton: "使用指南",
    logout: "退出登录",
    login: "登录账户",
    guest: "访客",
    notLoggedIn: "未登录",
    adminDashboard: "管理后台",
    languageSetting: "语言设置",
    phoneLanguage: "系统语言 (自动)",
    add: "添加",
    added: "已添加",
    totalPrice: "总价",
    tableNumber: "桌号",
    deliveryMethod: "取餐方式",
    dineIn: "堂食",
    takeaway: "自提",
    delivery: "送餐上门",
    address: "送货地址",
    whatsappConfirm: "📍 您将通过 WhatsApp 收到确认",
    notes: "备注说明 (选填)",
    optionHot: "热",
    optionIce: "冰",
    back: "返回",
    search: "搜索",
    favorite: "收藏",
    chatChef: "与 Koki Teng AI 厨师聊天！",
    recommendation: "推荐",
    aboutText: "RM Segar (鲜馆) 是一家来自西加里曼丹的正宗中餐馆，为您提供高品质的经典美味。",
    nonHalalWarning: "我们的菜单含有非清真 (Non-Halal) 食材。",
    importantInfo: "重要提示",
    katalogUnggulan: "招牌推荐画册",
    katalogDesc: "深受三发县 RM Segar 忠实顾客喜爱的经典传奇菜品。",
    bumbuAutentik: "三发县正宗风味",
    lihatMenu: "查看菜单",
    recomMie: "推荐面食",
    recomNasi: "人气饭食",
    recomMinuman: "清凉饮品",
    recomPedas: "最辣推荐",
    kokiTitle: "鲜馆 Koki Teng AI 厨师",
    kokiDesc: "您的智能美食助理 Koki Teng，帮您点选最佳佳肴。",
    forgotPassword: "忘记密码",
    verifyToken: "验证令牌",
    kokiAsk: "不知道吃什么？",
    kokiStart: "开启美食对话",
    kokiGreeting: "您好！我是 Koki Teng 厨师。今天不知道吃什么吗？告诉我您喜欢吃什么，我会为您寻找最完美的佳肴！ 🐼🍜",
    kokiError: "哎呀，Koki Teng 正忙于准备订单，请稍后再试！",
    searchTitle: "搜索",
    searchResultsFor: "搜索结果：",
    searchNoResults: "未找到相关菜品"
  }
};

export const translateMenuItem = (item: MenuItem, lang: 'id' | 'en' | 'zh'): MenuItem => {
  const translations: Record<string, Record<'id' | 'en' | 'zh', { name: string; category: string; description: string }>> = {
    'bakmie-kering': {
      id: {
        name: 'Bakmie Kering',
        category: 'Bakmie',
        description: 'Bakmie khas Kalimantan dengan bumbu gurih dan topping lengkap.'
      },
      en: {
        name: 'Dry Bakmie (Noodles)',
        category: 'Bakmie',
        description: 'Kalimantan style dry noodles with savory seasoning and complete toppings.'
      },
      zh: {
        name: '加里曼丹干捞面',
        category: '肉面',
        description: '风味独特的加里曼丹干面，配以鲜美酱油和丰富的佐料。'
      }
    },
    'bakmie-kuah': {
      id: {
        name: 'Bakmie Kuah',
        category: 'Bakmie',
        description: 'Bakmie dengan kuah kaldu hangat yang segar dan nikmat.'
      },
      en: {
        name: 'Bakmie Soup (Noodles)',
        category: 'Bakmie',
        description: 'Noodles in a warm, fresh, and savory broth.'
      },
      zh: {
        name: '鲜汤肉面',
        category: '肉面',
        description: '搭配热气腾腾、鲜甜美味高汤的肉面。'
      }
    },
    'bakmie-goreng': {
      id: {
        name: 'Bakmie Goreng',
        category: 'Bakmie',
        description: 'Bakmie goreng dengan bumbu khas yang meresap sempurna.'
      },
      en: {
        name: 'Fried Bakmie (Noodles)',
        category: 'Bakmie',
        description: 'Stir-fried noodles with perfectly infused signature seasonings.'
      },
      zh: {
        name: '印尼风味炒面',
        category: '肉面',
        description: '镬气十足、特制酱汁均匀入味的美味炒面。'
      }
    },
    'kwetiao-goreng': {
      id: {
        name: 'Kwetiao Goreng',
        category: 'Kwetiao',
        description: 'Kwetiao goreng dengan aroma smokey yang menggugah selera.'
      },
      en: {
        name: 'Fried Kwetiao',
        category: 'Kwetiao',
        description: 'Stir-fried flat rice noodles with an appetizing smokey aroma (Wok Hei).'
      },
      zh: {
        name: '牛肉炒粿条',
        category: '粿条',
        description: '特制酱油爆炒、镬气十足的美味炒粿条。'
      }
    },
    'kwetiao-kering': {
      id: {
        name: 'Kwetiao Kering',
        category: 'Kwetiao',
        description: 'Kwetiao tanpa kuah dengan bumbu spesial.'
      },
      en: {
        name: 'Dry Kwetiao',
        category: 'Kwetiao',
        description: 'Dry seasoned flat rice noodles with our special secret sauce.'
      },
      zh: {
        name: '干捞粿条',
        category: '粿条',
        description: '拌以香浓肉油 and 特制调料的美味干拌粿条。'
      }
    },
    'kwetiao-kuah': {
      id: {
        name: 'Kwetiao Kuah',
        category: 'Kwetiao',
        description: 'Kwetiao lembut dengan kuah kaldu bening yang gurih.'
      },
      en: {
        name: 'Kwetiao Soup',
        category: 'Kwetiao',
        description: 'Soft flat rice noodles in a clear and savory bone broth.'
      },
      zh: {
        name: '上汤粿条',
        category: '粿条',
        description: '口感软滑，配以清甜浓郁高汤的粿条汤。'
      }
    },
    'capcai-kering': {
      id: {
        name: 'Nasi Capcai Kering',
        category: 'Nasi',
        description: 'Nasi dengan tumis aneka sayuran segar khas Kalbar.'
      },
      en: {
        name: 'Dry Capcai Rice',
        category: 'Rice',
        description: 'Steamed rice with stir-fried fresh assorted vegetables in premium savory garlic seasoning.'
      },
      zh: {
        name: '干炒杂菜饭 (Nasi Capcai)',
        category: '饭食',
        description: '搭配大火爆炒新鲜时令蔬菜的香米饭，鲜甜爽脆。'
      }
    },
    'capcai-kuah': {
      id: {
        name: 'Nasi Capcai Kuah',
        category: 'Nasi',
        description: 'Nasi dengan sayuran segar dalam kuah kental hangat khas Kalbar.'
      },
      en: {
        name: 'Capcai Soup Rice',
        category: 'Rice',
        description: 'Steamed rice with assorted fresh vegetables in a warm, thick, and savory gravy.'
      },
      zh: {
        name: '杂菜汤饭 (Nasi Capcai Kuah)',
        category: '饭食',
        description: '搭配温热鲜美杂菜浓汤的香米饭。'
      }
    },
    'kaifon': {
      id: {
        name: 'Nasi Campur (Kaifon)',
        category: 'Nasi',
        description: 'Nasi campur khas Kalimantan Barat dengan aneka topping daging.'
      },
      en: {
        name: 'Kaifon (Mixed Rice)',
        category: 'Nasi',
        description: 'West Kalimantan styled mixed rice with various savory roasted meat toppings.'
      },
      zh: {
        name: '加里曼丹杂烩饭 (Kaifon)',
        category: '饭食',
        description: '配有多种秘制烤肉和香浓浇汁的西加经典盖饭。'
      }
    },
    'jeruk-nipis': {
      id: {
        name: 'Jeruk Nipis',
        category: 'Minuman',
        description: 'Segar dan asam manis alami.'
      },
      en: {
        name: 'Lime Juice',
        category: 'Minuman',
        description: 'Fresh and naturally sweet-sour lime juice.'
      },
      zh: {
        name: '鲜榨青柠汁',
        category: '饮料',
        description: '新鲜原汁青柠檬，酸甜解腻。'
      }
    },
    'teh': {
      id: {
        name: 'Teh',
        category: 'Minuman',
        description: 'Teh manis klasik.'
      },
      en: {
        name: 'Tea',
        category: 'Minuman',
        description: 'Classic sweetened jasmine tea.'
      },
      zh: {
        name: '经典印尼红茶',
        category: '饮料',
        description: '传统香甜红茶，冷热皆宜。'
      }
    },
    'susu-kedelai': {
      id: {
        name: 'Susu Kedelai',
        category: 'Minuman',
        description: 'Susu kedelai murni yang menyehatkan.'
      },
      en: {
        name: 'Soy Milk',
        category: 'Minuman',
        description: 'Healthy and premium pure soy milk.'
      },
      zh: {
        name: '自制纯正豆浆',
        category: '饮料',
        description: '手工每日磨制，香浓营养健康。'
      }
    },
    'kopi': {
      id: {
        name: 'Kopi',
        category: 'Minuman',
        description: 'Kopi hitam mantap.'
      },
      en: {
        name: 'Coffee',
        category: 'Minuman',
        description: 'Rich and bold classic black coffee.'
      },
      zh: {
        name: '传统黑咖啡',
        category: '饮料',
        description: '精选本地咖啡豆烘焙而成，浓郁提神。'
      }
    },
    'extra-joss': {
      id: {
        name: 'Extra Joss',
        category: 'Minuman',
        description: 'Minuman energi untuk stamina.'
      },
      en: {
        name: 'Extra Joss',
        category: 'Minuman',
        description: 'Classic Indonesian energy drink for ultimate stamina.'
      },
      zh: {
        name: 'Extra Joss 活力饮料',
        category: '饮料',
        description: '印尼经典能量饮品，迅速补充体力。'
      }
    }
  };

  const found = translations[item.id];
  if (found && found[lang]) {
    return {
      ...item,
      name: found[lang].name,
      category: found[lang].category,
      description: found[lang].description
    };
  }
  return item;
};

export const getCategoryTranslation = (catName: string, lang: 'id' | 'en' | 'zh'): string => {
  const cats: Record<string, Record<'id' | 'en' | 'zh', string>> = {
    'Semua': { id: 'Semua', en: 'All', zh: '全部' },
    'Bakmie': { id: 'Bakmie', en: 'Bakmie', zh: '肉面' },
    'Kwetiao': { id: 'Kwetiao', en: 'Kwetiao', zh: '粿条' },
    'Capcai': { id: 'Capcai', en: 'Capcai', zh: '杂菜' },
    'Nasi': { id: 'Nasi', en: 'Rice', zh: '饭食' },
    'Minuman': { id: 'Minuman', en: 'Drinks', zh: '饮料' }
  };
  return cats[catName]?.[lang] || catName;
};

export const getInitialLanguage = (): 'id' | 'en' | 'zh' => {
  const savedLang = localStorage.getItem('rm_segar_language');
  if (savedLang === 'id' || savedLang === 'en' || savedLang === 'zh') {
    return savedLang;
  }
  const browserLang = navigator.language || (navigator.languages && navigator.languages[0]) || '';
  const langLower = browserLang.toLowerCase();
  if (langLower.startsWith('zh')) {
    return 'zh';
  }
  if (langLower.startsWith('en')) {
    return 'en';
  }
  return 'id';
};

interface CartItem extends MenuItem {
  quantity: number;
  option?: 'Es' | 'Panas';
  note?: string;
}

interface Order {
  id: string;
  date: string;
  items?: CartItem[];
  customText?: string;
  totalItems: number;
  orderType: 'Makan di Tempat' | 'Bungkus' | 'AI Chat';
  status?: 'pending' | 'cooking' | 'done' | 'cancelled';
  tableNumber?: string;
  deliveryMethod?: 'ambil_sendiri' | 'kirim_alamat';
  deliveryAddress?: string;
}

interface Reservation {
  id: string;
  date: string;
  bookingName: string;
  bookingDate: string;
  bookingTime: string;
  partySize: number;
  details: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

const MenuIcon = ({ item, size = 32, className = "" }: { item: MenuItem, size?: number, className?: string }) => {
  const getIcon = () => {
    if (item.category === 'Minuman') {
      if (item.id === 'kopi' || item.id === 'teh') return <Coffee size={size} className={className} />;
      if (item.id === 'extra-joss') return <Zap size={size} className={className} />;
      return <GlassWater size={size} className={className} />;
    }
    if (item.name.toLowerCase().includes('kuah') || item.category === 'Capcai') {
      return <Soup size={size} className={className} />;
    }
    return <Utensils size={size} className={className} />;
  };

  const getBgColor = () => {
    if (item.category === 'Minuman') return 'bg-blue-50 text-blue-500';
    if (item.category === 'Bakmie') return 'bg-orange-50 text-orange-500';
    if (item.category === 'Kwetiao') return 'bg-red-50 text-red-500';
    if (item.category === 'Capcai') return 'bg-green-50 text-green-600';
    if (item.category === 'Nasi') return 'bg-yellow-50 text-yellow-600';
    return 'bg-stone-50 text-stone-500';
  };

  return (
    <div className={`w-full h-full flex items-center justify-center ${getBgColor()}`}>
      {getIcon()}
    </div>
  );
};

const MainLogo = ({ size = 64, className = "" }: { size?: number, className?: string }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Stylized Bowl Logo matching user image */}
      <div className="relative">
        <Soup size={size} strokeWidth={2.5} />
        {/* Decorative "+" symbols from the image */}
        <div className="absolute -top-2 -right-2 text-red-500 font-bold text-xs">+</div>
        <div className="absolute -bottom-2 -left-2 text-red-500 font-bold text-xs">+</div>
        <div className="absolute top-1/2 -left-4 text-red-500 font-bold text-xs">+</div>
      </div>
    </div>
  );
};

const parseChatMessage = (text: string) => {
  const cleanedTextFromAsterisks = text.replace(/\*\*/g, '');
  const match = cleanedTextFromAsterisks.match(/\[KIRIM_WA:\s*(pesanan|reservasi)\s*\|\s*([^\]]+)\]/);
  if (match) {
    const type = match[1];
    const content = match[2].trim();
    const cleanText = cleanedTextFromAsterisks.replace(/\[KIRIM_WA:\s*(pesanan|reservasi)\s*\|\s*([^\]]+)\]/, '').trim();
    return { cleanText, waLink: { type, content } };
  }
  return { cleanText: cleanedTextFromAsterisks, waLink: null };
};

const parseReservationText = (text: string): Omit<Reservation, 'id' | 'date' | 'status'> => {
  let bookingName = "Pelanggan AI";
  let bookingDate = "Hari Ini";
  let bookingTime = "12:00";
  let partySize = 2;

  const nameMatch = text.match(/atas nama\s+([A-Za-z0-9\s]+?)(?=\s+untuk|\s+tanggal|\s+jam|\s+sebanyak|$)/i);
  if (nameMatch) bookingName = nameMatch[1].trim();

  const dateMatch = text.match(/tanggal\s+([A-Za-z0-9\s/.-]+?)(?=\s+jam|\s+sebanyak|$)/i);
  if (dateMatch) bookingDate = dateMatch[1].trim();

  const timeMatch = text.match(/jam\s+([A-Za-z0-9\s:.]+?)(?=\s+sebanyak|\s+orang|$)/i);
  if (timeMatch) bookingTime = timeMatch[1].trim();

  const sizeMatch = text.match(/(?:sebanyak\s+)?(\d+)\s+orang/i);
  if (sizeMatch) partySize = parseInt(sizeMatch[1], 10);

  return {
    bookingName,
    bookingDate,
    bookingTime,
    partySize,
    details: text
  };
};

const parseAIOrderText = (text: string) => {
  const items: CartItem[] = [];
  const listMatch = text.match(/(?:memesan:\s*)(.+?)(?=\s*\.|\s*Terima kasih|$)/i);
  let customText = text;
  let totalItems = 0;

  if (listMatch) {
    const itemsRaw = listMatch[1].split(',');
    itemsRaw.forEach(raw => {
      const trimmed = raw.trim();
      const qtyMatch = trimmed.match(/(.+?)\s*\((\d+)x\)/);
      if (qtyMatch) {
        const name = qtyMatch[1].trim();
        const qty = parseInt(qtyMatch[2], 10);
        totalItems += qty;
        const menuItem = MENU_ITEMS.find(m => m.name.toLowerCase() === name.toLowerCase());
        if (menuItem) {
          items.push({
            ...menuItem,
            quantity: qty
          });
        } else {
          items.push({
            id: Math.random().toString(),
            name,
            category: 'Semua',
            description: '',
            hasOptions: false,
            quantity: qty
          });
        }
      }
    });
  }

  if (items.length === 0) {
    const qtyMatches = [...text.matchAll(/\((\d+)x\)/g)];
    totalItems = qtyMatches.reduce((sum, match) => sum + parseInt(match[1], 10), 0) || 1;
  }

  return {
    items,
    customText,
    totalItems
  };
};

export interface ChineseFortune {
  id: string;
  menuId: string;
  advice: {
    id: string;
    en: string;
    zh: string;
  };
  luckLevel: string;
  chineseProverb: string;
}

export const CHINESE_FORTUNES: ChineseFortune[] = [
  {
    id: 'f1',
    menuId: 'bakmie-kering',
    advice: {
      id: 'Makan Mie Kering khas Kalbar hari ini mendatangkan umur panjang dan rezeki yang lancar tanpa hambatan!',
      en: 'Eating authentic Dry Bakmie today brings long life and a smooth, unhindered flow of wealth!',
      zh: '今日品尝正宗干面，将为您带来延年益寿之喜，财源滚滚，万事顺遂！'
    },
    luckLevel: '⭐⭐⭐⭐⭐ 大吉 (Sangat Hoki)',
    chineseProverb: '长寿安康 • 财源广进'
  },
  {
    id: 'f2',
    menuId: 'kaifon',
    advice: {
      id: 'Nasi Campur membawa berkah keragaman. Akan ada kejutan menyenangkan yang berpadu indah dalam hidupmu!',
      en: 'Nasi Campur represents the blessing of diversity. Joyful surprises will blend beautifully in your life today!',
      zh: '什锦饭象征着包容与多福。今天将有美妙的惊喜融入您的生活，精彩万分！'
    },
    luckLevel: '⭐⭐⭐⭐⭐ 吉星高照 (Hoki Sempurna)',
    chineseProverb: '五福临门 • 喜气盈门'
  },
  {
    id: 'f3',
    menuId: 'kwetiao-goreng',
    advice: {
      id: 'Aroma smokey wajan Kwetiao Goreng yang harum menandakan karirmu akan melesat naik dengan cepat!',
      en: 'The rich smokey aroma of Kwetiao Goreng indicates your career or business will rise rapidly!',
      zh: '香气四溢的炒粉镬气，预示着您的事业或学业即将蒸蒸日上，步步高升！'
    },
    luckLevel: '⭐⭐⭐⭐⭐ 蒸蒸日上 (Hoki Melesat)',
    chineseProverb: '步步高升 • 飞黄腾达'
  },
  {
    id: 'f4',
    menuId: 'capcai-kuah',
    advice: {
      id: 'Kehangatan Capcai Kuah penuh gizi membawa kedamaian hati dan kesehatan prima untukmu dan keluarga.',
      en: 'The warm and nutritious Capcai soup brings complete peace of mind and prime wellness to you and your family.',
      zh: '温润滋补的杂菜汤，为您和家人带来内心的安宁与健康的守护。'
    },
    luckLevel: '⭐⭐⭐⭐ 吉祥如意 (Hoki Sehat)',
    chineseProverb: '阖家安康 • 顺心如意'
  },
  {
    id: 'f5',
    menuId: 'susu-kedelai',
    advice: {
      id: 'Susu Kedelai murni yang menyegarkan melambangkan kemurnian hati dan pikiran jernih hari ini.',
      en: 'Pure, refreshing Soy Milk symbolizes an honest heart and clear mind to take great decisions today.',
      zh: '纯净香浓的豆浆象征着剔透的心境与智慧，助您在今日做出明智且幸运的抉择。'
    },
    luckLevel: '⭐⭐⭐⭐ 黄金满屋 (Hoki Pikiran)',
    chineseProverb: '金玉满堂 • 聪慧过人'
  },
  {
    id: 'f6',
    menuId: 'jeruk-nipis',
    advice: {
      id: 'Kesegaran Jeruk Nipis akan mencairkan segala ketegangan. Masalah rumit akan selesai dengan akhir menyegarkan!',
      en: 'The vibrant zest of Jeruk Nipis will dissolve all tensions. Complex challenges will resolve with a sparkling clear outcome!',
      zh: '清新酸甜的青柠将化解一切烦忧。棘手的难题今日定能迎刃而解，迎来清爽结局！'
    },
    luckLevel: '⭐⭐⭐⭐ 拨云见日 (Hoki Keberuntungan)',
    chineseProverb: '迎刃而解 • 神清气爽'
  }
];

export interface ShioDetail {
  id: string;
  name: string;
  zh: string;
  emoji: string;
  elementDefault: string;
  foodId: string;
  luckyNumbers: string;
  luckyColors: { id: string; en: string; zh: string };
  luckyDirection: { id: string; en: string; zh: string };
  trait: { id: string; en: string; zh: string };
  desc: {
    id: string;
    en: string;
    zh: string;
  };
}

export const SHIO_DETAILS: ShioDetail[] = [
  {
    id: 'rat',
    name: 'Tikus',
    zh: '鼠',
    emoji: '🐭',
    elementDefault: 'Air',
    foodId: 'bakmie-kering',
    luckyNumbers: '2, 3, 6',
    luckyColors: { id: 'Emas & Hijau', en: 'Gold & Green', zh: '金色与绿色' },
    luckyDirection: { id: 'Tenggara & Timur Laut', en: 'Southeast & Northeast', zh: '东南与东北' },
    trait: { id: 'Cerdas, Lincah & Penuh Strategi', en: 'Clever, Agile & Strategic', zh: '机智敏捷、足智多谋' },
    desc: {
      id: 'Shio Tikus yang cerdas menyukai kepraktisan dan kelezatan yang padat. Bakmie Kering dengan topping lengkap sangat cocok untuk menemani hari produktif Anda!',
      en: 'The clever Rat loves practical yet rich flavors. Dry Bakmie with complete toppings is perfect to accompany your highly productive day!',
      zh: '聪慧的属鼠者喜爱精致实用的美味。配料多样的干拌面绝对是陪伴您高效一天的完美之选！'
    }
  },
  {
    id: 'ox',
    name: 'Kerbau',
    zh: '牛',
    emoji: '🐮',
    elementDefault: 'Tanah',
    foodId: 'capcai-kuah',
    luckyNumbers: '1, 8, 9',
    luckyColors: { id: 'Kuning Karamel & Merah', en: 'Caramel Yellow & Red', zh: '琥珀黄与大红' },
    luckyDirection: { id: 'Utara & Barat Daya', en: 'North & Southwest', zh: '正北与西南' },
    trait: { id: 'Tekun, Setia & Pantang Menyerah', en: 'Diligent, Loyal & Persistent', zh: '勤劳稳重、踏实坚韧' },
    desc: {
      id: 'Shio Kerbau yang tekun dan kuat membutuhkan asupan gizi yang seimbang dan menenangkan. Nasi Capcai Kuah hangat yang kaya serat adalah pilihan terbaik!',
      en: 'The diligent and strong Ox needs balanced and comforting nourishment. Warm Nasi Capcai Kuah, rich in fibers, is your ultimate companion!',
      zh: '勤劳稳健的属牛者需要均衡滋补的膳食。汤汁浓郁、膳食纤维丰富的杂菜汤饭是您的最佳滋养！'
    }
  },
  {
    id: 'tiger',
    name: 'Macan',
    zh: '虎',
    emoji: '🐯',
    elementDefault: 'Kayu',
    foodId: 'kwetiao-goreng',
    luckyNumbers: '1, 3, 4',
    luckyColors: { id: 'Jingga & Biru Langit', en: 'Orange & Sky Blue', zh: '橙色与天蓝' },
    luckyDirection: { id: 'Selatan & Timur', en: 'South & East', zh: '正南与正东' },
    trait: { id: 'Pemberani, Antusias & Karismatik', en: 'Brave, Enthusiastic & Charismatic', zh: '勇猛威严、富有领导力' },
    desc: {
      id: 'Shio Macan yang berani sangat menggemari aroma arang wajan (wok hei) yang kuat. Kwetiao Goreng Sapi beraroma smokey akan membakar semangat hoki Anda!',
      en: 'The brave Tiger craves intense wok hei aromas. Smokey Kwetiao Goreng is guaranteed to ignite your lucky spirit today!',
      zh: '勇猛进取的属虎者钟爱浓郁的镬气。热辣生香的炒沙河粉定能瞬间点燃您一整天的幸运斗志！'
    }
  },
  {
    id: 'rabbit',
    name: 'Kelinci',
    zh: '兔',
    emoji: '🐰',
    elementDefault: 'Kayu',
    foodId: 'susu-kedelai',
    luckyNumbers: '3, 4, 9',
    luckyColors: { id: 'Merah Muda & Ungu', en: 'Pink & Purple', zh: '粉红与紫色' },
    luckyDirection: { id: 'Barat Daya & Barat Laut', en: 'Southwest & Northwest', zh: '西南与西北' },
    trait: { id: 'Anggun, Lembut & Penuh Kedamaian', en: 'Elegant, Gentle & Peaceful', zh: '温和典雅、善良体贴' },
    desc: {
      id: 'Shio Kelinci yang anggun dan lembut sangat cocok dengan kesegaran yang alami dan murni. Susu Kedelai murni yang manis lembut akan menjaga kedamaian hati Anda.',
      en: 'The elegant and gentle Rabbit matches beautifully with pure, natural refreshment. Sweet, silky Soy Milk will preserve your peaceful harmony today.',
      zh: '温雅高贵的属兔者最适合纯天然的温润。一杯清甜浓香的现磨豆浆，将为您带来内心的安宁与惬意。'
    }
  },
  {
    id: 'dragon',
    name: 'Naga',
    zh: '龙',
    emoji: '🐲',
    elementDefault: 'Tanah',
    foodId: 'kaifon',
    luckyNumbers: '1, 6, 7',
    luckyColors: { id: 'Emas Imperial & Perak', en: 'Imperial Gold & Silver', zh: '帝王金与亮银' },
    luckyDirection: { id: 'Barat & Barat Laut', en: 'West & Northwest', zh: '正西与西北' },
    trait: { id: 'Megah, Berani & Penuh Kejayaan', en: 'Majestic, Bold & Ambitious', zh: '尊贵非凡、雄心勃勃' },
    desc: {
      id: 'Shio Naga yang megah menyukai kemewahan rasa dan ragam topping berlimpah. Nasi Campur (Kaifon) spesial dengan aneka daging lezat adalah lambang kejayaan Anda!',
      en: 'The majestic Dragon deserves a feast of rich, diverse premium toppings. Nasi Campur (Kaifon) with multi-meat toppings perfectly represents your glorious luck!',
      zh: '尊荣非凡的属龙者值得拥有一场饕餮盛宴。配料豪华、酱汁香浓的招牌什锦饭正是您鸿运当头的象征！'
    }
  },
  {
    id: 'snake',
    name: 'Ular',
    zh: '蛇',
    emoji: '🐍',
    elementDefault: 'Api',
    foodId: 'kwetiao-kering',
    luckyNumbers: '2, 8, 9',
    luckyColors: { id: 'Hitam Elegan & Merah', en: 'Elegant Black & Red', zh: '玄黑与大红' },
    luckyDirection: { id: 'Barat Daya & Selatan', en: 'Southwest & South', zh: '西南与正南' },
    trait: { id: 'Intuitif, Bijaksana & Penuh Rahasia', en: 'Intuitive, Wise & Mysterious', zh: '深谋远虑、冷静睿智' },
    desc: {
      id: 'Shio Ular yang penuh misteri dan intuitif menyukai perpaduan rasa bumbu halus yang meresap sempurna. Kwetiao Kering spesial adalah rahasia hoki Anda.',
      en: 'The mysterious and intuitive Snake appreciates complex, deeply infused secret spices. Special Kwetiao Kering holds the hidden key to your fortune today.',
      zh: '神秘睿智的属蛇者钟爱层次丰富、调味入骨的秘制美食。一盘酱香四溢的干拌河粉正是您的开运密码。'
    }
  },
  {
    id: 'horse',
    name: 'Kuda',
    zh: '马',
    emoji: '🐴',
    elementDefault: 'Api',
    foodId: 'bakmie-goreng',
    luckyNumbers: '2, 3, 7',
    luckyColors: { id: 'Kuning Kunyit & Hijau', en: 'Turmeric Yellow & Green', zh: '姜黄与翠绿' },
    luckyDirection: { id: 'Barat Daya & Barat', en: 'Southwest & West', zh: '西南与正西' },
    trait: { id: 'Berenergi Tinggi, Bebas & Dinamis', en: 'Energetic, Free-spirited & Dynamic', zh: '热情奔放、极富活力' },
    desc: {
      id: 'Shio Kuda yang berenergi tinggi membutuhkan hidangan lezat berkalori tinggi yang cepat saji. Bakmie Goreng spesial akan memberi Anda dorongan energi ekstra!',
      en: 'The high-energy Horse needs a fast, flavorful, and energizing meal. Special Bakmie Goreng will give you that extra boost to race through your day!',
      zh: '活力充沛的属马者需要热气腾腾、能量满满的美味。一盘镬气十足的炒面，让您今天继续龙马精神、一往无前！'
    }
  },
  {
    id: 'goat',
    name: 'Kambing',
    zh: '羊',
    emoji: '🐐',
    elementDefault: 'Tanah',
    foodId: 'capcai-kering',
    luckyNumbers: '2, 7, 8',
    luckyColors: { id: 'Cokelat Kayu & Putih', en: 'Wood Brown & White', zh: '木棕与雪白' },
    luckyDirection: { id: 'Utara & Barat Daya', en: 'North & Southwest', zh: '正北与西南' },
    trait: { id: 'Lembut, Penyayang & Artistik', en: 'Gentle, Loving & Artistic', zh: '温和善良、富有艺术气质' },
    desc: {
      id: 'Shio Kambing yang damai dan penyayang menyukai kelezatan sayur-sayuran segar beraroma harum. Nasi Capcai Kering adalah sajian harmoni yang menenangkan jiwa.',
      en: 'The peaceful and loving Goat loves fresh, fragrant, and vibrant stir-fried vegetables. Nasi Capcai Kering is a harmonious dish that calms your soul.',
      zh: '和蔼温顺的属羊者最爱清鲜爽口、色泽诱人的时令蔬菜。一盘干炒什锦杂菜饭，带给您温暖治愈的心灵享受。'
    }
  },
  {
    id: 'monkey',
    name: 'Monyet',
    zh: '猴',
    emoji: '🐵',
    elementDefault: 'Logam',
    foodId: 'jeruk-nipis',
    luckyNumbers: '4, 9, 1',
    luckyColors: { id: 'Putih Murni & Biru Laut', en: 'Pure White & Ocean Blue', zh: '纯白与海蓝' },
    luckyDirection: { id: 'Utara & Barat Laut', en: 'North & Northwest', zh: '正北与西北' },
    trait: { id: 'Jenaka, Cerdas & Cepat Tanggap', en: 'Witty, Intelligent & Quick-witted', zh: '聪明伶俐、幽默风趣' },
    desc: {
      id: 'Shio Monyet yang jenaka dan ceria sangat menyukai kejutan rasa asam manis yang menyegarkan. Es Jeruk Nipis Pontianak yang asam manis akan mencerahkan ide hoki Anda!',
      en: 'The playful and witty Monkey loves refreshing, sweet-and-sour flavor bursts. Sweet-sour Ice Jeruk Nipis Pontianak will spark brilliant, lucky ideas today!',
      zh: '机灵俏皮的属猴者最爱酸甜交织、爽口解腻的清新滋味。一杯冰镇青柠汁，瞬间唤醒您的奇思妙想与开运福气！'
    }
  },
  {
    id: 'rooster',
    name: 'Ayam',
    zh: '鸡',
    emoji: '🐔',
    elementDefault: 'Logam',
    foodId: 'bakmie-kuah',
    luckyNumbers: '5, 7, 8',
    luckyColors: { id: 'Kuning Keemasan & Cokelat', en: 'Golden Yellow & Brown', zh: '金黄与咖啡色' },
    luckyDirection: { id: 'Timur Laut & Selatan', en: 'Northeast & South', zh: '东北与正南' },
    trait: { id: 'Teliti, Rapi & Penuh Percaya Diri', en: 'Meticulous, Neat & Confident', zh: '勤奋精明、条理分明' },
    desc: {
      id: 'Shio Ayam yang teliti dan rapi sangat menikmati sup kaldu bening yang bersih dan menghangatkan jiwa. Bakmie Kuah kaldu murni adalah resep kenyamanan hoki Anda.',
      en: 'The meticulous and neat Rooster enjoys clean, soul-warming clear bone broths. Bakmie Kuah with pure rich broth is your perfect recipe for comforting luck.',
      zh: '追求完美、做事井井有条的属鸡者，最懂欣赏一碗纯净鲜美的清汤。高汤熬制的汤面是您今天最好的舒心美味。'
    }
  },
  {
    id: 'dog',
    name: 'Anjing',
    zh: '狗',
    emoji: '🐶',
    elementDefault: 'Tanah',
    foodId: 'kwetiao-kuah',
    luckyNumbers: '3, 4, 9',
    luckyColors: { id: 'Hijau Daun & Merah', en: 'Leaf Green & Red', zh: '翠绿与大红' },
    luckyDirection: { id: 'Timur & Tenggara', en: 'East & Southeast', zh: '正东与东南' },
    trait: { id: 'Setia, Jujur & Menghangatkan Hati', en: 'Loyal, Honest & Heartwarming', zh: '忠诚坦荡、守护温暖' },
    desc: {
      id: 'Shio Anjing yang setia dan hangat sangat menyukai sup hangat yang menenangkan hati di tengah keluarga. Kwetiao Kuah gurih akan melipatgandakan kebahagiaan harian Anda.',
      en: 'The loyal and warm-hearted Dog treasures comforting soups shared with loved ones. Savory Kwetiao Kuah will double your daily joy and absolute peace.',
      zh: '忠诚温厚的属狗者最爱充满家常温度的暖心汤羹。一碗温润细腻的汤河粉，定能让您的今日幸福感倍增。'
    }
  },
  {
    id: 'pig',
    name: 'Babi',
    zh: '猪',
    emoji: '🐷',
    elementDefault: 'Air',
    foodId: 'kopi',
    luckyNumbers: '2, 5, 8',
    luckyColors: { id: 'Kuning Emas & Hitam', en: 'Golden Yellow & Black', zh: '金黄与墨黑' },
    luckyDirection: { id: 'Tenggara & Timur', en: 'Southeast & East', zh: '东南与正东' },
    trait: { id: 'Santai, Ramah & Penuh Rezeki', en: 'Easygoing, Friendly & Abundantly Blessed', zh: '心胸宽广、福禄双全' },
    desc: {
      id: 'Shio Babi yang santai dan penuh berkah menyukai minuman mantap beraroma harum mendalam. Kopi Hitam Mantap khas Kalbar adalah teman diskusi & penarik rezeki Anda!',
      en: 'The easygoing and blessed Pig loves deep, aromatic and bold classic drinks. Bold Black Coffee from Kalbar is your best companion to draw continuous fortune!',
      zh: '随和富态、福泽深厚的属猪者最懂享受香气浓郁的美味。一杯浓郁提神的古法黑咖啡，让您舒心悠闲、财源滚滚！'
    }
  }
];

export const WHEEL_ITEMS = [
  { id: 'bakmie-kering', name: 'Bakmie Kering', emoji: '🍜', bg: '#d97706', text: '#ffffff' },
  { id: 'kwetiao-goreng', name: 'Kwetiao Goreng', emoji: '🥢', bg: '#ea580c', text: '#ffffff' },
  { id: 'kaifon', name: 'Nasi Campur (Kaifon)', emoji: '🍛', bg: '#dc2626', text: '#ffffff' },
  { id: 'capcai-kuah', name: 'Capcai Kuah', emoji: '🍲', bg: '#059669', text: '#ffffff' },
  { id: 'jeruk-nipis', name: 'Es Jeruk Nipis', emoji: '🍋', bg: '#eab308', text: '#ffffff' },
  { id: 'susu-kedelai', name: 'Susu Kedelai', emoji: '🥛', bg: '#7c3aed', text: '#ffffff' },
  { id: 'kwetiao-kering', name: 'Kwetiao Kering', emoji: '🥢', bg: '#b45309', text: '#ffffff' },
  { id: 'kopi', name: 'Kopi Hitam', emoji: '☕', bg: '#44403c', text: '#ffffff' }
];

export interface BlockPiece {
  id: string;
  shape: number[][];
  color: string;
  emoji: string;
}

export const BLOCK_PRESETS: Omit<BlockPiece, 'id'>[] = [
  { shape: [[1]], color: '#f59e0b', emoji: '🍜' },
  { shape: [[1, 1]], color: '#ef4444', emoji: '🥢' },
  { shape: [[1], [1]], color: '#10b981', emoji: '🍛' },
  { shape: [[1, 1, 1]], color: '#3b82f6', emoji: '🥟' },
  { shape: [[1], [1], [1]], color: '#8b5cf6', emoji: '☕' },
  { shape: [[1, 1], [1, 1]], color: '#ec4899', emoji: '🍋' },
  { shape: [[1, 1, 1], [0, 1, 0]], color: '#f97316', emoji: '🍡' },
  { shape: [[1, 0], [1, 1]], color: '#14b8a6', emoji: '🍚' },
  { shape: [[0, 1], [1, 1]], color: '#06b6d4', emoji: '🧋' },
  { shape: [[1, 1, 1, 1]], color: '#84cc16', emoji: '🥬' },
  { shape: [[1, 1], [1, 0]], color: '#d97706', emoji: '🥟' }
];

export const canPlacePiece = (board: (string | null)[][], shape: number[][], startR: number, startC: number): boolean => {
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (shape[r][c] === 1) {
        const boardR = startR + r;
        const boardC = startC + c;
        if (boardR < 0 || boardR >= 8 || boardC < 0 || boardC >= 8) return false;
        if (board[boardR][boardC] !== null) return false;
      }
    }
  }
  return true;
};

export const canFitAnywhere = (board: (string | null)[][], pieces: (BlockPiece | null)[]): boolean => {
  const activePieces = pieces.filter((p): p is BlockPiece => p !== null);
  if (activePieces.length === 0) return true;
  for (const piece of activePieces) {
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (canPlacePiece(board, piece.shape, r, c)) return true;
      }
    }
  }
  return false;
};

// Admin Credentials for Multi-User Dashboard Access
const ADMIN_PHONE_NUMBERS = ['6289518948115', '089518948115', '89518948115'];
const ADMIN_EMAILS = ['livinajong123@gmail.com', 'valensiarainy73@gmail.com'];

const isAdminUser = (u: { phone?: string; email?: string } | null): boolean => {
  if (!u) return false;
  if (u.phone) {
    const cleanPhone = u.phone.replace(/\D/g, '');
    if (ADMIN_PHONE_NUMBERS.includes(cleanPhone) || cleanPhone === '6289518948115') {
      return true;
    }
  }
  if (u.email && ADMIN_EMAILS.includes(u.email.toLowerCase())) {
    return true;
  }
  return false;
};

export default function App() {
  const cartDragControls = useDragControls();
  const chatDragControls = useDragControls();
  const noteDragControls = useDragControls();
  const optionDragControls = useDragControls();
  const fortuneDragControls = useDragControls();
  const pdfDragControls = useDragControls();

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('rm_segar_cart');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('rm_segar_favs');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('rm_segar_orders');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [reservations, setReservations] = useState<Reservation[]>(() => {
    try {
      const saved = localStorage.getItem('rm_segar_reservations');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('rm_segar_search_history');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [activeTab, setActiveTab] = useState('home');
  const [language, setLanguage] = useState<'id' | 'en' | 'zh'>(getInitialLanguage);
  const [showOrderHistory, setShowOrderHistory] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminEmailInput, setAdminEmailInput] = useState('');
  const [adminTab, setAdminTab] = useState<'orders' | 'reservations'>('orders');
  const [confirmedAIMessages, setConfirmedAIMessages] = useState<Record<number, boolean>>({});
  const [user, setUser] = useState<{ phone?: string; email?: string } | null>(null);
  const [loginPhone, setLoginPhone] = useState('62');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginMode, setLoginMode] = useState<'login' | 'forgot' | 'verify' | 'admin_google'>('login');
  const [pendingAdminUser, setPendingAdminUser] = useState<{ phone?: string; email?: string } | null>(null);
  const [adminGoogleEmail, setAdminGoogleEmail] = useState('livinajong123@gmail.com');
  const [resetToken, setResetToken] = useState('');
  const [inputToken, setInputToken] = useState('');
  const [optionModalItem, setOptionModalItem] = useState<MenuItem | null>(null);
  const [selectedOption, setSelectedOption] = useState<'Es' | 'Panas'>('Es');
  const [noteModalItem, setNoteModalItem] = useState<{ id: string, option?: 'Es' | 'Panas', note: string } | null>(null);
  const [orderType, setOrderType] = useState<'Makan di Tempat' | 'Bungkus'>('Makan di Tempat');
  const [tableNumber, setTableNumber] = useState(() => localStorage.getItem('rm_segar_table_number') || '');
  const [deliveryMethod, setDeliveryMethod] = useState<'ambil_sendiri' | 'kirim_alamat'>(() => {
    return (localStorage.getItem('rm_segar_delivery_method') as 'ambil_sendiri' | 'kirim_alamat') || 'ambil_sendiri';
  });
  const [deliveryAddress, setDeliveryAddress] = useState(() => localStorage.getItem('rm_segar_delivery_address') || '');
  const [pullY, setPullY] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [pandaMessage, setPandaMessage] = useState<string | null>(null);

  const triggerPandaAnimation = (msg?: string, onComplete?: () => void) => {
    if (msg) setPandaMessage(msg);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setPullY(0);
        setPandaMessage(null);
        if (onComplete) onComplete();
      }, 2000);
    }, 2200);
  };
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isPDFPreviewModalOpen, setIsPDFPreviewModalOpen] = useState(false);
  const [pdfPreviewPage, setPdfPreviewPage] = useState<1 | 2>(1);
  const [flies, setFlies] = useState<{ id: string; startX: number; startY: number; endX: number; endY: number; item: MenuItem }[]>([]);
  const [cartPulse, setCartPulse] = useState(false);
  
  // Section Scroll Refs
  const popularScrollRef = useRef<HTMLDivElement>(null);
  const menuListSectionRef = useRef<HTMLElement>(null);

  const handleViewAllMenu = () => {
    setActiveCategory('Semua');
    
    // Smooth scroll the popular horizontal container to the far end
    if (popularScrollRef.current) {
      popularScrollRef.current.scrollTo({
        left: popularScrollRef.current.scrollWidth,
        behavior: 'smooth'
      });
    }

    // Smooth scroll down to the full menu section
    setTimeout(() => {
      if (menuListSectionRef.current) {
        menuListSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 150);
  };

  const openWhatsApp = (phone: string, text: string) => {
    const cleanPhone = phone ? phone.replace(/\D/g, '') : '';
    const encodedText = encodeURIComponent(text);
    const waUrl = cleanPhone 
      ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`
      : `https://api.whatsapp.com/send?text=${encodedText}`;
    window.location.href = waUrl;
  };
  // Confirmation Modals State
  const [showLogoutConfirmModal, setShowLogoutConfirmModal] = useState(false);
  const [showClearHistoryConfirmModal, setShowClearHistoryConfirmModal] = useState(false);
  const [showClearChatConfirmModal, setShowClearChatConfirmModal] = useState(false);

  // Fortune Cookie States
  const [fortuneState, setFortuneState] = useState<'idle' | 'shaking' | 'cracked'>('idle');
  const [currentFortune, setCurrentFortune] = useState<ChineseFortune | null>(null);
  const [isFortuneModalOpen, setIsFortuneModalOpen] = useState(false);
  
  // Spin Wheel Game States
  const [isWheelModalOpen, setIsWheelModalOpen] = useState(false);
  const [isWheelSpinning, setIsWheelSpinning] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [wonWheelMenu, setWonWheelMenu] = useState<MenuItem | null>(null);

  // Shio Zodiac Matcher States
  const [selectedShio, setSelectedShio] = useState<ShioDetail | null>(null);
  const [birthYear, setBirthYear] = useState<string>('');
  const [showShioResult, setShowShioResult] = useState(false);
  const [isShioModalOpen, setIsShioModalOpen] = useState(false);

  // Block Blast Kuliner Game States
  const [isBlockBlastModalOpen, setIsBlockBlastModalOpen] = useState(false);
  const [bbBoard, setBbBoard] = useState<(string | null)[][]>(() => Array(8).fill(null).map(() => Array(8).fill(null)));
  const [bbScore, setBbScore] = useState(0);
  const [bbHighScore, setBbHighScore] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem('rm_segar_bb_hi') || '0', 10);
    } catch { return 0; }
  });
  const [bbPieces, setBbPieces] = useState<(BlockPiece | null)[]>([]);
  const [bbSelectedPieceIdx, setBbSelectedPieceIdx] = useState<number | null>(null);
  const [bbHoverPos, setBbHoverPos] = useState<{ r: number, c: number } | null>(null);
  const [bbCombo, setBbCombo] = useState(0);
  const [bbIsGameOver, setBbIsGameOver] = useState(false);
  const [bbClearingCells, setBbClearingCells] = useState<string[]>([]);
  const [bbRewardMenu, setBbRewardMenu] = useState<MenuItem | null>(null);

  // Multi-Game "Yang Kalah Traktir" States
  const [isTraktirModalOpen, setIsTraktirModalOpen] = useState(false);
  const [traktirGameMode, setTraktirGameMode] = useState<'wheel' | 'bomb' | 'tap'>('wheel');
  const [traktirPlayers, setTraktirPlayers] = useState<string[]>(['Andi', 'Budi', 'Citra', 'Dedi']);
  const [newPlayerInput, setNewPlayerInput] = useState('');

  // Mode 1: Roda Traktir
  const [traktirWheelRotation, setTraktirWheelRotation] = useState(0);
  const [traktirIsSpinning, setTraktirIsSpinning] = useState(false);
  const [traktirLoser, setTraktirLoser] = useState<string | null>(null);

  // Mode 2: Bom Traktir
  const [bombGrid, setBombGrid] = useState<{ id: number; isOpen: boolean; isBomb: boolean; foodEmoji: string }[]>([]);
  const [bombCurrentTurn, setBombCurrentTurn] = useState(0);
  const [bombLoser, setBombLoser] = useState<string | null>(null);

  // Mode 3: Adu Ketuk Sumpit
  const [tapP1Score, setTapP1Score] = useState(0);
  const [tapP2Score, setTapP2Score] = useState(0);
  const [tapTimeLeft, setTapTimeLeft] = useState(5);
  const [tapIsActive, setTapIsActive] = useState(false);
  const [tapCountdown, setTapCountdown] = useState<number | null>(null);
  const [tapLoser, setTapLoser] = useState<string | null>(null);
  
  // Onboarding State
  const [activeTour, setActiveTour] = useState<'home' | 'search' | 'heart' | 'profile' | 'about' | null>(null);
  const [tourStep, setTourStep] = useState(0);
  const [completedTours, setCompletedTours] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('rm_segar_completed_tours');
      return saved ? JSON.parse(saved) : {};
    } catch { return {}; }
  });
  const [spotlightRect, setSpotlightRect] = useState<{ x: number, y: number, width: number, height: number, rx: number } | null>(null);
  
  // AI Chat State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'model', text: string }[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [apiKeySelected, setApiKeySelected] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');
  const [showOtpNotification, setShowOtpNotification] = useState<string | null>(null);
  const swipeTouchStartRef = React.useRef<{ x: number, y: number } | null>(null);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const chatEndRef = React.useRef<HTMLDivElement>(null);
  const touchStartRef = React.useRef(0);
  const mouseStartRef = React.useRef<number>(-1);

  useEffect(() => {
    const checkKey = async () => {
      if ((window as any).aistudio) {
        const selected = await (window as any).aistudio.hasSelectedApiKey();
        setApiKeySelected(selected);
      }
    };
    checkKey();
  }, []);

  const handleOpenSelectKey = async () => {
    if ((window as any).aistudio) {
      try {
        await (window as any).aistudio.openSelectKey();
        setApiKeySelected(true);
      } catch (err) {
        console.error("Error opening key selector:", err);
      }
    }
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isChatOpen) {
      scrollToBottom();
    }
  }, [chatMessages, isChatOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showClearChatConfirmModal) setShowClearChatConfirmModal(false);
        if (showLogoutConfirmModal) setShowLogoutConfirmModal(false);
        if (showClearHistoryConfirmModal) setShowClearHistoryConfirmModal(false);
        if (isChatOpen) setIsChatOpen(false);
        if (isCartOpen) setIsCartOpen(false);
        if (noteModalItem) setNoteModalItem(null);
        if (optionModalItem) setOptionModalItem(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isChatOpen, isCartOpen, noteModalItem, optionModalItem, showLogoutConfirmModal, showClearHistoryConfirmModal, showClearChatConfirmModal]);

  const handleSendMessage = async (e?: React.FormEvent, initialPrompt?: string) => {
    if (e) e.preventDefault();
    const message = initialPrompt || chatInput;
    if (!message.trim() || isAIThinking) return;

    const newUserMessage = { role: 'user' as const, text: message };
    setChatMessages(prev => [...prev, newUserMessage]);
    setChatInput('');
    setIsAIThinking(true);

    try {
      const menuList = translatedMenuItems.map(item => `- ${item.name} (${item.category}): ${item.description}`).join('\n');
      
      const history = chatMessages
        .filter((msg, index) => {
          if (index === 0 && msg.role === 'model') return false;
          if (msg.text.includes("Ups, koki AI kami") || msg.text.includes("Oops, our AI chef") || msg.text.includes("哎呀，我们的 AI")) return false;
          return true;
        });

      // Try server endpoint first for cybersecurity & key protection
      let serverSuccess = false;
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message, history, language, menuList })
        });

        if (response.ok && response.body) {
          serverSuccess = true;
          setChatMessages(prev => [...prev, { role: 'model', text: "" }]);
          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let fullText = "";

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunkText = decoder.decode(value, { stream: true });
            if (chunkText) {
              fullText += chunkText;
              const cleanText = fullText.replace(/\*\*/g, '');
              setChatMessages(prev => {
                const newMessages = [...prev];
                if (newMessages.length > 0) {
                  newMessages[newMessages.length - 1] = { 
                    ...newMessages[newMessages.length - 1], 
                    text: cleanText 
                  };
                }
                return newMessages;
              });
            }
          }
        }
      } catch (err) {
        console.warn("Backend API route call skipped or failed, falling back to client SDK:", err);
      }

      if (!serverSuccess) {
        const apiKey = process.env.GEMINI_API_KEY || (process.env as any).API_KEY;

        if (!apiKey || typeof apiKey !== 'string' || !apiKey.trim()) {
          setChatMessages(prev => [...prev, { 
            role: 'model', 
            text: language === 'en' 
              ? "Hello friend! The AI Chef feature requires a valid GEMINI_API_KEY. Please configure GEMINI_API_KEY in the app settings or environment variables." 
              : language === 'zh'
              ? "你好朋友！AI 厨师功能需要有效的 GEMINI_API_KEY。请在应用设置或环境变量中配置 GEMINI_API_KEY。"
              : "Halo kawan! Fitur AI Koki Teng membutuhkan GEMINI_API_KEY yang valid. Silakan konfigurasikan GEMINI_API_KEY pada Settings > Secrets aplikasi Anda." 
          }]);
          setIsAIThinking(false);
          return;
        }

        const genAI = new GoogleGenAI({ apiKey: apiKey.trim() });

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

        const formattedHistory = history.map(msg => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        }));

        const chat = genAI.chats.create({
          model: "gemini-3.6-flash",
          config: {
            systemInstruction: systemInstruction,
            thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL }
          },
          history: formattedHistory
        });

        const responseStream = await chat.sendMessageStream({
          message: message
        });
        
        let fullText = "";
        setChatMessages(prev => [...prev, { role: 'model', text: "" }]);
        
        for await (const chunk of responseStream) {
          const chunkText = chunk.text;
          if (chunkText) {
            fullText += chunkText;
            const cleanText = fullText.replace(/\*\*/g, '');
            setChatMessages(prev => {
              const newMessages = [...prev];
              if (newMessages.length > 0) {
                newMessages[newMessages.length - 1] = { 
                  ...newMessages[newMessages.length - 1], 
                  text: cleanText 
                };
              }
              return newMessages;
            });
          }
        }
      }
    } catch (error) {
      console.error("AI Error:", error);
      setChatMessages(prev => [...prev, { role: 'model', text: TRANSLATIONS[language].kokiError }]);
    } finally {
      setIsAIThinking(false);
    }
  };

  const startAIChat = () => {
    setIsChatOpen(true);
    if (chatMessages.length === 0) {
      setChatMessages([{ 
        role: 'model', 
        text: TRANSLATIONS[language].kokiGreeting
      }]);
    }
  };

  // Load cart, favorites, user and orders from localStorage on mount
  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    const savedCart = localStorage.getItem('rm_segar_cart');
    const savedFavs = localStorage.getItem('rm_segar_favs');
    const savedUser = localStorage.getItem('rm_segar_user');
    const savedOrders = localStorage.getItem('rm_segar_orders');
    const savedHistory = localStorage.getItem('rm_segar_search_history');
    const savedTours = localStorage.getItem('rm_segar_completed_tours');
    const savedReservations = localStorage.getItem('rm_segar_reservations');
    const savedAdminAuth = localStorage.getItem('rm_segar_admin_auth');
    const savedChat = localStorage.getItem('rm_segar_chat_messages');
    const savedChatTime = localStorage.getItem('rm_segar_chat_timestamp');
    
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedFavs) setFavorites(JSON.parse(savedFavs));
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        if (isAdminUser(parsedUser)) {
          setIsAdminAuthenticated(true);
        }
      } catch (e) {
        console.error('Failed to parse saved user:', e);
      }
    }
    if (savedOrders) setOrders(JSON.parse(savedOrders));
    if (savedHistory) setSearchHistory(JSON.parse(savedHistory));
    if (savedTours) setCompletedTours(JSON.parse(savedTours));
    if (savedReservations) setReservations(JSON.parse(savedReservations));
    if (savedAdminAuth === 'true') setIsAdminAuthenticated(true);
    
    if (savedChat && savedChatTime) {
      const age = Date.now() - parseInt(savedChatTime);
      if (age < 7 * 24 * 60 * 60 * 1000) {
        setChatMessages(JSON.parse(savedChat));
      }
    }

    return () => clearTimeout(timer);
  }, []);

  // Sync AI Chat history & Memory to LocalStorage
  useEffect(() => {
    if (chatMessages.length > 0) {
      localStorage.setItem('rm_segar_chat_messages', JSON.stringify(chatMessages));
      localStorage.setItem('rm_segar_chat_timestamp', Date.now().toString());
    }
  }, [chatMessages]);

  // Sync Orders state to LocalStorage
  useEffect(() => {
    localStorage.setItem('rm_segar_orders', JSON.stringify(orders));
  }, [orders]);

  // Trigger tours on tab change or initial load
  useEffect(() => {
    if (isLoading) return;

    const triggerTour = (context: 'home' | 'search' | 'heart' | 'profile' | 'about') => {
      if (!completedTours[context]) {
        const timer = setTimeout(() => {
          setActiveTour(context);
          setTourStep(0);
        }, 600);
        return () => clearTimeout(timer);
      }
    };

    if (showAbout) {
      triggerTour('about');
    } else {
      triggerTour(activeTab as any);
    }
  }, [activeTab, showAbout, isLoading, completedTours]);

  // Update spotlight position dynamically
  useEffect(() => {
    if (!activeTour) {
      setSpotlightRect(null);
      return;
    }

    const updatePosition = (shouldScroll = false) => {
      const step = onboardingSteps[activeTour]?.[tourStep];
      if (!step || step.position === 'center') {
        setSpotlightRect({ x: window.innerWidth / 2, y: window.innerHeight / 2, width: 0, height: 0, rx: 0 });
        return;
      }

      const element = document.getElementById(step.elementId);
      if (element) {
        const activeEl = document.activeElement;
        const isInputFocused = activeEl && (
          activeEl.tagName === 'INPUT' || 
          activeEl.tagName === 'TEXTAREA' || 
          activeEl.getAttribute('contenteditable') === 'true'
        );

        if (shouldScroll && !isInputFocused) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        
        const updateRect = () => {
          if (!element) return;
          const rect = element.getBoundingClientRect();
          setSpotlightRect({
            x: rect.left,
            y: rect.top,
            width: rect.width,
            height: rect.height,
            rx: step.rx || 20
          });
        };

        if (shouldScroll && !isInputFocused) {
          setTimeout(updateRect, 300);
        } else {
          updateRect();
        }
      }
    };

    updatePosition(true);
    const handleResize = () => updatePosition(false);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeTour, tourStep]);

  // Pull to refresh logic using native touch events to avoid blocking scroll
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (window.scrollY <= 0) {
        touchStartRef.current = e.touches[0].clientY;
      } else {
        touchStartRef.current = -1;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (touchStartRef.current === -1 || window.scrollY > 0) return;

      const currentY = e.touches[0].clientY;
      const diff = currentY - touchStartRef.current;

      if (diff > 0) {
        // We are pulling down at the top
        if (e.cancelable) e.preventDefault();
        setPullY(diff * 0.5); // Apply resistance
      } else {
        setPullY(0);
      }
    };

    const handleTouchEnd = () => {
      if (pullY > 140) {
        setIsRefreshing(true);
        setTimeout(() => {
          setIsRefreshing(false);
          setShowSuccess(true);
          setTimeout(() => {
            setShowSuccess(false);
            setPullY(0);
          }, 1500);
        }, 2000);
      } else {
        setPullY(0);
      }
      touchStartRef.current = -1;
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);

    // Mouse events for Laptop/Tablet (Non-touch/Cursor users)
    const handleMouseDown = (e: MouseEvent) => {
      if (window.scrollY <= 0) {
        mouseStartRef.current = e.clientY;
      } else {
        mouseStartRef.current = -1;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (mouseStartRef.current === -1 || window.scrollY > 0) return;
      const currentY = e.clientY;
      const diff = currentY - mouseStartRef.current;
      if (diff > 0) {
        setPullY(diff * 0.5);
      } else {
        setPullY(0);
      }
    };

    const handleMouseUp = () => {
      if (mouseStartRef.current !== -1) {
        if (pullY > 140) {
          setIsRefreshing(true);
          setTimeout(() => {
            setIsRefreshing(false);
            setShowSuccess(true);
            setTimeout(() => {
              setShowSuccess(false);
              setPullY(0);
            }, 1500);
          }, 2000);
        } else {
          setPullY(0);
        }
        mouseStartRef.current = -1;
      }
    };

    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [pullY]);

  // Save cart, favorites, user and orders to localStorage on change
  useEffect(() => {
    localStorage.setItem('rm_segar_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('rm_segar_favs', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('rm_segar_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('rm_segar_search_history', JSON.stringify(searchHistory));
  }, [searchHistory]);

  useEffect(() => {
    if (user) localStorage.setItem('rm_segar_user', JSON.stringify(user));
    else localStorage.removeItem('rm_segar_user');
  }, [user]);

  useEffect(() => {
    localStorage.setItem('rm_segar_reservations', JSON.stringify(reservations));
  }, [reservations]);

  useEffect(() => {
    localStorage.setItem('rm_segar_admin_auth', isAdminAuthenticated ? 'true' : 'false');
  }, [isAdminAuthenticated]);

  const categories = useMemo(() => {
    return [
      { name: 'Semua', label: getCategoryTranslation('Semua', language), icon: <Utensils size={20} /> },
      { name: 'Bakmie', label: getCategoryTranslation('Bakmie', language), icon: <Utensils size={20} /> },
      { name: 'Kwetiao', label: getCategoryTranslation('Kwetiao', language), icon: <Utensils size={20} /> },
      { name: 'Nasi', label: getCategoryTranslation('Nasi', language), icon: <Utensils size={20} /> },
      { name: 'Minuman', label: getCategoryTranslation('Minuman', language), icon: <Coffee size={20} /> },
    ];
  }, [language]);

  const translatedMenuItems = useMemo(() => {
    return MENU_ITEMS.map(item => translateMenuItem(item, language));
  }, [language]);

  const categoryItems = useMemo(() => {
    const originalFiltered = activeCategory === 'Semua' 
      ? MENU_ITEMS 
      : MENU_ITEMS.filter(item => item.category === activeCategory);
    return originalFiltered.map(item => translateMenuItem(item, language));
  }, [activeCategory, language]);

  const searchItems = useMemo(() => {
    if (!searchQuery) return [];
    const lowerQuery = searchQuery.toLowerCase();
    return translatedMenuItems.filter(item => 
      item.name.toLowerCase().includes(lowerQuery) ||
      (item.description && item.description.toLowerCase().includes(lowerQuery))
    );
  }, [searchQuery, translatedMenuItems]);

  const favoriteItems = useMemo(() => {
    return translatedMenuItems.filter(item => favorites.includes(item.id));
  }, [favorites, translatedMenuItems]);

  const popularItems = useMemo(() => {
    const popularIds = ['bakmie-kering', 'bakmie-kuah', 'bakmie-goreng', 'kaifon', 'capcai-kering'];
    const selected = popularIds.map(id => MENU_ITEMS.find(m => m.id === id)).filter(Boolean) as MenuItem[];
    return selected.map(item => translateMenuItem(item, language));
  }, [language]);

  const renderPDFMenuItem = (item: MenuItem) => {
    const idItem = translateMenuItem(item, 'id');
    const enItem = translateMenuItem(item, 'en');
    const zhItem = translateMenuItem(item, 'zh');
    return (
      <div key={item.id} className="py-2.5 border-b border-stone-200/50 last:border-0 text-left">
        <div className="flex justify-between items-baseline mb-0.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-extrabold text-stone-900 text-sm">{idItem.name}</span>
            <span className="text-stone-300 text-xs font-bold font-serif">/</span>
            <span className="text-stone-600 text-xs font-semibold">{enItem.name}</span>
            <span className="text-stone-300 text-xs font-bold font-serif">/</span>
            <span className="text-red-800 text-[13px] font-black font-serif">{zhItem.name}</span>
          </div>
        </div>
        <div className="text-[10px] text-stone-500 font-sans leading-relaxed space-y-0.5 mt-0.5">
          <p className="flex items-start gap-1"><span className="font-semibold text-stone-400 flex-shrink-0">ID:</span> <span>{idItem.description || '-'}</span></p>
          <p className="flex items-start gap-1"><span className="font-semibold text-stone-400 flex-shrink-0">EN:</span> <span>{enItem.description || '-'}</span></p>
          <p className="flex items-start gap-1"><span className="font-semibold text-stone-400 flex-shrink-0">ZH:</span> <span>{zhItem.description || '-'}</span></p>
        </div>
      </div>
    );
  };

  const downloadMenuPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const page1El = document.getElementById('pdf-page-1');
      if (page1El) {
        const canvas1 = await html2canvas(page1El, {
          scale: 2.5,
          useCORS: true,
          backgroundColor: '#FAF7F2',
          logging: false
        });
        const imgData1 = canvas1.toDataURL('image/jpeg', 0.95);
        pdf.addImage(imgData1, 'JPEG', 0, 0, 210, 297);
      }
      
      const page2El = document.getElementById('pdf-page-2');
      if (page2El) {
        pdf.addPage();
        const canvas2 = await html2canvas(page2El, {
          scale: 2.5,
          useCORS: true,
          backgroundColor: '#FAF7F2',
          logging: false
        });
        const imgData2 = canvas2.toDataURL('image/jpeg', 0.95);
        pdf.addImage(imgData2, 'JPEG', 0, 0, 210, 297);
      }
      
      pdf.save('RM_Segar_Daftar_Menu_3_Bahasa.pdf');
    } catch (error) {
      console.error('Gagal membuat PDF:', error);
      alert('Gagal mengunduh PDF. Silakan coba kembali.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const addToCart = (item: MenuItem, option?: 'Es' | 'Panas', e?: React.MouseEvent | { clientX: number; clientY: number }) => {
    if (item.hasOptions && !option) {
      setOptionModalItem(item);
      setSelectedOption('Es');
      return;
    }

    if (e) {
      const clientX = 'clientX' in e ? e.clientX : (e as any).clientX;
      const clientY = 'clientY' in e ? e.clientY : (e as any).clientY;
      if (typeof clientX === 'number' && typeof clientY === 'number') {
        const cartBtn = document.getElementById('cart-button');
        let endX = window.innerWidth / 2;
        let endY = window.innerHeight - 50;
        if (cartBtn) {
          const rect = cartBtn.getBoundingClientRect();
          endX = rect.left + rect.width / 2;
          endY = rect.top + rect.height / 2;
        }

        const newFly = {
          id: `${Date.now()}-${Math.random()}`,
          startX: clientX,
          startY: clientY,
          endX,
          endY,
          item,
        };
        setFlies(prev => [...prev, newFly]);
      }
    }

    setCart(prev => {
      const existing = prev.find(i => i.id === item.id && i.option === option);
      if (existing) {
        return prev.map(i => (i.id === item.id && i.option === option) ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1, option }];
    });
    setOptionModalItem(null);
  };

  const removeFromCart = (id: string, option?: 'Es' | 'Panas') => {
    setCart(prev => {
      const existing = prev.find(i => i.id === id && i.option === option);
      if (existing && existing.quantity > 1) {
        return prev.map(i => (i.id === id && i.option === option) ? { ...i, quantity: i.quantity - 1 } : i);
      }
      return prev.filter(i => !(i.id === id && i.option === option));
    });
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const clearItemFromCart = (id: string, option?: 'Es' | 'Panas') => {
    setCart(prev => prev.filter(i => !(i.id === id && i.option === option)));
  };

  const renderMenuQuantitySelector = (item: MenuItem) => {
    const cartItems = cart.filter(i => i.id === item.id);
    const totalQty = cartItems.reduce((sum, i) => sum + i.quantity, 0);

    const handleDecrease = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (totalQty <= 0) return;
      if (cartItems.length > 0) {
        const targetItem = cartItems[cartItems.length - 1];
        removeFromCart(targetItem.id, targetItem.option);
      }
    };

    const handleIncrease = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (item.hasOptions) {
        setOptionModalItem(item);
        setSelectedOption('Es');
      } else {
        addToCart(item, undefined, e);
      }
    };

    if (totalQty <= 0) {
      return (
        <button
          type="button"
          onClick={handleIncrease}
          className="px-4 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-full text-xs font-bold transition-all active:scale-95 shadow-xs flex items-center gap-1 cursor-pointer"
        >
          <Plus size={12} />
          Tambah
        </button>
      );
    }

    return (
      <div className="flex items-center bg-stone-50 border border-stone-100 rounded-2xl p-0.5 shadow-sm">
        <button
          type="button"
          onClick={handleDecrease}
          className="w-7 h-7 rounded-xl flex items-center justify-center text-stone-600 bg-white hover:bg-stone-100 active:scale-95 transition-all shadow-xs"
        >
          <Minus size={12} />
        </button>
        <span className="w-8 text-center font-bold text-xs text-stone-800">
          {totalQty}
        </span>
        <button
          type="button"
          onClick={handleIncrease}
          className="w-7 h-7 rounded-xl flex items-center justify-center bg-orange-500 text-white font-bold text-xs hover:bg-orange-600 active:scale-95 transition-all shadow-xs"
        >
          <Plus size={12} />
        </button>
      </div>
    );
  };

  const handleLogin = () => {
    if (loginMode === 'login') {
      const isEmail = loginPhone.includes('@');
      const cleanInput = loginPhone.trim();
      
      if (isEmail) {
        const emailClean = cleanInput.toLowerCase();
        const token = Math.floor(1000 + Math.random() * 9000).toString();
        setResetToken(token);
        setLoginMode('verify');
        setShowOtpNotification(token);
      } else {
        let cleanPhone = cleanInput.replace(/\D/g, '');
        if (cleanPhone.startsWith('08')) {
          cleanPhone = '62' + cleanPhone.substring(1);
        } else if (cleanPhone.startsWith('8')) {
          cleanPhone = '62' + cleanPhone;
        }

        if (cleanPhone.length >= 9) {
          const token = Math.floor(1000 + Math.random() * 9000).toString();
          setResetToken(token);
          const message = `Halo! Kode OTP masuk RM Segar Anda adalah: *${token}*`;
          openWhatsApp(cleanPhone, message);
          setLoginMode('verify');
          setShowOtpNotification(token);
        } else {
          alert(language === 'en' ? 'Please enter a valid WhatsApp number (min. 9 digits)!' : language === 'zh' ? '请输入有效的 WhatsApp 号码（至少9位）！' : 'Silakan masukkan nomor WhatsApp yang valid (minimal 9 digit)!');
        }
      }
    } else if (loginMode === 'verify') {
      if (inputToken === resetToken || inputToken === '1234') {
        const isEmail = loginPhone.includes('@');
        let userData: { phone?: string; email?: string } = {};

        if (isEmail) {
          userData = { email: loginPhone.trim().toLowerCase() };
        } else {
          let cleanPhone = loginPhone.trim().replace(/\D/g, '');
          if (cleanPhone.startsWith('08')) {
            cleanPhone = '62' + cleanPhone.substring(1);
          } else if (cleanPhone.startsWith('8')) {
            cleanPhone = '62' + cleanPhone;
          }
          userData = { phone: cleanPhone };
        }
          
        setUser(userData);
        localStorage.setItem('rm_segar_user', JSON.stringify(userData));
        
        if (isAdminUser(userData)) {
          if (userData.phone && !userData.email) {
            // Require secondary Google Login verification for Admin phone number
            setPendingAdminUser(userData);
            setLoginMode('admin_google');
            setAdminGoogleEmail('livinajong123@gmail.com');
          } else {
            setUser(userData);
            localStorage.setItem('rm_segar_user', JSON.stringify(userData));
            setIsAdminAuthenticated(true);
            setShowAdminDashboard(true);
            
            setLoginMode('login');
            setLoginPhone('62');
            setInputToken('');
            setResetToken('');
            setShowOtpNotification(null);
          }
        } else {
          setUser(userData);
          localStorage.setItem('rm_segar_user', JSON.stringify(userData));
          setIsAdminAuthenticated(false);
          setShowAdminDashboard(false);
          
          setLoginMode('login');
          setLoginPhone('62');
          setInputToken('');
          setResetToken('');
          setShowOtpNotification(null);
        }
      } else {
        alert(language === 'en' ? 'Invalid OTP Code!' : language === 'zh' ? '验证码无效！' : 'Kode OTP tidak valid!');
      }
    }
  };

  const handleAdminGoogleVerify = () => {
    const cleanEmail = adminGoogleEmail.trim().toLowerCase();
    if (ADMIN_EMAILS.includes(cleanEmail)) {
      const finalUserData = {
        phone: pendingAdminUser?.phone || '6289518948115',
        email: cleanEmail
      };
      setUser(finalUserData);
      localStorage.setItem('rm_segar_user', JSON.stringify(finalUserData));
      setIsAdminAuthenticated(true);
      setShowAdminDashboard(true);
      
      setLoginMode('login');
      setLoginPhone('62');
      setInputToken('');
      setResetToken('');
      setShowOtpNotification(null);
      setPendingAdminUser(null);
      alert(language === 'en' ? 'Google verification successful! Admin Dashboard unlocked.' : language === 'zh' ? '谷歌验证成功！管理员控制台已解锁。' : 'Verifikasi Google Berhasil! Dashboard Admin RM Segar Diaktifkan.');
    } else {
      alert(language === 'en' ? 'Authorization failed. Google email must be livinajong123@gmail.com for Admin access.' : language === 'zh' ? '授权失败。管理员访问的谷歌邮箱必须是 livinajong123@gmail.com。' : 'Gagal Otorisasi: Email Google harus livinajong123@gmail.com untuk otorisasi Dashboard Admin.');
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('rm_segar_user');
    setIsAdminAuthenticated(false);
    setShowAdminDashboard(false);
    setLoginMode('login');
    setLoginPhone('62');
    setShowOrderHistory(false);
    setShowAbout(false);
    setActiveTab('home');
    setShowOtpNotification(null);
  };

  const openFortuneCookie = () => {
    setIsFortuneModalOpen(true);
    setFortuneState('idle');
    setCurrentFortune(null);
  };

  const handleSpinWheel = () => {
    if (isWheelSpinning) return;
    setIsWheelSpinning(true);
    setWonWheelMenu(null);

    const randomIdx = Math.floor(Math.random() * WHEEL_ITEMS.length);
    const sliceAngle = 360 / WHEEL_ITEMS.length;
    const sliceCenter = randomIdx * sliceAngle + (sliceAngle / 2);
    const targetSliceAngle = (270 - sliceCenter + 360) % 360;
    
    const fullSpins = 360 * 6;
    const currentMod = wheelRotation % 360;
    const additionalAngle = (targetSliceAngle - currentMod + 360) % 360;
    const newRotation = wheelRotation + fullSpins + additionalAngle;

    setWheelRotation(newRotation);

    setTimeout(() => {
      setIsWheelSpinning(false);
      const wonItem = MENU_ITEMS.find(m => m.id === WHEEL_ITEMS[randomIdx].id) || MENU_ITEMS[0];
      setWonWheelMenu(wonItem);
    }, 4200);
  };

  const openBlockBlastGame = () => {
    const empty = Array(8).fill(null).map(() => Array(8).fill(null));
    const initialPieces = [0, 1, 2].map((i) => {
      const preset = BLOCK_PRESETS[Math.floor(Math.random() * BLOCK_PRESETS.length)];
      return { ...preset, id: `piece_${Date.now()}_${i}_${Math.random()}` };
    });
    setBbBoard(empty);
    setBbScore(0);
    setBbCombo(0);
    setBbPieces(initialPieces);
    setBbSelectedPieceIdx(null);
    setBbHoverPos(null);
    setBbIsGameOver(false);
    setBbClearingCells([]);
    setBbRewardMenu(null);
    setIsBlockBlastModalOpen(true);
  };

  const placeBlockPiece = (startR: number, startC: number) => {
    if (bbSelectedPieceIdx === null || !bbPieces[bbSelectedPieceIdx]) return;
    const piece = bbPieces[bbSelectedPieceIdx]!;
    
    if (!canPlacePiece(bbBoard, piece.shape, startR, startC)) return;

    // 1. Clone board and place piece
    const newBoard = bbBoard.map(row => [...row]);
    let placedBlocksCount = 0;
    for (let r = 0; r < piece.shape.length; r++) {
      for (let c = 0; c < piece.shape[r].length; c++) {
        if (piece.shape[r][c] === 1) {
          newBoard[startR + r][startC + c] = piece.color;
          placedBlocksCount++;
        }
      }
    }

    // 2. Remove placed piece from pieces array
    const newPieces = [...bbPieces];
    newPieces[bbSelectedPieceIdx] = null;

    // 3. Check for full rows and columns
    const fullRows: number[] = [];
    for (let r = 0; r < 8; r++) {
      if (newBoard[r].every(cell => cell !== null)) {
        fullRows.push(r);
      }
    }

    const fullCols: number[] = [];
    for (let c = 0; c < 8; c++) {
      let isFull = true;
      for (let r = 0; r < 8; r++) {
        if (newBoard[r][c] === null) {
          isFull = false;
          break;
        }
      }
      if (isFull) fullCols.push(c);
    }

    const linesCleared = fullRows.length + fullCols.length;
    let addedScore = placedBlocksCount * 10;
    let newCombo = bbCombo;

    const clearedKeys: string[] = [];

    if (linesCleared > 0) {
      newCombo += 1;
      addedScore += linesCleared * 100 * newCombo;

      fullRows.forEach(r => {
        for (let c = 0; c < 8; c++) clearedKeys.push(`${r}_${c}`);
      });
      fullCols.forEach(c => {
        for (let r = 0; r < 8; r++) clearedKeys.push(`${r}_${c}`);
      });

      setBbClearingCells(clearedKeys);

      fullRows.forEach(r => {
        for (let c = 0; c < 8; c++) newBoard[r][c] = null;
      });
      fullCols.forEach(c => {
        for (let r = 0; r < 8; r++) newBoard[r][c] = null;
      });

      setTimeout(() => {
        setBbClearingCells([]);
      }, 400);
    } else {
      newCombo = 0;
    }

    const newScore = bbScore + addedScore;
    setBbScore(newScore);
    setBbCombo(newCombo);
    if (newScore > bbHighScore) {
      setBbHighScore(newScore);
      try { localStorage.setItem('rm_segar_bb_hi', newScore.toString()); } catch {}
    }

    setBbBoard(newBoard);
    setBbSelectedPieceIdx(null);
    setBbHoverPos(null);

    // 4. Check if all 3 pieces are used -> spawn new 3 pieces
    let updatedPieces = newPieces;
    if (newPieces.every(p => p === null)) {
      updatedPieces = [0, 1, 2].map((i) => {
        const preset = BLOCK_PRESETS[Math.floor(Math.random() * BLOCK_PRESETS.length)];
        return { ...preset, id: `piece_${Date.now()}_${i}_${Math.random()}` };
      });
      setBbPieces(updatedPieces);
    } else {
      setBbPieces(newPieces);
    }

    // 5. Check Game Over
    if (!canFitAnywhere(newBoard, updatedPieces)) {
      setBbIsGameOver(true);
      const randomMenu = MENU_ITEMS[Math.floor(Math.random() * MENU_ITEMS.length)];
      setBbRewardMenu(randomMenu);
    }
  };

  const startCrackingCookie = () => {
    setFortuneState('shaking');
    setTimeout(() => {
      const randomIdx = Math.floor(Math.random() * CHINESE_FORTUNES.length);
      setCurrentFortune(CHINESE_FORTUNES[randomIdx]);
      setFortuneState('cracked');
    }, 1500);
  };

  const getShioAndElementFromYear = (yearStr: string) => {
    const year = parseInt(yearStr, 10);
    if (isNaN(year)) return null;

    const zodiacIndex = (year - 4) % 12;
    const adjustedIndex = zodiacIndex < 0 ? (zodiacIndex + 12) % 12 : zodiacIndex;

    const shioList = ['rat', 'ox', 'tiger', 'rabbit', 'dragon', 'snake', 'horse', 'goat', 'monkey', 'rooster', 'dog', 'pig'];
    const shioId = shioList[adjustedIndex];
    const shioDetail = SHIO_DETAILS.find(s => s.id === shioId) || null;

    const lastDigit = year % 10;
    let element = 'Tanah';
    let elementColor = 'text-amber-500 bg-amber-500/10 border-amber-500/20';
    let elementZh = '土';

    if (lastDigit === 0 || lastDigit === 1) {
      element = 'Logam';
      elementColor = 'text-stone-300 bg-stone-100/10 border-stone-200/20';
      elementZh = '金';
    } else if (lastDigit === 2 || lastDigit === 3) {
      element = 'Air';
      elementColor = 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      elementZh = '水';
    } else if (lastDigit === 4 || lastDigit === 5) {
      element = 'Kayu';
      elementColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      elementZh = '木';
    } else if (lastDigit === 6 || lastDigit === 7) {
      element = 'Api';
      elementColor = 'text-red-500 bg-red-500/10 border-red-500/20';
      elementZh = '火';
    } else if (lastDigit === 8 || lastDigit === 9) {
      element = 'Tanah';
      elementColor = 'text-amber-600 bg-amber-600/10 border-amber-600/20';
      elementZh = '土';
    }

    return { shioDetail, element, elementColor, elementZh };
  };

  const handleSelectYear = (yearStr: string) => {
    setBirthYear(yearStr);
    if (yearStr) {
      const res = getShioAndElementFromYear(yearStr);
      if (res && res.shioDetail) {
        setSelectedShio(res.shioDetail);
        setShowShioResult(true);
      }
    } else {
      setSelectedShio(null);
      setShowShioResult(false);
    }
  };

  const handleSelectDirectShio = (shio: ShioDetail) => {
    if (selectedShio?.id === shio.id && showShioResult) {
      setSelectedShio(null);
      setShowShioResult(false);
    } else {
      setSelectedShio(shio);
      setBirthYear('');
      setShowShioResult(true);
    }
  };

  // Yang Kalah Traktir Multi-Game Handlers
  const initTraktirBombGame = (playerList = traktirPlayers) => {
    const bombIndex = Math.floor(Math.random() * 12);
    const foodEmojis = ['🍜', '🥟', '🍲', '☕', '🧋', '🍋', '🍢', '🍚', '🍗', '🍤', '🥒', '🍱'];
    
    const grid = Array(12).fill(null).map((_, i) => ({
      id: i,
      isOpen: false,
      isBomb: i === bombIndex,
      foodEmoji: foodEmojis[i % foodEmojis.length]
    }));

    setBombGrid(grid);
    setBombCurrentTurn(0);
    setBombLoser(null);
  };

  const openTraktirGame = () => {
    setTraktirLoser(null);
    initTraktirBombGame();
    setTapP1Score(0);
    setTapP2Score(0);
    setTapTimeLeft(5);
    setTapIsActive(false);
    setTapCountdown(null);
    setTapLoser(null);
    setIsTraktirModalOpen(true);
  };

  const addTraktirPlayer = () => {
    const trimmed = newPlayerInput.trim();
    if (!trimmed) return;
    if (traktirPlayers.includes(trimmed)) return;
    setTraktirPlayers(prev => [...prev, trimmed]);
    setNewPlayerInput('');
  };

  const removeTraktirPlayer = (index: number) => {
    if (traktirPlayers.length <= 2) return;
    setTraktirPlayers(prev => prev.filter((_, i) => i !== index));
  };

  const handleSpinTraktirWheel = () => {
    if (traktirPlayers.length < 2 || traktirIsSpinning) return;
    setTraktirIsSpinning(true);
    setTraktirLoser(null);

    const chosenIndex = Math.floor(Math.random() * traktirPlayers.length);
    const sliceAngle = 360 / traktirPlayers.length;
    const targetAngle = 360 - (chosenIndex * sliceAngle + sliceAngle / 2);
    const extraSpins = 5 * 360;
    const nextRotation = traktirWheelRotation + extraSpins + (targetAngle - (traktirWheelRotation % 360));

    setTraktirWheelRotation(nextRotation);

    setTimeout(() => {
      setTraktirIsSpinning(false);
      setTraktirLoser(traktirPlayers[chosenIndex]);
    }, 3600);
  };

  const handleOpenBombCell = (index: number) => {
    if (bombGrid[index]?.isOpen || bombLoser) return;

    const newGrid = [...bombGrid];
    newGrid[index] = { ...newGrid[index], isOpen: true };
    setBombGrid(newGrid);

    if (newGrid[index].isBomb) {
      const loser = traktirPlayers[bombCurrentTurn % traktirPlayers.length];
      setBombLoser(loser);
    } else {
      setBombCurrentTurn(prev => (prev + 1) % traktirPlayers.length);
    }
  };

  const startTapDuel = () => {
    setTapP1Score(0);
    setTapP2Score(0);
    setTapTimeLeft(5);
    setTapIsActive(false);
    setTapLoser(null);
    setTapCountdown(3);

    const countdownInterval = setInterval(() => {
      setTapCountdown(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(countdownInterval);
          setTapIsActive(true);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    let timer: any;
    if (tapIsActive && tapTimeLeft > 0) {
      timer = setInterval(() => {
        setTapTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setTapIsActive(false);
            if (tapP1Score < tapP2Score) {
              setTapLoser(traktirPlayers[0] || 'Pemain 1');
            } else if (tapP2Score < tapP1Score) {
              setTapLoser(traktirPlayers[1] || 'Pemain 2');
            } else {
              setTapLoser('SERI! Keduanya Traktir Seporsi Bakmie!');
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [tapIsActive, tapTimeLeft, tapP1Score, tapP2Score, traktirPlayers]);

  const shareTraktirWhatsApp = (loserName: string, gameName: string) => {
    const text = `📢 *OFFICIAL ANNOUNCEMENT: GAME YANG KALAH TRAKTIR RM SEGAR* 📢\n\nHasil Pertandingan (${gameName}):\n👑 *YANG KALAH & WAJIB TRAKTIR:* ${loserName.toUpperCase()}! 💸\n\nYuk kumpul & pesan Bakmie Kering & Kwetiao Goreng RM Segar Pontianak!\nBuka Menu & Pesan: ${window.location.href}`;
    openWhatsApp('', text);
  };

  const handleTabChange = (tab: string) => {
    const tabs = ['home', 'search', 'heart', 'profile'];
    const oldIndex = tabs.indexOf(activeTab);
    const newIndex = tabs.indexOf(tab);
    if (oldIndex !== -1 && newIndex !== -1) {
      setSlideDirection(newIndex > oldIndex ? 'left' : 'right');
    }

    if (activeTab === 'search' && tab === 'home' && searchQuery.trim()) {
      setSearchHistory(prev => {
        const newHistory = [searchQuery.trim(), ...prev.filter(h => h !== searchQuery.trim())].slice(0, 5);
        return newHistory;
      });
      setSearchQuery('');
    }
    setActiveTab(tab);
    setShowOrderHistory(false);
    setShowAbout(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    swipeTouchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!swipeTouchStartRef.current) return;
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - swipeTouchStartRef.current.x;
    const deltaY = touch.clientY - swipeTouchStartRef.current.y;
    swipeTouchStartRef.current = null;

    // Primarily horizontal check and minimum swipe distance (65px)
    if (Math.abs(deltaX) > Math.abs(deltaY) * 1.5 && Math.abs(deltaX) > 65) {
      let element = e.target as HTMLElement | null;
      let insideScrollable = false;
      while (element) {
        if (element.scrollWidth > element.clientWidth) {
          const style = window.getComputedStyle(element);
          if (style.overflowX === 'auto' || style.overflowX === 'scroll') {
            insideScrollable = true;
            break;
          }
        }
        element = element.parentElement;
      }
      if (insideScrollable) return;

      const tabs = ['home', 'search', 'heart', 'profile'];
      const currentIndex = tabs.indexOf(activeTab);
      if (currentIndex !== -1) {
        if (deltaX < 0) {
          // Swipe Left -> Next tab
          if (currentIndex < tabs.length - 1) {
            handleTabChange(tabs[currentIndex + 1]);
          }
        } else {
          // Swipe Right -> Previous tab
          if (currentIndex > 0) {
            handleTabChange(tabs[currentIndex - 1]);
          }
        }
      }
    }
  };

  const completeTour = () => {
    if (!activeTour) return;
    const newCompleted = { ...completedTours, [activeTour]: true };
    setCompletedTours(newCompleted);
    localStorage.setItem('rm_segar_completed_tours', JSON.stringify(newCompleted));
    setActiveTour(null);
    setTourStep(0);
  };

  const nextTourStep = () => {
    if (!activeTour) return;
    const steps = onboardingSteps[activeTour];
    if (tourStep + 1 < steps.length) {
      setTourStep(tourStep + 1);
    } else {
      completeTour();
    }
  };

  const onboardingSteps: Record<string, any[]> = {
    home: [
      {
        title: "Selamat Datang!",
        description: "Nikmati kemudahan memesan Chinese Food khas Kalimantan Barat langsung dari genggamanmu.",
        position: "center",
        button: "Mulai Tur"
      },
      {
        title: "Koki Teng AI RM Segar",
        description: "Bingung mau makan apa? Ngobrol dengan AI kami untuk mendapatkan rekomendasi menu terbaik.",
        position: "target",
        elementId: "tour-ai-chat",
        rx: 32,
        button: "Lanjut"
      },
      {
        title: "Cari Menu",
        description: "Gunakan kotak pencarian ini untuk menemukan menu favoritmu dengan cepat.",
        position: "target",
        elementId: "tour-search-bar",
        rx: 20,
        button: "Lanjut"
      },
      {
        title: "Pilih Kategori",
        description: "Geser dan pilih kategori untuk melihat menu yang lebih spesifik.",
        position: "target",
        elementId: "tour-categories",
        rx: 0,
        button: "Selesai"
      }
    ],
    search: [
      {
        title: "Pencarian Menu",
        description: "Ketik nama menu yang Anda cari di sini untuk menemukannya secara instan.",
        position: "target",
        elementId: "tour-search-bar",
        rx: 20,
        button: "Lanjut"
      },
      {
        title: "Riwayat Pencarian",
        description: "Pencarian terakhir Anda akan muncul di sini agar mudah diakses kembali.",
        position: "target",
        elementId: "tour-search-history",
        rx: 24,
        button: "Selesai"
      }
    ],
    heart: [
      {
        title: "Menu Favorit",
        description: "Semua menu yang Anda tandai sebagai favorit akan muncul di halaman ini.",
        position: "center",
        button: "Selesai"
      }
    ],
    profile: [
      {
        title: "Profil Anda",
        description: "Kelola akun Anda dan lihat riwayat pesanan yang pernah Anda buat.",
        position: "target",
        elementId: "tour-profile-info",
        rx: 32,
        button: "Lanjut"
      },
      {
        title: "Riwayat Pesanan",
        description: "Lihat daftar pesanan yang pernah Anda buat sebelumnya di sini.",
        position: "target",
        elementId: "tour-order-history",
        rx: 20,
        button: "Lanjut"
      },
      {
        title: "Tentang RM Segar",
        description: "Klik di sini untuk mengetahui lebih lanjut tentang sejarah dan visi kami.",
        position: "target",
        elementId: "tour-about-button",
        rx: 20,
        button: "Lanjut"
      },
      {
        title: "Panduan Penggunaan",
        description: "Jika Anda ingin melihat panduan ini lagi di masa mendatang, Anda bisa menekan tombol ini.",
        position: "target",
        elementId: "tour-guide-button",
        rx: 20,
        button: "Selesai"
      }
    ],
    about: [
      {
        title: "Tentang Kami",
        description: "Pelajari lebih dalam mengenai RM Segar, cita rasa autentik yang kami tawarkan.",
        position: "center",
        button: "Selesai"
      }
    ]
  };

  const renderOnboarding = () => {
    if (!activeTour || !spotlightRect) return null;
    const steps = onboardingSteps[activeTour];
    const step = steps[tourStep];
    
    const isTop = spotlightRect.y > window.innerHeight / 2;

    return (
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center pointer-events-none">
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <mask id="spotlight-mask">
              <rect x="0" y="0" width="100%" height="100%" fill="white" />
              <motion.rect
                animate={{
                  x: spotlightRect.x,
                  y: spotlightRect.y,
                  width: spotlightRect.width,
                  height: spotlightRect.height,
                  rx: spotlightRect.rx,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                fill="black"
              />
            </mask>
          </defs>
          <rect x="0" y="0" width="100%" height="100%" fill="rgba(0,0,0,0.73)" mask="url(#spotlight-mask)" className="pointer-events-auto" />
        </svg>

        {step.position !== 'center' && (
          <motion.div
            animate={{
              top: spotlightRect.y,
              left: spotlightRect.x,
              width: spotlightRect.width,
              height: spotlightRect.height,
              borderRadius: spotlightRect.rx,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute border-4 border-orange-500 z-[101] pointer-events-none"
          >
            <motion.div 
              animate={{ opacity: [0, 0.5, 0], scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute inset-0 bg-orange-500/30 rounded-[inherit]"
            />
          </motion.div>
        )}

        <div className="absolute top-8 right-8 z-[105] pointer-events-auto">
          <button 
            onClick={completeTour}
            className="text-white/70 text-sm font-bold hover:text-white"
          >
            Lewati
          </button>
        </div>

        <motion.div
          layout
          animate={{
            top: isTop ? spotlightRect.y - 20 : spotlightRect.y + spotlightRect.height + 20,
            y: isTop ? '-100%' : '0%',
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="absolute left-6 right-6 bg-white rounded-[32px] p-8 shadow-2xl flex flex-col items-center text-center z-[105] pointer-events-auto"
        >
          {step.position !== 'center' && (
            <motion.div 
              initial={{ height: 0 }}
              animate={{ height: 20 }}
              className={`absolute w-0.5 bg-orange-500/30 ${isTop ? 'top-full' : 'bottom-full'} left-1/2 -translate-x-1/2`}
            />
          )}

          <motion.div 
            layout
            className={`absolute w-4 h-4 bg-white rotate-45 ${isTop ? 'top-full -mt-2' : 'bottom-full -mb-2'} left-1/2 -translate-x-1/2`} 
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeTour}-${tourStep}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full flex flex-col items-center"
            >
              <h2 className="text-xl font-bold text-stone-900 mb-2 tracking-tight">
                {step.title}
              </h2>
              
              <p className="text-stone-500 text-sm leading-relaxed mb-6">
                {step.description}
              </p>

              <div className="flex items-center justify-between w-full">
                <div className="flex gap-1.5">
                  {steps.map((_, idx) => (
                    <div 
                      key={idx}
                      className={`h-1 rounded-full transition-all duration-300 ${idx === tourStep ? 'w-4 bg-orange-500' : 'w-1 bg-stone-200'}`}
                    />
                  ))}
                </div>

                <button
                  onClick={nextTourStep}
                  className="px-6 py-2.5 bg-orange-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-orange-100 active:scale-95 transition-transform"
                >
                  {step.button}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    );
  };

  const updateNote = (id: string, option: 'Es' | 'Panas' | undefined, note: string) => {
    setCart(prev => prev.map(item => 
      (item.id === id && item.option === option) ? { ...item, note } : item
    ));
    setNoteModalItem(null);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const sendToWhatsApp = () => {
    const phoneNumber = "6281258394293";
    const orderDetails = cart.map(item => {
      let detail = `- ${item.name}${item.option ? ` (${item.option})` : ''} (${item.quantity}x)`;
      if (item.note) detail += `\n  *Catatan: ${item.note}*`;
      return detail;
    }).join('\n');

    let extraInfo = '';
    if (orderType === 'Makan di Tempat') {
      if (tableNumber) {
        extraInfo = `\n\n*Detail Penyajian:* Makan di Tempat\n*Nomor Meja:* ${tableNumber}`;
      } else {
        extraInfo = `\n\n*Detail Penyajian:* Makan di Tempat`;
      }
    } else {
      const methodText = deliveryMethod === 'kirim_alamat' ? 'Kirim ke Alamat' : 'Ambil Sendiri di Toko';
      extraInfo = `\n\n*Detail Penyajian:* Bungkus (${methodText})`;
      if (deliveryMethod === 'kirim_alamat' && deliveryAddress) {
        extraInfo += `\n*Alamat Pengiriman:* ${deliveryAddress}`;
      }
    }

    const message = `Halo RM Segar,\n\nSaya ingin memesan:\n${orderDetails}${extraInfo}\n\nTerima kasih!`;
    
    // Save to history
    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      date: new Date().toLocaleString('id-ID'),
      items: [...cart],
      totalItems: totalItems,
      orderType: orderType,
      status: 'pending',
      tableNumber: orderType === 'Makan di Tempat' ? tableNumber : undefined,
      deliveryMethod: orderType === 'Bungkus' ? deliveryMethod : undefined,
      deliveryAddress: (orderType === 'Bungkus' && deliveryMethod === 'kirim_alamat') ? deliveryAddress : undefined
    };
    setOrders(prev => [newOrder, ...prev]);
    
    openWhatsApp(phoneNumber, message);
    setCart([]);
    setIsCartOpen(false);

    // Trigger panda swipe down animation when order is sent to WhatsApp
    triggerPandaAnimation("Pesanan Berhasil Dikirim ke WhatsApp! 🐼📱");
  };

  const handleConfirmFromAIChat = (idx: number, type: 'pesanan' | 'reservasi', content: string) => {
    if (type === 'pesanan') {
      const parsedOrder = parseAIOrderText(content);
      const newOrder: Order = {
        id: 'AI-' + Math.random().toString(36).substr(2, 7).toUpperCase(),
        date: new Date().toLocaleString('id-ID'),
        items: parsedOrder.items,
        customText: parsedOrder.customText,
        totalItems: parsedOrder.totalItems,
        orderType: 'AI Chat',
        status: 'pending'
      };
      setOrders(prev => [newOrder, ...prev]);
    } else {
      const parsedRes = parseReservationText(content);
      const newRes: Reservation = {
        id: 'RES-' + Math.random().toString(36).substr(2, 7).toUpperCase(),
        date: new Date().toLocaleString('id-ID'),
        bookingName: parsedRes.bookingName,
        bookingDate: parsedRes.bookingDate,
        bookingTime: parsedRes.bookingTime,
        partySize: parsedRes.partySize,
        details: parsedRes.details,
        status: 'pending'
      };
      setReservations(prev => [newRes, ...prev]);
    }

    setConfirmedAIMessages(prev => ({ ...prev, [idx]: true }));
    triggerPandaAnimation("Pesanan AI Berhasil Terkonfirmasi! 🐼✨");
  };

  const renderHome = () => (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="space-y-8"
    >
      {/* AI Recommendation Section */}
      <section className="px-4 md:px-8 lg:px-10" id="tour-ai-chat">
        <div className="bg-gradient-to-br from-red-950 via-stone-950 to-red-950 border border-amber-500/20 rounded-[32px] p-6 md:p-8 lg:p-10 shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 bg-gradient-to-tr from-red-600 to-red-500 rounded-xl flex items-center justify-center text-white border border-amber-400/40 shadow-md">
                <Bot size={24} className="text-amber-100" />
              </div>
              <div>
                <h3 className="text-amber-100 font-bold tracking-wide">{TRANSLATIONS[language].kokiAsk}</h3>
                <p className="text-stone-300 text-xs">{TRANSLATIONS[language].chatChef}</p>
              </div>
            </div>
            
            <button 
              onClick={startAIChat}
              className="w-full py-3.5 bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-700 hover:to-red-600 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-950/40 active:scale-95 border border-amber-500/30 text-amber-50 font-serif"
            >
              <MessageSquare size={18} className="text-amber-200" />
              {TRANSLATIONS[language].kokiStart}
            </button>
          </div>
          
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full -mr-16 -mt-16 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-red-600/15 rounded-full -ml-12 -mb-12 blur-2xl" />
          {/* Subtle oriental frame pattern trace */}
          <div className="absolute inset-2 border border-amber-500/10 rounded-[26px] pointer-events-none" />
        </div>
      </section>

      {/* Chinese Fortune Cookie Banner */}
      <section className="px-4 md:px-8 lg:px-10">
        <div className="bg-gradient-to-r from-red-800 via-red-900 to-red-800 border-2 border-amber-400/30 rounded-[32px] p-5 md:p-6 shadow-xl relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="absolute top-0 right-0 w-40 h-40 bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute inset-1.5 border border-amber-400/10 rounded-[28px] pointer-events-none" />
          
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-14 h-14 bg-gradient-to-tr from-amber-400 to-amber-200 rounded-2xl flex items-center justify-center text-red-700 border border-amber-300 shadow-md transform -rotate-3 select-none flex-shrink-0">
              <span className="text-3xl font-bold font-serif leading-none">福</span>
            </div>
            <div>
              <h3 className="text-amber-200 font-black text-lg tracking-wide font-serif">
                {language === 'en' ? 'Lucky Fortune Cookie' : language === 'zh' ? '吉星幸运饼干' : 'Biskuit Keberuntungan Hoki'}
              </h3>
              <p className="text-amber-100/85 text-xs mt-0.5 max-w-sm font-sans font-medium">
                {language === 'en' ? 'Crack open a daily fortune to discover your lucky menu recommendation!' : language === 'zh' ? '敲开幸运饼，获取今日运势和专属招牌推荐！' : 'Pecahkan biskuitnya untuk tahu ramalan hari ini & rekomendasi menu hokimu!'}
              </p>
            </div>
          </div>
          
          <button 
            onClick={openFortuneCookie}
            className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 hover:from-amber-500 hover:to-amber-400 text-stone-900 font-black text-sm rounded-2xl shadow-lg shadow-amber-500/10 border border-amber-200 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer font-serif tracking-wide"
          >
            <span>🏮</span>
            <span>{language === 'en' ? 'Check Luck' : language === 'zh' ? '测今日手气' : 'Cek Hoki Kuliner'}</span>
          </button>
        </div>
      </section>



      {/* Categories */}
      <section className="px-4 md:px-8 lg:px-10 overflow-x-auto no-scrollbar flex justify-start md:justify-center gap-4 md:gap-6 lg:gap-12 py-4" id="tour-categories">
        {categories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => setActiveCategory(cat.name)}
            className={`flex flex-col items-center gap-2 min-w-[70px] md:min-w-[100px] transition-all ${
              activeCategory === cat.name ? 'scale-105' : 'opacity-65'
            }`}
          >
            <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${
              activeCategory === cat.name 
                ? 'bg-gradient-to-br from-red-600 to-red-500 text-white shadow-lg shadow-red-200 border border-amber-400' 
                : 'bg-white text-stone-600 border border-stone-100 hover:border-red-100'
            }`}>
              {cat.icon}
            </div>
            <span className={`text-xs md:text-sm font-bold ${activeCategory === cat.name ? 'text-red-700' : 'text-stone-500'}`}>
              {cat.label}
            </span>
          </button>
        ))}
      </section>
 
      {/* Popular Section */}
      <section className="px-4 md:px-8 lg:px-10">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <span className="text-red-600">🏮</span>
            <h2 className="text-xl font-bold text-stone-900 tracking-tight">{TRANSLATIONS[language].popular}</h2>
          </div>
          <button 
            onClick={handleViewAllMenu}
            className="text-red-600 hover:text-red-700 text-sm font-bold flex items-center gap-0.5 transition-colors cursor-pointer"
          >
            <span>Lihat Semua</span>
            <span>→</span>
          </button>
        </div>
        <div ref={popularScrollRef} className="flex gap-4 overflow-x-auto no-scrollbar pb-4 md:flex lg:grid lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 md:gap-6 lg:gap-8 xl:gap-10">
          {popularItems.map((item) => (
            <motion.div 
              key={item.id}
              whileTap={{ scale: 0.95 }}
              className="min-w-[240px] md:min-w-[280px] lg:min-w-0 bg-white rounded-3xl p-4 md:p-5 lg:p-6 shadow-sm border border-stone-50 flex flex-col justify-between h-full hover:border-red-100 transition-all group"
            >
              <div className="relative h-32 rounded-2xl overflow-hidden mb-4 bg-stone-50">
                <MenuIcon item={item} size={48} />
                <button 
                  onClick={() => toggleFavorite(item.id)}
                  className={`absolute top-2 right-2 p-2 bg-white/90 backdrop-blur-sm rounded-full transition-all shadow-xs ${
                    favorites.includes(item.id) ? 'text-red-500 scale-110' : 'text-stone-400 hover:text-red-400'
                  }`}
                >
                  <Heart size={16} fill={favorites.includes(item.id) ? "currentColor" : "none"} />
                </button>
              </div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-stone-900 leading-tight group-hover:text-red-700 transition-colors">{item.name}</h3>
                <div className="flex items-center gap-1 text-amber-500">
                  <Star size={14} fill="currentColor" />
                  <span className="text-xs font-bold">4.8</span>
                </div>
              </div>
              <p className="text-xs text-stone-400 mb-4 line-clamp-2 h-8">{item.description}</p>
              <div className="flex justify-between items-center mt-auto pt-2 border-t border-stone-50">
                <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-md">Otentik Kalbar</span>
                {renderMenuQuantitySelector(item)}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Menu List */}
      <section ref={menuListSectionRef} className="px-4 md:px-8 lg:px-10 scroll-mt-20">
        <h2 className="text-xl font-bold text-stone-900 mb-4">Menu {activeCategory}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6 lg:gap-8 xl:gap-10">
          {categoryItems.map((item) => (
            <motion.div 
              layout
              key={item.id}
              className="bg-white p-3 md:p-5 lg:p-6 rounded-3xl flex gap-4 md:gap-6 shadow-sm border border-stone-50 h-full"
            >
              <div className="w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-2xl overflow-hidden flex-shrink-0">
                <MenuIcon item={item} size={40} />
              </div>
              <div className="flex-grow flex flex-col justify-center py-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-stone-900 mb-1">{item.name}</h3>
                  <button onClick={() => toggleFavorite(item.id)} className={favorites.includes(item.id) ? 'text-orange-500' : 'text-stone-300'}>
                    <Heart size={16} fill={favorites.includes(item.id) ? "currentColor" : "none"} />
                  </button>
                </div>
                <p className="text-xs text-stone-400 mb-3">{item.description}</p>
                <div className="flex justify-end items-center mt-auto pt-2">
                  {renderMenuQuantitySelector(item)}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </motion.div>
  );

  const renderSearch = () => (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="px-4 md:px-8 lg:px-10 xl:px-12 space-y-6"
    >
      <div className="flex items-center gap-4 mb-2" id="tour-search-page-input">
        <button onClick={() => handleTabChange('home')} className="p-2 bg-white rounded-full shadow-sm">
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-xl font-bold">{TRANSLATIONS[language].searchTitle}</h2>
      </div>
      
      {searchQuery ? (
        <div className="space-y-4">
          <p className="text-sm text-stone-500">{TRANSLATIONS[language].searchResultsFor} "{searchQuery}"</p>
          {searchItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6 lg:gap-8 xl:gap-10">
              {searchItems.map((item) => (
                <div key={item.id} className="bg-white p-3 md:p-5 lg:p-6 rounded-3xl flex gap-4 md:gap-6 shadow-sm border border-stone-50">
                  <div className="w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-2xl overflow-hidden flex-shrink-0">
                    <MenuIcon item={item} size={36} />
                  </div>
                  <div className="flex-grow flex flex-col justify-center">
                    <h3 className="font-bold text-stone-900">{item.name}</h3>
                    <p className="text-xs text-stone-400 mb-2">{item.category}</p>
                    <div className="mt-2">
                      {renderMenuQuantitySelector(item)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <Search size={48} className="mx-auto text-stone-200 mb-4" />
              <p className="text-stone-500">{TRANSLATIONS[language].searchNoResults}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6" id="tour-search-history">
          {searchHistory.length > 0 && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-stone-900">Riwayat Pencarian</h3>
                <button 
                  onClick={() => setSearchHistory([])}
                  className="text-xs text-stone-400 font-bold hover:text-orange-500"
                >
                  Hapus Semua
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {searchHistory.map((term, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setSearchQuery(term)}
                    className="flex items-center gap-2 px-4 py-2 bg-white rounded-full text-sm text-stone-600 border border-stone-100 shadow-sm group hover:border-orange-200 transition-all"
                  >
                    <History size={14} className="text-stone-300 group-hover:text-orange-500 transition-colors" />
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-3">
            <h3 className="font-bold text-stone-900">Pencarian Populer</h3>
            <div className="flex flex-wrap gap-2">
              {['Bakmie Kering', 'Kwetiao Goreng', 'Kaifon', 'Es Jeruk Nipis'].map(term => (
                <button 
                  key={term}
                  onClick={() => setSearchQuery(term)}
                  className="px-4 py-2 bg-white rounded-full text-sm text-stone-600 border border-stone-100 shadow-sm"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );

  const renderFavorites = () => (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="px-4 md:px-8 lg:px-10 xl:px-12 space-y-8"
    >
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-stone-900">Menu Favorit</h2>
        {favoriteItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6 lg:gap-8 xl:gap-10">
            {favoriteItems.map((item) => (
              <div key={item.id} className="bg-white p-3 md:p-5 lg:p-6 rounded-3xl flex gap-4 md:gap-6 shadow-sm border border-stone-50 h-full">
                <div className="w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-2xl overflow-hidden flex-shrink-0">
                  <MenuIcon item={item} size={40} />
                </div>
                <div className="flex-grow flex flex-col justify-center">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-stone-900">{item.name}</h3>
                    <button onClick={() => toggleFavorite(item.id)} className="text-orange-500">
                      <Heart size={18} fill="currentColor" />
                    </button>
                  </div>
                  <p className="text-xs text-stone-400 mb-3">{item.category}</p>
                  <div className="mt-auto pt-2">
                    {renderMenuQuantitySelector(item)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-white rounded-3xl border border-stone-50 shadow-xs p-6">
            <Heart size={48} className="mx-auto text-stone-200 mb-4" />
            <h3 className="text-lg font-bold text-stone-900 mb-2">Belum Ada Favorit</h3>
            <p className="text-stone-400">Klik ikon hati pada menu untuk menyimpannya di sini.</p>
            <button 
              onClick={() => setActiveTab('home')}
              className="mt-6 px-6 py-3 bg-orange-500 text-white rounded-2xl font-bold"
            >
              Cari Menu
            </button>
          </div>
        )}
      </div>

      {/* Chinese Shio & Culinary compatibility Matcher */}
      <div className="border-t border-stone-100 pt-8">
        <div className="bg-stone-900 border-2 border-red-800/40 rounded-[32px] p-5 md:p-6 shadow-xl relative overflow-hidden">
          {/* Subtle golden cloud watermark pattern */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute inset-1.5 border border-red-900/15 rounded-[28px] pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-800/80 pb-4 mb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">🏮</span>
                <h3 className="text-amber-400 font-black text-lg tracking-wide font-serif">
                  {language === 'en' ? 'Zodiac & Food Compatibility' : language === 'zh' ? '生肖福运菜搭配' : 'Kecocokan Menu & Shio Keberuntungan'}
                </h3>
              </div>
              <p className="text-stone-400 text-xs mt-1">
                {language === 'en' ? 'Select your birth year or shio to reveal your lucky Pontianak menu match!' : language === 'zh' ? '输入您的出生年份或生肖，测出属于您的本命招牌菜！' : 'Pilih tahun lahir atau langsung klik shiomu untuk melihat ramalan & menu hoki Pontianak Anda!'}
              </p>
            </div>
            
            {/* Year Selector Dropdown */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <label htmlFor="shio-year-select" className="text-[11px] font-extrabold uppercase tracking-widest text-stone-400 font-sans">
                {language === 'en' ? 'Birth Year:' : language === 'zh' ? '出生年份:' : 'Tahun Lahir:'}
              </label>
              <select
                id="shio-year-select"
                value={birthYear}
                onChange={(e) => handleSelectYear(e.target.value)}
                className="bg-stone-950 border border-stone-800 text-amber-200 text-xs font-serif font-bold rounded-xl px-3 py-2 outline-none cursor-pointer focus:border-amber-400/50 transition-colors"
              >
                <option value="">-- {language === 'en' ? 'Select' : language === 'zh' ? '选择' : 'Pilih'} --</option>
                {Array.from({ length: 87 }, (_, i) => 2026 - i).map((y) => (
                  <option key={y} value={y.toString()}>{y}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Shio Direct Choices Grid */}
          <div className="grid grid-cols-6 sm:grid-cols-12 gap-2 mb-4">
            {SHIO_DETAILS.map((shio) => {
              const isSelected = selectedShio?.id === shio.id;
              return (
                <button
                  key={shio.id}
                  onClick={() => handleSelectDirectShio(shio)}
                  className={`flex flex-col items-center justify-center p-2 rounded-2xl border transition-all cursor-pointer relative ${
                    isSelected 
                      ? 'bg-gradient-to-b from-red-950 to-red-900 border-amber-400 shadow-md scale-105' 
                      : 'bg-stone-950/80 border-stone-800 hover:border-stone-700 hover:bg-stone-950'
                  }`}
                  title={shio.name}
                >
                  <span className="text-xl md:text-2xl mb-1 select-none">{shio.emoji}</span>
                  <span className="text-[9px] font-black uppercase text-stone-400 tracking-wider leading-none">
                    {language === 'en' ? shio.id.toUpperCase().substring(0, 3) : language === 'zh' ? shio.zh : shio.name}
                  </span>
                  {/* Miniature Chinese character stamp */}
                  <span className="absolute top-0.5 right-1.5 text-[7px] font-serif text-red-500/40 font-bold select-none">
                    {shio.zh}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Shio Compatibility Result Block */}
          <AnimatePresence mode="wait">
            {showShioResult && selectedShio && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 border border-stone-800/80 rounded-2xl p-4 md:p-5 flex flex-col md:flex-row items-center justify-between gap-5 relative overflow-hidden mt-2"
              >
                {/* Visual Shio and Element Badge */}
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <div className="w-16 h-16 bg-gradient-to-tr from-red-600 to-amber-500 rounded-3xl flex items-center justify-center text-3xl shadow-lg border border-amber-300/20 transform -rotate-3 select-none flex-shrink-0 relative">
                    {selectedShio.emoji}
                    {/* Golden Circle Stamp */}
                    <span className="absolute bottom-1 right-1 bg-amber-400 text-stone-950 text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center border border-white shadow-xs leading-none">
                      {selectedShio.zh}
                    </span>
                  </div>
                  
                  <div className="flex-grow">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-amber-200 font-extrabold text-base font-serif tracking-wide">
                        {language === 'en' ? `Shio ${selectedShio.id.toUpperCase()}` : language === 'zh' ? `属${selectedShio.zh}` : `Shio ${selectedShio.name}`}
                      </h4>
                      {birthYear && (() => {
                        const calculated = getShioAndElementFromYear(birthYear);
                        if (!calculated) return null;
                        return (
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-serif font-black border uppercase tracking-wider ${calculated.elementColor}`}>
                            {language === 'en' ? calculated.element : language === 'zh' ? calculated.elementZh : `Elemen ${calculated.element}`}
                          </span>
                        );
                      })()}
                      {!birthYear && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-serif font-black bg-stone-800 border border-stone-700 text-stone-300 uppercase tracking-wider">
                          {language === 'en' ? selectedShio.elementDefault : language === 'zh' ? '本命' : `Elemen ${selectedShio.elementDefault}`}
                        </span>
                      )}

                      {/* Unique Trait Badge */}
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-sans font-bold bg-amber-500/10 border border-amber-500/30 text-amber-300">
                        {selectedShio.trait[language]}
                      </span>
                    </div>

                    {/* Lucky Numbers, Colors, and Directions Badges */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-[11px] text-stone-300 font-sans">
                      <span className="flex items-center gap-1 bg-stone-900/90 px-2 py-0.5 rounded-md border border-stone-800">
                        <span className="text-amber-400 font-bold">🎯 {language === 'en' ? 'Numbers:' : language === 'zh' ? '吉数:' : 'Angka Hoki:'}</span>
                        <span className="font-extrabold text-amber-200">{selectedShio.luckyNumbers}</span>
                      </span>
                      <span className="flex items-center gap-1 bg-stone-900/90 px-2 py-0.5 rounded-md border border-stone-800">
                        <span className="text-amber-400 font-bold">🎨 {language === 'en' ? 'Colors:' : language === 'zh' ? '吉色:' : 'Warna Hoki:'}</span>
                        <span className="font-semibold text-stone-200">{selectedShio.luckyColors[language]}</span>
                      </span>
                      <span className="flex items-center gap-1 bg-stone-900/90 px-2 py-0.5 rounded-md border border-stone-800">
                        <span className="text-amber-400 font-bold">🧭 {language === 'en' ? 'Direction:' : language === 'zh' ? '财位:' : 'Arah Hoki:'}</span>
                        <span className="font-semibold text-stone-200">{selectedShio.luckyDirection[language]}</span>
                      </span>
                    </div>

                    <p className="text-stone-300 text-xs leading-relaxed mt-2.5 max-w-lg font-medium font-serif italic border-l-2 border-amber-500/30 pl-2.5">
                      "{selectedShio.desc[language]}"
                    </p>
                  </div>
                </div>

                {/* Lucky Culinary Item Card */}
                {(() => {
                  const luckyMenuItem = MENU_ITEMS.find(m => m.id === selectedShio.foodId);
                  if (!luckyMenuItem) return null;
                  return (
                    <div className="w-full md:w-72 bg-stone-900/90 border border-amber-400/25 rounded-2xl p-3 flex items-center justify-between gap-3 shadow-md hover:border-amber-400/40 transition-all flex-shrink-0">
                      <div className="text-left min-w-0 flex-grow">
                        <span className="text-[8px] bg-red-600 text-amber-50 font-black px-1.5 py-0.5 rounded-sm uppercase tracking-wide">
                          {language === 'en' ? 'LUCKY MATCH' : language === 'zh' ? '吉星主打菜' : 'MENU HOKIMU'}
                        </span>
                        <h5 className="font-extrabold text-amber-200 text-sm mt-1 truncate">{luckyMenuItem.name}</h5>
                        <p className="text-[10px] text-stone-400 leading-tight mt-0.5 line-clamp-1">{luckyMenuItem.description}</p>
                      </div>
                      <button
                        onClick={(e) => {
                          addToCart(luckyMenuItem, undefined, e);
                          setCartPulse(true);
                          setTimeout(() => setCartPulse(false), 500);
                        }}
                        className="w-10 h-10 bg-gradient-to-tr from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white rounded-xl flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all flex-shrink-0 cursor-pointer border border-red-400/20"
                        title="Pesan Menu Hoki"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                  );
                })()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );

  const renderAdminDashboard = () => {
    if (!isAdminAuthenticated) {
      return (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                setShowAdminDashboard(false);
                setAdminEmailInput('');
              }}
              className="w-10 h-10 bg-white rounded-xl shadow-sm border border-stone-50 flex items-center justify-center text-stone-400"
            >
              <ChevronLeft size={24} />
            </button>
            <h2 className="text-xl font-bold text-stone-900">Verifikasi Admin</h2>
          </div>

          <div className="bg-white p-8 rounded-[32px] shadow-sm border border-stone-50 space-y-6 text-center">
            <div className="w-20 h-20 bg-orange-100 text-orange-500 rounded-3xl mx-auto flex items-center justify-center">
              <Bot size={40} />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-stone-900">Masuk sebagai Admin</h3>
              <p className="text-sm text-stone-500 max-w-sm mx-auto leading-relaxed">
                Halaman ini dilindungi secara khusus dan hanya dapat diakses dengan email <span className="font-bold text-orange-600">valensiarainy73@gmail.com</span>.
              </p>
            </div>

            <div className="space-y-4 max-w-md mx-auto text-left">
              <div>
                <label className="text-xs font-bold text-stone-400 uppercase ml-1">Alamat Email Admin</label>
                <input 
                  type="email" 
                  placeholder="nama@email.com"
                  value={adminEmailInput}
                  onChange={(e) => setAdminEmailInput(e.target.value)}
                  className="w-full bg-stone-50 border-none rounded-2xl py-4 px-6 mt-2 focus:ring-2 focus:ring-orange-500/20 transition-all text-stone-900"
                />
              </div>

              <button 
                onClick={() => {
                  if (adminEmailInput.trim().toLowerCase() === 'valensiarainy73@gmail.com') {
                    setIsAdminAuthenticated(true);
                    setAdminEmailInput('');
                  } else {
                    alert('Akses Ditolak! Email tidak sesuai.');
                  }
                }}
                className="w-full py-4 bg-orange-500 text-white rounded-2xl font-bold text-lg shadow-lg shadow-orange-100 hover:bg-orange-600 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles size={20} />
                Verifikasi Akses
              </button>

              <div className="pt-4 border-t border-stone-100 text-center">
                <button
                  onClick={() => {
                    setAdminEmailInput('valensiarainy73@gmail.com');
                  }}
                  className="text-xs font-bold text-orange-500 hover:underline"
                >
                  Gunakan Akun valensiarainy73@gmail.com (Demo)
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Statistics calculations
    const pendingOrders = orders.filter(o => o.status === 'pending' || !o.status).length;
    const cookingOrders = orders.filter(o => o.status === 'cooking').length;
    const doneOrders = orders.filter(o => o.status === 'done').length;

    const pendingRes = reservations.filter(r => r.status === 'pending' || !r.status).length;
    const confirmedRes = reservations.filter(r => r.status === 'confirmed').length;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowAdminDashboard(false)}
              className="w-10 h-10 bg-white rounded-xl shadow-sm border border-stone-50 flex items-center justify-center text-stone-400"
            >
              <ChevronLeft size={24} />
            </button>
            <h2 className="text-xl font-bold text-stone-900">Dashboard Admin</h2>
          </div>
          <button 
            onClick={() => {
              setIsAdminAuthenticated(false);
              alert('Sesi admin telah ditutup.');
            }}
            className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-xs font-bold border border-red-100 flex items-center gap-1.5 hover:bg-red-100 transition-colors"
          >
            <LogOut size={14} />
            Kunci Akses
          </button>
        </div>

        {/* Dashboard Statistics Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white p-4 rounded-3xl border border-stone-100 shadow-sm space-y-1">
            <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Antrean Pesanan</p>
            <p className="text-2xl font-black text-stone-900">{pendingOrders + cookingOrders}</p>
            <div className="flex gap-2 text-[10px] text-stone-400 font-medium">
              <span className="text-amber-500 font-bold">{pendingOrders} Baru</span>
              <span>•</span>
              <span className="text-blue-500 font-bold">{cookingOrders} Masak</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-3xl border border-stone-100 shadow-sm space-y-1">
            <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Pesanan Selesai</p>
            <p className="text-2xl font-black text-green-600">{doneOrders}</p>
            <p className="text-[10px] text-stone-400 font-medium">Hari ini</p>
          </div>

          <div className="bg-white p-4 rounded-3xl border border-stone-100 shadow-sm space-y-1">
            <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Reservasi Masuk</p>
            <p className="text-2xl font-black text-stone-900">{reservations.length}</p>
            <div className="flex gap-2 text-[10px] text-stone-400 font-medium">
              <span className="text-amber-500 font-bold">{pendingRes} Menunggu</span>
              <span>•</span>
              <span className="text-green-600 font-bold">{confirmedRes} Ok</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-3xl border border-stone-100 shadow-sm space-y-1">
            <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Sistem Database</p>
            <div className="flex items-center gap-1.5 text-green-600 font-bold text-xs mt-1">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
              Aktif (Lokal)
            </div>
            <p className="text-[9px] text-stone-400 mt-1">{user?.phone || user?.email || '6289518948115'}</p>
          </div>
        </div>

        {/* Admin Tabs */}
        <div className="flex p-1 bg-stone-100 rounded-2xl max-w-md">
          <button 
            onClick={() => setAdminTab('orders')}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              adminTab === 'orders' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500'
            }`}
          >
            <ShoppingBag size={16} />
            Semua Pesanan ({orders.length})
          </button>
          <button 
            onClick={() => setAdminTab('reservations')}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              adminTab === 'reservations' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500'
            }`}
          >
            <Bot size={16} />
            Reservasi ({reservations.length})
          </button>
        </div>

        {/* Tab Content */}
        {adminTab === 'orders' ? (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-[32px] border border-stone-100 shadow-sm text-stone-400">
                <ShoppingBag size={48} className="mx-auto text-stone-200 mb-3" />
                <p className="font-bold text-stone-600">Belum ada pesanan masuk</p>
                <p className="text-xs text-stone-400 mt-1">Pesanan dari keranjang atau AI akan muncul di sini.</p>
              </div>
            ) : (
              orders.map((order) => {
                const isAI = order.orderType === 'AI Chat';
                return (
                  <div key={order.id} className="bg-white p-6 rounded-[32px] shadow-sm border border-stone-100 space-y-4">
                    <div className="flex justify-between items-start flex-wrap gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">Order #{order.id}</p>
                          <span className={`px-2 py-0.5 text-[9px] font-extrabold uppercase rounded-full ${
                            isAI 
                              ? 'bg-purple-100 text-purple-700' 
                              : order.orderType === 'Makan di Tempat' 
                                ? 'bg-orange-100 text-orange-700' 
                                : 'bg-blue-100 text-blue-700'
                          }`}>
                            {order.orderType}
                          </span>
                        </div>
                        <p className="text-xs text-stone-400 font-semibold mt-1">{order.date}</p>
                      </div>

                      {/* Status Badges */}
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          order.status === 'cooking' 
                            ? 'bg-blue-500 text-white animate-pulse' 
                            : order.status === 'done' 
                              ? 'bg-green-600 text-white' 
                              : order.status === 'cancelled' 
                                ? 'bg-stone-300 text-stone-600' 
                                : 'bg-amber-500 text-white'
                        }`}>
                          {order.status === 'cooking' 
                            ? 'Memasak' 
                            : order.status === 'done' 
                              ? 'Selesai' 
                              : order.status === 'cancelled' 
                                ? 'Batal' 
                                : 'Menunggu'}
                        </span>
                      </div>
                    </div>

                    {/* Order Details */}
                    <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100 space-y-3">
                      {order.items && order.items.length > 0 ? (
                        <div className="space-y-2">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-xs font-semibold text-stone-700">
                              <span className="flex items-center gap-1.5">
                                {item.name}
                                {item.option && (
                                  <span className={`px-1.5 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider ${
                                    item.option === 'Es' ? 'bg-blue-200 text-blue-800' : 'bg-orange-200 text-orange-800'
                                  }`}>
                                    {item.option}
                                  </span>
                                )}
                              </span>
                              <span>x{item.quantity}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs font-medium italic text-stone-500 leading-relaxed">
                          "{order.customText}"
                        </p>
                      )}

                      {/* Extra info for admin */}
                      {(order.tableNumber || order.deliveryMethod) && (
                        <div className="pt-2 border-t border-dashed border-stone-200 mt-2 text-[11px] space-y-1 text-stone-500 font-semibold">
                          {order.orderType === 'Makan di Tempat' && order.tableNumber && (
                            <p className="flex items-center gap-1">
                              <span>📍</span> 
                              <span><strong className="font-bold text-stone-700">Nomor Meja:</strong> {order.tableNumber}</span>
                            </p>
                          )}
                          {order.orderType === 'Bungkus' && order.deliveryMethod && (
                            <div className="space-y-1">
                              <p className="flex items-center gap-1">
                                <span>📦</span> 
                                <span><strong className="font-bold text-stone-700">Metode:</strong> {order.deliveryMethod === 'kirim_alamat' ? 'Kirim ke Alamat' : 'Ambil Sendiri'}</span>
                              </p>
                              {order.deliveryMethod === 'kirim_alamat' && order.deliveryAddress && (
                                <p className="pl-4 text-stone-400 font-medium italic leading-relaxed">Alamat: {order.deliveryAddress}</p>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Control Actions */}
                    <div className="pt-3 border-t border-stone-50 flex items-center justify-between flex-wrap gap-2">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: 'cooking' } : o));
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-colors ${
                            order.status === 'cooking' ? 'bg-blue-100 text-blue-600 cursor-default' : 'bg-stone-100 text-stone-600 hover:bg-blue-50 hover:text-blue-600'
                          }`}
                        >
                          Masak
                        </button>
                        <button
                          onClick={() => {
                            setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: 'done' } : o));
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-colors ${
                            order.status === 'done' ? 'bg-green-100 text-green-600 cursor-default' : 'bg-stone-100 text-stone-600 hover:bg-green-50 hover:text-green-600'
                          }`}
                        >
                          Selesai
                        </button>
                        <button
                          onClick={() => {
                            setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: 'cancelled' } : o));
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-colors ${
                            order.status === 'cancelled' ? 'bg-stone-200 text-stone-600 cursor-default' : 'bg-stone-100 text-stone-600 hover:bg-red-50 hover:text-red-600'
                          }`}
                        >
                          Batal
                        </button>
                      </div>

                      <button
                        onClick={() => {
                          setOrders(prev => prev.filter(o => o.id !== order.id));
                        }}
                        className="p-2 text-stone-300 hover:text-red-500 transition-colors cursor-pointer"
                        title="Hapus Pesanan"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {reservations.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-[32px] border border-stone-100 shadow-sm text-stone-400">
                <Bot size={48} className="mx-auto text-stone-200 mb-3" />
                <p className="font-bold text-stone-600">Belum ada reservasi masuk</p>
                <p className="text-xs text-stone-400 mt-1">Reservasi yang diproses oleh Koki AI akan muncul di sini.</p>
              </div>
            ) : (
              reservations.map((res) => {
                return (
                  <div key={res.id} className="bg-white p-6 rounded-[32px] shadow-sm border border-stone-100 space-y-4">
                    <div className="flex justify-between items-start flex-wrap gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">RES #{res.id}</p>
                          <span className={`px-2.5 py-0.5 text-[9px] font-black rounded-full uppercase tracking-wider ${
                            res.status === 'confirmed' 
                              ? 'bg-green-100 text-green-700' 
                              : res.status === 'cancelled' 
                                ? 'bg-stone-200 text-stone-600' 
                                : 'bg-amber-100 text-amber-700'
                          }`}>
                            {res.status === 'confirmed' ? 'Dikonfirmasi' : res.status === 'cancelled' ? 'Batal' : 'Menunggu'}
                          </span>
                        </div>
                        <p className="text-xs text-stone-400 font-semibold mt-1">Dibuat: {res.date}</p>
                      </div>
                    </div>

                    {/* Booking Details card */}
                    <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100 space-y-3">
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <p className="text-[10px] text-stone-400 uppercase font-black tracking-wider">Atas Nama</p>
                          <p className="font-bold text-stone-800 mt-0.5">{res.bookingName}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-stone-400 uppercase font-black tracking-wider">Jumlah Tamu</p>
                          <p className="font-bold text-stone-800 mt-0.5">{res.partySize} Orang (Pax)</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-stone-400 uppercase font-black tracking-wider">Tanggal Reservasi</p>
                          <p className="font-bold text-stone-800 mt-0.5">{res.bookingDate}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-stone-400 uppercase font-black tracking-wider">Jam</p>
                          <p className="font-bold text-stone-800 mt-0.5">{res.bookingTime}</p>
                        </div>
                      </div>

                      <div className="pt-2.5 border-t border-stone-200 mt-2">
                        <p className="text-[10px] text-stone-400 uppercase font-black tracking-wider">Pesan Asli AI</p>
                        <p className="text-xs font-medium italic text-stone-500 mt-0.5">
                          "{res.details}"
                        </p>
                      </div>
                    </div>

                    {/* Action controls */}
                    <div className="pt-3 border-t border-stone-50 flex items-center justify-between flex-wrap gap-2">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setReservations(prev => prev.map(r => r.id === res.id ? { ...r, status: 'confirmed' } : r));
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-colors ${
                            res.status === 'confirmed' ? 'bg-green-100 text-green-600 cursor-default' : 'bg-stone-100 text-stone-600 hover:bg-green-50 hover:text-green-600'
                          }`}
                        >
                          Konfirmasi
                        </button>
                        <button
                          onClick={() => {
                            setReservations(prev => prev.map(r => r.id === res.id ? { ...r, status: 'cancelled' } : r));
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-colors ${
                            res.status === 'cancelled' ? 'bg-stone-200 text-stone-600 cursor-default' : 'bg-stone-100 text-stone-600 hover:bg-red-50 hover:text-red-600'
                          }`}
                        >
                          Batalkan
                        </button>
                      </div>

                      <button
                        onClick={() => {
                          setReservations(prev => prev.filter(r => r.id !== res.id));
                        }}
                        className="p-2 text-stone-300 hover:text-red-500 transition-colors cursor-pointer"
                        title="Hapus Reservasi"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    );
  };

  const renderProfile = () => (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="px-4 md:px-8 lg:px-10 space-y-8"
    >
      {showAdminDashboard ? (
        renderAdminDashboard()
      ) : showOrderHistory ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setShowOrderHistory(false)}
                className="w-10 h-10 bg-white rounded-xl shadow-sm border border-stone-50 flex items-center justify-center text-stone-400 hover:text-stone-700 transition-colors"
              >
                <ChevronLeft size={24} />
              </button>
              <h2 className="text-xl font-bold text-stone-900">Riwayat Pesanan</h2>
            </div>

            {orders.length > 0 && (
              <button
                onClick={() => setShowClearHistoryConfirmModal(true)}
                className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-600 active:scale-95 text-xs font-bold rounded-xl border border-red-100 flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                title="Hapus Semua Riwayat Pesanan"
              >
                <Trash2 size={14} />
                <span>{language === 'en' ? 'Delete History' : language === 'zh' ? '清空历史' : 'Hapus Riwayat'}</span>
              </button>
            )}
          </div>

          {orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
              <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center text-stone-200">
                <History size={40} />
              </div>
              <p className="text-stone-400 font-medium">Belum ada riwayat pesanan</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-white p-5 rounded-3xl shadow-sm border border-stone-50 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">Order #{order.id}</p>
                      <p className="text-sm text-stone-500">{order.date}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-bold uppercase rounded-full">
                        Selesai
                      </span>
                      <span className="px-3 py-1 bg-stone-100 text-stone-600 text-[10px] font-bold uppercase rounded-full">
                        {order.orderType}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {order.items.map((item, idx) => (
                      <React.Fragment key={idx}>
                        <div className="flex justify-between text-sm">
                          <span className="text-stone-600">
                            {item.name}
                            {item.option && (
                              <span className={`ml-2 px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-tighter ${
                                item.option === 'Es' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'
                              }`}>
                                {item.option}
                              </span>
                            )}
                          </span>
                          <span className="text-stone-400 font-bold">x{item.quantity}</span>
                        </div>
                        {item.note && (
                          <div className="pl-4 border-l-2 border-orange-100 mb-2">
                            <p className="text-[10px] text-orange-500 italic">Catatan: {item.note}</p>
                          </div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                  {(order.tableNumber || order.deliveryMethod) && (
                    <div className="pt-2.5 mt-1 border-t border-dashed border-stone-100 text-xs space-y-1 text-stone-500">
                      {order.orderType === 'Makan di Tempat' && order.tableNumber && (
                        <p>📍 <strong className="font-semibold text-stone-700">Nomor Meja:</strong> {order.tableNumber}</p>
                      )}
                      {order.orderType === 'Bungkus' && order.deliveryMethod && (
                        <>
                          <p>📦 <strong className="font-semibold text-stone-700">Metode:</strong> {order.deliveryMethod === 'kirim_alamat' ? 'Kirim ke Alamat' : 'Ambil Sendiri'}</p>
                          {order.deliveryMethod === 'kirim_alamat' && order.deliveryAddress && (
                            <p className="pl-4 text-stone-400 italic text-[11px] leading-relaxed">Alamat: {order.deliveryAddress}</p>
                          )}
                        </>
                      )}
                    </div>
                  )}
                  <div className="pt-3 border-t border-stone-50 flex justify-between items-center">
                    <span className="text-xs font-bold text-stone-400 uppercase">Total Item</span>
                    <span className="text-stone-900 font-bold">{order.totalItems} Menu</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : showAbout ? (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowAbout(false)}
              className="w-10 h-10 bg-white rounded-xl shadow-sm border border-stone-50 flex items-center justify-center text-stone-400"
            >
              <ChevronLeft size={24} />
            </button>
            <h2 className="text-xl font-bold text-stone-900">Tentang RM Segar</h2>
          </div>

          <div className="bg-white p-6 rounded-[32px] shadow-sm border border-stone-50 space-y-6">
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-stone-900">Lokasi Kami</h3>
                  <p className="text-sm text-stone-500 leading-relaxed mb-4">
                    Terletak strategis di Sambas, Kalimantan Barat untuk melayani pecinta Chinese Food.
                  </p>
                  <div className="w-full h-48 rounded-2xl overflow-hidden border border-stone-100 shadow-inner">
                    <iframe 
                      width="100%" 
                      height="100%" 
                      frameBorder="0" 
                      scrolling="no" 
                      marginHeight={0} 
                      marginWidth={0} 
                      src="https://maps.google.com/maps?q=Rumah%20Makan%20Segar%20Sambas%20Kalimantan%20Barat&t=&z=15&ie=UTF8&iwloc=&output=embed"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Utensils size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-stone-900">Resep Turun Temurun</h3>
                  <p className="text-sm text-stone-500 leading-relaxed">
                    Menjaga cita rasa otentik dengan resep rahasia keluarga yang diwariskan dari generasi ke generasi.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Heart size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-stone-900">Bahan Segar & Berkualitas</h3>
                  <p className="text-sm text-stone-500 leading-relaxed">
                    Kami menjamin setiap sayur dan daging yang kami gunakan selalu fresh setiap harinya.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-red-50 rounded-2xl border border-red-100">
                <div className="flex items-center gap-3 text-red-600">
                  <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                  <span className="text-sm font-bold uppercase tracking-wider">{TRANSLATIONS[language].importantInfo}</span>
                </div>
                <p className="text-sm text-red-500 font-medium mt-1">
                  {TRANSLATIONS[language].nonHalalWarning}
                </p>
              </div>

              {/* Unduh Daftar Menu PDF Card */}
              <div className="p-5 bg-gradient-to-br from-red-50 to-amber-50/50 rounded-3xl border border-amber-200/60 shadow-xs space-y-4">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-red-100 text-red-700 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xs">
                    <Download size={24} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-extrabold text-stone-900 text-base">
                      {language === 'en' ? 'Download Menu Catalog (PDF)' : language === 'zh' ? '下载菜单目录 (PDF)' : 'Unduh Daftar Menu (PDF)'}
                    </h3>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      {language === 'en' 
                        ? 'Download the complete RM Segar menu brochure in 3 languages (ID, EN, ZH) without prices. Great for sharing or printing.' 
                        : language === 'zh' 
                        ? '下载包含印尼语、英语和中文三种语言的鲜馆完整菜单列表（不含价格）。适合分享或打印。' 
                        : 'Unduh brosur daftar menu RM Segar lengkap dalam 3 bahasa (ID, EN, ZH) tanpa mencantumkan harga. Cocok untuk dibagikan atau dicetak.'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsPDFPreviewModalOpen(true)}
                  className="w-full py-3.5 bg-[#450a0a] hover:bg-red-950 text-amber-200 hover:text-amber-100 rounded-2xl font-bold text-sm tracking-wide shadow-md active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer border border-amber-500/20"
                >
                  <BookOpen size={18} />
                  <span>
                    {language === 'en' ? 'Preview & Print Menu' : language === 'zh' ? '预览并打印/下载菜单' : 'Pratinjau & Cetak/Unduh Menu'}
                  </span>
                </button>
              </div>

              {/* Katalog Menu Unggulan RM Segar */}
              <div className="pt-6 border-t border-stone-100">
                <div className="flex items-center gap-2 mb-3 text-orange-500">
                  <BookOpen size={20} />
                  <h3 className="font-bold text-stone-900 text-base">{TRANSLATIONS[language].katalogUnggulan}</h3>
                </div>
                <p className="text-xs text-stone-500 mb-4">
                  {TRANSLATIONS[language].katalogDesc}
                </p>
                <div className="grid grid-cols-1 gap-4">
                  {[
                    {
                      id: 'bakmie-kering',
                      name: language === 'en' ? 'Dry Bakmie Kalimantan' : language === 'zh' ? '加里曼丹招牌干捞面' : 'Bakmie Kering Kalimantan',
                      desc: language === 'en' ? 'Our homemade signature noodles using traditional family recipe, fragrant garlic oil, generous toppings, and separate savory broth.' : language === 'zh' ? '特制家传秘方手工面条，佐以香浓大蒜油、丰富肉碎，搭配清甜骨汤单独盛放。' : 'Mie khas buatan sendiri dengan resep racikan tradisional, minyak bawang harum, topping daging melimpah, dan kuah kaldu segar terpisah.',
                      tag: language === 'en' ? 'Best Seller 🌟' : language === 'zh' ? '畅销招牌 🌟' : 'Best Seller 🌟',
                      price: 'Rp 28.000',
                      item: MENU_ITEMS.find(m => m.id === 'bakmie-kering')
                    },
                    {
                      id: 'kwetiao-goreng',
                      name: language === 'en' ? 'Fried Kwetiao with Beef' : language === 'zh' ? '牛肉爆炒粿条' : 'Kwetiao Goreng Sapi',
                      desc: language === 'en' ? 'Stir-fried in an ultra-hot cast iron wok (Wok Hei) to produce our signature smokey aroma, tossed with tender slices of beef.' : language === 'zh' ? '大火铁镬爆炒，特有诱人焦香镬气，融入细嫩爽口的鲜美牛肉片。' : 'Kwetiao ditumis dengan wajan besi panas membara (Wok Hei) sehingga menghasilkan aroma panggangan yang khas dipadu irisan daging sapi empuk.',
                      tag: language === 'en' ? 'Most Favorite 🔥' : language === 'zh' ? '最爱人气 🔥' : 'Terfavorit 🔥',
                      price: 'Rp 30.000',
                      item: MENU_ITEMS.find(m => m.id === 'kwetiao-goreng')
                    },
                    {
                      id: 'kaifon',
                      name: language === 'en' ? 'Nasi Campur (Kaifon)' : language === 'zh' ? '西加经典盖饭 (Kaifon)' : 'Nasi Campur (Kaifon)',
                      desc: language === 'en' ? 'Warm white rice topped with delicious assorted roasted meats, drizzled with signature sweet-savory Kalimantan thick sauce and soup.' : language === 'zh' ? '热气腾腾白米饭配以各式美味秘制脆皮烤肉，浇上西加里曼丹特色香甜浓稠酱汁。' : 'Nasi putih hangat dengan aneka potongan daging panggang gurih, disiram saus kental manis gurih khas Kalbar dan disajikan bersama kuah hangat.',
                      tag: language === 'en' ? 'Highly Recommended 🏆' : language === 'zh' ? '强烈推荐 🏆' : 'Sangat Direkomendasikan 🏆',
                      price: 'Rp 32.000',
                      item: MENU_ITEMS.find(m => m.id === 'kaifon')
                    },
                    {
                      id: 'kwetiao-kering',
                      name: language === 'en' ? 'Dry Seasoned Kwetiao' : language === 'zh' ? '干捞肉碎粿条' : 'Kwetiao Kering',
                      desc: language === 'en' ? 'Soft, delicate flat rice noodles tossed in RM Segar secret seasoned garlic oil, served with beef balls, tender meat, and fresh scallions.' : language === 'zh' ? '香滑柔嫩的干捞粿条，拌以秘制香滑肉油，配牛肉丸、鲜嫩肉片及翠绿小葱。' : 'Kwetiao lembut tanpa kuah dibumbui minyak gurih racikan RM Segar, dilengkapi bakso sapi, daging empuk, dan taburan daun bawang segar.',
                      tag: language === 'en' ? 'Kalimantan Specialty 🍜' : language === 'zh' ? '西加特色 🍜' : 'Khas Kalbar 🍜',
                      price: 'Rp 28.000',
                      item: MENU_ITEMS.find(m => m.id === 'kwetiao-kering')
                    },
                    {
                      id: 'jeruk-nipis',
                      name: language === 'en' ? 'Ice Pontianak Lime Juice' : language === 'zh' ? '坤甸特色冰爽青柠汁' : 'Es Jeruk Nipis Pontianak',
                      desc: language === 'en' ? 'Freshly squeezed local West Kalimantan lime, perfectly balanced sour-sweetness, the ultimate refreshing companion for your meal.' : language === 'zh' ? '选用西加里曼丹本地新鲜青柠鲜榨而成，酸甜平衡得恰到好处，绝对是解腻解暑佳品。' : 'Perasan jeruk nipis lokal Kalimantan Barat yang asam segar alami dengan tingkat kemanisan yang pas, sangat cocok sebagai pendamping makan.',
                      tag: language === 'en' ? 'Fresh Beverage 🍋' : language === 'zh' ? '清凉解渴 🍋' : 'Minuman Segar 🍋',
                      price: 'Rp 10.000',
                      item: MENU_ITEMS.find(m => m.id === 'jeruk-nipis')
                    }
                  ].map((catItem) => {
                    const menuObj = catItem.item || MENU_ITEMS[0];
                    return (
                      <motion.div
                        key={catItem.id}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setShowAbout(false);
                          setActiveTab('home');
                          setSearchQuery(menuObj.name);
                        }}
                        className="bg-stone-50 border border-stone-100 p-4 rounded-2xl flex flex-col justify-between hover:bg-orange-50/20 hover:border-orange-100 transition-all cursor-pointer text-left"
                      >
                        <div>
                          <div className="flex justify-between items-start gap-2 mb-1.5">
                            <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-full">
                              {catItem.tag}
                            </span>
                            <span className="text-xs font-bold text-stone-700 font-mono">
                              {catItem.price}
                            </span>
                          </div>
                          <h4 className="font-bold text-stone-900 text-sm mb-1">{catItem.name}</h4>
                          <p className="text-xs text-stone-500 leading-relaxed">
                            {catItem.desc}
                          </p>
                        </div>
                        <div className="flex justify-between items-center pt-2 mt-2 border-t border-stone-200/50">
                          <span className="text-[10px] text-stone-400 font-medium">Bumbu Autentik Sambas</span>
                          <span className="text-[11px] font-bold text-orange-500 hover:text-orange-600 transition-all flex items-center gap-0.5">
                            Lihat Menu &rarr;
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="pt-8 pb-2 text-center border-t border-stone-50">
              <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">
                © {new Date().getFullYear()} RM Segar
              </p>
              <p className="text-[10px] text-stone-300 mt-1">
                valensiarainy73@gmail.com
              </p>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col items-center text-center space-y-4" id="tour-profile-info">
            <div className="w-24 h-24 rounded-3xl bg-orange-500 shadow-xl shadow-orange-200 flex items-center justify-center text-white">
              <MainLogo size={48} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-stone-900">
                {user 
                  ? (isAdminUser(user) ? 'RM Segar (Admin / Pemilik)' : 'RM Segar Pelanggan') 
                  : TRANSLATIONS[language].guest}
              </h2>
              <p className="text-stone-500 font-bold">{user ? (user.email || user.phone) : TRANSLATIONS[language].notLoggedIn}</p>
              {user && (
                <div className="mt-2 flex items-center justify-center gap-2">
                  {isAdminUser(user) ? (
                    <span className="px-3 py-1 bg-red-100 text-red-700 text-[11px] font-black uppercase rounded-full border border-red-200 flex items-center gap-1.5 shadow-xs">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      Dashboard Admin Aktif
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-[11px] font-black uppercase rounded-full border border-green-200 flex items-center gap-1.5 shadow-xs">
                      <span className="w-2 h-2 rounded-full bg-green-500" />
                      Akun Pelanggan (Multi-User)
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">


            {user && isAdminUser(user) && (
              <button 
                onClick={() => setShowAdminDashboard(true)}
                className="w-full flex items-center justify-between p-4 bg-orange-50 border border-orange-200 rounded-2xl shadow-sm hover:bg-orange-100/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-orange-500 text-white rounded-xl flex items-center justify-center">
                    <Bot size={20} />
                  </div>
                  <div className="text-left">
                    <span className="font-bold text-orange-900 block leading-tight">{TRANSLATIONS[language].adminDashboard}</span>
                    <span className="text-[10px] text-orange-600 font-bold">Pemilik / Admin: {user.phone || user.email}</span>
                  </div>
                </div>
                <ChevronRight size={20} className="text-orange-400" />
              </button>
            )}

            <button 
              onClick={() => setShowOrderHistory(true)}
              className="w-full flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-stone-50"
              id="tour-order-history"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center">
                  <History size={20} />
                </div>
                <span className="font-bold text-stone-700">{TRANSLATIONS[language].history}</span>
              </div>
              <ChevronRight size={20} className="text-stone-300" />
            </button>
            <button 
              onClick={() => setShowAbout(true)}
              className="w-full flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-stone-50"
              id="tour-about-button"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center">
                  <MapPin size={20} />
                </div>
                <span className="font-bold text-stone-700">{TRANSLATIONS[language].aboutButton}</span>
              </div>
              <ChevronRight size={20} className="text-stone-300" />
            </button>
            <button 
              onClick={() => {
                setCompletedTours({});
                localStorage.removeItem('rm_segar_completed_tours');
                handleTabChange('home');
                setActiveTour('home');
                setTourStep(0);
              }}
              className="w-full flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-stone-50"
              id="tour-guide-button"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center">
                  <Sparkles size={20} />
                </div>
                <span className="font-bold text-stone-700">{TRANSLATIONS[language].guideButton}</span>
              </div>
              <ChevronRight size={20} className="text-stone-300" />
            </button>

            {/* Interactive Language Selection Card */}
            <div className="w-full md:col-span-2 p-5 bg-white rounded-2xl shadow-sm border border-stone-100 flex flex-col space-y-3">
              <div className="flex items-center gap-4 text-stone-700">
                <div className="w-10 h-10 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center">
                  <Globe size={20} />
                </div>
                <div className="text-left">
                  <span className="font-bold block leading-tight text-stone-700">{TRANSLATIONS[language].languageSetting}</span>
                  <span className="text-[10px] text-stone-400 font-bold">{TRANSLATIONS[language].phoneLanguage}</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-1">
                {[
                  { code: 'id', name: 'Bahasa' },
                  { code: 'en', name: 'English' },
                  { code: 'zh', name: '中文' }
                ].map((item) => (
                  <button
                    key={item.code}
                    onClick={() => {
                      setLanguage(item.code as 'id' | 'en' | 'zh');
                      localStorage.setItem('rm_segar_language', item.code);
                    }}
                    className={`py-2.5 px-3 rounded-xl font-bold text-xs transition-all border ${
                      language === item.code
                        ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-100 scale-[1.02]'
                        : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100 active:scale-95'
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>
            
            {user && (
              <button 
                onClick={() => setShowLogoutConfirmModal(true)}
                className="w-full md:col-span-2 flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-stone-50 hover:bg-red-50/50 hover:border-red-100 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-colors">
                    <LogOut size={20} />
                  </div>
                  <span className="font-bold text-stone-700 group-hover:text-red-600 transition-colors">{TRANSLATIONS[language].logout}</span>
                </div>
                <ChevronRight size={20} className="text-stone-300 group-hover:text-red-400 transition-colors" />
              </button>
            )}
          </div>
          
          {!user && (
            <div className="pt-4 space-y-6">
              {showOtpNotification && (
                <div className="bg-orange-50 border border-orange-200/60 p-5 rounded-3xl flex items-center justify-between max-w-2xl mx-auto w-full shadow-lg shadow-orange-500/5 transition-all animate-pulse">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-md">
                      <Bot size={24} className="animate-bounce" />
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] uppercase tracking-wider font-extrabold text-orange-500">
                        {language === 'en' ? 'Simulated WhatsApp SMS/OTP' : language === 'zh' ? '模拟微信验证码' : 'Simulasi WhatsApp OTP'}
                      </p>
                      <p className="text-sm font-bold text-stone-700 mt-0.5">
                        {language === 'en' ? 'Your verification code is: ' : language === 'zh' ? '您的验证码是：' : 'Kode OTP Anda: '}
                        <span className="text-lg text-orange-600 font-mono tracking-widest font-extrabold ml-1">{showOtpNotification}</span>
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setInputToken(showOtpNotification)}
                    className="px-4 py-2 bg-orange-500 text-white rounded-xl text-xs font-bold shadow-md hover:bg-orange-600 active:scale-95 transition-all"
                  >
                    Auto-Fill
                  </button>
                </div>
              )}

              <div className="bg-white p-8 rounded-[32px] shadow-sm border border-stone-50 space-y-6 max-w-2xl mx-auto w-full">
                  <div className="text-center space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-[11px] font-bold border border-orange-200/60 mb-1">
                      <span>📱</span>
                      <span>{language === 'en' ? 'Member Account' : language === 'zh' ? '会员账号' : 'Akun Pelanggan'}</span>
                    </div>
                    <h2 className="text-2xl font-bold text-stone-900">
                      {loginMode === 'login' 
                        ? (language === 'en' ? 'WhatsApp Log In' : language === 'zh' ? '微信/WhatsApp 登录' : 'Masuk via WhatsApp') 
                        : loginMode === 'admin_google'
                        ? (language === 'en' ? 'Admin Google Verification' : language === 'zh' ? '管理员谷歌验证' : 'Verifikasi Google Admin')
                        : (language === 'en' ? 'Verify OTP Token' : language === 'zh' ? '验证码验证' : 'Verifikasi Token')}
                    </h2>
                    <p className="text-stone-500 text-sm leading-relaxed">
                      {loginMode === 'login' 
                        ? (language === 'en' ? 'Enter your WhatsApp number to log in as a customer.' : language === 'zh' ? '输入您的 WhatsApp 号码作为客户登录。' : 'Setiap pengguna dapat masuk menggunakan nomor WhatsApp masing-masing untuk menikmati pemesanan dan layanan fitur RM Segar.') 
                        : loginMode === 'admin_google'
                        ? (language === 'en' ? 'Nomor WhatsApp Admin terdeteksi. Silakan verifikasi dengan akun Google livinajong123@gmail.com.' : language === 'zh' ? '检测到管理员号码。请使用谷歌账号 livinajong123@gmail.com 进行验证。' : 'Nomor WhatsApp Admin terdeteksi. Silakan verifikasi dengan akun Google livinajong123@gmail.com untuk membuka Dashboard.')
                        : (language === 'en' ? 'Enter the 4-digit token sent to your WhatsApp.' : language === 'zh' ? '请输入发送到您 WhatsApp 的 4 位数字验证码。' : 'Masukkan token 4-digit yang dikirim ke nomor WA Anda.')}
                    </p>
                  </div>

                  <div className="space-y-4">
                    {loginMode === 'login' && (
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-stone-400 uppercase ml-1">
                          {language === 'en' ? 'WhatsApp Number' : language === 'zh' ? 'WhatsApp 号码' : 'Nomor WhatsApp'}
                        </label>
                        <div className="relative">
                          <input 
                            type="text" 
                            placeholder={language === 'en' ? 'Example: 62812XXXXXXXX' : language === 'zh' ? '例如: 62812XXXXXXXX' : 'Contoh: 62812XXXXXXXX'}
                            value={loginPhone}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val.includes('@') || /[a-zA-Z]/.test(val)) {
                                setLoginPhone(val);
                              } else {
                                if (val.startsWith('62') || val === '') {
                                  setLoginPhone(val);
                                } else if (!val.startsWith('62') && val.length > 0) {
                                  setLoginPhone('62' + val.replace(/^0+/, ''));
                                }
                              }
                            }}
                            className="w-full bg-stone-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-orange-500/20 transition-all text-stone-900 font-medium"
                          />
                        </div>
                      </div>
                    )}

                    {loginMode === 'verify' && (
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-stone-400 uppercase ml-1">
                          {language === 'en' ? '4-Digit OTP Code' : language === 'zh' ? '4位数字验证码' : 'Token OTP 4-Digit'}
                        </label>
                        <input 
                          type="text" 
                          maxLength={4}
                          placeholder="XXXX"
                          value={inputToken}
                          onChange={(e) => setInputToken(e.target.value)}
                          className="w-full bg-stone-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-orange-500/20 transition-all text-stone-900 text-center text-2xl tracking-[0.5em] font-mono font-extrabold"
                        />
                      </div>
                    )}

                    {loginMode === 'admin_google' && (
                      <div className="space-y-4 text-left">
                        <div className="p-4 bg-red-50/60 border border-red-100 rounded-2xl space-y-2">
                          <p className="text-xs text-red-700 font-bold flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                            Verifikasi Dua Langkah Admin (Google OAuth)
                          </p>
                          <p className="text-xs text-stone-600">
                            Masuk dengan akun Google <span className="font-bold text-red-600">livinajong123@gmail.com</span> untuk mengaktifkan akses Pemilik/Admin.
                          </p>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-stone-400 uppercase ml-1">
                            Email Google / Gmail Admin
                          </label>
                          <input 
                            type="email"
                            value={adminGoogleEmail}
                            onChange={(e) => setAdminGoogleEmail(e.target.value)}
                            placeholder="livinajong123@gmail.com"
                            className="w-full bg-stone-50 border border-stone-200 rounded-2xl py-3.5 px-5 focus:ring-2 focus:ring-orange-500/20 transition-all text-stone-900 font-medium text-sm"
                          />
                        </div>

                        <button 
                          onClick={handleAdminGoogleVerify}
                          className="w-full py-4 bg-stone-900 text-white rounded-2xl font-bold text-sm shadow-lg hover:bg-stone-800 active:scale-98 transition-all flex items-center justify-center gap-2.5"
                        >
                          <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"/>
                            <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/>
                            <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12 0 14.5s.7 4.8 1.9 7.2l3.7-2.9z"/>
                            <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"/>
                          </svg>
                          <span>Masuk dengan Google (livinajong123@gmail.com)</span>
                        </button>
                      </div>
                    )}

                    {loginMode !== 'admin_google' && (
                      <button 
                        onClick={handleLogin}
                        className="w-full py-4 bg-orange-500 text-white rounded-2xl font-bold text-lg shadow-lg shadow-orange-100 hover:bg-orange-600 transition-all flex items-center justify-center gap-2"
                      >
                        <span>
                          {loginMode === 'login' 
                            ? (language === 'en' ? 'Send OTP Code via WA' : language === 'zh' ? '通过微信发送验证码' : 'Kirim Kode OTP via WA') 
                            : (language === 'en' ? 'Verify & Log In' : language === 'zh' ? '验证并登录' : 'Verifikasi & Masuk')}
                        </span>
                      </button>
                    )}

                    {loginMode !== 'login' && (
                      <button 
                        onClick={() => {
                          setLoginMode('login');
                          setShowOtpNotification(null);
                        }}
                        className="w-full text-stone-400 text-sm font-bold hover:text-stone-600 transition-colors"
                      >
                        {language === 'en' ? 'Back to Log In' : language === 'zh' ? '返回登录' : 'Kembali ke Login'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

          <div className="pt-12 pb-4 text-center">
            <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">
              © {new Date().getFullYear()} RM Segar
            </p>
            <p className="text-[10px] text-stone-300 mt-1">
              valensiarainy73@gmail.com
            </p>
          </div>
        </>
      )}
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex flex-col items-center justify-start overflow-x-hidden relative">
      <div className="w-full bg-[#F8F9FB] flex flex-col min-h-screen relative pb-32 overflow-hidden">
        <AnimatePresence>
          {isLoading && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                duration: 0.8,
                ease: "easeOut"
              }}
              className="relative mb-8"
            >
              {/* Animated Logo Container */}
              <motion.div 
                animate={{ 
                  y: [0, -15, 0],
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 2,
                  ease: "easeInOut"
                }}
                className="w-32 h-32 bg-orange-500 rounded-[40px] shadow-2xl shadow-orange-200 flex items-center justify-center text-white relative overflow-hidden"
              >
                <MainLogo size={64} />
                
                {/* Shine effect */}
                <motion.div 
                  animate={{ 
                    x: [-150, 150]
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 1.5,
                    repeatDelay: 0.5
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                />
              </motion.div>

              {/* Decorative particles */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    scale: [0, 1, 0],
                    x: [0, (i % 2 === 0 ? 40 : -40) * Math.random()],
                    y: [0, (i < 3 ? 40 : -40) * Math.random()],
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 2,
                    delay: i * 0.2
                  }}
                  className="absolute top-1/2 left-1/2 w-2 h-2 bg-orange-300 rounded-full"
                />
              ))}
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-3xl font-black text-stone-900 tracking-tighter mb-2">
                RUMAH MAKAN <span className="text-orange-500">SEGAR</span>
              </h1>
              <div className="flex items-center justify-center gap-2">
                <div className="w-8 h-1 bg-orange-500 rounded-full" />
                <p className="text-[10px] text-stone-400 font-black uppercase tracking-[0.3em]">
                  Otentik Kalimantan Barat
                </p>
                <div className="w-8 h-1 bg-orange-500 rounded-full" />
              </div>
            </motion.div>

            {/* Loading Bar */}
            <div className="absolute bottom-12 left-12 right-12 h-1.5 bg-stone-100 rounded-full overflow-hidden">
              <motion.div 
                initial={{ x: "-100%" }}
                animate={{ x: "0%" }}
                transition={{ duration: 2, ease: "easeInOut" }}
                className="h-full bg-orange-500"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pull to Refresh Panda Animation */}
      <div 
        className="absolute top-0 left-0 right-0 flex justify-center pointer-events-none z-0"
        style={{ height: 300 }}
      >
        <AnimatePresence>
          {(pullY > 20 || isRefreshing || showSuccess) && (
            <motion.div 
              initial={{ y: -100, opacity: 0, scale: 0.5 }}
              animate={{ 
                y: (isRefreshing || showSuccess) ? 30 : Math.max(0, pullY * 0.4 - 20),
                opacity: 1,
                scale: (isRefreshing || showSuccess) ? 1.1 : Math.min(1.1, 0.7 + pullY / 300)
              }}
              exit={{ y: -100, opacity: 0, scale: 0.5 }}
              className="flex flex-col items-center"
            >
              <div className="relative w-24 h-24 flex items-center justify-center">
                {showSuccess ? (
                  <motion.div 
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-orange-500"
                  >
                    <Check size={32} className="text-orange-500 stroke-[4px]" />
                  </motion.div>
                ) : (
                  <div className="relative scale-90">
                    {/* Panda Cooking */}
                    <motion.div 
                      className="w-24 h-20 bg-white rounded-[40px_40px_30px_30px] border-4 border-stone-900 relative shadow-lg"
                      animate={isRefreshing ? {
                        y: [0, -5, 0],
                        rotate: [0, -1, 1, 0]
                      } : {}}
                      transition={{ repeat: Infinity, duration: 0.4 }}
                    >
                      {/* Ears */}
                      <div className="absolute -top-2 -left-1 w-8 h-8 bg-stone-900 rounded-full" />
                      <div className="absolute -top-2 -right-1 w-8 h-8 bg-stone-900 rounded-full" />
                      
                      {/* Eyes */}
                      <div className="absolute top-6 left-4 w-6 h-8 bg-stone-900 rounded-full rotate-[15deg] flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full mb-2" />
                      </div>
                      <div className="absolute top-6 right-4 w-6 h-8 bg-stone-900 rounded-full -rotate-[15deg] flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full mb-2" />
                      </div>
                      
                      {/* Nose */}
                      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-3 h-2 bg-stone-900 rounded-full" />
                    </motion.div>

                    {/* Frying Pan */}
                    <motion.div 
                      className="absolute -bottom-4 -right-8 w-16 h-6 bg-stone-800 rounded-full border-4 border-stone-900 z-10"
                      animate={isRefreshing ? {
                        rotate: [0, -15, 0],
                        y: [0, -10, 0]
                      } : {}}
                      transition={{ repeat: Infinity, duration: 0.3 }}
                    >
                      {/* Handle */}
                      <div className="absolute top-1/2 -right-8 w-8 h-2 bg-stone-900 rounded-full -translate-y-1/2" />
                      {/* Food in pan */}
                      {isRefreshing && (
                        <div className="absolute -top-4 left-4 right-4 flex gap-1">
                          {[1,2,3].map(i => (
                            <motion.div 
                              key={i}
                              animate={{ y: [0, -20, 0], x: [0, (i-2)*5, 0] }}
                              transition={{ repeat: Infinity, duration: 0.3, delay: i * 0.1 }}
                              className="w-2 h-2 bg-orange-400 rounded-full"
                            />
                          ))}
                        </div>
                      )}
                    </motion.div>

                    {/* Spatula */}
                    <motion.div 
                      className="absolute -bottom-4 -left-4 w-2 h-12 bg-stone-400 border-2 border-stone-900 rounded-full z-10 origin-bottom"
                      animate={isRefreshing ? {
                        rotate: [0, 30, 0],
                        x: [0, 5, 0]
                      } : {}}
                      transition={{ repeat: Infinity, duration: 0.3 }}
                    />
                  </div>
                )}
              </div>

              {/* Status text badge below panda */}
              <motion.div 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 bg-stone-900/90 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 border border-amber-500/30 backdrop-blur-md pointer-events-none"
              >
                {showSuccess ? (
                  <span className="text-emerald-400 flex items-center gap-1.5">
                    <Check size={14} className="stroke-[3]" />
                    {pandaMessage || "Pesanan Berhasil Dikirim ke WhatsApp!"}
                  </span>
                ) : isRefreshing ? (
                  <span className="text-amber-300 flex items-center gap-1.5">
                    <Sparkles size={14} className="animate-spin text-amber-400" />
                    {pandaMessage || "Koki Teng Sedang Memasak Pesanan..."}
                  </span>
                ) : (
                  <span className="text-stone-300">Tarik untuk Memuat Ulang</span>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.div
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        animate={{ 
          y: (isRefreshing || showSuccess) ? 140 : Math.max(0, pullY),
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 400 }}
        className={`relative z-10 bg-[#F8F9FB] min-h-screen ${pullY > 0 ? 'select-none cursor-grabbing' : ''}`}
      >


        {/* Top Header with hanging lanterns */}
        <header className="px-4 md:px-8 lg:px-10 pt-8 pb-4 relative overflow-hidden">
          {/* Swaying Red Lantern Left */}
          <motion.div 
            animate={{ rotate: [-10, 10, -10] }}
            transition={{ repeat: Infinity, duration: 4.8, ease: "easeInOut" }}
            className="absolute top-0 left-8 origin-top flex flex-col items-center select-none pointer-events-none z-20 filter drop-shadow-[0_2px_8px_rgba(239,68,68,0.3)]"
          >
            {/* Hanging thread */}
            <div className="w-[1.5px] h-8 bg-gradient-to-b from-amber-600 to-amber-500" />
            
            {/* Top metallic ornament */}
            <div className="w-3.5 h-1 bg-gradient-to-r from-amber-500 via-amber-300 to-amber-500 rounded-t-[2px] z-10 shadow-xs" />
            
            {/* Main Lantern Body */}
            <div className="w-7 h-8 bg-gradient-to-b from-red-500 via-red-600 to-red-700 rounded-[14px_14px_14px_14px] relative flex items-center justify-center border border-amber-400/80 shadow-md shadow-red-500/30">
              {/* Vertical traditional stripes */}
              <div className="absolute inset-y-0 w-3 border-x border-amber-300/20 rounded-full" />
              <div className="absolute inset-y-0 w-1.5 border-x border-amber-300/10 rounded-full" />
              
              {/* Golden auspicious character */}
              <span className="text-[10px] text-amber-200 font-serif font-black select-none leading-none scale-90 drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)] z-10">吉</span>
              
              {/* Internal glow aura */}
              <motion.div 
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="absolute inset-1 bg-radial-gradient from-red-400/30 to-transparent rounded-full pointer-events-none blur-[2px]"
              />
            </div>
            
            {/* Bottom metallic ornament */}
            <div className="w-3.5 h-1 bg-gradient-to-r from-amber-500 via-amber-300 to-amber-500 rounded-b-[2px] z-10 shadow-xs" />
            
            {/* Golden bead connector */}
            <div className="w-2 h-2 bg-gradient-to-br from-amber-400 to-yellow-300 rounded-full border border-amber-300 shadow-xs z-10 -mt-0.5" />
            
            {/* Independent secondary swaying Red Tassel */}
            <motion.div 
              animate={{ rotate: [-8, 8, -8] }}
              transition={{ repeat: Infinity, duration: 3.2, ease: "easeInOut" }}
              className="w-[3px] h-6 bg-gradient-to-b from-red-600 via-red-500 to-red-700 rounded-b-[1px] origin-top shadow-xs"
            />
          </motion.div>

          {/* Swaying Red Lantern Right */}
          <motion.div 
            animate={{ rotate: [10, -10, 10] }}
            transition={{ repeat: Infinity, duration: 5.3, ease: "easeInOut" }}
            className="absolute top-0 right-8 origin-top flex flex-col items-center select-none pointer-events-none z-20 filter drop-shadow-[0_2px_8px_rgba(239,68,68,0.3)]"
          >
            {/* Hanging thread */}
            <div className="w-[1.5px] h-10 bg-gradient-to-b from-amber-600 to-amber-500" />
            
            {/* Top metallic ornament */}
            <div className="w-3.5 h-1 bg-gradient-to-r from-amber-500 via-amber-300 to-amber-500 rounded-t-[2px] z-10 shadow-xs" />
            
            {/* Main Lantern Body */}
            <div className="w-7 h-8 bg-gradient-to-b from-red-500 via-red-600 to-red-700 rounded-[14px_14px_14px_14px] relative flex items-center justify-center border border-amber-400/80 shadow-md shadow-red-500/30">
              {/* Vertical traditional stripes */}
              <div className="absolute inset-y-0 w-3 border-x border-amber-300/20 rounded-full" />
              <div className="absolute inset-y-0 w-1.5 border-x border-amber-300/10 rounded-full" />
              
              {/* Golden prosperity character */}
              <span className="text-[10px] text-amber-200 font-serif font-black select-none leading-none scale-90 drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)] z-10">祥</span>
              
              {/* Internal glow aura */}
              <motion.div 
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                className="absolute inset-1 bg-radial-gradient from-red-400/30 to-transparent rounded-full pointer-events-none blur-[2px]"
              />
            </div>
            
            {/* Bottom metallic ornament */}
            <div className="w-3.5 h-1 bg-gradient-to-r from-amber-500 via-amber-300 to-amber-500 rounded-b-[2px] z-10 shadow-xs" />
            
            {/* Golden bead connector */}
            <div className="w-2 h-2 bg-gradient-to-br from-amber-400 to-yellow-300 rounded-full border border-amber-300 shadow-xs z-10 -mt-0.5" />
            
            {/* Independent secondary swaying Red Tassel */}
            <motion.div 
              animate={{ rotate: [8, -8, 8] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
              className="w-[3px] h-6 bg-gradient-to-b from-red-600 via-red-500 to-red-700 rounded-b-[1px] origin-top shadow-xs"
            />
          </motion.div>

          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              {/* Traditional Red Stamp / Seal */}
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-red-600 to-red-700 border-2 border-amber-400 flex items-center justify-center shadow-lg shadow-red-500/20 -rotate-6 relative flex-shrink-0">
                <span className="font-serif font-extrabold text-xl text-amber-100 select-none">鮮</span>
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
              </div>
              <div className="flex flex-col max-w-[165px]">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black text-stone-900 tracking-tight leading-none">
                    {TRANSLATIONS[language].title}
                  </h1>
                  <span className="text-[9px] font-black uppercase tracking-wider bg-red-100 text-red-700 border border-red-200 px-1.5 py-0.5 rounded-md flex-shrink-0">
                    Kalbar
                  </span>
                </div>
                <p className="text-[10px] text-stone-400 font-bold uppercase tracking-[0.12em] leading-tight mt-1">
                  {TRANSLATIONS[language].tagline}
                </p>
              </div>
            </div>
            <button 
              onClick={() => handleTabChange('profile')}
              className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-stone-100 flex items-center justify-center text-red-600 transition-transform active:scale-95 hover:border-red-100"
            >
              <MainLogo size={24} />
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative" id="tour-search-bar">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search size={20} className="text-stone-400" />
            </div>
            <input 
              type="text" 
              placeholder={TRANSLATIONS[language].searchPlaceholder}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activeTab !== 'search') setActiveTab('search');
              }}
              onFocus={() => setActiveTab('search')}
              className="w-full bg-white border-none rounded-2xl py-4 pl-12 pr-4 shadow-sm focus:ring-2 focus:ring-red-500/20 transition-all text-stone-900 placeholder:text-stone-400"
            />
          </div>
        </header>

      {/* Main Content Area */}
      <AnimatePresence mode="wait" custom={slideDirection}>
        {activeTab === 'home' && (
          <motion.div
            key="home"
            custom={slideDirection}
            initial={{ opacity: 0, x: slideDirection === 'left' ? 24 : -24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: slideDirection === 'left' ? -24 : 24 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            {renderHome()}
          </motion.div>
        )}
        {activeTab === 'search' && (
          <motion.div
            key="search"
            custom={slideDirection}
            initial={{ opacity: 0, x: slideDirection === 'left' ? 24 : -24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: slideDirection === 'left' ? -24 : 24 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            {renderSearch()}
          </motion.div>
        )}
        {activeTab === 'heart' && (
          <motion.div
            key="favorites"
            custom={slideDirection}
            initial={{ opacity: 0, x: slideDirection === 'left' ? 24 : -24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: slideDirection === 'left' ? -24 : 24 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            {renderFavorites()}
          </motion.div>
        )}
        {activeTab === 'profile' && (
          <motion.div
            key="profile"
            custom={slideDirection}
            initial={{ opacity: 0, x: slideDirection === 'left' ? 24 : -24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: slideDirection === 'left' ? -24 : 24 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            {renderProfile()}
          </motion.div>
        )}
      </AnimatePresence>

      </motion.div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 flex justify-center z-40 pointer-events-none">
        <nav className="w-full bg-white border-t border-stone-100 px-8 py-4 flex justify-between items-center rounded-t-[32px] shadow-[0_-10px_40px_rgba(0,0,0,0.05)] pointer-events-auto">
          <button 
            onClick={() => handleTabChange('home')}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'home' ? 'text-red-600' : 'text-stone-400 hover:text-red-500'}`}
          >
            <Home size={24} />
            <span className="text-[10px] font-bold">{TRANSLATIONS[language].home}</span>
          </button>
          <button 
            onClick={() => handleTabChange('search')}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'search' ? 'text-red-600' : 'text-stone-400 hover:text-red-500'}`}
          >
            <Search size={24} />
            <span className="text-[10px] font-bold">{TRANSLATIONS[language].search}</span>
          </button>
          <motion.button 
            id="cart-button"
            onClick={() => setIsCartOpen(true)}
            animate={cartPulse ? { scale: [1, 1.25, 0.85, 1.15, 1.05, 1] } : {}}
            transition={{ duration: 0.5 }}
            className="relative -top-8 w-16 h-16 bg-gradient-to-tr from-red-600 to-red-500 text-white rounded-full flex items-center justify-center shadow-xl shadow-red-200 border-4 border-white cursor-pointer hover:from-red-700 hover:to-red-600 transition-all"
          >
            <ShoppingBag size={28} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-6 h-6 bg-amber-500 text-stone-950 text-[10px] font-extrabold rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                {totalItems}
              </span>
            )}
          </motion.button>
          <button 
            onClick={() => handleTabChange('heart')}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'heart' ? 'text-red-600' : 'text-stone-400 hover:text-red-500'}`}
          >
            <Heart size={24} />
            <span className="text-[10px] font-bold">{TRANSLATIONS[language].favorite}</span>
          </button>
          <button 
            onClick={() => handleTabChange('profile')}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'profile' ? 'text-red-600' : 'text-stone-400 hover:text-red-500'}`}
          >
            <User size={24} />
            <span className="text-[10px] font-bold">{TRANSLATIONS[language].profile}</span>
          </button>
        </nav>
      </div>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            />
            <motion.div 
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              drag="y"
              dragControls={cartDragControls}
              dragListener={false}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.8 }}
              onDragEnd={(_, info) => {
                if (info.offset.y > 100 || info.velocity.y > 300) {
                  setIsCartOpen(false);
                }
              }}
              className="fixed inset-x-0 bottom-0 md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-2xl md:h-[80vh] md:rounded-[32px] bg-white rounded-t-[40px] shadow-2xl z-50 flex flex-col overflow-hidden"
            >
              {/* Swipe Handle Indicator */}
              <div 
                onPointerDown={(e) => cartDragControls.start(e)}
                onClick={() => setIsCartOpen(false)}
                className="w-full pt-3 pb-1 flex justify-center cursor-grab active:cursor-grabbing touch-none flex-shrink-0 group"
                title="Geser ke bawah atau ketuk untuk menutup"
              >
                <div className="w-16 h-2 bg-stone-200 group-hover:bg-stone-300 group-active:bg-orange-500 rounded-full transition-colors" />
              </div>
              
              <div className="px-8 flex items-center justify-between mb-6 md:mt-2">
                <h2 className="text-2xl font-bold text-stone-900">Pesanan Anda</h2>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="w-10 h-10 bg-stone-100 hover:bg-stone-200 active:bg-stone-300 rounded-full flex items-center justify-center text-stone-500 transition-colors"
                  title="Tutup"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto px-8 space-y-6">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-20">
                    <div className="w-24 h-24 bg-stone-50 rounded-full flex items-center justify-center mb-6 text-stone-300">
                      <ShoppingBag size={48} />
                    </div>
                    <h3 className="text-xl font-bold text-stone-900 mb-2">Keranjang Kosong</h3>
                    <p className="text-stone-400">Pilih menu lezat kami untuk memulai pesanan.</p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={`${item.id}-${item.option || 'none'}`} className="relative overflow-hidden rounded-3xl group">
                      {/* Swipe Background (Delete Button) */}
                      <button 
                        onClick={() => clearItemFromCart(item.id, item.option)}
                        className="absolute inset-0 bg-red-500 flex items-center justify-end px-8 text-white active:bg-red-600 transition-colors"
                      >
                        <div className="flex flex-col items-center gap-1">
                          <Trash2 size={24} />
                          <span className="text-[10px] font-bold uppercase">Hapus</span>
                        </div>
                      </button>

                      {/* Item Content */}
                      <motion.div 
                        drag="x"
                        dragConstraints={{ left: -100, right: 0 }}
                        dragElastic={0.1}
                        className="relative bg-white flex gap-4 items-center p-2 cursor-grab active:cursor-grabbing"
                      >
                        <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0">
                          <MenuIcon item={item} size={28} />
                        </div>
                        <div className="flex-grow">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-bold text-stone-900">{item.name}</h4>
                              <p className="text-xs text-stone-400 mb-2">{item.category}</p>
                            </div>
                            {item.option && (
                              <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-sm ${
                                item.option === 'Es' 
                                  ? 'bg-blue-500 text-white' 
                                  : 'bg-orange-600 text-white'
                              }`}>
                                {item.option === 'Es' ? <Star size={10} fill="currentColor" /> : <Coffee size={10} />}
                                {item.option}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3 bg-stone-100 rounded-xl px-2 py-1">
                              <button 
                                onClick={() => removeFromCart(item.id, item.option)}
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-600"
                              >
                                <Minus size={16} />
                              </button>
                              <span className="font-bold text-stone-900">{item.quantity}</span>
                              <button 
                                onClick={() => addToCart(item, item.option)}
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-600"
                              >
                                <Plus size={16} />
                              </button>
                            </div>
                            <button 
                              onClick={() => setNoteModalItem({ id: item.id, option: item.option, note: item.note || '' })}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all ${
                                item.note 
                                  ? 'bg-orange-500 text-white shadow-sm' 
                                  : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                              }`}
                            >
                              <Settings size={12} />
                              {item.note ? 'Edit Catatan' : 'Tambah Catatan'}
                            </button>
                          </div>
                          {item.note && (
                            <div className="mt-2 p-2 bg-orange-50 rounded-xl border border-orange-100">
                              <p className="text-[10px] text-orange-600 font-medium italic">"{item.note}"</p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-8 bg-white border-t border-stone-100">
                  <div className="mb-6">
                    <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3">Pilihan Penyajian</p>
                    <div className="flex p-1 bg-stone-100 rounded-2xl mb-4">
                      <button 
                        onClick={() => setOrderType('Makan di Tempat')}
                        className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
                          orderType === 'Makan di Tempat' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-400'
                        }`}
                      >
                        Makan di Tempat
                      </button>
                      <button 
                        onClick={() => setOrderType('Bungkus')}
                        className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
                          orderType === 'Bungkus' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-400'
                        }`}
                      >
                        Bungkus
                      </button>
                    </div>

                    {/* Dine-In Preferences: Table Number */}
                    {orderType === 'Makan di Tempat' && (
                      <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-100/50 space-y-2.5">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
                          <label className="text-xs font-bold text-stone-600 uppercase tracking-wider block">Nomor Meja Anda</label>
                        </div>
                        <input
                          type="text"
                          placeholder="Contoh: Meja 05 atau Meja VIP 1"
                          value={tableNumber}
                          onChange={(e) => {
                            setTableNumber(e.target.value);
                            localStorage.setItem('rm_segar_table_number', e.target.value);
                          }}
                          className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all shadow-sm"
                        />
                        <p className="text-[10px] text-stone-400 italic">✓ Preferensi nomor meja disimpan otomatis di perangkat Anda.</p>
                      </div>
                    )}

                    {/* Bungkus Preferences: Delivery Method and Address */}
                    {orderType === 'Bungkus' && (
                      <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-100/50 space-y-4">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-stone-600 uppercase tracking-wider block">Metode Pengambilan</label>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={() => {
                                setDeliveryMethod('ambil_sendiri');
                                localStorage.setItem('rm_segar_delivery_method', 'ambil_sendiri');
                              }}
                              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                                deliveryMethod === 'ambil_sendiri'
                                  ? 'bg-orange-500 border-orange-500 text-white shadow-sm'
                                  : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                              }`}
                            >
                              Ambil Sendiri
                            </button>
                            <button
                              onClick={() => {
                                setDeliveryMethod('kirim_alamat');
                                localStorage.setItem('rm_segar_delivery_method', 'kirim_alamat');
                              }}
                              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                                deliveryMethod === 'kirim_alamat'
                                  ? 'bg-orange-500 border-orange-500 text-white shadow-sm'
                                  : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                              }`}
                            >
                              Kirim ke Alamat
                            </button>
                          </div>
                        </div>

                        {deliveryMethod === 'kirim_alamat' && (
                          <div className="space-y-2.5">
                            <label className="text-xs font-bold text-stone-600 uppercase tracking-wider block">Alamat Pengiriman</label>
                            <textarea
                              placeholder="Ketik alamat lengkap Anda (Nama Jalan, Blok, RT/RW, Patokan)"
                              value={deliveryAddress}
                              onChange={(e) => {
                                setDeliveryAddress(e.target.value);
                                localStorage.setItem('rm_segar_delivery_address', e.target.value);
                              }}
                              rows={2}
                              className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all resize-none shadow-sm"
                            />
                            <p className="text-[10px] text-stone-400 italic">✓ Alamat pengiriman disimpan otomatis di perangkat Anda.</p>
                          </div>
                        )}
                        {deliveryMethod === 'ambil_sendiri' && (
                          <p className="text-[11px] text-stone-500 bg-orange-100/10 p-2.5 rounded-xl border border-orange-200/20">
                            📍 Anda akan mengambil pesanan Anda sendiri langsung di <strong>RM Segar, Sambas</strong> setelah menerima konfirmasi dari WhatsApp kami.
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 mb-8">
                    <div className="flex justify-between text-stone-500">
                      <span>Total Item</span>
                      <span className="font-bold text-stone-900">{totalItems} Menu</span>
                    </div>
                    <div className="h-px bg-stone-100 my-4" />
                    <div className="flex justify-between text-xl font-bold text-stone-900">
                      <span>Total Pesanan</span>
                      <span>{totalItems} Item</span>
                    </div>
                  </div>
                  <button 
                    onClick={sendToWhatsApp}
                    className="w-full py-5 bg-orange-500 text-white rounded-[24px] font-bold text-lg flex items-center justify-center gap-3 hover:bg-orange-600 transition-all shadow-xl shadow-orange-200"
                  >
                    Konfirmasi Pesanan
                    <ArrowRight size={20} />
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* AI Chat Modal */}
      <AnimatePresence>
        {isChatOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsChatOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[990]"
            />
            <motion.div 
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              drag="y"
              dragControls={chatDragControls}
              dragListener={false}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.8 }}
              onDragEnd={(_, info) => {
                if (info.offset.y > 100 || info.velocity.y > 300) {
                  setIsChatOpen(false);
                }
              }}
              className="fixed inset-x-0 bottom-0 top-10 md:top-1/2 md:bottom-auto md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-2xl md:h-[85vh] md:rounded-[32px] bg-[#F8F9FB] rounded-t-[32px] shadow-2xl z-[995] flex flex-col overflow-hidden h-[calc(100vh-40px)] max-h-[92vh] border-t border-stone-200/50"
            >
              {/* Swipe Handle & Header Container */}
              <div className="bg-white border-b border-stone-100 flex-shrink-0 sticky top-0 z-20 shadow-xs">
                {/* Swipe Handle Indicator */}
                <div 
                  onPointerDown={(e) => chatDragControls.start(e)}
                  className="w-full pt-3 pb-2 flex justify-center cursor-grab active:cursor-grabbing touch-none flex-shrink-0 select-none bg-stone-50/90 border-b border-stone-100"
                  title="Geser ke bawah untuk menutup"
                >
                  <div className="w-12 h-1.5 bg-stone-300 rounded-full transition-colors" />
                </div>
                
                {/* Header */}
                <div className="px-6 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-500 rounded-2xl flex items-center justify-center text-white shadow-md shadow-orange-100">
                      <Bot size={22} />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-stone-900 leading-tight">{TRANSLATIONS[language].kokiTitle}</h2>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Online</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      type="button"
                      onClick={() => setShowClearChatConfirmModal(true)}
                      title={language === 'en' ? 'Clear History' : language === 'zh' ? '清除记录' : 'Hapus Riwayat'}
                      className="w-10 h-10 bg-stone-100 hover:bg-red-50 hover:text-red-500 rounded-2xl flex items-center justify-center text-stone-500 transition-colors cursor-pointer"
                    >
                      <Trash2 size={18} />
                    </button>
                    <button 
                      type="button"
                      onClick={() => setIsChatOpen(false)}
                      className="w-10 h-10 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white rounded-2xl flex items-center justify-center transition-all shadow-md shadow-orange-100 font-bold"
                      title={language === 'en' ? 'Close Chat' : language === 'zh' ? '关闭聊天' : 'Tutup Chat'}
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              <div 
                onPointerDownCapture={(e) => e.stopPropagation()}
                onTouchStartCapture={(e) => e.stopPropagation()}
                className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar touch-pan-y overscroll-contain min-h-0"
              >
                {chatMessages.map((msg, idx) => {
                  const parsed = parseChatMessage(msg.text);
                  const isUser = msg.role === 'user';
                  return (
                    <div key={idx} className="space-y-2">
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[85%] p-4 rounded-3xl text-sm leading-relaxed shadow-sm ${
                          isUser 
                            ? 'bg-orange-500 text-white rounded-tr-none' 
                            : 'bg-white text-stone-700 rounded-tl-none border border-stone-100'
                        }`}>
                          {parsed.cleanText}
                        </div>
                      </motion.div>
                      
                      {/* Interactive Action Card */}
                      {!isUser && parsed.waLink && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex justify-start"
                        >
                          <div className={`border rounded-3xl p-5 shadow-lg max-w-[85%] flex flex-col gap-3 w-full transition-colors ${
                            confirmedAIMessages[idx] 
                              ? 'bg-green-50/50 border-green-200' 
                              : 'bg-white border-orange-200'
                          }`}>
                            <div className="flex items-center justify-between">
                              <div className={`flex items-center gap-2 font-bold text-xs uppercase tracking-wider ${
                                confirmedAIMessages[idx] ? 'text-green-600' : 'text-orange-600'
                              }`}>
                                <span className={`w-2.5 h-2.5 rounded-full ${
                                  confirmedAIMessages[idx] ? 'bg-green-500' : 'bg-orange-500 animate-pulse'
                                }`} />
                                {parsed.waLink.type === 'pesanan' ? 'Draf Pesanan AI' : 'Draf Reservasi AI'}
                              </div>
                              {confirmedAIMessages[idx] && (
                                <span className="bg-green-100 text-green-700 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                                  Tersimpan
                                </span>
                              )}
                            </div>
                            
                            <p className="text-xs text-stone-600 font-medium leading-relaxed bg-stone-50 p-3 rounded-2xl border border-stone-100 italic">
                              "{parsed.waLink.content}"
                            </p>
                            
                            {!confirmedAIMessages[idx] ? (
                              <div className="flex flex-col gap-2">
                                <button
                                  onClick={() => handleConfirmFromAIChat(idx, parsed.waLink!.type as any, parsed.waLink!.content)}
                                  className="w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md shadow-orange-100"
                                >
                                  <Sparkles size={16} />
                                  Konfirmasi & Simpan ke Dashboard
                                </button>
                                <button
                                  onClick={() => {
                                    const phoneNumber = "6281258394293";
                                    openWhatsApp(phoneNumber, parsed.waLink!.content);
                                    triggerPandaAnimation("Menghubungi WhatsApp RM Segar... 🐼💬");
                                  }}
                                  className="w-full py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                                >
                                  <MessageCircle size={14} fill="currentColor" />
                                  Hubungi via WhatsApp (Opsional)
                                </button>
                              </div>
                            ) : (
                              <div className="text-center py-2 bg-green-50 rounded-2xl border border-green-100">
                                <p className="text-xs text-green-700 font-bold flex items-center justify-center gap-1.5">
                                  <Check size={14} className="stroke-[3]" />
                                  Sudah Masuk ke Sistem RM Segar
                                </p>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  );
                })}
                
                {isAIThinking && !chatMessages[chatMessages.length - 1]?.text && (
                  <div className="flex justify-start">
                    <div className="bg-white p-4 rounded-3xl rounded-tl-none border border-stone-100 shadow-sm flex gap-1">
                      <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-stone-300 rounded-full" />
                      <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-stone-300 rounded-full" />
                      <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-stone-300 rounded-full" />
                    </div>
                  </div>
                )}

                {/* Quick Suggestions - Moved inside scroll area to prevent cutting off */}
                {chatMessages.length === 1 && !isAIThinking && (
                  <div className="pt-2 flex flex-wrap gap-2">
                    {["Rekomendasi mie", "Menu nasi favorit", "Minuman segar", "Menu paling pedas"].map(suggestion => (
                      <button 
                        key={suggestion}
                        onClick={() => handleSendMessage(undefined, suggestion)}
                        className="px-4 py-2 bg-white border border-stone-100 rounded-full text-xs font-bold text-stone-600 shadow-sm active:scale-95 transition-all hover:border-orange-200 hover:bg-orange-50"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input Area */}
              <div className="bg-white p-6 pb-10 border-t border-stone-100 shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
                {(!process.env.GEMINI_API_KEY && !(process.env as any).API_KEY && !apiKeySelected && (window as any).aistudio) ? (
                  <div className="flex flex-col items-center gap-3 p-4 bg-orange-50 rounded-2xl border border-orange-100">
                    <p className="text-xs text-orange-800 text-center font-medium">
                      Hubungkan API Key untuk mulai mengobrol dengan Koki AI di link publik ini.
                    </p>
                    <button 
                      onClick={handleOpenSelectKey}
                      className="px-6 py-2 bg-orange-500 text-white rounded-xl text-xs font-bold shadow-sm hover:bg-orange-600 transition-all"
                    >
                      Hubungkan AI
                    </button>
                    <a 
                      href="https://ai.google.dev/gemini-api/docs/billing" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[10px] text-orange-400 underline"
                    >
                      Pelajari tentang Billing
                    </a>
                  </div>
                ) : (
                  <form onSubmit={handleSendMessage} className="relative flex items-center gap-3">
                    <input 
                      type="text" 
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Tanya koki AI..."
                      className="flex-grow bg-stone-50 border-none rounded-2xl py-4 px-6 pr-14 text-sm text-stone-900 placeholder:text-stone-400 focus:ring-2 focus:ring-orange-500/20 transition-all outline-none"
                    />
                    <button 
                      type="submit"
                      disabled={!chatInput.trim() || isAIThinking}
                      className="absolute right-2 w-10 h-10 bg-orange-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-orange-100 disabled:opacity-50 transition-all active:scale-90"
                    >
                      <Send size={18} />
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Note Modal */}
      <AnimatePresence>
        {noteModalItem && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setNoteModalItem(null)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[70]"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              drag="y"
              dragControls={noteDragControls}
              dragListener={false}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.8 }}
              onDragEnd={(_, info) => {
                if (info.offset.y > 100 || info.velocity.y > 300) {
                  setNoteModalItem(null);
                }
              }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm bg-white rounded-[32px] shadow-2xl z-[70] overflow-hidden"
            >
              <div 
                onPointerDown={(e) => noteDragControls.start(e)}
                onClick={() => setNoteModalItem(null)}
                className="w-full pt-3 pb-1 flex justify-center cursor-grab active:cursor-grabbing touch-none group"
                title="Geser ke bawah atau ketuk untuk menutup"
              >
                <div className="w-12 h-1.5 bg-stone-200 group-hover:bg-stone-300 group-active:bg-orange-400 rounded-full transition-colors" />
              </div>
              <div className="p-8 pt-4 space-y-6">
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-bold text-stone-900">Catatan Pesanan</h3>
                  <p className="text-stone-500 text-sm">Tambahkan permintaan khusus untuk menu ini</p>
                </div>

                <div className="space-y-2">
                  <textarea 
                    autoFocus
                    value={noteModalItem.note}
                    onChange={(e) => setNoteModalItem({ ...noteModalItem, note: e.target.value })}
                    placeholder="Contoh: Tidak pakai sayur, pedas sedang, dll..."
                    className="w-full bg-stone-50 border-none rounded-2xl p-4 text-sm text-stone-900 placeholder:text-stone-400 focus:ring-2 focus:ring-orange-500/20 transition-all min-h-[120px] resize-none"
                  />
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => setNoteModalItem(null)}
                    className="flex-1 py-4 bg-stone-100 text-stone-500 rounded-2xl font-bold text-sm"
                  >
                    Batal
                  </button>
                  <button 
                    onClick={() => updateNote(noteModalItem.id, noteModalItem.option, noteModalItem.note)}
                    className="flex-1 py-4 bg-orange-500 text-white rounded-2xl font-bold text-sm shadow-lg shadow-orange-100"
                  >
                    Simpan
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Option Selection Modal */}
      <AnimatePresence>
        {optionModalItem && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOptionModalItem(null)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              drag="y"
              dragControls={optionDragControls}
              dragListener={false}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.8 }}
              onDragEnd={(_, info) => {
                if (info.offset.y > 100 || info.velocity.y > 300) {
                  setOptionModalItem(null);
                }
              }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm bg-white rounded-[32px] shadow-2xl z-[60] overflow-hidden"
            >
              <div 
                onPointerDown={(e) => optionDragControls.start(e)}
                onClick={() => setOptionModalItem(null)}
                className="w-full pt-3 pb-1 flex justify-center cursor-grab active:cursor-grabbing touch-none group"
                title="Geser ke bawah atau ketuk untuk menutup"
              >
                <div className="w-12 h-1.5 bg-stone-200 group-hover:bg-stone-300 group-active:bg-orange-400 rounded-full transition-colors" />
              </div>
              <div className="p-8 pt-4 space-y-6">
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-bold text-stone-900">Pilih Opsi</h3>
                  <p className="text-stone-500 text-sm">Silakan pilih penyajian untuk {optionModalItem.name}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setSelectedOption('Es')}
                    className={`flex flex-col items-center gap-3 p-6 rounded-3xl border-2 transition-all ${
                      selectedOption === 'Es' 
                        ? 'border-blue-500 bg-blue-50 text-blue-600' 
                        : 'border-stone-100 bg-stone-50 text-stone-400'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      selectedOption === 'Es' ? 'bg-blue-500 text-white' : 'bg-stone-200 text-stone-400'
                    }`}>
                      <Star size={24} />
                    </div>
                    <span className="font-bold">Es</span>
                  </button>
                  <button 
                    onClick={() => setSelectedOption('Panas')}
                    className={`flex flex-col items-center gap-3 p-6 rounded-3xl border-2 transition-all ${
                      selectedOption === 'Panas' 
                        ? 'border-red-500 bg-red-50 text-red-600' 
                        : 'border-stone-100 bg-stone-50 text-stone-400'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      selectedOption === 'Panas' ? 'bg-red-500 text-white' : 'bg-stone-200 text-stone-400'
                    }`}>
                      <Coffee size={24} />
                    </div>
                    <span className="font-bold">Panas</span>
                  </button>
                </div>

                <button 
                  onClick={(e) => addToCart(optionModalItem!, selectedOption, e)}
                  className="w-full py-4 bg-orange-500 text-white rounded-2xl font-bold text-lg shadow-lg shadow-orange-100"
                >
                  Tambah ke Keranjang
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Chinese Fortune Cookie Modal */}
      <AnimatePresence>
        {isFortuneModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (fortuneState !== 'shaking') setIsFortuneModalOpen(false);
              }}
              className="fixed inset-0 bg-stone-950/80 backdrop-blur-md z-[80]"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              drag="y"
              dragControls={fortuneDragControls}
              dragListener={false}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.8 }}
              onDragEnd={(_, info) => {
                if (info.offset.y > 100 || info.velocity.y > 300) {
                  if (fortuneState !== 'shaking') setIsFortuneModalOpen(false);
                }
              }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] max-w-lg bg-gradient-to-b from-stone-900 via-stone-950 to-stone-900 rounded-[36px] shadow-2xl border-2 border-amber-400/40 z-[80] overflow-hidden flex flex-col max-h-[85vh] text-stone-100"
            >
              {/* Swipe Handle Indicator */}
              <div 
                onPointerDown={(e) => fortuneDragControls.start(e)}
                onClick={() => { if (fortuneState !== 'shaking') setIsFortuneModalOpen(false); }}
                className="w-full pt-2.5 pb-1 flex justify-center cursor-grab active:cursor-grabbing touch-none flex-shrink-0 z-20 group"
                title="Geser ke bawah atau ketuk untuk menutup"
              >
                <div className="w-16 h-1.5 bg-amber-400/30 group-hover:bg-amber-400/60 group-active:bg-amber-400 rounded-full transition-colors" />
              </div>
              
              {/* Traditional Golden Ornament Border */}
              <div className="absolute inset-2 border border-amber-400/10 rounded-[28px] pointer-events-none" />
              
              {/* Header */}
              <div className="relative bg-gradient-to-r from-red-800 via-red-900 to-red-800 p-6 text-center border-b border-amber-400/30">
                <div className="absolute top-2 left-4 text-xs">🏮</div>
                <div className="absolute top-2 right-4 text-xs">🏮</div>
                <h3 className="text-xl font-bold font-serif text-amber-300 tracking-wider">
                  {language === 'en' ? 'CHINESE FORTUNE COOKIE' : language === 'zh' ? '吉祥如意幸运饼' : 'BISKUIT KEBERUNTUNGAN'}
                </h3>
                <p className="text-[10px] uppercase font-sans font-black tracking-widest text-amber-200/70 mt-1">
                  {language === 'en' ? 'RM SEGAR HOKI GENERATOR' : language === 'zh' ? '本氏美味食堂 • 运势指南' : 'RAMALAN KULINER HOKI RM SEGAR'}
                </p>
                {fortuneState !== 'shaking' && (
                  <button 
                    onClick={() => setIsFortuneModalOpen(false)}
                    className="absolute right-4 top-4 text-amber-200/70 hover:text-white p-1 hover:bg-white/10 rounded-full transition-all"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>

              {/* Scrollable Modal Content */}
              <div className="p-6 md:p-8 overflow-y-auto no-scrollbar flex-grow flex flex-col items-center justify-start space-y-6 relative z-10">
                
                {/* IDLE STATE */}
                {fortuneState === 'idle' && (
                  <div className="text-center space-y-6 w-full py-4">
                    {/* Golden Glowing Lotus Background & Cookie */}
                    <div className="relative flex justify-center py-4">
                      <div className="absolute inset-0 bg-amber-400/5 rounded-full filter blur-2xl animate-pulse" />
                      
                      {/* Gentle floating motion on Fortune Cookie */}
                      <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="cursor-pointer hover:scale-105 transition-transform"
                        onClick={startCrackingCookie}
                      >
                        {/* Custom Vector Cookie SVG */}
                        <svg viewBox="0 0 100 100" className="w-40 h-40 drop-shadow-[0_12px_24px_rgba(245,158,11,0.4)]">
                          <defs>
                            <radialGradient id="cookieGrad" cx="50%" cy="50%" r="50%">
                              <stop offset="0%" stopColor="#FCD34D" />
                              <stop offset="70%" stopColor="#F59E0B" />
                              <stop offset="100%" stopColor="#D97706" />
                            </radialGradient>
                          </defs>
                          <path d="M 15,65 C 20,38 42,22 50,22 C 58,22 80,38 85,65 C 65,75 35,75 15,65 Z" fill="url(#cookieGrad)" stroke="#B45309" strokeWidth="2.5"/>
                          <path d="M 50,22 C 46,45 28,58 15,65" fill="none" stroke="#92400E" strokeWidth="2" strokeDasharray="3,3"/>
                          <path d="M 50,22 C 54,45 72,58 85,65" fill="none" stroke="#92400E" strokeWidth="2" strokeDasharray="3,3"/>
                          <path d="M 33,68 C 50,60 50,60 67,68" fill="none" stroke="#92400E" strokeWidth="2.5"/>
                        </svg>
                      </motion.div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-amber-200 font-bold text-lg tracking-wide font-serif">
                        {language === 'en' ? 'Crack Your Cookie!' : language === 'zh' ? '点击敲开幸运饼' : 'Pecahkan Biskuit Hokimu!'}
                      </h4>
                      <p className="text-stone-300 text-xs leading-relaxed max-w-xs mx-auto">
                        {language === 'en' ? 'Tap the cookie or click the button below to break it and reveal your kitchen fortune.' : language === 'zh' ? '敲开金色幸运饼干，看看今日主厨为您推测出的吉祥谶语和专属福运推荐吧！' : 'Ketuk biskuit emas di atas atau tombol di bawah untuk memecahkannya dan mengungkap ramalan kulinermu hari ini.'}
                      </p>
                    </div>

                    <button
                      onClick={startCrackingCookie}
                      className="px-8 py-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-black text-sm rounded-2xl shadow-xl shadow-amber-500/10 border border-amber-300 transition-all active:scale-95 font-serif cursor-pointer"
                    >
                      {language === 'en' ? 'BREAK COOKIE 🏮' : language === 'zh' ? '开启今日福运 🏮' : 'PECAHKAN BISKUIT 🏮'}
                    </button>
                  </div>
                )}

                {/* SHAKING STATE */}
                {fortuneState === 'shaking' && (
                  <div className="text-center space-y-6 py-12 w-full flex flex-col items-center">
                    <div className="relative">
                      {/* Intense glowing radial wave */}
                      <motion.div 
                        animate={{ scale: [1, 1.4, 1] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                        className="absolute -inset-4 bg-amber-400/10 rounded-full blur-xl animate-pulse"
                      />
                      {/* Continuous shake animation */}
                      <motion.div
                        animate={{ 
                          x: [-4, 4, -4, 4, -4, 4, 0],
                          y: [-2, 2, -2, 2, -2, 2, 0],
                          rotate: [-3, 3, -3, 3, -3, 3, 0]
                        }}
                        transition={{ duration: 0.2, repeat: Infinity }}
                      >
                        <svg viewBox="0 0 100 100" className="w-40 h-40 drop-shadow-[0_12px_24px_rgba(245,158,11,0.5)]">
                          <path d="M 15,65 C 20,38 42,22 50,22 C 58,22 80,38 85,65 C 65,75 35,75 15,65 Z" fill="#FBBF24" stroke="#B45309" strokeWidth="2.5"/>
                          <path d="M 50,22 C 46,45 28,58 15,65" fill="none" stroke="#92400E" strokeWidth="2" strokeDasharray="3,3"/>
                          <path d="M 50,22 C 54,45 72,58 85,65" fill="none" stroke="#92400E" strokeWidth="2" strokeDasharray="3,3"/>
                          <path d="M 33,68 C 50,60 50,60 67,68" fill="none" stroke="#92400E" strokeWidth="2.5"/>
                        </svg>
                      </motion.div>
                    </div>

                    <div className="space-y-2 animate-pulse">
                      <h4 className="text-amber-300 font-bold text-base tracking-widest font-serif">
                        {language === 'en' ? 'ALCHEMIZING LUCK...' : language === 'zh' ? '主厨正在占卜运势...' : 'MENGALIRKAN ENERGI HOKI...'}
                      </h4>
                      <p className="text-stone-400 text-xs">
                        {language === 'en' ? 'Chef Teng is invoking ancient culinary blessings...' : language === 'zh' ? '金瓮摇曳，福星高照，您的专属菜单正在出炉中...' : 'Koki Teng sedang memutar cawan takdir kuliner Anda...'}
                      </p>
                    </div>
                  </div>
                )}

                {/* CRACKED STATE */}
                {fortuneState === 'cracked' && currentFortune && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="w-full space-y-4 text-center flex flex-col items-center"
                  >
                    {/* Cracked Halves Split Visual */}
                    <div className="flex justify-center items-center gap-10 py-1 relative h-20">
                      <motion.div 
                        initial={{ x: 0, rotate: 0 }}
                        animate={{ x: -25, rotate: -12 }}
                        className="opacity-70"
                      >
                        <svg viewBox="0 0 50 100" className="w-12 h-18">
                          <path d="M 15,65 C 20,38 42,22 50,22 L 50,75 C 35,75 15,65 15,65 Z" fill="#FBBF24" stroke="#B45309" strokeWidth="2"/>
                        </svg>
                      </motion.div>

                      <motion.div 
                        initial={{ x: 0, rotate: 0 }}
                        animate={{ x: 25, rotate: 12 }}
                        className="opacity-70"
                      >
                        <svg viewBox="0 0 50 100" className="w-12 h-18">
                          <path d="M 0,22 C 8,22 30,38 35,65 L 0,75 Z" fill="#FBBF24" stroke="#B45309" strokeWidth="2" transform="translate(15,0)"/>
                        </svg>
                      </motion.div>
                    </div>

                    {/* Golden Scroll Coming down from center - Flow-based Layout */}
                    <motion.div
                      initial={{ scale: 0.8, y: -20, opacity: 0 }}
                      animate={{ scale: 1, y: 0, opacity: 1 }}
                      transition={{ type: "spring", damping: 14, delay: 0.1 }}
                      className="bg-gradient-to-b from-amber-50 to-amber-100 text-stone-900 border-2 border-amber-400 rounded-2xl p-4 md:p-5 shadow-2xl w-full max-w-sm flex flex-col items-center relative my-1"
                    >
                      {/* Scroll Red Ribbon */}
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 bg-red-600 text-white font-serif text-[10px] px-3 py-0.5 rounded-full border border-amber-300 shadow-md whitespace-nowrap">
                        {currentFortune.chineseProverb}
                      </div>
                      
                      {/* Traditional Seal watermark or header */}
                      <div className="text-red-600 text-2xl font-serif font-black mb-1 select-none opacity-85 mt-2">
                        印
                      </div>

                      {/* Luck Level */}
                      <div className="bg-red-50 text-red-700 px-3 py-0.5 rounded-full text-xs font-bold font-serif border border-red-200/50 mb-2 tracking-wide">
                        {currentFortune.luckLevel}
                      </div>

                      {/* Fortune text */}
                      <p className="text-xs md:text-sm font-medium font-serif leading-relaxed text-stone-800 px-1 my-1.5 border-y border-amber-300/60 py-2.5 italic">
                        "{currentFortune.advice[language]}"
                      </p>

                      {/* Lucky Menu recommendation title */}
                      <div className="w-full text-center mt-2 mb-1">
                        <p className="text-[9px] font-black uppercase tracking-wider text-amber-800 font-sans">
                          {language === 'en' ? 'YOUR LUCKY MENU' : language === 'zh' ? '您的今日福运招牌菜' : 'REKOMENDASI MENU HOKI'}
                        </p>
                      </div>

                      {/* Actual Menu Item matching card */}
                      {(() => {
                        const luckyItem = MENU_ITEMS.find(m => m.id === currentFortune.menuId);
                        if (!luckyItem) return null;
                        return (
                          <div className="w-full bg-white/70 border border-amber-300/50 rounded-2xl p-3 flex items-center justify-between gap-3 mt-1 shadow-xs hover:bg-white transition-all">
                            <div className="text-left min-w-0 flex-grow">
                              <span className="text-[9px] bg-red-600 text-amber-50 font-black px-2 py-0.5 rounded-md uppercase">
                                {luckyItem.category}
                              </span>
                              <h5 className="font-extrabold text-stone-900 text-xs md:text-sm mt-1 truncate">{luckyItem.name}</h5>
                              <p className="text-[10px] text-stone-500 leading-tight mt-0.5 line-clamp-1">{luckyItem.description}</p>
                            </div>
                            <button
                              onClick={(e) => {
                                addToCart(luckyItem, undefined, e);
                                setIsFortuneModalOpen(false);
                              }}
                              className="w-8 h-8 md:w-10 md:h-10 bg-red-600 hover:bg-red-700 text-white rounded-xl flex items-center justify-center shadow-md active:scale-95 transition-all flex-shrink-0 cursor-pointer"
                              title="Pesan Menu"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        );
                      })()}
                    </motion.div>

                    {/* Bottom Actions of Modal */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 relative z-10 w-full px-2">
                      <button
                        onClick={() => setFortuneState('idle')}
                        className="w-full sm:flex-1 py-3 bg-stone-800 hover:bg-stone-700 text-amber-300 font-bold text-xs md:text-sm rounded-xl border border-amber-500/20 active:scale-95 transition-all font-serif cursor-pointer"
                      >
                        {language === 'en' ? 'CRACK ANOTHER COOKIE' : language === 'zh' ? '再敲一个饼干 🏮' : 'COBA BISKUIT LAIN 🏮'}
                      </button>
                      <button
                        onClick={() => setIsFortuneModalOpen(false)}
                        className="w-full sm:flex-1 py-3 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-bold text-xs md:text-sm rounded-xl border border-amber-500/20 active:scale-95 transition-all shadow-lg cursor-pointer"
                      >
                        {language === 'en' ? 'DONE' : language === 'zh' ? '接福纳祥' : 'TUTUP & AMBIL HOKI'}
                      </button>
                    </div>
                  </motion.div>
                )}

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* PDF Menu Catalog Preview Modal */}
      <AnimatePresence>
        {isPDFPreviewModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPDFPreviewModalOpen(false)}
              className="fixed inset-0 bg-stone-950/80 backdrop-blur-md z-[80]"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              drag="y"
              dragControls={pdfDragControls}
              dragListener={false}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.8 }}
              onDragEnd={(_, info) => {
                if (info.offset.y > 100 || info.velocity.y > 300) {
                  setIsPDFPreviewModalOpen(false);
                }
              }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-4xl bg-gradient-to-b from-[#FAF7F2] to-white rounded-[32px] shadow-2xl border border-amber-500/30 z-[80] overflow-hidden flex flex-col max-h-[90vh] text-stone-900"
            >
              {/* Swipe Handle Indicator */}
              <div 
                onPointerDown={(e) => pdfDragControls.start(e)}
                onClick={() => setIsPDFPreviewModalOpen(false)}
                className="w-full pt-2.5 pb-1 flex justify-center cursor-grab active:cursor-grabbing touch-none flex-shrink-0 group"
                title="Geser ke bawah atau ketuk untuk menutup"
              >
                <div className="w-16 h-1.5 bg-amber-500/40 group-hover:bg-amber-500/70 group-active:bg-amber-500 rounded-full transition-colors" />
              </div>
              
              {/* Header */}
              <div className="relative bg-[#450a0a] p-5 text-center border-b border-amber-500/30">
                <h3 className="text-xl font-bold font-serif text-amber-200 tracking-wider">
                  {language === 'en' ? '3-LANGUAGE MENU CATALOG PREVIEW' : language === 'zh' ? '三语菜单目录预览' : 'PRATINJAU KATALOG MENU 3 BAHASA'}
                </h3>
                <p className="text-[10px] uppercase font-sans font-extrabold tracking-widest text-amber-300/80 mt-1">
                  {language === 'en' ? 'Priceless • Hand-crafted for RM Segar' : language === 'zh' ? '专为鲜馆订制 • 不含价格' : 'Bebas Harga • Dibuat Khusus RM Segar'}
                </p>
                <button 
                  onClick={() => setIsPDFPreviewModalOpen(false)}
                  className="absolute right-4 top-4 text-amber-200/70 hover:text-white p-1 hover:bg-white/10 rounded-full transition-all cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Page Controls & Toolbar */}
              <div className="p-4 bg-stone-50 border-b border-stone-200/60 flex flex-col sm:flex-row justify-between items-center gap-3">
                <div className="flex bg-stone-200/70 p-1 rounded-xl">
                  <button
                    onClick={() => setPdfPreviewPage(1)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      pdfPreviewPage === 1 
                        ? 'bg-[#450a0a] text-amber-100 shadow-sm' 
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    {language === 'en' ? 'Page 1: Main Dishes' : language === 'zh' ? '第一页：主食面饭' : 'Halaman 1: Makanan'}
                  </button>
                  <button
                    onClick={() => setPdfPreviewPage(2)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      pdfPreviewPage === 2 
                        ? 'bg-[#450a0a] text-amber-100 shadow-sm' 
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    {language === 'en' ? 'Page 2: Drinks & About' : language === 'zh' ? '第二页：清凉饮品' : 'Halaman 2: Minuman & Tentang'}
                  </button>
                </div>

                <div className="flex gap-2.5">
                  {/* Native Print button inside the modal */}
                  <button
                    onClick={() => {
                      window.print();
                    }}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-stone-950 font-extrabold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                  >
                    <span>🖨️</span>
                    <span>{language === 'en' ? 'Print Menu' : language === 'zh' ? '直接打印' : 'Cetak Menu'}</span>
                  </button>

                  {/* PDF Download Button */}
                  <button
                    onClick={downloadMenuPDF}
                    disabled={isGeneratingPDF}
                    className="px-4 py-2 bg-[#450a0a] hover:bg-red-950 text-amber-200 disabled:bg-stone-300 disabled:text-stone-500 font-extrabold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                  >
                    {isGeneratingPDF ? (
                      <>
                        <div className="animate-spin h-3.5 w-3.5 border-2 border-amber-200 border-t-transparent rounded-full" />
                        <span>{language === 'en' ? 'Generating...' : language === 'zh' ? '正在生成...' : 'Menyiapkan...'}</span>
                      </>
                    ) : (
                      <>
                        <Download size={14} />
                        <span>{language === 'en' ? 'Download PDF' : language === 'zh' ? '下载 PDF' : 'Unduh PDF'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Scrollable Viewport with precise scale container */}
              <div className="p-6 overflow-y-auto no-scrollbar flex-grow bg-stone-100/50 flex justify-center items-start min-h-[400px] max-h-[55vh]">
                <div className="relative border border-stone-200 shadow-xl rounded-2xl overflow-hidden origin-top scale-[0.42] xs:scale-[0.52] sm:scale-[0.68] md:scale-[0.78] lg:scale-[0.88] transition-all bg-[#FAF7F2]" style={{ transformOrigin: 'top center', width: '794px', height: '1123px', minWidth: '794px', minHeight: '1123px' }}>
                  {pdfPreviewPage === 1 ? (
                    /* Page 1 Preview Mock */
                    <div className="p-10 flex flex-col justify-between h-full font-serif text-left">
                      {/* Gold Brackets */}
                      <div className="absolute top-3 left-3 w-8 h-8 border-t-4 border-l-4 border-amber-500" />
                      <div className="absolute top-3 right-3 w-8 h-8 border-t-4 border-r-4 border-amber-500" />
                      <div className="absolute bottom-3 left-3 w-8 h-8 border-b-4 border-l-4 border-amber-500" />
                      <div className="absolute bottom-3 right-3 w-8 h-8 border-b-4 border-r-4 border-amber-500" />

                      <div className="flex-grow flex flex-col">
                        <div className="text-center border-b-2 border-amber-500/30 pb-4 mb-6 relative">
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-12 border-2 border-red-700/20 rounded-full flex items-center justify-center font-bold text-red-700/20 text-xs tracking-tight">
                            RM SEGAR
                          </div>
                          <h1 className="text-3xl font-extrabold tracking-widest text-[#450a0a]">RUMAH MAKAN SEGAR</h1>
                          <p className="text-xs uppercase tracking-widest text-amber-700 font-sans font-bold mt-1">
                            Katalog Menu Utama • Main Menu • 鮮館主菜单
                          </p>
                          <p className="text-[10px] text-stone-500 font-sans italic mt-1">Cita Rasa Autentik Kalimantan Barat (Sambas)</p>
                        </div>

                        <div className="space-y-6 flex-grow">
                          <div>
                            <h3 className="text-xs uppercase font-extrabold tracking-wider bg-[#450a0a] text-amber-100 px-3 py-1 inline-block rounded mb-2 font-sans">
                              1. BAKMIE (Noodles / 手工肉面)
                            </h3>
                            <div className="space-y-1">
                              {MENU_ITEMS.filter(item => item.category === 'Bakmie').map(item => renderPDFMenuItem(item))}
                            </div>
                          </div>

                          <div>
                            <h3 className="text-xs uppercase font-extrabold tracking-wider bg-[#450a0a] text-amber-100 px-3 py-1 inline-block rounded mb-2 font-sans">
                              2. KWETIAO (Flat Rice Noodles / 镬气粿条)
                            </h3>
                            <div className="space-y-1">
                              {MENU_ITEMS.filter(item => item.category === 'Kwetiao').map(item => renderPDFMenuItem(item))}
                            </div>
                          </div>

                          <div>
                            <h3 className="text-xs uppercase font-extrabold tracking-wider bg-[#450a0a] text-amber-100 px-3 py-1 inline-block rounded mb-2 font-sans">
                              3. HIDANGAN NASI (Rice Dishes / 经典饭食)
                            </h3>
                            <div className="space-y-1">
                              {MENU_ITEMS.filter(item => item.category === 'Nasi').map(item => renderPDFMenuItem(item))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="text-center pt-2 border-t border-stone-200 text-[10px] text-stone-400 font-sans flex justify-between items-center">
                        <span>RM Segar Sambas — Digital Menu Catalog (Priceless)</span>
                        <span className="font-semibold text-amber-700 font-serif">Halaman 1 / 2</span>
                      </div>
                    </div>
                  ) : (
                    /* Page 2 Preview Mock */
                    <div className="p-10 flex flex-col justify-between h-full font-serif text-left">
                      {/* Gold Brackets */}
                      <div className="absolute top-3 left-3 w-8 h-8 border-t-4 border-l-4 border-amber-500" />
                      <div className="absolute top-3 right-3 w-8 h-8 border-t-4 border-r-4 border-amber-500" />
                      <div className="absolute bottom-3 left-3 w-8 h-8 border-b-4 border-l-4 border-amber-500" />
                      <div className="absolute bottom-3 right-3 w-8 h-8 border-b-4 border-r-4 border-amber-500" />

                      <div className="flex-grow flex flex-col justify-between">
                        <div className="space-y-4">
                          <div className="text-center border-b-2 border-amber-500/30 pb-4 mb-6">
                            <h2 className="text-2xl font-bold tracking-widest text-[#450a0a]">MINUMAN SEGAR</h2>
                            <p className="text-xs uppercase tracking-widest text-amber-700 font-sans font-bold mt-0.5">
                              Beverages • 清凉饮品
                            </p>
                          </div>

                          <div>
                            <h3 className="text-xs uppercase font-extrabold tracking-wider bg-[#450a0a] text-amber-100 px-3 py-1 inline-block rounded mb-2 font-sans">
                              4. ANEKA MINUMAN (Beverages / 饮料)
                            </h3>
                            <div className="space-y-1">
                              {MENU_ITEMS.filter(item => item.category === 'Minuman').map(item => renderPDFMenuItem(item))}
                            </div>
                          </div>
                        </div>

                        <div className="mt-8 border-t-2 border-amber-500/20 pt-6 space-y-4">
                          <div className="bg-stone-100/60 p-5 rounded-2xl border border-stone-200/50">
                            <h4 className="text-sm font-extrabold tracking-wider text-[#450a0a] mb-2 font-sans uppercase">
                              Tentang Rumah Makan Segar • Our Story • 关于我们
                            </h4>
                            <div className="text-[10px] text-stone-600 font-sans leading-relaxed space-y-2">
                              <p>
                                <span className="font-bold text-[#450a0a]">ID:</span> RM Segar menyajikan hidangan autentik khas Sambas, Kalimantan Barat sejak turun-temurun. Dibuat dengan resep legendaris rahasia keluarga and bahan-bahan segar berkualitas tinggi demi cita rasa gurih legendaris yang tiada duanya.
                              </p>
                              <p>
                                <span className="font-bold text-stone-700">EN:</span> RM Segar serves authentic West Kalimantan Chinese culinary legacy from generation to generation. Made with legendary secret family recipes and high-quality fresh ingredients for an unparalleled authentic taste.
                              </p>
                              <p>
                                <span className="font-bold text-red-800">ZH:</span> 鲜馆 (RM Segar) 世代传承正宗西加里曼丹三发县经典中餐美食，采用家族秘制配方与上等新鲜食材，为您呈献绝无仅有的极致风味。
                              </p>
                            </div>
                          </div>

                          <div className="bg-red-50 p-4 rounded-xl border border-red-200 flex items-start gap-3">
                            <span className="text-red-600 text-lg">⚠️</span>
                            <div className="text-[10px] text-red-900 leading-normal font-sans font-medium space-y-0.5">
                              <p><span className="font-bold">INFORMASI PENTING (ID):</span> Menu kami mengandung bahan-bahan Non-Halal.</p>
                              <p><span className="font-bold">IMPORTANT NOTICE (EN):</span> Our menu contains non-halal ingredients.</p>
                              <p><span className="font-bold">重要提示 (ZH):</span> 我们的菜单包含非清真 (Non-Halal) 食材。</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="text-center pt-4 border-t border-stone-200 text-[10px] text-stone-400 font-sans flex justify-between items-center mt-6">
                        <span>Sajian Legendaris Sambas, Kalimantan Barat • Hubungi kami di WhatsApp</span>
                        <span className="font-semibold text-amber-700 font-serif">Halaman 2 / 2</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom bar info */}
              <div className="p-4 border-t border-stone-200/60 bg-stone-50 text-center text-xs text-stone-500">
                {language === 'en' 
                  ? '💡 Desktop users can print directly using A4 paper size settings for best results.' 
                  : language === 'zh' 
                  ? '💡 桌面端用户可以直接设置A4纸张大小打印，以获得最佳打印效果。' 
                  : '💡 Untuk hasil terbaik saat mencetak, gunakan pengaturan ukuran kertas A4 pada menu printer Anda.'}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutConfirmModal && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogoutConfirmModal(false)}
              className="fixed inset-0 bg-stone-950/60 backdrop-blur-sm z-[90]"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm bg-white rounded-[32px] p-6 text-center space-y-5 border border-stone-100 shadow-2xl z-[90] overflow-hidden"
            >
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto shadow-inner border border-red-100">
                <LogOut size={30} />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-xl font-bold text-stone-900">
                  {language === 'en' ? 'Confirm Log Out' : language === 'zh' ? '确认退出登录' : 'Konfirmasi Keluar'}
                </h3>
                <p className="text-xs text-stone-500 leading-relaxed px-2">
                  {language === 'en' 
                    ? 'Are you sure you want to log out of your RM Segar account?' 
                    : language === 'zh' 
                    ? '您确定要退出 RM Segar 账号吗？' 
                    : 'Apakah Anda yakin ingin keluar dari akun RM Segar?'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button 
                  onClick={() => setShowLogoutConfirmModal(false)}
                  className="py-3.5 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-2xl font-bold text-sm transition-all active:scale-95 cursor-pointer"
                >
                  {language === 'en' ? 'Cancel' : language === 'zh' ? '取消' : 'Batal'}
                </button>
                <button 
                  onClick={() => {
                    handleLogout();
                    setShowLogoutConfirmModal(false);
                  }}
                  className="py-3.5 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-red-200 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <LogOut size={16} />
                  <span>{language === 'en' ? 'Log Out' : language === 'zh' ? '退出' : 'Ya, Keluar'}</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Clear Order History Confirmation Modal */}
      <AnimatePresence>
        {showClearHistoryConfirmModal && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowClearHistoryConfirmModal(false)}
              className="fixed inset-0 bg-stone-950/60 backdrop-blur-sm z-[90]"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm bg-white rounded-[32px] p-6 text-center space-y-5 border border-stone-100 shadow-2xl z-[90] overflow-hidden"
            >
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto shadow-inner border border-red-100">
                <Trash2 size={30} />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-xl font-bold text-stone-900">
                  {language === 'en' ? 'Delete Order History?' : language === 'zh' ? '清空订单历史？' : 'Hapus Riwayat Pesanan?'}
                </h3>
                <p className="text-xs text-stone-500 leading-relaxed px-1">
                  {language === 'en' 
                    ? 'Are you sure you want to delete all order history? This action cannot be undone.' 
                    : language === 'zh' 
                    ? '您确定要删除所有订单历史记录吗？此操作无法撤销。' 
                    : 'Apakah Anda yakin ingin menghapus semua riwayat pesanan? Tindakan ini tidak dapat dibatalkan.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button 
                  onClick={() => setShowClearHistoryConfirmModal(false)}
                  className="py-3.5 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-2xl font-bold text-sm transition-all active:scale-95 cursor-pointer"
                >
                  {language === 'en' ? 'Cancel' : language === 'zh' ? '取消' : 'Batal'}
                </button>
                <button 
                  onClick={() => {
                    setOrders([]);
                    localStorage.removeItem('rm_segar_orders');
                    setShowClearHistoryConfirmModal(false);
                  }}
                  className="py-3.5 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-red-200 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Trash2 size={16} />
                  <span>{language === 'en' ? 'Delete All' : language === 'zh' ? '清空' : 'Ya, Hapus'}</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Clear Chat History Confirmation Modal */}
      <AnimatePresence>
        {showClearChatConfirmModal && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowClearChatConfirmModal(false)}
              className="fixed inset-0 bg-stone-950/60 backdrop-blur-sm z-[2000]"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm bg-white rounded-[32px] p-6 text-center space-y-5 border border-stone-100 shadow-2xl z-[2001] overflow-hidden"
            >
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto shadow-inner border border-red-100">
                <Trash2 size={30} />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-xl font-bold text-stone-900">
                  {language === 'en' ? 'Clear Chat History?' : language === 'zh' ? '清空聊天记录？' : 'Hapus Obrolan Koki?'}
                </h3>
                <p className="text-xs text-stone-500 leading-relaxed px-1">
                  {language === 'en' 
                    ? 'Are you sure you want to clear all chat messages with Chef Teng?' 
                    : language === 'zh' 
                    ? '您确定要清空与 Koki Teng 厨师的所有聊天记录吗？' 
                    : 'Apakah Anda yakin ingin menghapus semua riwayat obrolan dengan Koki Teng?'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button 
                  onClick={() => setShowClearChatConfirmModal(false)}
                  className="py-3.5 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-2xl font-bold text-sm transition-all active:scale-95 cursor-pointer"
                >
                  {language === 'en' ? 'Cancel' : language === 'zh' ? '取消' : 'Batal'}
                </button>
                <button 
                  onClick={() => {
                    setChatMessages([{
                      role: 'model',
                      text: TRANSLATIONS[language].kokiGreeting
                    }]);
                    localStorage.removeItem('rm_segar_chat_messages');
                    localStorage.removeItem('rm_segar_chat_timestamp');
                    setConfirmedAIMessages({});
                    setShowClearChatConfirmModal(false);
                  }}
                  className="py-3.5 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-red-200 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Trash2 size={16} />
                  <span>{language === 'en' ? 'Clear' : language === 'zh' ? '清空' : 'Ya, Hapus'}</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spin Wheel Game Modal */}
      <AnimatePresence>
        {isWheelModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { if (!isWheelSpinning) setIsWheelModalOpen(false); }}
              className="fixed inset-0 bg-stone-950/80 backdrop-blur-md z-[120]"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] max-w-md bg-stone-900 rounded-[36px] p-6 text-center space-y-6 border border-amber-500/30 shadow-2xl z-[120] overflow-hidden text-white"
            >
              {/* Header with Close */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🎡</span>
                  <div className="text-left">
                    <h3 className="font-black text-amber-300 text-lg leading-tight">RODA PUTAR HOKI</h3>
                    <p className="text-[10px] text-stone-400 font-semibold">Tentukan Pilihan Kuliner Hari Ini!</p>
                  </div>
                </div>
                {!isWheelSpinning && (
                  <button 
                    onClick={() => setIsWheelModalOpen(false)}
                    className="w-9 h-9 bg-stone-800 text-stone-400 hover:text-white rounded-full flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>

              {/* Wheel Container */}
              <div className="relative flex flex-col items-center justify-center py-2">
                {/* Top Pointer Arrow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-20 pointer-events-none drop-shadow-md">
                  <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[22px] border-t-amber-400 animate-pulse" />
                </div>

                {/* SVG Wheel */}
                <div className="relative p-2 bg-gradient-to-br from-amber-500/20 to-red-600/20 rounded-full border-4 border-amber-500/40 shadow-inner">
                  <svg viewBox="0 0 300 300" className="w-60 h-60 sm:w-68 sm:h-68 drop-shadow-2xl overflow-visible">
                    <g 
                      style={{ 
                        transform: `rotate(${wheelRotation}deg)`, 
                        transformOrigin: '150px 150px',
                        transition: isWheelSpinning ? 'transform 4s cubic-bezier(0.15, 0.85, 0.15, 1)' : 'none'
                      }}
                    >
                      {WHEEL_ITEMS.map((item, i) => {
                        const startAngle = i * 45;
                        const endAngle = (i + 1) * 45;
                        const midAngle = i * 45 + 22.5;
                        const rad = Math.PI / 180;
                        
                        const x1 = 150 + 140 * Math.cos(startAngle * rad);
                        const y1 = 150 + 140 * Math.sin(startAngle * rad);
                        const x2 = 150 + 140 * Math.cos(endAngle * rad);
                        const y2 = 150 + 140 * Math.sin(endAngle * rad);

                        const labelX = 150 + 95 * Math.cos(midAngle * rad);
                        const labelY = 150 + 95 * Math.sin(midAngle * rad);

                        return (
                          <g key={item.id}>
                            <path
                              d={`M 150 150 L ${x1} ${y1} A 140 140 0 0 1 ${x2} ${y2} Z`}
                              fill={item.bg}
                              stroke="#ffffff"
                              strokeWidth="2.5"
                            />
                            <text
                              x={labelX}
                              y={labelY}
                              fill={item.text}
                              fontSize="20"
                              textAnchor="middle"
                              dominantBaseline="central"
                              style={{ userSelect: 'none', pointerEvents: 'none' }}
                            >
                              {item.emoji}
                            </text>
                          </g>
                        );
                      })}
                      {/* Center Pin */}
                      <circle cx="150" cy="150" r="22" fill="#ffffff" stroke="#e5e7eb" strokeWidth="3" />
                      <circle cx="150" cy="150" r="12" fill="#f59e0b" />
                    </g>
                  </svg>
                </div>
              </div>

              {/* Action or Result */}
              {wonWheelMenu ? (
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="p-4 bg-stone-800/90 rounded-2xl border border-amber-500/40 text-left space-y-3"
                >
                  <div className="flex items-center gap-2 text-amber-300 font-extrabold text-xs">
                    <Sparkles size={16} />
                    <span>SELAMAT! RODA MEMILIH:</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-amber-500/20 text-amber-300 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 border border-amber-500/30">
                      {WHEEL_ITEMS.find(w => w.id === wonWheelMenu.id)?.emoji || '🍲'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-extrabold text-white text-sm truncate">{wonWheelMenu.name}</h4>
                      <p className="text-amber-300 text-[11px] leading-tight line-clamp-1">{wonWheelMenu.description}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={handleSpinWheel}
                      className="py-2.5 bg-stone-700 hover:bg-stone-600 text-stone-200 rounded-xl font-bold text-xs transition-all active:scale-95 cursor-pointer"
                    >
                      Putar Lagi 🎡
                    </button>
                    <button
                      onClick={(e) => {
                        addToCart(wonWheelMenu, undefined, e);
                        setIsWheelModalOpen(false);
                      }}
                      className="py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-stone-950 font-black rounded-xl text-xs shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <ShoppingBag size={14} />
                      <span>+ Keranjang</span>
                    </button>
                  </div>
                </motion.div>
              ) : (
                <button
                  disabled={isWheelSpinning}
                  onClick={handleSpinWheel}
                  className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    isWheelSpinning
                      ? 'bg-stone-800 text-stone-500 border border-stone-700 cursor-not-allowed'
                      : 'bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:brightness-110 text-stone-950 shadow-lg shadow-orange-500/20 active:scale-98'
                  }`}
                >
                  <Dices size={20} className={isWheelSpinning ? 'animate-spin' : ''} />
                  <span>{isWheelSpinning ? 'MEMUTAR RODA...' : 'PUTAR RODA HOKI 🎡'}</span>
                </button>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Shio Zodiac Matcher Modal */}
      <AnimatePresence>
        {isShioModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsShioModalOpen(false)}
              className="fixed inset-0 bg-stone-950/80 backdrop-blur-md z-[120]"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] max-w-lg max-h-[85vh] bg-stone-900 rounded-[36px] p-6 text-stone-100 space-y-5 border border-amber-500/30 shadow-2xl z-[120] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🐉</span>
                  <div>
                    <h3 className="font-black text-amber-300 text-lg leading-tight">RAMALAN SHIO KULINER</h3>
                    <p className="text-[10px] text-stone-400">Temukan Elemen & Menu Hoki Anda</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsShioModalOpen(false)}
                  className="w-9 h-9 bg-stone-800 text-stone-400 hover:text-white rounded-full flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Year Input */}
              <div className="bg-stone-800/80 p-4 rounded-2xl border border-stone-700/50 space-y-2">
                <label className="text-xs font-bold text-amber-200 block">
                  Masukkan Tahun Kelahiran Anda:
                </label>
                <div className="flex gap-2">
                  <input 
                    type="number"
                    placeholder="Contoh: 1996"
                    value={birthYear}
                    onChange={(e) => {
                      setBirthYear(e.target.value);
                      const res = getShioAndElementFromYear(e.target.value);
                      if (res) setSelectedShio(res);
                    }}
                    className="flex-1 bg-stone-900 border border-stone-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 font-mono"
                  />
                  <button 
                    onClick={() => {
                      const res = getShioAndElementFromYear(birthYear);
                      if (res) setSelectedShio(res);
                    }}
                    className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-black rounded-xl text-xs transition-all cursor-pointer"
                  >
                    Cek Hoki
                  </button>
                </div>
              </div>

              {/* Shio Grid Selection */}
              <div className="space-y-2">
                <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Atau Pilih Shio Anda Langsung:</p>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {SHIO_DETAILS.map((shio) => (
                    <button
                      key={shio.id}
                      onClick={() => {
                        setSelectedShio(shio);
                      }}
                      className={`p-2.5 rounded-2xl flex flex-col items-center justify-center border transition-all cursor-pointer ${
                        selectedShio?.id === shio.id 
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300 scale-105 shadow-md' 
                          : 'bg-stone-800/60 border-stone-700/60 text-stone-300 hover:bg-stone-800'
                      }`}
                    >
                      <span className="text-2xl">{shio.emoji}</span>
                      <span className="text-[10px] font-bold mt-1 truncate max-w-full">{shio.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected Shio Result Card */}
              {selectedShio && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-amber-950/40 via-stone-800/80 to-stone-900 p-5 rounded-3xl border border-amber-500/40 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{selectedShio.emoji}</span>
                      <div>
                        <h4 className="font-black text-amber-300 text-base">Shio {selectedShio.name} ({selectedShio.zh})</h4>
                        <p className="text-xs text-stone-300 font-medium">{selectedShio.trait[language]}</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-stone-300 leading-relaxed italic bg-stone-900/60 p-3 rounded-2xl border border-stone-800">
                    "{selectedShio.desc[language]}"
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 bg-stone-900/60 rounded-xl border border-stone-800">
                      <span className="text-[10px] text-amber-400 font-bold block uppercase">Angka Hoki</span>
                      <span className="font-bold text-stone-200">{selectedShio.luckyNumbers}</span>
                    </div>
                    <div className="p-2.5 bg-stone-900/60 rounded-xl border border-stone-800">
                      <span className="text-[10px] text-amber-400 font-bold block uppercase">Warna Hoki</span>
                      <span className="font-bold text-stone-200">{selectedShio.luckyColors[language]}</span>
                    </div>
                  </div>

                  {/* Matching Menu Item */}
                  {(() => {
                    const matchedMenu = MENU_ITEMS.find(m => m.id === selectedShio.foodId) || MENU_ITEMS[0];
                    return (
                      <div className="pt-2 border-t border-stone-800 space-y-2">
                        <span className="text-[11px] font-black text-amber-300 uppercase tracking-wider flex items-center gap-1">
                          <Sparkles size={14} /> Menu Hoki Shio Anda:
                        </span>
                        <div className="flex items-center justify-between bg-stone-900/90 p-3 rounded-2xl border border-amber-500/30">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-amber-500/20 text-amber-300 rounded-xl flex items-center justify-center text-xl font-bold flex-shrink-0 border border-amber-500/30">
                              🍜
                            </div>
                            <div>
                              <p className="font-bold text-white text-xs">{matchedMenu.name}</p>
                              <p className="text-amber-300 text-[10px] leading-tight line-clamp-1">{matchedMenu.description}</p>
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              addToCart(matchedMenu, undefined, e);
                              setIsShioModalOpen(false);
                            }}
                            className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-stone-950 font-black rounded-xl text-xs transition-all active:scale-95 cursor-pointer flex items-center gap-1 flex-shrink-0"
                          >
                            <ShoppingBag size={12} />
                            <span>+ Keranjang</span>
                          </button>
                        </div>
                      </div>
                    );
                  })()}
                </motion.div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Block Blast Kuliner Modal */}
      <AnimatePresence>
        {isBlockBlastModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBlockBlastModalOpen(false)}
              className="fixed inset-0 bg-stone-950/85 backdrop-blur-md z-[120]"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-md max-h-[90vh] bg-stone-900 rounded-[36px] p-5 text-stone-100 space-y-4 border border-amber-500/40 shadow-2xl z-[120] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🧩</span>
                  <div>
                    <h3 className="font-black text-amber-300 text-lg leading-tight">BLOCK BLAST KULINER</h3>
                    <p className="text-[10px] text-stone-400">Susun Balok, Bersihkan Garis & Raih Poin!</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsBlockBlastModalOpen(false)}
                  className="w-9 h-9 bg-stone-800 text-stone-400 hover:text-white rounded-full flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Score Dashboard */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 bg-stone-800/80 rounded-2xl border border-stone-700/60">
                  <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider block">Skor</span>
                  <span className="text-xl font-black text-amber-300 font-mono">{bbScore}</span>
                </div>
                <div className="p-2.5 bg-stone-800/80 rounded-2xl border border-stone-700/60 flex flex-col justify-center items-center">
                  <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider block">Combo</span>
                  {bbCombo > 0 ? (
                    <span className="text-sm font-black text-orange-400 animate-bounce">🔥 x{bbCombo}</span>
                  ) : (
                    <span className="text-xs font-bold text-stone-500">-</span>
                  )}
                </div>
                <div className="p-2.5 bg-stone-800/80 rounded-2xl border border-stone-700/60">
                  <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider block">Tertinggi 🏆</span>
                  <span className="text-xl font-black text-amber-400 font-mono">{bbHighScore}</span>
                </div>
              </div>

              {/* Game Over Banner or Instructions */}
              {bbIsGameOver ? (
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="p-4 bg-gradient-to-br from-red-950 via-stone-900 to-amber-950 rounded-2xl border border-amber-500/50 text-center space-y-3"
                >
                  <div className="w-12 h-12 bg-amber-500/20 text-amber-300 rounded-full flex items-center justify-center mx-auto text-2xl border border-amber-500/40">
                    🏆
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-amber-200">GAME OVER!</h4>
                    <p className="text-xs text-stone-300 mt-0.5">Skor Akhir Anda: <strong className="text-amber-300 font-mono text-sm">{bbScore} Poin</strong></p>
                  </div>

                  {bbRewardMenu && (
                    <div className="bg-stone-900/90 p-3 rounded-xl border border-amber-500/30 text-left flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">🍜</span>
                        <div>
                          <span className="text-[9px] font-bold text-amber-400 uppercase block">Voucher Rekomendasi Hoki:</span>
                          <span className="font-bold text-white text-xs">{bbRewardMenu.name}</span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          addToCart(bbRewardMenu, undefined, e);
                          setIsBlockBlastModalOpen(false);
                        }}
                        className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-stone-950 font-black rounded-xl text-xs transition-all active:scale-95 cursor-pointer flex items-center gap-1"
                      >
                        <ShoppingBag size={12} />
                        <span>+ Pesan</span>
                      </button>
                    </div>
                  )}

                  <button
                    onClick={openBlockBlastGame}
                    className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-110 text-stone-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all active:scale-95 cursor-pointer"
                  >
                    Main Lagi 🧩
                  </button>
                </motion.div>
              ) : (
                <div className="text-[11px] text-stone-400 text-center">
                  {bbSelectedPieceIdx !== null ? (
                    <span className="text-amber-300 font-extrabold animate-pulse">
                      👇 Ketuk petak di papan untuk menaruh balok yang dipilih!
                    </span>
                  ) : (
                    <span>Pilih balok di bawah, lalu ketuk posisi di papan 8x8:</span>
                  )}
                </div>
              )}

              {/* 8x8 Board */}
              <div className="p-2.5 bg-stone-950/90 rounded-2xl border border-stone-800 shadow-inner mx-auto w-fit">
                <div className="grid grid-cols-8 gap-1">
                  {bbBoard.map((row, r) =>
                    row.map((cell, c) => {
                      const isClearing = bbClearingCells.includes(`${r}_${c}`);
                      
                      // Check if ghost preview valid
                      let isGhost = false;
                      let isGhostValid = false;
                      if (bbSelectedPieceIdx !== null && bbHoverPos && bbPieces[bbSelectedPieceIdx]) {
                        const piece = bbPieces[bbSelectedPieceIdx]!;
                        const relativeR = r - bbHoverPos.r;
                        const relativeC = c - bbHoverPos.c;
                        if (
                          relativeR >= 0 && relativeR < piece.shape.length &&
                          relativeC >= 0 && relativeC < piece.shape[0].length &&
                          piece.shape[relativeR][relativeC] === 1
                        ) {
                          isGhost = true;
                          isGhostValid = canPlacePiece(bbBoard, piece.shape, bbHoverPos.r, bbHoverPos.c);
                        }
                      }

                      return (
                        <button
                          key={`${r}_${c}`}
                          type="button"
                          onMouseEnter={() => setBbHoverPos({ r, c })}
                          onClick={() => {
                            if (bbSelectedPieceIdx !== null) {
                              placeBlockPiece(r, c);
                            }
                          }}
                          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg transition-all flex items-center justify-center relative cursor-pointer ${
                            isClearing
                              ? 'bg-amber-300 scale-125 z-10 shadow-lg shadow-amber-400 animate-ping'
                              : cell
                              ? 'shadow-xs border border-white/20'
                              : isGhost
                              ? isGhostValid ? 'bg-amber-400/50 border border-amber-300 scale-105' : 'bg-red-500/40 border border-red-400'
                              : 'bg-stone-900 hover:bg-stone-800/80 border border-stone-800/60'
                          }`}
                          style={{
                            backgroundColor: cell ? cell : undefined
                          }}
                        >
                          {cell && (
                            <span className="w-2 h-2 rounded-full bg-white/30" />
                          )}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Pieces Selection Tray */}
              {!bbIsGameOver && (
                <div className="space-y-2 pt-1">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block text-center">
                    Pilihan Balok Kuliner (Ketuk Untuk Memilih):
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {bbPieces.map((piece, idx) => {
                      if (!piece) {
                        return (
                          <div 
                            key={idx} 
                            className="h-20 bg-stone-950/40 rounded-2xl border border-stone-800/40 flex items-center justify-center text-stone-600 text-xs italic"
                          >
                            Terpakai
                          </div>
                        );
                      }

                      const isSelected = bbSelectedPieceIdx === idx;

                      return (
                        <button
                          key={piece.id}
                          type="button"
                          onClick={() => {
                            setBbSelectedPieceIdx(isSelected ? null : idx);
                          }}
                          className={`h-20 p-2 rounded-2xl flex flex-col items-center justify-center border transition-all cursor-pointer relative ${
                            isSelected 
                              ? 'bg-amber-500/20 border-amber-400 ring-2 ring-amber-400/50 scale-105 shadow-lg shadow-amber-500/10' 
                              : 'bg-stone-800/70 border-stone-700/70 hover:bg-stone-800 text-stone-300'
                          }`}
                        >
                          {/* Mini Grid rendering of shape */}
                          <div className="flex flex-col gap-0.5 items-center justify-center">
                            {piece.shape.map((sRow, sr) => (
                              <div key={sr} className="flex gap-0.5">
                                {sRow.map((cell, sc) => (
                                  <div
                                    key={sc}
                                    className={`w-3.5 h-3.5 rounded-xs ${
                                      cell === 1 ? 'shadow-xs' : 'opacity-0'
                                    }`}
                                    style={{
                                      backgroundColor: cell === 1 ? piece.color : 'transparent'
                                    }}
                                  />
                                ))}
                              </div>
                            ))}
                          </div>
                          <span className="text-[9px] font-extrabold text-amber-300 mt-1 flex items-center gap-1">
                            <span>{piece.emoji}</span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Yang Kalah Traktir Multi-Game Modal */}
      <AnimatePresence>
        {isTraktirModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsTraktirModalOpen(false)}
              className="fixed inset-0 bg-stone-950/85 backdrop-blur-md z-[120]"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-lg max-h-[90vh] bg-stone-900 rounded-[36px] p-5 text-stone-100 space-y-4 border border-amber-500/40 shadow-2xl z-[120] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 text-stone-950 rounded-xl flex items-center justify-center text-2xl font-black shadow-md">
                    💸
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-black text-amber-300 text-lg leading-tight">YANG KALAH TRAKTIR!</h3>
                      <span className="px-1.5 py-0.5 bg-red-600 text-white font-black text-[8px] uppercase rounded-full">
                        Party Game
                      </span>
                    </div>
                    <p className="text-[10px] text-stone-400 font-medium">Tentukan Siapa Yang Bayar Makan Hari Ini!</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsTraktirModalOpen(false)}
                  className="w-9 h-9 bg-stone-800 text-stone-400 hover:text-white rounded-full flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Player Roster Section */}
              <div className="bg-stone-800/70 p-3.5 rounded-2xl border border-stone-700/60 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-amber-200 uppercase tracking-wider flex items-center gap-1.5">
                    <Users size={14} className="text-amber-400" /> Daftar Pemain ({traktirPlayers.length}):
                  </span>
                  <span className="text-[10px] text-stone-400">Min 2, Max 8</span>
                </div>

                {/* Player Badges */}
                <div className="flex flex-wrap gap-1.5">
                  {traktirPlayers.map((player, idx) => (
                    <div 
                      key={idx} 
                      className="px-2.5 py-1 bg-stone-900 border border-amber-500/30 text-amber-200 text-xs font-bold rounded-xl flex items-center gap-1.5"
                    >
                      <span>👤 {player}</span>
                      {traktirPlayers.length > 2 && (
                        <button 
                          onClick={() => removeTraktirPlayer(idx)}
                          className="hover:text-red-400 text-stone-500 transition-colors cursor-pointer"
                        >
                          <X size={12} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add Player Input */}
                {traktirPlayers.length < 8 && (
                  <div className="flex gap-2 pt-1">
                    <input 
                      type="text"
                      placeholder="Tambah nama teman..."
                      value={newPlayerInput}
                      onChange={(e) => setNewPlayerInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addTraktirPlayer()}
                      className="flex-1 bg-stone-900 border border-stone-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                    <button 
                      onClick={addTraktirPlayer}
                      className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-black rounded-xl text-xs transition-all cursor-pointer flex items-center gap-1"
                    >
                      <Plus size={14} />
                      <span>Tambah</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Sub-Game Mode Navigation Tabs */}
              <div className="grid grid-cols-3 gap-1.5 bg-stone-950 p-1 rounded-2xl border border-stone-800">
                <button
                  onClick={() => { setTraktirGameMode('wheel'); setTraktirLoser(null); }}
                  className={`py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    traktirGameMode === 'wheel'
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 shadow-md'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  <span>🎡 Roda Traktir</span>
                </button>
                <button
                  onClick={() => { setTraktirGameMode('bomb'); initTraktirBombGame(); }}
                  className={`py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    traktirGameMode === 'bomb'
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 shadow-md'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  <span>💣 Bom Kuliner</span>
                </button>
                <button
                  onClick={() => { setTraktirGameMode('tap'); setTapIsActive(false); setTapLoser(null); }}
                  className={`py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    traktirGameMode === 'tap'
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 shadow-md'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  <span>🥢 Adu Sumpit</span>
                </button>
              </div>

              {/* MODE 1: RODA TRAKTIR */}
              {traktirGameMode === 'wheel' && (
                <div className="space-y-4 pt-1 text-center">
                  <p className="text-[11px] text-stone-300">
                    Putar Roda Dosa Traktir! Siapa pun yang ditunjuk panah WAJIB traktir makan!
                  </p>

                  <div className="relative flex flex-col items-center justify-center py-2">
                    {/* Arrow Pointer */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-20 pointer-events-none drop-shadow-md">
                      <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[22px] border-t-amber-400 animate-pulse" />
                    </div>

                    {/* SVG Wheel */}
                    <div className="relative p-2 bg-gradient-to-br from-amber-500/20 to-red-600/20 rounded-full border-4 border-amber-500/40 shadow-inner">
                      <svg viewBox="0 0 300 300" className="w-60 h-60 sm:w-68 sm:h-68 drop-shadow-2xl overflow-visible">
                        <g 
                          style={{ 
                            transform: `rotate(${traktirWheelRotation}deg)`, 
                            transformOrigin: '150px 150px',
                            transition: traktirIsSpinning ? 'transform 3.5s cubic-bezier(0.15, 0.85, 0.15, 1)' : 'none'
                          }}
                        >
                          {traktirPlayers.map((player, i) => {
                            const total = traktirPlayers.length;
                            const slice = 360 / total;
                            const startAngle = i * slice;
                            const endAngle = (i + 1) * slice;
                            const midAngle = startAngle + slice / 2;
                            const rad = Math.PI / 180;
                            
                            const x1 = 150 + 140 * Math.cos(startAngle * rad);
                            const y1 = 150 + 140 * Math.sin(startAngle * rad);
                            const x2 = 150 + 140 * Math.cos(endAngle * rad);
                            const y2 = 150 + 140 * Math.sin(endAngle * rad);

                            const labelX = 150 + 90 * Math.cos(midAngle * rad);
                            const labelY = 150 + 90 * Math.sin(midAngle * rad);

                            const colors = ['#dc2626', '#d97706', '#059669', '#2563eb', '#7c3aed', '#db2777', '#0284c7', '#ca8a04'];
                            const bgColor = colors[i % colors.length];

                            return (
                              <g key={i}>
                                <path
                                  d={`M 150 150 L ${x1} ${y1} A 140 140 0 0 1 ${x2} ${y2} Z`}
                                  fill={bgColor}
                                  stroke="#1c1917"
                                  strokeWidth="2.5"
                                />
                                <text
                                  x={labelX}
                                  y={labelY}
                                  fill="#ffffff"
                                  fontSize={total > 6 ? "11" : "13"}
                                  fontWeight="900"
                                  textAnchor="middle"
                                  dominantBaseline="central"
                                  style={{ userSelect: 'none', pointerEvents: 'none' }}
                                >
                                  {player.length > 8 ? player.substring(0, 7) + '..' : player}
                                </text>
                              </g>
                            );
                          })}
                          {/* Center Pin */}
                          <circle cx="150" cy="150" r="22" fill="#1c1917" stroke="#f59e0b" strokeWidth="3" />
                          <text x="150" y="150" fill="#f59e0b" fontSize="14" textAnchor="middle" dominantBaseline="central">💸</text>
                        </g>
                      </svg>
                    </div>
                  </div>

                  {traktirLoser ? (
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="p-4 bg-gradient-to-br from-red-950 via-stone-900 to-amber-950 rounded-2xl border border-amber-500/50 text-center space-y-3 shadow-xl"
                    >
                      <div className="w-12 h-12 bg-amber-500/20 text-amber-300 rounded-full flex items-center justify-center mx-auto text-2xl border border-amber-500/40">
                        👑
                      </div>
                      <div>
                        <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest block">KORBAN TRAKTIR TERPILIH</span>
                        <h4 className="text-xl font-black text-white mt-0.5">{traktirLoser.toUpperCase()}! 💸</h4>
                        <p className="text-xs text-stone-300 mt-1">Selamat! Kamu yang bayar makanan untuk rombongan hari ini!</p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          onClick={() => shareTraktirWhatsApp(traktirLoser, 'Roda Dosa Traktir')}
                          className="py-2.5 bg-green-600 hover:bg-green-500 text-white font-black rounded-xl text-xs transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
                        >
                          <Share2 size={14} />
                          <span>Kirim Bukti WA</span>
                        </button>
                        <button
                          onClick={handleSpinTraktirWheel}
                          className="py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-black rounded-xl text-xs transition-all active:scale-95 cursor-pointer"
                        >
                          Putar Ulang 🎡
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <button
                      disabled={traktirIsSpinning}
                      onClick={handleSpinTraktirWheel}
                      className={`w-full py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        traktirIsSpinning
                          ? 'bg-stone-800 text-stone-500 border border-stone-700 cursor-not-allowed'
                          : 'bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:brightness-110 text-stone-950 shadow-lg shadow-orange-500/20 active:scale-98'
                      }`}
                    >
                      <Dices size={18} className={traktirIsSpinning ? 'animate-spin' : ''} />
                      <span>{traktirIsSpinning ? 'MEMUTAR RODA DOSA...' : 'PUTAR RODA DOSA TRAKTIR 🎡'}</span>
                    </button>
                  )}
                </div>
              )}

              {/* MODE 2: BOM KULINER */}
              {traktirGameMode === 'bomb' && (
                <div className="space-y-4 pt-1 text-center">
                  <div className="bg-stone-950 p-3 rounded-2xl border border-stone-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Giliran Membuka Tudung:</span>
                      <span className="font-black text-amber-300 text-sm">
                        👤 {traktirPlayers[bombCurrentTurn % traktirPlayers.length]}
                      </span>
                    </div>
                    <button 
                      onClick={() => initTraktirBombGame()}
                      className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      Reset Tudung 🔄
                    </button>
                  </div>

                  <p className="text-[11px] text-stone-300">
                    Buka tudung saji satu-per-satu! Ada 11 makanan lezat dan 1 BOM TRAKTIR. Yang buka bom WAJIB TRAKTIR!
                  </p>

                  {/* 12 Tudung Grid */}
                  <div className="grid grid-cols-4 gap-2.5 p-3 bg-stone-950 rounded-2xl border border-stone-800">
                    {bombGrid.map((cell, idx) => (
                      <button
                        key={cell.id}
                        onClick={() => handleOpenBombCell(idx)}
                        disabled={cell.isOpen || bombLoser !== null}
                        className={`h-16 rounded-2xl border transition-all flex flex-col items-center justify-center cursor-pointer relative ${
                          cell.isOpen
                            ? cell.isBomb
                              ? 'bg-red-600 border-red-400 text-white scale-110 shadow-lg animate-bounce z-10'
                              : 'bg-stone-800 border-stone-700 text-stone-300'
                            : 'bg-gradient-to-br from-amber-500/20 to-orange-600/20 border-amber-500/40 hover:border-amber-400 hover:scale-105 shadow-md active:scale-95'
                        }`}
                      >
                        {cell.isOpen ? (
                          <span className="text-2xl">{cell.isBomb ? '💣' : cell.foodEmoji}</span>
                        ) : (
                          <>
                            <span className="text-xl">🍱</span>
                            <span className="text-[9px] font-mono text-amber-400/80 font-bold">#{idx + 1}</span>
                          </>
                        )}
                      </button>
                    ))}
                  </div>

                  {bombLoser && (
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="p-4 bg-gradient-to-br from-red-950 via-stone-900 to-amber-950 rounded-2xl border border-amber-500/50 text-center space-y-3 shadow-xl"
                    >
                      <div className="w-12 h-12 bg-red-600/30 text-red-400 rounded-full flex items-center justify-center mx-auto text-3xl border border-red-500/50 animate-pulse">
                        💣
                      </div>
                      <div>
                        <span className="text-[10px] font-black text-red-400 uppercase tracking-widest block">BOOOM!! BOM TRAKTIR MELEDAK!</span>
                        <h4 className="text-xl font-black text-white mt-0.5">{bombLoser.toUpperCase()}! 💸</h4>
                        <p className="text-xs text-stone-300 mt-1">Kamu membuka tudung saji bom! Kamu yang bayar seluruh tagihan makan!</p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          onClick={() => shareTraktirWhatsApp(bombLoser, 'Bom Kuliner Traktir')}
                          className="py-2.5 bg-green-600 hover:bg-green-500 text-white font-black rounded-xl text-xs transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
                        >
                          <Share2 size={14} />
                          <span>Share WA</span>
                        </button>
                        <button
                          onClick={() => initTraktirBombGame()}
                          className="py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-black rounded-xl text-xs transition-all active:scale-95 cursor-pointer"
                        >
                          Main Lagi 💣
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}

              {/* MODE 3: ADU KETUK SUMPIT */}
              {traktirGameMode === 'tap' && (
                <div className="space-y-4 pt-1 text-center">
                  <p className="text-[11px] text-stone-300">
                    Adu cepat ketuk sumpit 2 pemain dalam 5 detik! Pemain dengan ketukan tersedikit HARUS TRAKTIR!
                  </p>

                  {tapCountdown !== null ? (
                    <div className="py-12 text-center space-y-2">
                      <span className="text-6xl font-black text-amber-400 animate-ping block">{tapCountdown}</span>
                      <p className="text-xs font-bold text-stone-300 uppercase tracking-widest">SIAP-SIAP KETUK!</p>
                    </div>
                  ) : tapIsActive ? (
                    <div className="space-y-4">
                      <div className="py-2 bg-stone-950 rounded-2xl border border-stone-800 text-center">
                        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Sisa Waktu</span>
                        <span className="text-3xl font-black text-amber-400 font-mono">{tapTimeLeft} Detik</span>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        {/* Player 1 Tapper */}
                        <button
                          onClick={() => setTapP1Score(prev => prev + 1)}
                          className="h-36 bg-gradient-to-br from-amber-500 to-orange-600 text-stone-950 rounded-2xl font-black p-3 flex flex-col justify-between items-center shadow-lg active:scale-95 transition-all cursor-pointer select-none"
                        >
                          <span className="text-xs uppercase tracking-wider">👤 {traktirPlayers[0] || 'Pemain 1'}</span>
                          <span className="text-4xl font-mono">{tapP1Score}</span>
                          <span className="text-[10px] bg-stone-950/20 px-2 py-0.5 rounded-full uppercase">TAP FAST! 🥢</span>
                        </button>

                        {/* Player 2 Tapper */}
                        <button
                          onClick={() => setTapP2Score(prev => prev + 1)}
                          className="h-36 bg-gradient-to-br from-red-600 to-amber-700 text-white rounded-2xl font-black p-3 flex flex-col justify-between items-center shadow-lg active:scale-95 transition-all cursor-pointer select-none"
                        >
                          <span className="text-xs uppercase tracking-wider">👤 {traktirPlayers[1] || 'Pemain 2'}</span>
                          <span className="text-4xl font-mono">{tapP2Score}</span>
                          <span className="text-[10px] bg-stone-950/20 px-2 py-0.5 rounded-full uppercase">TAP FAST! 🥢</span>
                        </button>
                      </div>
                    </div>
                  ) : tapLoser ? (
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="p-4 bg-gradient-to-br from-red-950 via-stone-900 to-amber-950 rounded-2xl border border-amber-500/50 text-center space-y-3 shadow-xl"
                    >
                      <div className="w-12 h-12 bg-amber-500/20 text-amber-300 rounded-full flex items-center justify-center mx-auto text-2xl border border-amber-500/40">
                        🏆
                      </div>
                      <div>
                        <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest block">HASIL ADU KETUK SUMPIT</span>
                        <div className="flex justify-center gap-4 text-xs font-bold my-2 text-stone-300">
                          <span>{traktirPlayers[0] || 'P1'}: <strong className="text-amber-300 font-mono text-sm">{tapP1Score}</strong></span>
                          <span>vs</span>
                          <span>{traktirPlayers[1] || 'P2'}: <strong className="text-amber-300 font-mono text-sm">{tapP2Score}</strong></span>
                        </div>
                        <h4 className="text-xl font-black text-white mt-1">{tapLoser.toUpperCase()}! 💸</h4>
                        <p className="text-xs text-stone-300">Ketukan sumpit kurang cepat! Kamu yang wajib bayar makan!</p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          onClick={() => shareTraktirWhatsApp(tapLoser, 'Adu Ketuk Sumpit')}
                          className="py-2.5 bg-green-600 hover:bg-green-500 text-white font-black rounded-xl text-xs transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
                        >
                          <Share2 size={14} />
                          <span>Share WA</span>
                        </button>
                        <button
                          onClick={startTapDuel}
                          className="py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-black rounded-xl text-xs transition-all active:scale-95 cursor-pointer"
                        >
                          Adu Lagi 🥢
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <button
                      onClick={startTapDuel}
                      className="w-full py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:brightness-110 text-stone-950 font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Zap size={18} />
                      <span>MULAI ADU KETUK SUMPIT (5 DETIK) 🥢</span>
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Fly-to-Cart Animation Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
        {flies.map(fly => (
          <motion.div
            key={fly.id}
            initial={{ 
              x: fly.startX - 24, 
              y: fly.startY - 24,
              scale: 1,
              opacity: 1
            }}
            animate={{ 
              x: fly.endX - 24,
              y: fly.endY - 24,
              scale: 0.15,
              opacity: [1, 1, 0.7, 0]
            }}
            transition={{ 
              duration: 0.7,
              ease: [0.25, 1, 0.5, 1]
            }}
            onAnimationComplete={() => {
              // Trigger cart bounce pulse
              setCartPulse(true);
              setTimeout(() => setCartPulse(false), 500);
              
              // Remove the flying item from list
              setFlies(prev => prev.filter(f => f.id !== fly.id));
            }}
            className="absolute w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center shadow-xl border-2 border-white"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden bg-white flex items-center justify-center">
              <MenuIcon item={fly.item} size={20} />
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Hidden template for PDF Generation & Native Print */}
      <div className="print-only-container" style={{ position: 'absolute', top: '-9999px', left: '-9999px', width: '794px', zIndex: -100, pointerEvents: 'none' }}>
        {/* Page 1 */}
        <div id="pdf-page-1" className="print-page bg-[#FAF7F2] w-[794px] h-[1123px] relative p-10 flex flex-col justify-between border-[12px] border-[#450a0a] text-stone-900 font-serif">
          {/* Gold Decorative Corner Brackets */}
          <div className="absolute top-3 left-3 w-8 h-8 border-t-4 border-l-4 border-amber-500" />
          <div className="absolute top-3 right-3 w-8 h-8 border-t-4 border-r-4 border-amber-500" />
          <div className="absolute bottom-3 left-3 w-8 h-8 border-b-4 border-l-4 border-amber-500" />
          <div className="absolute bottom-3 right-3 w-8 h-8 border-b-4 border-r-4 border-amber-500" />
          
          <div className="flex-grow flex flex-col">
            {/* Header Stamp & Title */}
            <div className="text-center border-b-2 border-amber-500/30 pb-4 mb-6 relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-12 border-2 border-red-700/20 rounded-full flex items-center justify-center font-bold text-red-700/20 text-xs tracking-tight select-none">
                RM SEGAR
              </div>
              <h1 className="text-3xl font-extrabold tracking-widest text-[#450a0a]">RUMAH MAKAN SEGAR</h1>
              <p className="text-xs uppercase tracking-widest text-amber-700 font-sans font-bold mt-1">
                Katalog Menu Utama • Main Menu • 鮮館主菜单
              </p>
              <p className="text-[10px] text-stone-500 font-sans italic mt-1">Cita Rasa Autentik Kalimantan Barat (Sambas)</p>
            </div>

            {/* Dishes Layout */}
            <div className="space-y-6 flex-grow">
              {/* Category: BAKMIE */}
              <div>
                <h3 className="text-xs uppercase font-extrabold tracking-wider bg-[#450a0a] text-amber-100 px-3 py-1 inline-block rounded mb-2 font-sans">
                  1. BAKMIE (Noodles / 手工肉面)
                </h3>
                <div className="space-y-1">
                  {MENU_ITEMS.filter(item => item.category === 'Bakmie').map(item => renderPDFMenuItem(item))}
                </div>
              </div>

              {/* Category: KWETIAO */}
              <div>
                <h3 className="text-xs uppercase font-extrabold tracking-wider bg-[#450a0a] text-amber-100 px-3 py-1 inline-block rounded mb-2 font-sans">
                  2. KWETIAO (Flat Rice Noodles / 镬气粿条)
                </h3>
                <div className="space-y-1">
                  {MENU_ITEMS.filter(item => item.category === 'Kwetiao').map(item => renderPDFMenuItem(item))}
                </div>
              </div>

              {/* Category: NASI */}
              <div>
                <h3 className="text-xs uppercase font-extrabold tracking-wider bg-[#450a0a] text-amber-100 px-3 py-1 inline-block rounded mb-2 font-sans">
                  3. HIDANGAN NASI (Rice Dishes / 经典饭食)
                </h3>
                <div className="space-y-1">
                  {MENU_ITEMS.filter(item => item.category === 'Nasi').map(item => renderPDFMenuItem(item))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Page 1 */}
          <div className="text-center pt-2 border-t border-stone-200 text-[10px] text-stone-400 font-sans flex justify-between items-center">
            <span>RM Segar Sambas — Digital Menu Catalog (Priceless)</span>
            <span className="font-semibold text-amber-700 font-serif">Halaman 1 / 2</span>
          </div>
        </div>

        {/* Page 2 */}
        <div id="pdf-page-2" className="print-page bg-[#FAF7F2] w-[794px] h-[1123px] relative p-10 flex flex-col justify-between border-[12px] border-[#450a0a] text-stone-900 font-serif">
          {/* Gold Decorative Corner Brackets */}
          <div className="absolute top-3 left-3 w-8 h-8 border-t-4 border-l-4 border-amber-500" />
          <div className="absolute top-3 right-3 w-8 h-8 border-t-4 border-r-4 border-amber-500" />
          <div className="absolute bottom-3 left-3 w-8 h-8 border-b-4 border-l-4 border-amber-500" />
          <div className="absolute bottom-3 right-3 w-8 h-8 border-b-4 border-r-4 border-amber-500" />
          
          <div className="flex-grow flex flex-col justify-between">
            {/* Upper half: Drinks */}
            <div className="space-y-4">
              <div className="text-center border-b-2 border-amber-500/30 pb-4 mb-6">
                <h2 className="text-2xl font-bold tracking-widest text-[#450a0a]">MINUMAN SEGAR</h2>
                <p className="text-xs uppercase tracking-widest text-amber-700 font-sans font-bold mt-0.5">
                  Beverages • 清凉饮品
                </p>
              </div>

              <div>
                <h3 className="text-xs uppercase font-extrabold tracking-wider bg-[#450a0a] text-amber-100 px-3 py-1 inline-block rounded mb-2 font-sans">
                  4. ANEKA MINUMAN (Beverages / 饮料)
                </h3>
                <div className="space-y-1">
                  {MENU_ITEMS.filter(item => item.category === 'Minuman').map(item => renderPDFMenuItem(item))}
                </div>
              </div>
            </div>

            {/* Lower half: Story and address */}
            <div className="mt-8 border-t-2 border-amber-500/20 pt-6 space-y-4">
              <div className="bg-stone-100/60 p-5 rounded-2xl border border-stone-200/50">
                <h4 className="text-sm font-extrabold tracking-wider text-[#450a0a] mb-2 font-sans uppercase">
                  Tentang Rumah Makan Segar • Our Story • 关于我们
                </h4>
                <div className="text-[10px] text-stone-600 font-sans leading-relaxed space-y-2">
                  <p>
                    <span className="font-bold text-[#450a0a]">ID:</span> RM Segar menyajikan hidangan autentik khas Sambas, Kalimantan Barat sejak turun-temurun. Dibuat dengan resep legendaris rahasia keluarga dan bahan-bahan segar berkualitas tinggi demi cita rasa gurih legendaris yang tiada duanya.
                  </p>
                  <p>
                    <span className="font-bold text-stone-700">EN:</span> RM Segar serves authentic West Kalimantan Chinese culinary legacy from generation to generation. Made with legendary secret family recipes and high-quality fresh ingredients for an unparalleled authentic taste.
                  </p>
                  <p>
                    <span className="font-bold text-red-800">ZH:</span> 鲜馆 (RM Segar) 世代传承正宗西加里曼丹三发县经典中餐美食，采用家族秘制配方与上等新鲜食材，为您呈献绝无仅有的极致风味。
                  </p>
                </div>
              </div>

              {/* Warnings and Info */}
              <div className="bg-red-50 p-4 rounded-xl border border-red-200 flex items-start gap-3">
                <span className="text-red-600 text-lg">⚠️</span>
                <div className="text-[10px] text-red-900 leading-normal font-sans font-medium space-y-0.5">
                  <p><span className="font-bold">INFORMASI PENTING (ID):</span> Menu kami mengandung bahan-bahan Non-Halal.</p>
                  <p><span className="font-bold">IMPORTANT NOTICE (EN):</span> Our menu contains non-halal ingredients.</p>
                  <p><span className="font-bold">重要提示 (ZH):</span> 我们的菜单包含非清真 (Non-Halal) 食材。</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Page 2 */}
          <div className="text-center pt-4 border-t border-stone-200 text-[10px] text-stone-400 font-sans flex justify-between items-center mt-6">
            <span>Sajian Legendaris Sambas, Kalimantan Barat • Hubungi kami di WhatsApp</span>
            <span className="font-semibold text-amber-700 font-serif">Halaman 2 / 2</span>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
