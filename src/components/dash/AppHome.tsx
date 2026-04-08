import { Link } from "react-router-dom";
import { data } from "@/lib/data";
import { KeyRound, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Map URL path to accent color and description (icon diambil dari data.ts)
const appMeta: Record<string, { accent: string; description: string }> = {
  "/image-optimizer": {
    accent: "from-violet-500/20 to-purple-500/10 border-violet-500/30",
    description: "Kompres & optimalkan gambar langsung di browser.",
  },
  "/passgen": {
    accent: "from-amber-500/20 to-yellow-500/10 border-amber-500/30",
    description: "Buat password kuat & acak secara instan.",
  },
  "/passcheck": {
    accent: "from-amber-500/20 to-yellow-500/10 border-amber-500/30",
    description: "Cek apakah password kamu pernah bocor.",
  },
  "/qrcode": {
    accent: "from-sky-500/20 to-cyan-500/10 border-sky-500/30",
    description: "Generate QR code dari teks atau URL apapun.",
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
  // Flatten all navMain items into a single list
  const allApps: (AppItem & { category: string })[] = data.navMain.flatMap(
    (group) =>
      (group.items ?? []).map((item) => ({
        ...item,
        category: group.title,
      })),
  );

  return (
    <div className="p-6 h-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Selamat Datang 👋</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Pilih aplikasi di bawah untuk mulai bekerja.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {allApps.map((app) => {
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
