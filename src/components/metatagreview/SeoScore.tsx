import type { MetaTagData } from "@/lib/metaParser";
import { Progress } from "@/components/ui/progress";

const CRITERIA = [
  // Core (30pts) — paling kritis untuk SEO on-page
  {
    key: "title",
    label: "Title",
    weight: 15,
    validate: (v: string) =>
      v.length >= 10 && v.length <= 60 ? 1 : v ? 0.5 : 0,
  },
  {
    key: "description",
    label: "Description",
    weight: 15,
    validate: (v: string) =>
      v.length >= 50 && v.length <= 160 ? 1 : v ? 0.5 : 0,
  },
  // Social Graph (30pts) — pengaruh besar untuk CTR & sharing
  {
    key: "ogImage",
    label: "og:image",
    weight: 12,
    validate: (v: string) => (v ? 1 : 0),
  },
  {
    key: "ogTitle",
    label: "og:title",
    weight: 10,
    validate: (v: string) => (v ? 1 : 0),
  },
  {
    key: "ogDescription",
    label: "og:description",
    weight: 8,
    validate: (v: string) => (v ? 1 : 0),
  },
  // Technical (24pts) — sinyal teknis ke crawler
  {
    key: "canonical",
    label: "Canonical URL",
    weight: 8,
    validate: (v: string) => (v ? 1 : 0),
  },
  {
    key: "twitterCard",
    label: "twitter:card",
    weight: 6,
    validate: (v: string) => (v ? 1 : 0),
  },
  {
    key: "robots",
    label: "Robots",
    weight: 5,
    validate: (v: string) => (v ? 1 : 0),
  },
  {
    key: "viewport",
    label: "Viewport",
    weight: 5,
    validate: (v: string) => (v ? 1 : 0),
  },
  // Secondary (10pts) — pelengkap social card
  {
    key: "ogUrl",
    label: "og:url",
    weight: 3,
    validate: (v: string) => (v ? 1 : 0),
  },
  {
    key: "twitterTitle",
    label: "twitter:title",
    weight: 3,
    validate: (v: string) => (v ? 1 : 0),
  },
  {
    key: "twitterDescription",
    label: "twitter:description",
    weight: 2,
    validate: (v: string) => (v ? 1 : 0),
  },
  {
    key: "twitterImage",
    label: "twitter:image",
    weight: 2,
    validate: (v: string) => (v ? 1 : 0),
  },
  // Supplementary (6pts) — konteks tambahan
  {
    key: "keywords",
    label: "Keywords",
    weight: 3,
    validate: (v: string) => (v ? 1 : 0),
  },
  {
    key: "author",
    label: "Author",
    weight: 2,
    validate: (v: string) => (v ? 1 : 0),
  },
  {
    key: "ogLocale",
    label: "og:locale",
    weight: 1,
    validate: (v: string) => (v ? 1 : 0),
  },
] as const; // total bobot: 100

function getScoreColor(score: number) {
  if (score >= 80)
    return {
      text: "text-emerald-400",
      bg: "bg-emerald-500",
      label: "Sangat Baik",
    };
  if (score >= 60)
    return { text: "text-amber-400", bg: "bg-amber-500", label: "Cukup Baik" };
  if (score >= 40)
    return {
      text: "text-orange-400",
      bg: "bg-orange-500",
      label: "Perlu Perbaikan",
    };
  return { text: "text-red-400", bg: "bg-red-500", label: "Buruk" };
}

export const SeoScore = ({ data }: { data: MetaTagData }) => {
  const score = Math.round(
    CRITERIA.reduce((sum, c) => {
      const value = data[c.key as keyof MetaTagData] as string;
      return sum + c.validate(value || "") * c.weight;
    }, 0),
  );

  const { text, bg, label } = getScoreColor(score);
  const passed = CRITERIA.filter(
    (c) => c.validate((data[c.key as keyof MetaTagData] as string) || "") === 1,
  ).length;
  const warnings = CRITERIA.filter((c) => {
    const v = c.validate((data[c.key as keyof MetaTagData] as string) || "");
    return v > 0 && v < 1;
  }).length;
  const missing = CRITERIA.filter(
    (c) => c.validate((data[c.key as keyof MetaTagData] as string) || "") === 0,
  ).length;

  return (
    <div className="rounded-lg border border-border bg-card p-6 space-y-5">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
        Skor SEO
      </h3>

      <div className="flex items-center gap-6">
        <div className="relative w-24 h-24 shrink-0">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              strokeWidth="8"
              className="stroke-muted/30"
            />
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              strokeWidth="8"
              strokeLinecap="round"
              className={`${bg.replace("bg-", "stroke-")} transition-all duration-700`}
              strokeDasharray={`${score * 2.64} 264`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-2xl font-bold font-mono ${text}`}>
              {score}
            </span>
            <span className="text-[10px] text-muted-foreground">/100</span>
          </div>
        </div>

        <div className="flex-1 space-y-3">
          <p className={`text-sm font-semibold ${text}`}>{label}</p>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-muted-foreground">
              <span>Lengkap</span>
              <span className="text-emerald-400 font-mono">{passed}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Peringatan</span>
              <span className="text-amber-400 font-mono">{warnings}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Tidak ada</span>
              <span className="text-red-400 font-mono">{missing}</span>
            </div>
          </div>
        </div>
      </div>

      <Progress
        value={score}
        className="h-2 bg-muted/30 [&>div]:transition-all [&>div]:duration-700"
        style={{ ["--tw-bg-opacity" as string]: 1 }}
      />
    </div>
  );
};
