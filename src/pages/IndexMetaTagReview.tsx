import { useState } from "react";
import { Search, Loader2, Globe, Tag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GooglePreview } from "@/components/metatagreview/GooglePreview";
import { FacebookPreview } from "@/components/metatagreview/FacebookPreview";
import { TwitterPreview } from "@/components/metatagreview/TwitterPreview";
import { MetaTagList } from "@/components/metatagreview/MetaTagList";
import { SeoScore } from "@/components/metatagreview/SeoScore";
import { fetchMetaTags, type MetaTagData } from "@/lib/metaParser";
import { useToast } from "@/hooks/use-toast";
import HeaderApp from "@/components/HeaderApp";

const MetaTagReviewPage = () => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<MetaTagData | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    setLoading(true);
    setData(null);
    try {
      const result = await fetchMetaTags(url);
      setData(result);
    } catch {
      toast({
        title: "Error",
        description: "Gagal mengambil data meta tag. Pastikan URL valid.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background bg-grid relative">
      <HeaderApp
        title="Meta Tag Preview"
        description="Analisis meta tag SEO dari URL manapun"
        icon={<Tag className="size-10 text-white" />}
        customCss=""
        clientSide={false}
      />
      <div className="absolute inset-0 bg-gradient-radial pointer-events-none" />

      {/* Search */}
      <div className="container max-w-5xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="example.com"
              className="pl-10 h-12 bg-card border-border text-foreground placeholder:text-muted-foreground font-mono text-sm"
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="h-12 px-6 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Analisis
              </>
            )}
          </Button>
        </form>
      </div>

      {/* Results */}
      {data && (
        <div className="container max-w-5xl mx-auto px-4 pb-16 space-y-10">
          <SeoScore data={data} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-8">
              <GooglePreview data={data} />
              <FacebookPreview data={data} />
            </div>
            <div className="space-y-8">
              <TwitterPreview data={data} />
              <MetaTagList data={data} />
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!data && !loading && (
        <div className="container max-w-5xl mx-auto px-4 text-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
            <Search className="w-7 h-7 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground text-sm">
            Masukkan URL untuk melihat preview meta tag SEO
          </p>
        </div>
      )}
    </div>
  );
};

export default MetaTagReviewPage;
