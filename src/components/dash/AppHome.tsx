import { useState } from "react";
import { Link } from "react-router-dom";
import { data } from "@/lib/data";
import { KeyRound, LucideIcon, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

// Map URL path to accent color and description (icon diambil dari data.ts)
const appMeta: Record<string, { accent: string; description: string }> = {
  "/image-optimizer": {
    accent: "from-violet-500/20 to-purple-500/10 border-violet-500/30",
    description: "Kompres & optimalkan gambar langsung di browser.",
  },
  "/color-palette-picker": {
    accent: "from-violet-500/20 to-purple-500/10 border-violet-500/30",
    description: "Ekstrak palette warna secara mudah dan cepat dari gambar.",
  },
  "/passgen": {
    accent: "from-amber-500/20 to-yellow-500/10 border-amber-500/30",
    description: "Buat password kuat & acak secara instan.",
  },
  "/passcheck": {
    accent: "from-amber-500/20 to-yellow-500/10 border-amber-500/30",
    description: "Cek apakah password kamu pernah bocor.",
  },
  "/uuidgen": {
    accent: "from-sky-500/20 to-cyan-500/10 border-sky-500/30",
    description: "Generate UUID dari teks atau URL apapun.",
  },
  "/qrcode": {
    accent: "from-sky-500/20 to-cyan-500/10 border-sky-500/30",
    description: "Generate QR code dari teks atau URL apapun.",
  },
  "/hashgen": {
    accent: "from-sky-500/20 to-cyan-500/10 border-sky-500/30",
    description: "Generate hash dari teks atau URL apapun.",
  },
  "/domainlookup": {
    accent: "from-pink-500/20 to-fuchsia-500/10 border-pink-500/30",
    description: "Cek ketersediaan domain dan informasi registrar.",
  },
  "/base64": {
    accent: "from-sky-500/20 to-cyan-500/10 border-sky-500/30",
    description: "Encode dan decode base64 dari teks atau URL apapun.",
  },
  "/timestamp": {
    accent: "from-sky-500/20 to-cyan-500/10 border-sky-500/30",
    description: "Konversi tanggal dan waktu ke format timestamp.",
  },
  "/jsoncsv": {
    accent: "from-sky-500/20 to-cyan-500/10 border-sky-500/30",
    description: "Konversi JSON ke CSV dan sebaliknya.",
  },
  "/regex-tester": {
    accent: "from-sky-500/20 to-cyan-500/10 border-sky-500/30",
    description: "Uji ekspresi reguler Anda secara real-time.",
  },
  "/filechecksum": {
    accent: "from-sky-500/20 to-cyan-500/10 border-sky-500/30",
    description: "Generate checksum dari file.",
  },
  "/markdown-preview": {
    accent: "from-sky-500/20 to-cyan-500/10 border-sky-500/30",
    description: "Tampilkan hasil markdown secara real-time.",
  },
  "/jwtdecoder": {
    accent: "from-amber-500/20 to-yellow-500/10 border-amber-500/30",
    description: "Decode, analisis dan verifikasi JSON Web Tokens.",
  },
  "/meta-tag-preview": {
    accent: "from-pink-500/20 to-fuchsia-500/10 border-pink-500/30",
    description: "Review meta tag dari URL apapun.",
  },
  "/pagespeed": {
    accent: "from-pink-500/20 to-fuchsia-500/10 border-pink-500/30",
    description:
      "Analisis performa website Anda, aksesibilitas, dan SEO dalam hitungan detik.",
  },
  "/color-converter": {
    accent: "from-violet-500/20 to-purple-500/10 border-violet-500/30",
    description: "Konversi warna antara HEX, RGB, HSL, OKLCH, HWB, CMYK.",
  },
  "/bmi-calculator": {
    accent: "from-emerald-500/20 to-green-500/10 border-emerald-500/30",
    description: "Kalkulator BMI untuk menghitung indeks massa tubuh.",
  },
};

const defaultMeta = {
  accent: "from-muted/50 to-muted/10 border-muted-foreground/20",
  description: "Buka aplikasi ini untuk mulai menggunakannya.",
};

interface AppItem {
  title: string;
  url: string;
  isActive?: boolean;
  icon?: LucideIcon;
}

export default function AppHome() {
  const [searchQuery, setSearchQuery] = useState("");

  // Flatten all navMain items into a single list and sort A-Z
  const allApps: (AppItem & { category: string })[] = data.navMain
    .flatMap((group) =>
      (group.items ?? []).map((item) => ({
        ...item,
        category: group.title,
      })),
    )
    .sort((a, b) => a.title.localeCompare(b.title));

  const filteredApps = allApps.filter((app) => {
    const searchLower = searchQuery.toLowerCase();
    const meta = appMeta[app.url] ?? defaultMeta;
    return (
      app.title.toLowerCase().includes(searchLower) ||
      app.category.toLowerCase().includes(searchLower) ||
      meta.description.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="p-6 h-full">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Selamat Datang 👋
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Pilih aplikasi di bawah untuk mulai bekerja.
          </p>
        </div>
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 z-10 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Cari aplikasi, kategori..."
            className="w-full pl-9 bg-background/60 backdrop-blur-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Cards Grid */}
      {filteredApps.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center rounded-xl border border-dashed bg-muted/30">
          <Search className="size-8 text-muted-foreground/50 mb-3" />
          <h3 className="text-lg font-medium">Aplikasi tidak ditemukan</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Tidak ada aplikasi yang cocok dengan pencarian &quot;{searchQuery}
            &quot;.
          </p>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredApps.map((app) => {
          const meta = appMeta[app.url] ?? defaultMeta;
          const Icon = app.icon ?? KeyRound;

          return (
            <Link key={app.url} to={app.url}>
              <Card
                className={cn(
                  "group flex flex-col md:flex-row gap-4 rounded-xl border bg-gradient-to-br p-5",
                  "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg",
                  meta.accent,
                )}
              >
                <div className="flex w-1/6 size-12 items-center justify-center rounded-lg bg-background/60 backdrop-blur-sm border border-border/50 shadow-sm group-hover:scale-110 transition-transform duration-200">
                  <Icon className="size-6 text-foreground" />
                </div>
                <CardHeader className="flex w-5/6 flex-col gap-0.5 p-0">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    {app.category}
                  </span>
                  <CardTitle className="leading-tight">{app.title}</CardTitle>
                  <CardDescription className="leading-snug">
                    {(appMeta[app.url] ?? defaultMeta).description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
