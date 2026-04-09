import { useState, useCallback } from "react";
import { Palette } from "lucide-react";
import { parseColor, buildFormats, type ColorFormats } from "@/lib/colorUtils";
import { ColorFormatCard } from "@/components/colorconverter/ColorFormatCard";
import { ColorPreview } from "@/components/colorconverter/ColorPreview";
import HeaderApp from "@/components/HeaderApp";

const DEFAULT_COLOR = buildFormats(99, 102, 241, 1); // indigo-ish

const FORMAT_LABELS: { key: keyof ColorFormats; label: string }[] = [
  { key: "hex", label: "HEX" },
  { key: "rgb", label: "RGB" },
  { key: "rgba", label: "RGBA" },
  { key: "hsl", label: "HSL" },
  { key: "hsla", label: "HSLA" },
  { key: "hwb", label: "HWB" },
  { key: "oklch", label: "OKLCH" },
  { key: "cmyk", label: "CMYK" },
];

const ColorConverterPage = () => {
  const [inputValue, setInputValue] = useState("#6366F1");
  const [formats, setFormats] = useState<ColorFormats>(DEFAULT_COLOR);
  const [error, setError] = useState(false);

  const handleInputChange = useCallback((val: string) => {
    setInputValue(val);
    const parsed = parseColor(val);
    if (parsed) {
      setFormats(parsed);
      setError(false);
    } else {
      setError(true);
    }
  }, []);

  const handleColorPicker = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const hex = e.target.value;
      setInputValue(hex);
      const parsed = parseColor(hex);
      if (parsed) {
        setFormats(parsed);
        setError(false);
      }
    },
    [],
  );

  return (
    <div className="min-h-screen bg-background bg-grid relative">
      {/* Header */}
      <HeaderApp
        title="Color Converter"
        description="Convert colors between different formats"
        icon={<Palette className="size-10 text-white" />}
        customCss=""
        clientSide={false}
      />
      <div className="absolute inset-0 bg-gradient-radial pointer-events-none" />

      <main className="container mx-auto px-4 py-8">
        {/* Input Section */}
        <div className="mx-auto mb-8 max-w-2xl">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder="#6366F1, rgb(99 102 241), hsl(239,84%,67%), oklch(.6 .2 270), hwb(...), cmyk(...)"
                spellCheck={false}
                className={`w-full rounded-lg border bg-card px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all ${
                  error
                    ? "border-destructive/50 focus:ring-destructive/30"
                    : "border-border focus:ring-primary/30 focus:border-primary/50"
                }`}
              />
              {error && (
                <p className="mt-1.5 text-xs text-destructive">
                  Format tidak dikenali. Coba: #FF5733, rgb(255,87,51),
                  hsl(11,100%,60%)
                </p>
              )}
            </div>
            <label className="relative flex h-[46px] w-[46px] shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-border transition-colors hover:border-primary/40">
              <input
                type="color"
                value={formats.hex}
                onChange={handleColorPicker}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              />
              <div
                className="h-full w-full rounded-lg"
                style={{ backgroundColor: formats.hex }}
              />
            </label>
          </div>
        </div>

        {/* Preview + Formats */}
        <div className="mx-auto max-w-4xl">
          <div className="mb-6">
            <ColorPreview formats={formats} />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {FORMAT_LABELS.map(({ key, label }) => (
              <ColorFormatCard
                key={key}
                format={key}
                label={label}
                formats={formats}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ColorConverterPage;
