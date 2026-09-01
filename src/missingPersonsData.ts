// Basis Data Resmi Disinkronkan Langsung dari OrangHilang.id (https://oranghilang.id)
// KATEGORI KHUSUS: ANAK-ANAK & BALITA HILANG (Usia <= 17 Tahun)
// Endpoint Resmi: https://oranghilang.id/api/victim

export interface MissingPerson {
  id: string;
  name: string;
  age: number | string;
  gender: "Laki-laki" | "Perempuan";
  lastSeenDate: string;
  lastSeenLocation: string;
  clothingFeatures: string;
  contactPerson: string;
  photoUrl: string;
  status: string;
  sumberData: string;
  education?: string;
  job?: string;
  verifiedInPortal?: boolean;
  portalUrl?: string;
}

export const MISSING_PERSONS_DATA: MissingPerson[] = [
  {
    "id": "6a900a8f922f87d32decfa75",
    "name": "Samuel",
    "age": "4 Tahun",
    "gender": "Laki-laki",
    "lastSeenDate": "27 Agustus 2026",
    "lastSeenLocation": "Tugu nabire hebat",
    "clothingFeatures": "Hilang dari pengawasan orang tua",
    "contactPerson": "Pelapor: Natalia Putri (putrinatalia55916@gmail.com)",
    "photoUrl": "https://qhn9xp6j3w.ufs.sh/f/oSFRa8DpgSu0xr8kSLvBuSZDUQrl2aWERog1wTmskF4OG6zI",
    "status": "Belum Ditemukan",
    "sumberData": "OrangHilang.id (Kategori Anak)",
    "education": "Belum sekolah",
    "job": "Pelajar / Anak",
    "verifiedInPortal": true,
    "portalUrl": "https://oranghilang.id"
  },
  {
    "id": "69f267fc2894f5beab7da5f1",
    "name": "Marvellino Putra Pratama",
    "age": "12 Tahun",
    "gender": "Laki-laki",
    "lastSeenDate": "29 April 2026",
    "lastSeenLocation": "Sidoarjo, Desa berbek, Kecamatan waru, Kabupaten Sidoarjo",
    "clothingFeatures": "Dari rumah berangkat les. Sampai les jam 16.30 naik gojek berangkatnya. Sampai les letakan tas dan topi dan bergegas beli jajan. rutinitasnya biasanya gitu beli jajan dulu biasanya balik ke tempat les tapi kini tidak kembali ke les",
    "contactPerson": "Pelapor: yuk curhat (yukcurhatyuk45@gmail.com)",
    "photoUrl": "https://qhn9xp6j3w.ufs.sh/f/oSFRa8DpgSu0GbXFPSTz7RlGjnepmCsoEgJcPhbDvqZXy4NF",
    "status": "Belum Ditemukan",
    "sumberData": "OrangHilang.id (Kategori Anak)",
    "education": "SD",
    "job": "Pelajar",
    "verifiedInPortal": true,
    "portalUrl": "https://oranghilang.id"
  },
  {
    "id": "6a488fc723f9a5d2f62dec88",
    "name": "Nayla taniya sarah",
    "age": "14 Tahun",
    "gender": "Perempuan",
    "lastSeenDate": "4 Juli 2026",
    "lastSeenLocation": "Pulau yoni",
    "clothingFeatures": "Keluar dari rumah sekitar jam 7 malam hari jumat, dan sampe jam 12 siang hari sabtu belum datang sampe sekarang",
    "contactPerson": "Pelapor: Tantri Yani (tantriyani259@gmail.com)",
    "photoUrl": "https://qhn9xp6j3w.ufs.sh/f/oSFRa8DpgSu0gf5ZOwFNyTxEK2VarLhWFlcSdb9Qu3veGnHR",
    "status": "Belum Ditemukan",
    "sumberData": "OrangHilang.id (Kategori Anak)",
    "education": "Smp",
    "job": "Pelajar / Anak",
    "verifiedInPortal": true,
    "portalUrl": "https://oranghilang.id"
  },
  {
    "id": "6a0de2ce62934898da75db60",
    "name": "Mutiara Alfandi",
    "age": "15 Tahun",
    "gender": "Perempuan",
    "lastSeenDate": "20 Mei 2026",
    "lastSeenLocation": "Stasiun kereta api Lenteng agung",
    "clothingFeatures": "Sehabis pulang acara keluarga anak tersebut pulang naik kereta naik dari stasiun Lenteng agung dan dari situ sudah tidak ada kabar lagi dari hari Minggu tgl 18 mei jam 8 malem, orang tuanya sudah lapor polisi",
    "contactPerson": "Pelapor: Hamidah “HAMIDAH” work (hamidahwork2@gmail.com)",
    "photoUrl": "https://qhn9xp6j3w.ufs.sh/f/oSFRa8DpgSu0JgrLA4X4NLTfWXjrdiehVvDxAGOZQgKUIC20",
    "status": "Belum Ditemukan",
    "sumberData": "OrangHilang.id (Kategori Anak)",
    "education": "smp",
    "job": "Pelajaran",
    "verifiedInPortal": true,
    "portalUrl": "https://oranghilang.id"
  },
  {
    "id": "69ddd9638c743f31dfd8ff3e",
    "name": "Khansa Rasya azalia Faneya",
    "age": "16 Tahun",
    "gender": "Perempuan",
    "lastSeenDate": "14 April 2026",
    "lastSeenLocation": "alfamart di depan sma Negeri 9 malang",
    "clothingFeatures": "hari minggu pagi tanggal 12 - 04 - 2026. sekolah kami sedang mengadakan jalan pagi. Saat di depan SMA 9 malang rombongan sempat berhenti di sebuah toko jajanan basah setelah itu rombongan di bagi menjadi beberapa sesi ada yang ke alfamart dan ada yang tetap di toko jajanan basah akan tetapi terakhir kali anak tersebut sedang berada di sekitar SMA 9 malang.  ciri ciri: tinggi badan 160, berat 40kg, baju terakhir berwarna hitam berkerudung, hitam lebar dan bersepatu warna putih.",
    "contactPerson": "Pelapor: Kayla Zahara qubilah (kaylazq08@gmail.com)",
    "photoUrl": "https://qhn9xp6j3w.ufs.sh/f/oSFRa8DpgSu0GiCZpQz7RlGjnepmCsoEgJcPhbDvqZXy4NFI",
    "status": "Belum Ditemukan",
    "sumberData": "OrangHilang.id (Kategori Anak)",
    "education": "SMA",
    "job": "PELAJAR",
    "verifiedInPortal": true,
    "portalUrl": "https://oranghilang.id"
  },
  {
    "id": "6a57dc885ac1df0836f9fa4d",
    "name": "Alfira arum rahmadani",
    "age": "16 Tahun",
    "gender": "Perempuan",
    "lastSeenDate": "15 Juli 2026",
    "lastSeenLocation": "Baleendah",
    "clothingFeatures": "Hilang dari rumah tanpa sebab",
    "contactPerson": "Pelapor: Godhelp Stanley (godhelpstanley10@gmail.com)",
    "photoUrl": "https://qhn9xp6j3w.ufs.sh/f/oSFRa8DpgSu0SlA4scg6CHTfizrPpR1Gx8amB5MLkJV3gAjQ",
    "status": "Belum Ditemukan",
    "sumberData": "OrangHilang.id (Kategori Anak)",
    "education": "Smk",
    "job": "Siswa",
    "verifiedInPortal": true,
    "portalUrl": "https://oranghilang.id"
  },
  {
    "id": "6a5e1201f389bdf874498b21",
    "name": "Tirza soewandy",
    "age": "16 Tahun",
    "gender": "Perempuan",
    "lastSeenDate": "20 Juli 2026",
    "lastSeenLocation": "Jalan waru",
    "clothingFeatures": "Dari jam 10 pagi menghilang menggunakan celana pendek adidas",
    "contactPerson": "Pelapor: Mikhael Wang (mikhael78900@gmail.com)",
    "photoUrl": "https://qhn9xp6j3w.ufs.sh/f/oSFRa8DpgSu0GbdHAJFz7RlGjnepmCsoEgJcPhbDvqZXy4NF",
    "status": "Belum Ditemukan",
    "sumberData": "OrangHilang.id (Kategori Anak)",
    "education": "Sma",
    "job": "Tidak ada",
    "verifiedInPortal": true,
    "portalUrl": "https://oranghilang.id"
  },
  {
    "id": "6a89c99e840a700e531ada77",
    "name": "Djatmiko Rasya Saputra",
    "age": "17 Tahun",
    "gender": "Laki-laki",
    "lastSeenDate": "22 Agustus 2026",
    "lastSeenLocation": "Sekitar Wastukencana",
    "clothingFeatures": "Anak berkebutuhan Khusus, autis, kabur dari rumah (linggawastu) sekitar pukul 17.00. Menggunakan pakaian berwarna hijau.",
    "contactPerson": "Pelapor: Sarah Nursyiam (snursyiam@gmail.com)",
    "photoUrl": "https://qhn9xp6j3w.ufs.sh/f/oSFRa8DpgSu05erqc6Mxqs1YRSGM9LVN3JaTI8kcvDFwptyh",
    "status": "Belum Ditemukan",
    "sumberData": "OrangHilang.id (Kategori Anak)",
    "education": "Tidak sekolah",
    "job": "Tidak bekerja",
    "verifiedInPortal": true,
    "portalUrl": "https://oranghilang.id"
  }
];

// Helper: periksa apakah data tergolong anak-anak (usia <= 17)
export function isChildVictim(person: { age?: any; description?: string; education?: string }): boolean {
  if (!person) return false;
  const ageNum = parseInt(String(person.age || "").replace(/[^0-9]/g, ""), 10);
  if (!isNaN(ageNum) && ageNum > 0 && ageNum <= 17) return true;
  const desc = (person.description || "").toLowerCase();
  const edu = (person.education || "").toLowerCase();
  if (edu.includes("sd") || edu.includes("tk") || edu.includes("smp") || edu.includes("belum sekolah") || edu.includes("paud")) return true;
  if (desc.includes("balita") || desc.includes("anak") || desc.includes("bocah") || desc.includes("bayi")) return true;
  return false;
}

// Fungsi pencarian live ke portal OrangHilang.id khusus memfilter data ANAK-ANAK saja
export async function searchOrangHilangLive(searchTerm: string = ""): Promise<{
  items: MissingPerson[];
  isLive: boolean;
  total: number;
  testedQuery: string;
}> {
  const term = searchTerm.trim();
  try {
    const url = term 
      ? `https://oranghilang.id/api/victim?search=${encodeURIComponent(term)}`
      : `https://oranghilang.id/api/victim?limit=50`;
    const res = await fetch(url, { headers: { "Accept": "application/json" } });
    if (res.ok) {
      const json = await res.json();
      if (json && Array.isArray(json.items)) {
        // FILTER HANYA ANAK-ANAK (Usia <= 17 tahun atau indikasi anak/balita/sekolah)
        const childOnlyItems = json.items.filter((it: any) => {
          const ageNum = parseInt(String(it.age || ""), 10);
          return (!isNaN(ageNum) && ageNum > 0 && ageNum <= 17) || isChildVictim(it);
        });

        const liveItems: MissingPerson[] = childOnlyItems.map((it: any) => ({
          id: it._id,
          name: (it.name || "").trim(),
          age: it.age ? `${it.age} Tahun` : "Anak-anak",
          gender: it.gender === "pria" ? "Laki-laki" : "Perempuan",
          lastSeenDate: it.created_date ? new Date(it.created_date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "Terbaru",
          lastSeenLocation: (it.address || "Indonesia").trim(),
          clothingFeatures: (it.description || "Tidak ada catatan khusus").trim(),
          contactPerson: `Pelapor: ${it.delegation_name || "Keluarga"} (${it.delegation_email || "OrangHilang.id"})`,
          photoUrl: it.photo || "",
          status: it.status === "ditemukan" ? "Sudah Ditemukan" : "Belum Ditemukan",
          sumberData: "OrangHilang.id (Kategori Anak)",
          education: it.education ? it.education.trim() : "",
          job: it.job ? it.job.trim() : "Pelajar / Anak",
          verifiedInPortal: true,
          portalUrl: "https://oranghilang.id"
        }));

        if (liveItems.length > 0) {
          return { items: liveItems, isLive: true, total: liveItems.length, testedQuery: term };
        }
      }
    }
  } catch (e) {
    console.warn("Live API fetch fallback to cached OrangHilang.id child list:", e);
  }

  // Filter dari dataset lokal anak-anak jika offline/network timeout
  const q = term.toLowerCase();
  const filtered = !q 
    ? MISSING_PERSONS_DATA 
    : MISSING_PERSONS_DATA.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.lastSeenLocation.toLowerCase().includes(q) ||
        p.clothingFeatures.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.age.toString().toLowerCase().includes(q)
      );
  return { items: filtered, isLive: false, total: filtered.length, testedQuery: term };
}
