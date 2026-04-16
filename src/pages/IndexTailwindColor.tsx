import { useState, useCallback } from "react";
import { Copy, Check, Palette, Eye, Droplets, SwatchBook } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  tailwindColors,
  shadeKeys,
  colorFamilyKeys,
  type ShadeKey,
} from "@/components/tailwindcolor/TailwindColorData";
import {
  hexToRgb,
  rgbToHsl,
  rgbToHsv,
  rgbToCmyk,
  isLightColor,
} from "@/lib/tailwindUtils";
import { cn } from "@/lib/utils";
import HeaderApp from "@/components/HeaderApp";
import FormatRow from "@/components/tailwindcolor/FormatRow";
import { SubFooter } from "@/components/Footer";

export default function TailwindColorPage() {
  const [selectedFamily, setSelectedFamily] = useState("blue");
  const [selectedShade, setSelectedShade] = useState<ShadeKey>("500");
  const [copiedAll, setCopiedAll] = useState(false);

  const family = tailwindColors[selectedFamily];
  const hex = family.shades[selectedShade];
  const rgb = hexToRgb(hex);
  const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null;
  const hsv = rgb ? rgbToHsv(rgb.r, rgb.g, rgb.b) : null;
  const cmyk = rgb ? rgbToCmyk(rgb.r, rgb.g, rgb.b) : null;
  const isLight = isLightColor(hex);
  const tailwindClass = `${selectedFamily}-${selectedShade}`;

  const handleCopyAll = useCallback(() => {
    const text = [
      `Tailwind: ${tailwindClass}`,
      `HEX: ${hex.toUpperCase()}`,
      `RGB: rgb(${rgb?.r}, ${rgb?.g}, ${rgb?.b})`,
      `HSL: hsl(${hsl?.h}, ${hsl?.s}%, ${hsl?.l}%)`,
      `HSV: hsv(${hsv?.h}, ${hsv?.s}%, ${hsv?.v}%)`,
      `CMYK: cmyk(${cmyk?.c}%, ${cmyk?.m}%, ${cmyk?.y}%, ${cmyk?.k}%)`,
    ].join("\n");
    navigator.clipboard.writeText(text).then(() => {
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    });
  }, [tailwindClass, hex, rgb, hsl, hsv, cmyk]);

  return (
    <div className="min-h-screen bg-background bg-grid relative flex flex-col justify-between">
      <HeaderApp
        title={"Tailwind CSS Color Converter"}
        description={
          "Konversi warna Tailwind CSS ke HEX, RGB, HSL, HSV, dan CMYK."
        }
        icon={<SwatchBook className="size-10 text-white" />}
        customCss={""}
        clientSide={false}
      />

      <div className="absolute inset-0 bg-gradient-radial pointer-events-none" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Color Family Selector */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <Droplets className="h-4 w-4 text-blue-500" />
              Pilih Keluarga Warna
            </CardTitle>
            <CardDescription>
              Klik pada salah satu keluarga warna Tailwind CSS
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-11 gap-2">
              {colorFamilyKeys.map((key) => {
                const isSelected = key === selectedFamily;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedFamily(key)}
                    className={cn(
                      "group relative flex flex-col items-center gap-1.5 rounded-xl p-2.5 transition-all duration-200 cursor-pointer",
                      "hover:bg-zinc-50 hover:shadow-sm",
                      isSelected &&
                        "bg-blue-50 shadow-sm ring-2 ring-blue-500/30",
                    )}
                  >
                    <div className="relative">
                      <div
                        className="h-8 w-8 rounded-full shadow-md ring-2 ring-white transition-transform duration-200 group-hover:scale-110"
                        style={{
                          backgroundColor: tailwindColors[key].shades["500"],
                        }}
                      />
                      <div
                        className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full ring-2 ring-white"
                        style={{
                          backgroundColor: tailwindColors[key].shades["200"],
                        }}
                      />
                    </div>
                    <span
                      className={cn(
                        "text-[10px] font-medium capitalize leading-none",
                        isSelected ? "text-blue-700" : "text-zinc-600",
                      )}
                    >
                      {key}
                    </span>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shade Selector + Palette */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <Eye className="h-4 w-4 text-violet-500" />
                  Pilih Shade
                </CardTitle>
                <CardDescription>
                  {family.name} — {shadeKeys.length} variasi shade
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {shadeKeys.map((shade) => {
                    const shadeHex = family.shades[shade];
                    const isSelected = shade === selectedShade;
                    const shadeIsLight = isLightColor(shadeHex);
                    return (
                      <button
                        key={shade}
                        onClick={() => setSelectedShade(shade)}
                        className={cn(
                          "w-full flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200 cursor-pointer",
                          "hover:shadow-sm",
                          isSelected
                            ? "ring-2 ring-blue-500/40 shadow-sm"
                            : "hover:bg-white/60",
                        )}
                        style={{
                          backgroundColor: isSelected
                            ? `${shadeHex}20`
                            : "transparent",
                        }}
                      >
                        <div
                          className="h-9 w-9 rounded-lg shadow-sm shrink-0 ring-1 ring-black/5 flex items-center justify-center"
                          style={{ backgroundColor: shadeHex }}
                        >
                          {isSelected && (
                            <Check
                              className={cn(
                                "h-4 w-4",
                                shadeIsLight ? "text-zinc-800" : "text-white",
                              )}
                            />
                          )}
                        </div>
                        <div className="flex-1 text-left min-w-0">
                          <div className="flex items-baseline gap-2">
                            <span
                              className={cn(
                                "text-sm font-semibold",
                                isSelected ? "text-zinc-900" : "text-zinc-700",
                              )}
                            >
                              {shade}
                            </span>
                            <span className="text-xs font-mono text-zinc-400 truncate">
                              {shadeHex.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Full Palette Preview */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-zinc-600">
                  Palet {family.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-0.5 rounded-xl overflow-hidden">
                  {shadeKeys.map((shade) => (
                    <button
                      key={shade}
                      onClick={() => setSelectedShade(shade)}
                      className={cn(
                        "h-8 w-full transition-all duration-150 cursor-pointer relative group",
                        shade === selectedShade
                          ? "ring-2 ring-blue-500 ring-inset z-10"
                          : "hover:brightness-110",
                      )}
                      style={{ backgroundColor: family.shades[shade] }}
                      title={`${family.name}-${shade}: ${family.shades[shade].toUpperCase()}`}
                    >
                      <span
                        className={cn(
                          "absolute left-2 top-1/2 -translate-y-1/2 text-[10px] font-mono font-semibold opacity-0 group-hover:opacity-100 transition-opacity",
                          isLightColor(family.shades[shade])
                            ? "text-zinc-800"
                            : "text-white",
                        )}
                      >
                        {shade}
                      </span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview + Conversions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Color Preview */}
            <Card className="overflow-hidden">
              <div
                className="h-52 sm:h-64 relative transition-colors duration-300 flex items-end"
                style={{ backgroundColor: hex }}
              >
                <div
                  className={cn(
                    "absolute inset-0 p-6 flex flex-col justify-between",
                    isLight ? "text-zinc-900" : "text-white",
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-bold capitalize">
                        {family.name}
                      </h2>
                      <p className="text-lg opacity-70 font-mono mt-1">
                        {tailwindClass}
                      </p>
                    </div>
                    <div className="text-right text-sm font-mono opacity-60">
                      <p>{hex.toUpperCase()}</p>
                    </div>
                  </div>
                  <div className="flex items-end justify-between">
                    <div className="flex gap-2">
                      <span
                        className={cn(
                          "px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm",
                          isLight
                            ? "bg-black/10 text-zinc-900"
                            : "bg-white/15 text-white",
                        )}
                      >
                        Shade {selectedShade}
                      </span>
                      <span
                        className={cn(
                          "px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm",
                          isLight
                            ? "bg-black/10 text-zinc-900"
                            : "bg-white/15 text-white",
                        )}
                      >
                        {hsl ? `${hsl.h}\u00B0` : ""}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-zinc-400">
                    Klik pada format di bawah untuk menyalin
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyAll}
                    className="text-xs"
                  >
                    {copiedAll ? (
                      <>
                        <Check className="h-3 w-3 mr-1" />
                        Tersalin!
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3 mr-1" />
                        Salin Semua
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Format Conversions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-zinc-600">
                    Format Warna
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <FormatRow label="TW" value={tailwindClass} />
                  <FormatRow label="HEX" value={hex.toUpperCase()} />
                  {rgb && (
                    <FormatRow
                      label="RGB"
                      value={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`}
                    />
                  )}
                  {hsl && (
                    <FormatRow
                      label="HSL"
                      value={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`}
                    />
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-zinc-600">
                    Format Lainnya
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {hsv && (
                    <FormatRow
                      label="HSV"
                      value={`hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`}
                    />
                  )}
                  {cmyk && (
                    <FormatRow
                      label="CMYK"
                      value={`cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`}
                    />
                  )}
                  {rgb && (
                    <>
                      <FormatRow
                        label="RGBA"
                        value={`rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`}
                      />
                      <FormatRow
                        label="CSS"
                        value={`--color-${selectedFamily}-${selectedShade}: ${hex.toUpperCase()};`}
                      />
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Quick Reference */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-zinc-600">
                  Penggunaan di Tailwind CSS
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { label: "Background", value: `bg-${tailwindClass}` },
                    { label: "Text", value: `text-${tailwindClass}` },
                    { label: "Border", value: `border-${tailwindClass}` },
                    { label: "Ring", value: `ring-${tailwindClass}` },
                    { label: "Outline", value: `outline-${tailwindClass}` },
                    {
                      label: "Decoration",
                      value: `decoration-${tailwindClass}`,
                    },
                    { label: "Accent", value: `accent-${tailwindClass}` },
                    { label: "Caret", value: `caret-${tailwindClass}` },
                  ].map((item) => (
                    <FormatRow
                      key={item.label}
                      label={item.label}
                      value={item.value}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <SubFooter>Semua warna dari palet default Tailwind CSS v4.</SubFooter>
    </div>
  );
}
