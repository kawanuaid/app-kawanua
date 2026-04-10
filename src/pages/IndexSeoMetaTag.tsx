import { useState, useMemo, useCallback } from "react";
import {
  Copy,
  Check,
  Code2,
  Globe,
  Eye,
  Sparkles,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Monitor,
  Smartphone,
  Share2,
  FileText,
  Settings2,
  Hash,
  Palette,
  Info,
  Tags,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select } from "@/components/seometataggen/ui/select";
import SEOScore from "@/components/seometataggen/SeoScore";
import { MetaData } from "@/types/seometatag";
import SerpPreview from "@/components/seometataggen/SerpPreview";
import SocialPreview from "@/components/seometataggen/SocialPreview";
import highlightCode from "@/components/seometataggen/HighlightedCode";
import generateMetaTags from "@/components/seometataggen/GenerateMetaTags";
import HeaderApp from "@/components/HeaderApp";
import TipsCard from "@/components/seometataggen/TipsCard";
import TwitterIcon from "@/components/seometataggen/TwitterIcon";

const defaultMeta: MetaData = {
  title: "",
  description: "",
  keywords: "",
  author: "",
  canonicalUrl: "",
  robots: "index, follow",
  contentType: "website",
  pageLanguage: "id",

  ogTitle: "",
  ogDescription: "",
  ogImage: "",
  ogUrl: "",
  ogType: "website",
  ogSiteName: "",
  ogLocale: "id_ID",

  twitterCard: "summary_large_image",
  twitterTitle: "",
  twitterDescription: "",
  twitterImage: "",
  twitterSite: "",
  twitterCreator: "",

  themeColor: "#6366f1",
  faviconUrl: "",
  appleTouchIcon: "",
  viewport: "width=device-width, initial-scale=1.0",
  charset: "UTF-8",
  generator: "",
};

// Field wrapper component
function Field({
  label,
  description,
  children,
  charCount,
  maxChars,
  id,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
  charCount?: number;
  maxChars?: number;
  id?: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={id} className="text-sm font-medium">
          {label}
        </Label>
        {charCount !== undefined && maxChars && (
          <span
            className={`text-xs ${
              charCount > maxChars
                ? "text-red-500 font-medium"
                : charCount > maxChars * 0.9
                  ? "text-amber-500"
                  : "text-muted-foreground"
            }`}
          >
            {charCount}/{maxChars}
          </span>
        )}
      </div>
      {children}
      {description && (
        <p className="text-xs text-muted-foreground flex items-start gap-1">
          <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
          {description}
        </p>
      )}
    </div>
  );
}

export default function SeoMetatagGenPage() {
  const [meta, setMeta] = useState<MetaData>(defaultMeta);
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [activeOutputTab, setActiveOutputTab] = useState("code");

  const updateField = useCallback((field: keyof MetaData, value: string) => {
    setMeta((prev) => ({ ...prev, [field]: value }));
  }, []);

  const code = useMemo(() => generateMetaTags(meta), [meta]);
  const hasCode = code.trim().length > 0;

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement("textarea");
      textarea.value = code;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [code]);

  const handleReset = useCallback(() => {
    setMeta(defaultMeta);
  }, []);

  const handleAutoFillOgTwitter = useCallback(() => {
    setMeta((prev) => ({
      ...prev,
      ogTitle: prev.ogTitle || prev.title,
      ogDescription: prev.ogDescription || prev.description,
      ogUrl: prev.ogUrl || prev.canonicalUrl,
      ogSiteName: prev.ogSiteName || prev.title,
      twitterTitle: prev.twitterTitle || prev.title,
      twitterDescription: prev.twitterDescription || prev.description,
      twitterImage: prev.twitterImage || prev.ogImage,
    }));
  }, []);

  // Count filled fields
  const filledCount = useMemo(() => {
    let count = 0;
    const fields = [
      "title",
      "description",
      "keywords",
      "author",
      "canonicalUrl",
      "ogTitle",
      "ogDescription",
      "ogImage",
      "ogUrl",
      "twitterCard",
      "twitterTitle",
      "twitterDescription",
      "twitterImage",
      "themeColor",
      "faviconUrl",
    ] as const;
    fields.forEach((f) => {
      if (meta[f] && meta[f] !== defaultMeta[f]) count++;
    });
    return count;
  }, [meta]);

  return (
    <div className="min-h-screen bg-background bg-grid relative">
      {/* Header */}
      <header className="border-b border-border/50 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-indigo-400 flex items-center justify-center shadow-lg shadow-primary/25">
                <Tags className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground tracking-tight">
                  SEO Meta Tag Generator
                </h1>
                <p className="text-xs text-muted-foreground">
                  Buat meta tag yang optimal untuk SEO website Anda dengan mudah
                  dan cepat.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className="hidden sm:flex items-center gap-1"
              >
                <Hash className="w-3 h-3" />
                {filledCount} fields filled
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAutoFillOgTwitter}
                className="hidden sm:flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Auto-fill OG & Twitter
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleReset}
                title="Reset all fields"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="absolute inset-0 bg-gradient-radial pointer-events-none" />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Left: Input Form */}
          <div className="space-y-6">
            <Card className="border-border/50 shadow-lg shadow-black/[0.02]">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Informasi Meta Tag
                </CardTitle>
                <CardDescription>
                  Isi kolom di bawah ini untuk membuat meta tag SEO Anda.
                  Biarkan kolom kosong untuk melewatkannya.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="basic">
                  <TabsList className="w-full flex-wrap">
                    <TabsTrigger
                      value="basic"
                      className="flex items-center gap-1.5 flex-1"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Basic</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="opengraph"
                      className="flex items-center gap-1.5 flex-1"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Open Graph</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="twitter"
                      className="flex items-center gap-1.5 flex-1"
                    >
                      <TwitterIcon className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Twitter</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="advanced"
                      className="flex items-center gap-1.5 flex-1"
                    >
                      <Settings2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Advanced</span>
                    </TabsTrigger>
                  </TabsList>

                  {/* Basic Tab */}
                  <TabsContent value="basic" className="space-y-4 mt-4">
                    <Field
                      label="Page Title"
                      description="Judul halaman Anda. Jaga agar tetap di bawah 60 karakter untuk hasil terbaik."
                      charCount={meta.title.length}
                      maxChars={60}
                      id="title"
                    >
                      <Input
                        id="title"
                        placeholder="My Awesome Website — Best Product Ever"
                        value={meta.title}
                        onChange={(e) => updateField("title", e.target.value)}
                      />
                    </Field>

                    <Field
                      label="Meta Description"
                      description="Ringkasan singkat konten halaman Anda. Usahakan antara 150-160 karakter."
                      charCount={meta.description.length}
                      maxChars={160}
                      id="description"
                    >
                      <Textarea
                        id="description"
                        placeholder="Deskripsikan halaman Anda dengan cara yang menarik yang dapat membuat orang ingin mengklik..."
                        value={meta.description}
                        onChange={(e) =>
                          updateField("description", e.target.value)
                        }
                        rows={3}
                      />
                    </Field>

                    <Field
                      label="Keywords"
                      description="Kata kunci yang dipisahkan dengan koma. (Kurang penting untuk SEO modern tetapi masih digunakan oleh beberapa mesin pencari)"
                      id="keywords"
                    >
                      <Input
                        id="keywords"
                        placeholder="seo, meta tags, generator, web development"
                        value={meta.keywords}
                        onChange={(e) =>
                          updateField("keywords", e.target.value)
                        }
                      />
                    </Field>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="Author" id="author">
                        <Input
                          id="author"
                          placeholder="John Doe"
                          value={meta.author}
                          onChange={(e) =>
                            updateField("author", e.target.value)
                          }
                        />
                      </Field>

                      <Field label="Page Language" id="pageLanguage">
                        <Select
                          id="pageLanguage"
                          value={meta.pageLanguage}
                          onChange={(e) =>
                            updateField("pageLanguage", e.target.value)
                          }
                          options={[
                            { value: "id", label: "Indonesian (id)" },
                            { value: "en", label: "English (en)" },
                            { value: "en-US", label: "English US (en-US)" },
                            { value: "en-GB", label: "English UK (en-GB)" },
                            { value: "ja", label: "Japanese (ja)" },
                            { value: "ko", label: "Korean (ko)" },
                            { value: "zh", label: "Chinese (zh)" },
                            { value: "de", label: "German (de)" },
                            { value: "fr", label: "French (fr)" },
                            { value: "es", label: "Spanish (es)" },
                            { value: "pt", label: "Portuguese (pt)" },
                            { value: "ar", label: "Arabic (ar)" },
                            { value: "th", label: "Thai (th)" },
                            { value: "vi", label: "Vietnamese (vi)" },
                            { value: "ms", label: "Malay (ms)" },
                          ]}
                        />
                      </Field>
                    </div>

                    <Field
                      label="Canonical URL"
                      description="URL yang disukai dari halaman. Membantu menghindari masalah konten duplikat."
                      id="canonicalUrl"
                    >
                      <Input
                        id="canonicalUrl"
                        type="url"
                        placeholder="https://www.example.com/page"
                        value={meta.canonicalUrl}
                        onChange={(e) =>
                          updateField("canonicalUrl", e.target.value)
                        }
                      />
                    </Field>

                    <Field
                      label="Robots"
                      description="Kontrol bagaimana mesin pencari mengindeks halaman Anda."
                      id="robots"
                    >
                      <Select
                        id="robots"
                        value={meta.robots}
                        onChange={(e) => updateField("robots", e.target.value)}
                        options={[
                          {
                            value: "index, follow",
                            label: "Index, Follow (default)",
                          },
                          {
                            value: "noindex, follow",
                            label: "NoIndex, Follow",
                          },
                          {
                            value: "index, nofollow",
                            label: "Index, NoFollow",
                          },
                          {
                            value: "noindex, nofollow",
                            label: "NoIndex, NoFollow",
                          },
                          { value: "noarchive", label: "No Archive" },
                          { value: "nosnippet", label: "No Snippet" },
                        ]}
                      />
                    </Field>

                    <Field label="Content Type" id="contentType">
                      <Select
                        id="contentType"
                        value={meta.contentType}
                        onChange={(e) =>
                          updateField("contentType", e.target.value)
                        }
                        options={[
                          { value: "website", label: "Website" },
                          { value: "article", label: "Article" },
                          { value: "product", label: "Product" },
                          { value: "profile", label: "Profile" },
                          { value: "video", label: "Video" },
                          { value: "music", label: "Music" },
                          { value: "book", label: "Book" },
                        ]}
                      />
                    </Field>
                  </TabsContent>

                  {/* Open Graph Tab */}
                  <TabsContent value="opengraph" className="space-y-4 mt-4">
                    <div className="rounded-lg bg-blue-50 border border-blue-100 p-3 flex items-start gap-2">
                      <Globe className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-blue-700">
                        Tag Open Graph mengontrol bagaimana konten Anda muncul
                        saat dibagikan di Facebook, LinkedIn, dan platform media
                        sosial lainnya.
                      </p>
                    </div>

                    <Field
                      label="OG Title"
                      description="Judul untuk dibagikan di media sosial. Menggunakan Page Title jika kosong."
                      charCount={meta.ogTitle.length}
                      maxChars={60}
                      id="ogTitle"
                    >
                      <Input
                        id="ogTitle"
                        placeholder="Judul yang sama dengan Page Title atau judul khusus untuk berbagi di media sosial"
                        value={meta.ogTitle}
                        onChange={(e) => updateField("ogTitle", e.target.value)}
                      />
                    </Field>

                    <Field
                      label="OG Description"
                      description="Deskripsi untuk berbagi di media sosial. Menggunakan Meta Description jika kosong."
                      charCount={meta.ogDescription.length}
                      maxChars={160}
                      id="ogDescription"
                    >
                      <Textarea
                        id="ogDescription"
                        placeholder="Deskripsi untuk berbagi di media sosial..."
                        value={meta.ogDescription}
                        onChange={(e) =>
                          updateField("ogDescription", e.target.value)
                        }
                        rows={2}
                      />
                    </Field>

                    <Field
                      label="OG Image"
                      description="Ukuran yang direkomendasikan: 1200×630px. Gunakan URL absolut."
                      id="ogImage"
                    >
                      <Input
                        id="ogImage"
                        type="url"
                        placeholder="https://www.example.com/images/og-image.jpg"
                        value={meta.ogImage}
                        onChange={(e) => updateField("ogImage", e.target.value)}
                      />
                    </Field>

                    <Field
                      label="OG URL"
                      description="URL kanonik halaman Anda untuk berbagi di media sosial."
                      id="ogUrl"
                    >
                      <Input
                        id="ogUrl"
                        type="url"
                        placeholder="https://www.example.com/page"
                        value={meta.ogUrl}
                        onChange={(e) => updateField("ogUrl", e.target.value)}
                      />
                    </Field>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="OG Type" id="ogType">
                        <Select
                          id="ogType"
                          value={meta.ogType}
                          onChange={(e) =>
                            updateField("ogType", e.target.value)
                          }
                          options={[
                            { value: "website", label: "Website" },
                            { value: "article", label: "Article" },
                            { value: "profile", label: "Profile" },
                            { value: "video.movie", label: "Video" },
                            { value: "music.song", label: "Music" },
                            { value: "book", label: "Book" },
                          ]}
                        />
                      </Field>

                      <Field label="OG Locale" id="ogLocale">
                        <Select
                          id="ogLocale"
                          value={meta.ogLocale}
                          onChange={(e) =>
                            updateField("ogLocale", e.target.value)
                          }
                          options={[
                            { value: "id_ID", label: "Indonesian" },
                            { value: "en_US", label: "English (US)" },
                            { value: "en_GB", label: "English (UK)" },
                            { value: "ja_JP", label: "Japanese" },
                            { value: "ko_KR", label: "Korean" },
                            { value: "zh_CN", label: "Chinese (Simplified)" },
                            { value: "de_DE", label: "German" },
                            { value: "fr_FR", label: "French" },
                            { value: "es_ES", label: "Spanish" },
                            { value: "pt_BR", label: "Portuguese (BR)" },
                          ]}
                        />
                      </Field>
                    </div>

                    <Field label="OG Site Name" id="ogSiteName">
                      <Input
                        id="ogSiteName"
                        placeholder="Nama Website Saya"
                        value={meta.ogSiteName}
                        onChange={(e) =>
                          updateField("ogSiteName", e.target.value)
                        }
                      />
                    </Field>
                  </TabsContent>

                  {/* Twitter Tab */}
                  <TabsContent value="twitter" className="space-y-4 mt-4">
                    <div className="rounded-lg bg-sky-50 border border-sky-100 p-3 flex items-start gap-2">
                      <TwitterIcon className="w-4 h-4 text-sky-500 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-sky-700">
                        Tag Twitter Card mengontrol bagaimana konten Anda muncul
                        di feed Twitter/X. Menggunakan nilai Open Graph jika
                        tidak diatur.
                      </p>
                    </div>

                    <Field label="Twitter Card Type" id="twitterCard">
                      <Select
                        id="twitterCard"
                        value={meta.twitterCard}
                        onChange={(e) =>
                          updateField("twitterCard", e.target.value)
                        }
                        options={[
                          { value: "summary", label: "Summary (small image)" },
                          {
                            value: "summary_large_image",
                            label: "Summary Large Image",
                          },
                          { value: "app", label: "App Card" },
                          { value: "player", label: "Player Card" },
                        ]}
                      />
                    </Field>

                    <Field
                      label="Twitter Title"
                      charCount={meta.twitterTitle.length}
                      maxChars={70}
                      id="twitterTitle"
                    >
                      <Input
                        id="twitterTitle"
                        placeholder="Judul untuk Twitter card"
                        value={meta.twitterTitle}
                        onChange={(e) =>
                          updateField("twitterTitle", e.target.value)
                        }
                      />
                    </Field>

                    <Field
                      label="Twitter Description"
                      charCount={meta.twitterDescription.length}
                      maxChars={200}
                      id="twitterDescription"
                    >
                      <Textarea
                        id="twitterDescription"
                        placeholder="Deskripsi untuk Twitter card..."
                        value={meta.twitterDescription}
                        onChange={(e) =>
                          updateField("twitterDescription", e.target.value)
                        }
                        rows={2}
                      />
                    </Field>

                    <Field
                      label="Twitter Image"
                      description="URL gambar untuk Twitter card. Direkomendasikan: 1200×600px untuk gambar besar."
                      id="twitterImage"
                    >
                      <Input
                        id="twitterImage"
                        type="url"
                        placeholder="https://www.example.com/images/twitter-card.jpg"
                        value={meta.twitterImage}
                        onChange={(e) =>
                          updateField("twitterImage", e.target.value)
                        }
                      />
                    </Field>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field
                        label="Twitter Site"
                        description="@username dari website"
                        id="twitterSite"
                      >
                        <Input
                          id="twitterSite"
                          placeholder="@yoursite"
                          value={meta.twitterSite}
                          onChange={(e) =>
                            updateField("twitterSite", e.target.value)
                          }
                        />
                      </Field>

                      <Field
                        label="Twitter Creator"
                        description="@username dari penulis konten"
                        id="twitterCreator"
                      >
                        <Input
                          id="twitterCreator"
                          placeholder="@authorname"
                          value={meta.twitterCreator}
                          onChange={(e) =>
                            updateField("twitterCreator", e.target.value)
                          }
                        />
                      </Field>
                    </div>
                  </TabsContent>

                  {/* Advanced Tab */}
                  <TabsContent value="advanced" className="space-y-4 mt-4">
                    <div className="rounded-lg bg-amber-50 border border-amber-100 p-3 flex items-start gap-2">
                      <Settings2 className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-amber-700">
                        Tag meta tambahan untuk PWA, aplikasi seluler, dan
                        konfigurasi browser.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field
                        label="Warna Tema"
                        description="Warna toolbar browser di perangkat seluler"
                        id="themeColor"
                      >
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={meta.themeColor}
                            onChange={(e) =>
                              updateField("themeColor", e.target.value)
                            }
                            className="h-10 w-12 rounded-lg border border-input cursor-pointer p-0.5"
                          />
                          <Input
                            id="themeColor"
                            value={meta.themeColor}
                            onChange={(e) =>
                              updateField("themeColor", e.target.value)
                            }
                            placeholder="#6366f1"
                            className="flex-1"
                          />
                        </div>
                      </Field>

                      <Field label="Charset" id="charset">
                        <Select
                          id="charset"
                          value={meta.charset}
                          onChange={(e) =>
                            updateField("charset", e.target.value)
                          }
                          options={[
                            { value: "UTF-8", label: "UTF-8 (Recommended)" },
                            { value: "ISO-8859-1", label: "ISO-8859-1" },
                            { value: "UTF-16", label: "UTF-16" },
                          ]}
                        />
                      </Field>
                    </div>

                    <Field label="Favicon URL" id="faviconUrl">
                      <Input
                        id="faviconUrl"
                        type="url"
                        placeholder="https://www.example.com/favicon.ico"
                        value={meta.faviconUrl}
                        onChange={(e) =>
                          updateField("faviconUrl", e.target.value)
                        }
                      />
                    </Field>

                    <Field
                      label="Apple Touch Icon"
                      description="Ikon untuk perangkat iOS saat ditambahkan ke layar utama. Direkomendasikan: 180×180px"
                      id="appleTouchIcon"
                    >
                      <Input
                        id="appleTouchIcon"
                        type="url"
                        placeholder="https://www.example.com/apple-touch-icon.png"
                        value={meta.appleTouchIcon}
                        onChange={(e) =>
                          updateField("appleTouchIcon", e.target.value)
                        }
                      />
                    </Field>

                    <Field
                      label="Viewport"
                      description="Mengontrol bagaimana halaman Anda menskalakan pada perangkat yang berbeda. Sebagian besar situs harus menggunakan default."
                      id="viewport"
                    >
                      <Input
                        id="viewport"
                        placeholder="width=device-width, initial-scale=1.0"
                        value={meta.viewport}
                        onChange={(e) =>
                          updateField("viewport", e.target.value)
                        }
                      />
                    </Field>

                    <Field
                      label="Generator"
                      description="Perangkat lunak yang digunakan untuk menghasilkan halaman (misalnya, WordPress, Hugo, dll.)"
                      id="generator"
                    >
                      <Input
                        id="generator"
                        placeholder="misalnya, WordPress 6.0, Hugo, Next.js"
                        value={meta.generator}
                        onChange={(e) =>
                          updateField("generator", e.target.value)
                        }
                      />
                    </Field>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Auto-fill button for mobile */}
            <Button
              variant="outline"
              onClick={handleAutoFillOgTwitter}
              className="sm:hidden w-full flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Auto-fill OG & Twitter dari tab Basic
            </Button>
          </div>

          {/* Right: Output */}
          <div className="space-y-6">
            {/* Preview toggle (mobile) */}
            <div className="lg:hidden">
              <Button
                variant="outline"
                onClick={() => setShowPreview(!showPreview)}
                className="w-full flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  {showPreview ? "Hide" : "Show"} Preview
                </span>
                {showPreview ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </Button>
            </div>

            {/* Preview Panel */}
            {showPreview && (
              <div className="space-y-4">
                <Tabs
                  defaultValue="serp"
                  value={activeOutputTab}
                  onValueChange={setActiveOutputTab}
                >
                  <TabsList>
                    <TabsTrigger
                      value="serp"
                      className="flex items-center gap-1.5"
                    >
                      <Monitor className="w-3.5 h-3.5" />
                      Tampilan SERP
                    </TabsTrigger>
                    <TabsTrigger
                      value="social"
                      className="flex items-center gap-1.5"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      Tampilan Social Media
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="serp">
                    <SerpPreview meta={meta} />
                  </TabsContent>
                  <TabsContent value="social">
                    <SocialPreview meta={meta} />
                  </TabsContent>
                </Tabs>
              </div>
            )}

            {/* Code Output */}
            <Card className="border-border/50 shadow-lg shadow-black/[0.02]">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Code2 className="w-5 h-5 text-primary" />
                    Kode HTML
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs font-normal">
                      <Palette className="w-3 h-3 mr-1" />
                      {code.split("\n").filter((l) => l.trim()).length} baris
                    </Badge>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={handleCopy}
                      disabled={!hasCode}
                      className="flex items-center gap-1.5"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          Disalin!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          Salin Kode
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                <CardDescription>
                  Salin kode ini dan letakkan di dalam tag{" "}
                  <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">
                    &lt;head&gt;
                  </code>{" "}
                  website.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="rounded-xl bg-[#1e1e2e] border border-[#313244] overflow-hidden">
                    <div className="flex items-center gap-1.5 px-4 py-2.5 bg-[#181825] border-b border-[#313244]">
                      <div className="w-3 h-3 rounded-full bg-[#f38ba8]/80" />
                      <div className="w-3 h-3 rounded-full bg-[#f9e2af]/80" />
                      <div className="w-3 h-3 rounded-full bg-[#a6e3a1]/80" />
                      <span className="text-xs text-[#6c7086] ml-2 font-mono">
                        index.html
                      </span>
                    </div>
                    <div className="p-4 overflow-x-auto max-h-[600px] overflow-y-auto">
                      {hasCode ? (
                        <pre className="code-block text-[#cdd6f4] m-0">
                          {highlightCode(code)}
                        </pre>
                      ) : (
                        <div className="text-center py-12 text-[#6c7086]">
                          <Code2 className="w-10 h-10 mx-auto mb-3 opacity-50" />
                          <p className="text-sm">
                            Mulai mengisi kolom untuk menghasilkan tag meta Anda
                          </p>
                          <p className="text-xs mt-1 opacity-70">
                            Kode akan muncul di sini secara otomatis
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tips Card */}
            <TipsCard />
          </div>
        </div>

        {/* SEO Score & Checklist */}
        <div className="mt-8 lg:mt-10">
          <SEOScore meta={meta} />
        </div>
      </main>
    </div>
  );
}
