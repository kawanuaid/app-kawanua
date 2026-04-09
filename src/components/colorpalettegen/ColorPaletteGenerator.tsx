import { useState, useCallback, useRef } from "react";
import {
  Upload,
  Palette,
  Copy,
  Check,
  ImageIcon,
  X,
  Pipette,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import HeaderApp from "../HeaderApp";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

interface ExtractedColor {
  rgb: [number, number, number];
  hex: string;
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
}

function getContrastColor(r: number, g: number, b: number): string {
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#1a1a1a" : "#ffffff";
}

// Simple median cut color quantization
function extractPalette(
  img: HTMLImageElement,
  colorCount: number,
): [number, number, number][] {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  const scale = Math.min(
    1,
    200 / Math.max(img.naturalWidth, img.naturalHeight),
  );
  canvas.width = Math.floor(img.naturalWidth * scale);
  canvas.height = Math.floor(img.naturalHeight * scale);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

  const pixels: [number, number, number][] = [];
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 128) continue; // skip transparent
    pixels.push([data[i], data[i + 1], data[i + 2]]);
  }

  // Median cut
  function medianCut(
    bucket: [number, number, number][],
    depth: number,
  ): [number, number, number][] {
    if (depth === 0 || bucket.length === 0) {
      const avg: [number, number, number] = [0, 0, 0];
      for (const p of bucket) {
        avg[0] += p[0];
        avg[1] += p[1];
        avg[2] += p[2];
      }
      const len = bucket.length || 1;
      return [
        [
          Math.round(avg[0] / len),
          Math.round(avg[1] / len),
          Math.round(avg[2] / len),
        ],
      ];
    }

    // Find channel with greatest range
    let maxRange = 0,
      maxCh = 0;
    for (let ch = 0; ch < 3; ch++) {
      let min = 255,
        max = 0;
      for (const p of bucket) {
        if (p[ch] < min) min = p[ch];
        if (p[ch] > max) max = p[ch];
      }
      if (max - min > maxRange) {
        maxRange = max - min;
        maxCh = ch;
      }
    }

    bucket.sort((a, b) => a[maxCh] - b[maxCh]);
    const mid = Math.floor(bucket.length / 2);
    return [
      ...medianCut(bucket.slice(0, mid), depth - 1),
      ...medianCut(bucket.slice(mid), depth - 1),
    ];
  }

  const depth = Math.ceil(Math.log2(colorCount));
  const result = medianCut(pixels, depth);
  return result.slice(0, colorCount);
}

export default function ColorPaletteGenerator() {
  const [image, setImage] = useState<string | null>(null);
  const [colors, setColors] = useState<ExtractedColor[]>([]);
  const [maxColors, setMaxColors] = useState(6);
  const [loading, setLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const extractColors = useCallback(() => {
    if (!imgRef.current) return;
    setLoading(true);
    setTimeout(() => {
      try {
        const palette = extractPalette(imgRef.current!, maxColors);
        const extracted: ExtractedColor[] = palette.map(([r, g, b]) => ({
          rgb: [r, g, b] as [number, number, number],
          hex: rgbToHex(r, g, b),
        }));
        setColors(extracted);
      } catch {
        toast({
          title: "Gagal mengekstrak warna",
          description: "Coba upload gambar lain.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }, 50);
  }, [maxColors]);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({
        title: "File tidak valid",
        description: "Harap upload file gambar.",
        variant: "destructive",
      });
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "File terlalu besar",
        description: "Ukuran maksimal 5MB.",
        variant: "destructive",
      });
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target?.result as string);
      setColors([]);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleImageLoad = useCallback(() => {
    extractColors();
  }, [extractColors]);

  const copyColor = (hex: string, idx: number) => {
    navigator.clipboard.writeText(hex);
    setCopiedIdx(idx);
    toast({ title: "Disalin!", description: hex });
    setTimeout(() => setCopiedIdx(null), 1500);
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
    },
    [handleFile],
  );

  const clearImage = () => {
    setImage(null);
    setColors([]);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="min-h-screen bg-background bg-grid relative">
      <HeaderApp
        title={"Color Palette Picker"}
        description={"Ekstrak palette warna dari gambar"}
        icon={<Pipette className="size-10 text-primary-foreground" />}
        customCss={""}
        clientSide={false}
      />
      <div className="absolute inset-0 bg-gradient-radial pointer-events-none" />

      <main className="max-w-5xl mx-auto px-6 py-10 space-y-8">
        {/* Upload Area */}
        {!image ? (
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={cn(
              "relative bg-background border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all duration-300",
              "hover:border-primary/50 hover:bg-surface/50",
              dragActive
                ? "border-primary bg-primary/40 scale-[1.01]"
                : "border-border",
            )}
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) =>
                e.target.files?.[0] && handleFile(e.target.files[0])
              }
            />
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-surface flex items-center justify-center">
                <Upload className="w-7 h-7 text-muted-foreground" />
              </div>
              <div>
                <p className="text-foreground font-semibold text-lg">
                  Drop gambar atau klik untuk upload
                </p>
                <p className="text-muted-foreground text-sm mt-1">
                  PNG, JPG, WEBP • Maks 5MB
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Image Preview + Controls */}
            <div className="grid md:grid-cols-[1fr_280px] gap-6">
              <div className="relative group rounded-2xl overflow-hidden bg-background border border-border">
                <img
                  ref={imgRef}
                  src={image}
                  alt="Uploaded"
                  crossOrigin="anonymous"
                  onLoad={handleImageLoad}
                  className="w-full max-h-[420px] object-contain"
                />
                <button
                  onClick={clearImage}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-foreground/70 text-background flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Controls */}
              <div className="flex flex-col gap-5">
                <div className="bg-card rounded-2xl border border-border p-5 space-y-5">
                  <div>
                    <label className="text-sm font-medium text-foreground">
                      Jumlah Warna
                    </label>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Maksimal warna yang diekstrak
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Slider
                      min={2}
                      max={12}
                      step={1}
                      value={[maxColors]}
                      onValueChange={([v]) => setMaxColors(v)}
                      className="flex-1"
                    />
                    <span className="text-2xl font-bold text-foreground tabular-nums w-8 text-right">
                      {maxColors}
                    </span>
                  </div>
                  <Button
                    onClick={extractColors}
                    disabled={loading}
                    className="w-full"
                    size="lg"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        Mengekstrak...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Palette className="w-4 h-4" />
                        Ekstrak Warna
                      </span>
                    )}
                  </Button>
                </div>

                <button
                  onClick={() => inputRef.current?.click()}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 justify-center"
                >
                  <ImageIcon className="w-4 h-4" />
                  Ganti gambar
                </button>
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    e.target.files?.[0] && handleFile(e.target.files[0])
                  }
                />
              </div>
            </div>

            {/* Color Palette */}
            {colors.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Palette ({colors.length} warna)
                </h2>

                {/* Color Bar */}
                <div className="flex h-20 rounded-2xl overflow-hidden shadow-lg">
                  {colors.map((c, i) => (
                    <button
                      key={i}
                      onClick={() => copyColor(c.hex, i)}
                      className="flex-1 relative group transition-all hover:flex-[1.5] cursor-pointer"
                      style={{ backgroundColor: c.hex }}
                      title={c.hex}
                    >
                      <span
                        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ color: getContrastColor(...c.rgb) }}
                      >
                        {copiedIdx === i ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Color Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {colors.map((c, i) => (
                    <button
                      key={i}
                      onClick={() => copyColor(c.hex, i)}
                      className="group bg-card rounded-xl border border-border overflow-hidden hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer"
                    >
                      <div
                        className="h-20 w-full relative"
                        style={{ backgroundColor: c.hex }}
                      >
                        <span
                          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ color: getContrastColor(...c.rgb) }}
                        >
                          {copiedIdx === i ? (
                            <Check className="w-5 h-5" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </span>
                      </div>
                      <div className="p-3 text-left">
                        <p className="text-sm font-mono font-semibold text-foreground">
                          {c.hex.toUpperCase()}
                        </p>
                        <p className="text-xs text-muted-foreground font-mono">
                          rgb({c.rgb.join(", ")})
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
