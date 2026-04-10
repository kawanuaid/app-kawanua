import { Globe, Share2 } from "lucide-react";
import { MetaData } from "@/types/seometatag";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import TwitterIcon from "./TwitterIcon";

export default function SocialPreview({ meta }: { meta: MetaData }) {
  const ogTitle = meta.ogTitle || meta.title || "Page Title";
  const ogDesc =
    meta.ogDescription || meta.description || "Page description...";
  const ogImage = meta.ogImage;
  const ogSiteName = meta.ogSiteName || "";
  const ogUrl = meta.ogUrl || meta.canonicalUrl || "example.com";
  let displayDomain = ogUrl;
  try {
    displayDomain = new URL(ogUrl).hostname;
  } catch {
    // keep original
  }

  const twitterTitle =
    meta.twitterTitle || meta.ogTitle || meta.title || "Page Title";
  const twitterDesc =
    meta.twitterDescription ||
    meta.ogDescription ||
    meta.description ||
    "Page description...";
  const twitterImage = meta.twitterImage || meta.ogImage;

  return (
    <div className="rounded-xl border border-border bg-white p-5 space-y-5">
      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
        <Share2 className="w-4 h-4 text-primary" />
        Social Media Preview
      </div>
      <Separator />

      {/* Open Graph / Facebook Preview */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-blue-500" />
          <span className="text-sm font-medium">Facebook / Open Graph</span>
        </div>
        <div className="rounded-lg border border-gray-200 overflow-hidden max-w-[500px]">
          {ogImage ? (
            <div className="w-full aspect-[1.91/1] bg-gray-100 overflow-hidden">
              <img
                src={ogImage}
                alt="OG Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          ) : (
            <div className="w-full aspect-[1.91/1] bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
              <div className="text-center">
                <Globe className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>1200 × 630 recommended</p>
              </div>
            </div>
          )}
          <div className="p-3 bg-[#f0f2f5] space-y-0.5">
            <p className="text-xs text-gray-500 uppercase">{displayDomain}</p>
            <p className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2">
              {ogTitle}
            </p>
            <p className="text-xs text-gray-500 line-clamp-2">{ogDesc}</p>
            {ogSiteName && (
              <p className="text-xs text-gray-400">{ogSiteName}</p>
            )}
          </div>
        </div>
      </div>

      <Separator />

      {/* Twitter Preview */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <TwitterIcon className="w-4 h-4 text-sky-500" />
          <span className="text-sm font-medium">Twitter / X</span>
          <Badge variant="secondary" className="text-xs">
            {meta.twitterCard === "summary_large_image"
              ? "Large Image"
              : "Summary"}
          </Badge>
        </div>
        <div className="rounded-xl border border-gray-200 overflow-hidden max-w-[500px]">
          {meta.twitterCard === "summary_large_image" ? (
            <>
              {twitterImage ? (
                <div className="w-full aspect-[2/1] bg-gray-100 overflow-hidden">
                  <img
                    src={twitterImage}
                    alt="Twitter Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              ) : (
                <div className="w-full aspect-[2/1] bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                  <div className="text-center">
                    <TwitterIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>1200 × 600 recommended</p>
                  </div>
                </div>
              )}
              <div className="p-3 bg-white space-y-0.5 border-t border-gray-200">
                <p className="text-sm font-bold text-gray-900 leading-snug line-clamp-1">
                  {twitterTitle}
                </p>
                <p className="text-sm text-gray-500 line-clamp-2">
                  {twitterDesc}
                </p>
                <p className="text-xs text-gray-400">{displayDomain}</p>
              </div>
            </>
          ) : (
            <div className="flex">
              {twitterImage ? (
                <div className="w-32 h-32 bg-gray-100 flex-shrink-0 overflow-hidden">
                  <img
                    src={twitterImage}
                    alt="Twitter Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              ) : (
                <div className="w-32 h-32 bg-gray-100 flex-shrink-0 flex items-center justify-center">
                  <TwitterIcon className="w-6 h-6 text-gray-300" />
                </div>
              )}
              <div className="p-3 flex flex-col justify-center space-y-0.5">
                <p className="text-sm font-bold text-gray-900 leading-snug line-clamp-1">
                  {twitterTitle}
                </p>
                <p className="text-xs text-gray-500 line-clamp-2">
                  {twitterDesc}
                </p>
                <p className="text-xs text-gray-400">{displayDomain}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
