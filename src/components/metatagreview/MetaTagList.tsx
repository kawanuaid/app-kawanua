import type { MetaTagData } from "@/lib/metaParser";
import { Badge } from "@/components/ui/badge";

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  good: {
    label: "✓",
    className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  },
  warning: {
    label: "!",
    className: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  },
  missing: {
    label: "✕",
    className: "bg-red-500/15 text-red-400 border-red-500/30",
  },
};

function getStatus(value: string, key: string): keyof typeof STATUS_CONFIG {
  if (!value) return "missing";
  if (key === "title" && (value.length > 60 || value.length < 10))
    return "warning";
  if (key === "description" && (value.length > 160 || value.length < 50))
    return "warning";
  return "good";
}

const ESSENTIAL_TAGS = [
  { key: "title", label: "Title" },
  { key: "description", label: "Description" },
  { key: "keywords", label: "Keywords" },
  { key: "author", label: "Author" },
  { key: "language", label: "Language" },
  { key: "canonical", label: "Canonical URL" },
  { key: "robots", label: "Robots" },
  { key: "viewport", label: "Viewport" },
  { key: "ogTitle", label: "og:title" },
  { key: "ogDescription", label: "og:description" },
  { key: "ogImage", label: "og:image" },
  { key: "ogUrl", label: "og:url" },
  { key: "ogLocale", label: "og:locale" },
  { key: "twitterCard", label: "twitter:card" },
  { key: "twitterTitle", label: "twitter:title" },
  { key: "twitterDescription", label: "twitter:description" },
  { key: "twitterImage", label: "twitter:image" },
] as const;

export const MetaTagList = ({ data }: { data: MetaTagData }) => {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
        Meta Tags Audit
      </h3>
      <div className="rounded-lg border border-border bg-card overflow-hidden divide-y divide-border">
        {ESSENTIAL_TAGS.map(({ key, label }) => {
          const value = data[key as keyof MetaTagData] as string;
          const status = getStatus(value, key);
          const cfg = STATUS_CONFIG[status];
          return (
            <div key={key} className="flex items-start gap-3 px-4 py-3">
              <Badge
                variant="outline"
                className={`mt-0.5 text-[10px] font-mono w-5 h-5 flex items-center justify-center p-0 shrink-0 ${cfg.className}`}
              >
                {cfg.label}
              </Badge>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-mono text-muted-foreground">
                  {label}
                </p>
                <p className="text-sm text-foreground break-all line-clamp-2">
                  {value || (
                    <span className="text-muted-foreground italic">
                      Not set
                    </span>
                  )}
                </p>
                {value && (key === "title" || key === "description") && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {value.length} chars
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
