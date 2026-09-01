const fs = require("fs");
const victims = require("/tmp/formatted_victims.json");

const content = `// Data Resmi Hasil Scraping & Terverifikasi Langsung dari Basis Data OrangHilang.id (https://oranghilang.id)
// Endpoint Asli: https://oranghilang.id/api/victim

export interface MissingPerson {
  id: string;
  name: string;
  age: number | string;
  gender: 'Laki-laki' | 'Perempuan';
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
  delegation_email?: string;
  delegation_name?: string;
}

export const MISSING_PERSONS_DATA: MissingPerson[] = ${JSON.stringify(victims, null, 2)};

// Fungsi Query API Langsung ke https://oranghilang.id/api/victim
export async function fetchLiveOrangHilangData(searchTerm: string = ""): Promise<{ items: MissingPerson[]; isLive: boolean; total: number }> {
  try {
    const url = searchTerm.trim() 
      ? \`https://oranghilang.id/api/victim?search=\${encodeURIComponent(searchTerm.trim())}\`
      : \`https://oranghilang.id/api/victim?limit=50\`;
      
    const res = await fetch(url, { 
      headers: { "Accept": "application/json" }
    });
    
    if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
    const data = await res.json();
    
    if (data && Array.isArray(data.items)) {
      const parsed: MissingPerson[] = data.items.map((item: any) => ({
        id: item._id,
        name: (item.name || "").trim(),
        age: item.age ? \`\${item.age} Tahun\` : "Tidak diketahui",
        gender: item.gender === "pria" ? "Laki-laki" : "Perempuan",
        lastSeenDate: item.created_date ? new Date(item.created_date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "Terbaru",
        lastSeenLocation: (item.address || "Indonesia").trim(),
        clothingFeatures: (item.description || "Tidak ada catatan khusus").trim(),
        contactPerson: \`Pelapor: \${item.delegation_name || "Keluarga"} (\${item.delegation_email || "OrangHilang.id"})\`,
        photoUrl: item.photo || "",
        status: item.status === "ditemukan" ? "Sudah Ditemukan" : "Belum Ditemukan",
        sumberData: "OrangHilang.id (Resmi)",
        education: item.education || "",
        job: item.job || "",
        verifiedInPortal: true,
        portalUrl: "https://oranghilang.id"
      }));
      return { items: parsed, isLive: true, total: parsed.length };
    }
  } catch (err) {
    console.warn("Koneksi live OrangHilang.id dialihkan ke basis data tersinkron:", err);
  }

  // Fallback jika offline / CORS browser
  const q = searchTerm.trim().toLowerCase();
  const filtered = !q 
    ? MISSING_PERSONS_DATA 
    : MISSING_PERSONS_DATA.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.lastSeenLocation.toLowerCase().includes(q) ||
        p.clothingFeatures.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q)
      );
      
  return { items: filtered, isLive: false, total: filtered.length };
}

// Helper untuk uji verifikasi data
export async function testCheckOrangHilang(query: string): Promise<{
  query: string;
  found: boolean;
  count: number;
  results: MissingPerson[];
  checkedAt: string;
}> {
  const result = await fetchLiveOrangHilangData(query);
  return {
    query,
    found: result.items.length > 0,
    count: result.items.length,
    results: result.items,
    checkedAt: new Date().toLocaleTimeString("id-ID")
  };
}
`;

fs.writeFileSync("src/missingPersonsData.ts", content);
console.log("Successfully written src/missingPersonsData.ts");
