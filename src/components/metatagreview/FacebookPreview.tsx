import type { MetaTagData } from "@/lib/metaParser";

export const FacebookPreview = ({ data }: { data: MetaTagData }) => {
  const title = data.ogTitle || data.title || "No title";
  const desc = data.ogDescription || data.description || "No description";
  const siteName = data.siteName || (() => { try { return new URL(data.url).hostname; } catch { return data.url; } })();

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
        Facebook Preview
      </h3>
      <div className="rounded-lg overflow-hidden border border-[hsl(220,6%,83%)] bg-[hsl(220,14%,96%)]">
        {data.ogImage && (
          <div className="aspect-[1.91/1] bg-[hsl(220,10%,88%)] overflow-hidden">
            <img
              src={data.ogImage}
              alt=""
              className="w-full h-full object-cover"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          </div>
        )}
        <div className="p-3 space-y-0.5">
          <p className="text-xs uppercase text-[hsl(0,0%,40%)] tracking-wide">
            {siteName}
          </p>
          <h4 className="text-base font-semibold text-[hsl(0,0%,10%)] line-clamp-1">
            {title}
          </h4>
          <p className="text-sm text-[hsl(0,0%,40%)] line-clamp-2">{desc}</p>
        </div>
      </div>
    </div>
  );
};
