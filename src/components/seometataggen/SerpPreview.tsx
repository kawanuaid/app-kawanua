import { MetaData } from "@/types/seometatag";
import { Monitor, Smartphone } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function SerpPreview({ meta }: { meta: MetaData }) {
  const title = meta.title || "Page Title";
  const desc = meta.description || "Page description will appear here...";
  const url = meta.canonicalUrl || "https://www.example.com/page";
  let displayUrl = url;
  try {
    const u = new URL(url);
    displayUrl = u.hostname + u.pathname.replace(/\/$/, "");
  } catch {
    // keep original
  }

  return (
    <div className="rounded-xl border border-border bg-white p-5 space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
        <Monitor className="w-4 h-4 text-primary" />
        Tampilan Google Search
      </div>
      <Separator />
      <div className="space-y-1">
        <p className="text-sm text-green-700 truncate">{displayUrl}</p>
        <h3 className="text-xl text-blue-700 hover:underline cursor-pointer truncate leading-snug font-normal">
          {title}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
          {desc}
        </p>
      </div>
      <Separator />
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <Smartphone className="w-3.5 h-3.5" />
          Tampilan Mobile
        </div>
        <div className="max-w-[320px] rounded-lg border border-border p-3 bg-gray-50 space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-gray-300 flex-shrink-0" />
            <p className="text-xs text-gray-500 truncate">{displayUrl}</p>
          </div>
          <h4 className="text-base text-blue-700 leading-snug truncate font-normal">
            {title}
          </h4>
          <p className="text-xs text-gray-600 line-clamp-2">{desc}</p>
        </div>
      </div>
    </div>
  );
}
