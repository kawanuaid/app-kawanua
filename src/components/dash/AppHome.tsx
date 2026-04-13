import { useState } from "react";
import { Link } from "react-router-dom";
import { data } from "@/lib/data";
import {
  KeyRound,
  LucideIcon,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
  "/favicon-generator": {
    accent: "from-pink-500/20 to-fuchsia-500/10 border-pink-500/30",
    description: "Buat favicon untuk website Anda dengan mudah dan cepat.",
  },
  "/seo-metatag-generator": {
    accent: "from-pink-500/20 to-fuchsia-500/10 border-pink-500/30",
    description:
      "Buat meta tag yang optimal untuk SEO website Anda dengan mudah dan cepat.",
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
  "/unit-converters": {
    accent: "from-sky-500/20 to-cyan-500/10 border-sky-500/30",
    description: "Konversi berbagai jenis satuan dalam satu platform.",
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
  cover?: string;
}

export default function AppHome() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

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

  const totalPages = Math.ceil(filteredApps.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedApps = filteredApps.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

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
            onChange={handleSearchChange}
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
        {paginatedApps.map((app) => {
          const meta = appMeta[app.url] ?? defaultMeta;
          const Icon = app.icon ?? KeyRound;

          return (
            <Link key={app.url} to={app.url}>
              <article id={"card" + app.url.replace("/", "-")}>
                <Card
                  className={cn(
                    "group relative flex flex-col justify-end overflow-hidden rounded-xl border min-h-[250px] p-5",
                    "transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
                    meta.accent.match(/border-\\S+/g)?.join(" ") ||
                      "border-border",
                  )}
                >
                  {/* Background Image Layer */}
                  {app.cover && (
                    <div
                      className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                      style={{ backgroundImage: `url('${app.cover}')` }}
                    />
                  )}

                  {/* Accent Gradient Overlay */}
                  {/* <div
                    className={cn(
                      "absolute inset-0 z-0 bg-gradient-to-br opacity-60 transition-opacity duration-300 group-hover:opacity-80",
                      meta.accent.replace(/border-\\S+/g, "").trim(),
                    )}
                  /> */}

                  {/* Bottom-to-Top Gradient Overlay for Text Readability */}
                  {/* <div className="absolute inset-0 z-0 bg-gradient-to-t from-background via-background/90 to-background/10" /> */}
                  <div className="absolute inset-0 z-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/10" />

                  {/* Content Layer */}
                  <div className="relative z-10 flex flex-col gap-3 mt-auto">
                    {/* <div className="flex w-10 h-10 items-center justify-center rounded-lg bg-background backdrop-blur-md border border-border/50 shadow-sm group-hover:scale-110 group-hover:bg-background transition-all duration-300"> */}
                    <div
                      className={cn(
                        "flex w-10 h-10 items-center justify-center rounded-lg bg-gradient-to-br backdrop-blur-md border border-border/50 shadow-sm group-hover:scale-110 bg-background transition-all duration-300",
                        meta.accent,
                      )}
                    >
                      <Icon className="size-5 text-foreground" />
                    </div>
                    <CardHeader className="flex flex-col gap-0.5 p-0">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 drop-shadow-sm">
                        {app.category}
                      </span>
                      <CardTitle className="leading-tight text-lg text-slate-100 drop-shadow-sm">
                        {app.title}
                      </CardTitle>
                      <CardDescription className="leading-snug text-slate-200/70 line-clamp-2">
                        {(appMeta[app.url] ?? defaultMeta).description}
                      </CardDescription>
                    </CardHeader>
                  </div>
                </Card>
              </article>
            </Link>
            // <Link
            //   key={app.url}
            //   to={app.url}
            //   className="link-card overflow-hidden translate-y-0 hover:-translate-y-[2px] transition-all duration-200 rounded-lg relative"
            // >
            //   <article className={"card" + app.url.replace("/", "-")}>
            //     <Card
            //       className={cn(
            //         "group flex flex-col md:flex-row gap-4 rounded-xl border border-primary bg-slate-100 bg-gradient-to-br p-5",
            //         // "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg",
            //         // meta.accent,
            //       )}
            //     >
            //       <div className="flex w-1/6 size-12 items-center justify-center rounded-lg bg-background/60 backdrop-blur-sm border border-border/50 shadow-sm group-hover:scale-110 transition-transform duration-200">
            //         <Icon className="size-6 text-foreground" />
            //       </div>
            //       <CardHeader className="flex w-5/6 flex-col gap-0.5 p-0">
            //         <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            //           {app.category}
            //         </span>
            //         <CardTitle className="leading-tight">{app.title}</CardTitle>
            //         <CardDescription className="leading-snug">
            //           {(appMeta[app.url] ?? defaultMeta).description}
            //         </CardDescription>
            //       </CardHeader>
            //     </Card>
            //   </article>
            // </Link>
          );
        })}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <div className="flex items-center gap-2 px-4 text-sm font-medium">
            Halaman {currentPage} dari {totalPages}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
