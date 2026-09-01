const fs = require("fs");

async function main() {
  const res = await fetch("https://oranghilang.id/api/victim?limit=100");
  const data = await res.json();
  const items = data.items || [];

  const mapped = items.map(item => ({
    id: item._id,
    name: (item.name || "").trim(),
    age: item.age ? `${item.age} Tahun` : "Tidak diketahui",
    gender: item.gender === "pria" ? "Laki-laki" : "Perempuan",
    lastSeenDate: item.created_date ? new Date(item.created_date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "Terbaru",
    lastSeenLocation: (item.address || "Indonesia").trim(),
    clothingFeatures: (item.description || "Tidak ada catatan khusus").trim(),
    contactPerson: `Pelapor: ${item.delegation_name || "Keluarga"} (${item.delegation_email || "OrangHilang.id"})`,
    photoUrl: item.photo || "",
    status: item.status === "ditemukan" ? "Sudah Ditemukan" : "Belum Ditemukan",
    sumberData: "OrangHilang.id (Resmi)",
    education: item.education ? item.education.trim() : "",
    job: item.job ? item.job.trim() : "",
    verifiedInPortal: true,
    portalUrl: "https://oranghilang.id"
  }));

  console.log("Total real victims fetched:", mapped.length);

  const fileContent = `// Basis Data Resmi Disinkronkan Langsung dari OrangHilang.id (https://oranghilang.id)
// Endpoint Resmi: https://oranghilang.id/api/victim

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
}

export const MISSING_PERSONS_DATA: MissingPerson[] = ${JSON.stringify(mapped, null, 2)};

// Fungsi pencarian live ke portal OrangHilang.id dengan fallback data tersinkron
export async function searchOrangHilangLive(searchTerm: string = ""): Promise<{
  items: MissingPerson[];
  isLive: boolean;
  total: number;
  testedQuery: string;
}> {
  const term = searchTerm.trim();
  try {
    const url = term 
      ? \`https://oranghilang.id/api/victim?search=\${encodeURIComponent(term)}\`
      : \`https://oranghilang.id/api/victim?limit=50\`;
    const res = await fetch(url, { headers: { "Accept": "application/json" } });
    if (res.ok) {
      const json = await res.json();
      if (json && Array.isArray(json.items)) {
        const liveItems: MissingPerson[] = json.items.map((it: any) => ({
          id: it._id,
          name: (it.name || "").trim(),
          age: it.age ? \`\${it.age} Tahun\` : "Tidak diketahui",
          gender: it.gender === "pria" ? "Laki-laki" : "Perempuan",
          lastSeenDate: it.created_date ? new Date(it.created_date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "Terbaru",
          lastSeenLocation: (it.address || "Indonesia").trim(),
          clothingFeatures: (it.description || "Tidak ada catatan khusus").trim(),
          contactPerson: \`Pelapor: \${it.delegation_name || "Keluarga"} (\${it.delegation_email || "OrangHilang.id"})\`,
          photoUrl: it.photo || "",
          status: it.status === "ditemukan" ? "Sudah Ditemukan" : "Belum Ditemukan",
          sumberData: "OrangHilang.id (Resmi)",
          education: it.education ? it.education.trim() : "",
          job: it.job ? it.job.trim() : "",
          verifiedInPortal: true,
          portalUrl: "https://oranghilang.id"
        }));
        return { items: liveItems, isLive: true, total: liveItems.length, testedQuery: term };
      }
    }
  } catch (e) {
    console.warn("Live API fetch fallback to cached OrangHilang.id list:", e);
  }

  // Filter dari dataset lokal jika offline/network timeout
  const q = term.toLowerCase();
  const filtered = !q 
    ? MISSING_PERSONS_DATA 
    : MISSING_PERSONS_DATA.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.lastSeenLocation.toLowerCase().includes(q) ||
        p.clothingFeatures.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q)
      );

  return { items: filtered, isLive: false, total: filtered.length, testedQuery: term };
}
`;

  fs.writeFileSync("src/missingPersonsData.ts", fileContent, "utf8");
  console.log("Successfully updated src/missingPersonsData.ts with all official OrangHilang.id records!");
}

main().catch(console.error);
