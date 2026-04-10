import { useCallback, useState, useRef } from "react";
import {
  Upload,
  Download,
  Trash2,
  ImageIcon,
  FileImage,
  Code2,
  Package,
  CheckCircle2,
  GripVertical,
  Copy,
  Check,
  BookImage,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useFaviconGenerator } from "@/hooks/useFaviconGenerator";
import { cn } from "@/lib/utils";
import HeaderApp from "@/components/HeaderApp";

const categoryColors: Record<string, string> = {
  standard: "bg-blue-100 text-blue-800 border-blue-200",
  apple: "bg-gray-100 text-gray-800 border-gray-200",
  android: "bg-green-100 text-green-800 border-green-200",
  ms: "bg-orange-100 text-orange-800 border-orange-200",
};

const categoryLabels: Record<string, string> = {
  standard: "Standard",
  apple: "Apple",
  android: "Android",
  ms: "Microsoft",
};

export default function FaviconGenPage() {
  const {
    sourceImage,
    sourceFileName,
    generatedFavicons,
    isGenerating,
    handleFileUpload,
    downloadSingle,
    downloadAll,
    reset,
  } = useFaviconGenerator();

  const [isDragging, setIsDragging] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFileUpload(files[0]);
      }
    },
    [handleFileUpload],
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFileUpload(files[0]);
      }
    },
    [handleFileUpload],
  );

  const handleCopySnippet = useCallback(() => {
    const snippet = `<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png">
<link rel="icon" type="image/png" sizes="64x64" href="/favicon-64x64.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="msapplication-TileImage" content="/mstile-150x150.png">`;

    navigator.clipboard.writeText(snippet).then(() => {
      setCopiedSnippet(true);
      setTimeout(() => setCopiedSnippet(false), 2000);
    });
  }, []);

  return (
    <div className="min-h-screen bg-background bg-grid relative">
      <HeaderApp
        title={"Favicon Generator"}
        description={
          "Buat favicon untuk website Anda dalam berbagai ukuran standar dengan mudah dan cepat."
        }
        icon={<BookImage className="size-10 text-white" />}
        customCss={""}
        clientSide
      />
      <div className="absolute inset-0 bg-gradient-radial pointer-events-none" />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Upload Section */}
        {!sourceImage ? (
          <Card className="border-dashed border-2 shadow-none">
            <CardContent className="p-0">
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "flex flex-col items-center justify-center py-20 px-8 cursor-pointer transition-all duration-200 rounded-xl",
                  isDragging
                    ? "bg-primary/5 border-primary"
                    : "hover:bg-muted/50",
                )}
              >
                <div
                  className={cn(
                    "w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-colors",
                    isDragging
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  <Upload className="w-8 h-8" />
                </div>
                <p className="text-lg font-semibold text-foreground mb-1">
                  {isDragging
                    ? "Drop your image here"
                    : "Drop an image here or click to upload"}
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  PNG, JPG, SVG, atau WebP — lebih disukai gambar dengan ratio
                  kotak
                </p>
                <Button variant="outline" size="sm">
                  <FileImage className="w-4 h-4" />
                  Pilih File
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Source Image Info */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Source Preview */}
              <Card className="lg:col-span-1">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Gambar Sumber</CardTitle>
                  <CardDescription className="truncate">
                    {sourceFileName}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center p-6 bg-muted/50 rounded-lg border">
                    <img
                      src={sourceImage}
                      alt="Source"
                      className="max-w-full max-h-48 object-contain rounded-lg shadow-sm"
                    />
                  </div>
                </CardContent>
                <CardFooter className="gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={reset}
                    className="flex-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    Hapus
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1"
                  >
                    <Upload className="w-4 h-4" />
                    Ganti
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </CardFooter>
              </Card>

              {/* Preview Grid */}
              <Card className="lg:col-span-2">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">
                        Tampilan Ukuran
                      </CardTitle>
                      <CardDescription>
                        Bagaimana favicon akan terlihat dalam berbagai ukuran.
                      </CardDescription>
                    </div>
                    {generatedFavicons.length > 0 && (
                      <Badge variant="secondary" className="gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        {generatedFavicons.length} ukuran
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {isGenerating ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        <p className="text-sm text-muted-foreground">
                          Membuat favicon...
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {generatedFavicons.map((favicon) => (
                        <div
                          key={favicon.size.size}
                          className="flex flex-col items-center gap-2 p-3 rounded-lg border bg-white hover:shadow-md transition-shadow"
                        >
                          <div className="w-24 h-24 flex items-center justify-center bg-[repeating-conic-gradient(#f1f5f9_0%_25%,transparent_0%_50%)] bg-[length:12px_12px] rounded-md">
                            <img
                              src={favicon.url}
                              alt={favicon.size.fileName}
                              style={{
                                width: Math.min(favicon.size.size, 80),
                                height: Math.min(favicon.size.size, 80),
                                imageRendering:
                                  favicon.size.size <= 32
                                    ? "pixelated"
                                    : "auto",
                              }}
                              className="rounded-sm"
                            />
                          </div>
                          <span className="text-xs font-semibold text-foreground">
                            {favicon.size.name}
                          </span>
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-[10px] px-1.5 py-0",
                              categoryColors[favicon.size.category],
                            )}
                          >
                            {categoryLabels[favicon.size.category]}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Generated Favicons Table */}
            {generatedFavicons.length > 0 && (
              <>
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base">
                          Favicon Anda
                        </CardTitle>
                        <CardDescription>
                          Klik Unduh untuk mengunduh sekaligus semua file
                          dibawah ini.
                        </CardDescription>
                      </div>
                      <Button size="sm" onClick={downloadAll}>
                        <Package className="w-4 h-4" />
                        Unduh Semua (ZIP)
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-lg border overflow-hidden">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-muted/50 border-b">
                            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">
                              Tampilan
                            </th>
                            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">
                              Ukuran
                            </th>
                            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 hidden sm:table-cell">
                              Nama FIle
                            </th>
                            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 hidden md:table-cell">
                              Penggunaan
                            </th>
                            <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 hidden lg:table-cell">
                              Kategori
                            </th>
                            <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">
                              Aksi
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {generatedFavicons.map((favicon, index) => (
                            <tr
                              key={favicon.size.size}
                              className={cn(
                                "border-b last:border-0 hover:bg-muted/30 transition-colors",
                                index % 2 === 0 ? "bg-white" : "bg-muted/10",
                              )}
                            >
                              <td className="px-4 py-3">
                                <div className="w-10 h-10 flex items-center justify-center bg-[repeating-conic-gradient(#f1f5f9_0%_25%,transparent_0%_50%)] bg-[length:8px_8px] rounded">
                                  <img
                                    src={favicon.url}
                                    alt={favicon.size.fileName}
                                    className="rounded-sm"
                                    style={{
                                      width: Math.min(favicon.size.size, 36),
                                      height: Math.min(favicon.size.size, 36),
                                      imageRendering:
                                        favicon.size.size <= 32
                                          ? "pixelated"
                                          : "auto",
                                    }}
                                  />
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <span className="text-sm font-medium text-foreground">
                                  {favicon.size.size}×{favicon.size.size}
                                </span>
                              </td>
                              <td className="px-4 py-3 hidden sm:table-cell">
                                <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                                  {favicon.size.fileName}
                                </code>
                              </td>
                              <td className="px-4 py-3 hidden md:table-cell">
                                <span className="text-sm text-muted-foreground">
                                  {favicon.size.description}
                                </span>
                              </td>
                              <td className="px-4 py-3 hidden lg:table-cell">
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    "text-[10px] px-1.5 py-0",
                                    categoryColors[favicon.size.category],
                                  )}
                                >
                                  {categoryLabels[favicon.size.category]}
                                </Badge>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => downloadSingle(favicon)}
                                  title={`Download ${favicon.size.fileName}`}
                                >
                                  <Download className="w-4 h-4" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                {/* HTML Snippet */}
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Code2 className="w-4 h-4 text-primary" />
                        <div>
                          <CardTitle className="text-base">
                            HTML Snippet
                          </CardTitle>
                          <CardDescription>
                            Tambahkan kode dibawah ini pada tag{" "}
                            <code className="text-xs bg-muted px-1 py-0.5 rounded">
                              &lt;head&gt;
                            </code>{" "}
                            website.
                          </CardDescription>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopySnippet}
                      >
                        {copiedSnippet ? (
                          <>
                            <Check className="w-4 h-4 text-green-500" />
                            Disalin!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            Salin
                          </>
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-lg bg-slate-950 p-4 overflow-x-auto">
                      <pre className="text-sm text-slate-300 font-mono leading-relaxed">
                        <code>
                          {`<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">\n`}
                          {`<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">\n`}
                          {`<link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png">\n`}
                          {`<link rel="icon" type="image/png" sizes="64x64" href="/favicon-64x64.png">\n`}
                          <span className="text-emerald-400">
                            {`<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">\n`}
                          </span>
                          <span className="text-sky-400">
                            {`<link rel="manifest" href="/site.webmanifest">\n`}
                          </span>
                          <span className="text-amber-400">
                            {`<meta name="msapplication-TileImage" content="/mstile-150x150.png">`}
                          </span>
                        </code>
                      </pre>
                    </div>
                  </CardContent>
                </Card>

                {/* Info Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Card className="border-blue-100 bg-blue-50/50">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                          <GripVertical className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-blue-900">
                            Standard Favicons
                          </p>
                          <p className="text-xs text-blue-700 mt-1">
                            16×16, 32×32, 48×48, dan 64×64 PNG untuk tab dan
                            bookmark pada browser.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-gray-100 bg-gray-50/50">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center shrink-0">
                          <svg
                            className="w-4 h-4"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            Apple Touch Icon
                          </p>
                          <p className="text-xs text-gray-700 mt-1">
                            180×180 PNG untuk home screen bookmark and Safari di
                            iOS.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-green-100 bg-green-50/50">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                          <Package className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-green-900">
                            Web Manifest
                          </p>
                          <p className="text-xs text-green-700 mt-1">
                            File site.webmanifest disertakan dalam file ZIP guna
                            dukungan pada Android and PWA.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}
