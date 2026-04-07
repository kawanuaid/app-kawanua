import { useState, useEffect, useRef, useCallback } from "react";
import QRCode from "qrcode";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, QrCode } from "lucide-react";

const SIZE_OPTIONS = [
  { label: "128 × 128", value: 128 },
  { label: "256 × 256", value: 256 },
  { label: "512 × 512", value: 512 },
  { label: "1024 × 1024", value: 1024 },
];

const QRCodeGenerator = () => {
  const [text, setText] = useState("https://kawanua.id");
  const [fgColor, setFgColor] = useState("#22C55E");
  const [bgColor, setBgColor] = useState("#0F1419");
  const [size, setSize] = useState(256);
  const [format, setFormat] = useState<"png" | "jpeg" | "svg">("png");
  const [errorLevel, setErrorLevel] = useState<"L" | "M" | "Q" | "H">("M");
  const [margin, setMargin] = useState(2);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [svgData, setSvgData] = useState("");

  const qrOptions = {
    width: size,
    margin,
    errorCorrectionLevel: errorLevel,
    color: { dark: fgColor, light: bgColor },
  };

  const generateQR = useCallback(async () => {
    if (!text.trim()) return;

    try {
      if (canvasRef.current) {
        await QRCode.toCanvas(canvasRef.current, text, qrOptions);
      }
      const svg = await QRCode.toString(text, { ...qrOptions, type: "svg" });
      setSvgData(svg);
    } catch (err) {
      console.error(err);
    }
  }, [text, fgColor, bgColor, size, errorLevel, margin]);

  useEffect(() => {
    generateQR();
  }, [generateQR]);

  const handleDownload = async () => {
    if (!text.trim()) return;

    if (format === "svg") {
      const blob = new Blob([svgData], { type: "image/svg+xml" });
      downloadBlob(blob, "qrcode.svg");
      return;
    }

    const canvas = document.createElement("canvas");
    await QRCode.toCanvas(canvas, text, {
      ...qrOptions,
    });

    canvas.toBlob(
      (blob) => {
        if (blob) downloadBlob(blob, `qrcode.${format}`);
      },
      format === "jpeg" ? "image/jpeg" : "image/png",
      1,
    );
  };

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Controls */}
      <Card className="border-border bg-card">
        <CardContent className="p-6 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="text" className="text-foreground">
              Teks / URL
            </Label>
            <Input
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Masukkan teks atau URL..."
              className="bg-muted border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-foreground">Warna QR</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="w-10 h-10 rounded-md border border-border cursor-pointer bg-transparent"
                />
                <Input
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="bg-muted border-border text-foreground font-mono text-sm"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Warna Background</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-10 h-10 rounded-md border border-border cursor-pointer bg-transparent"
                />
                <Input
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="bg-muted border-border text-foreground font-mono text-sm"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-foreground">Ukuran</Label>
              <Select
                value={String(size)}
                onValueChange={(v) => setSize(Number(v))}
              >
                <SelectTrigger className="bg-muted border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SIZE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={String(opt.value)}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-foreground">Error Correction</Label>
              <Select
                value={errorLevel}
                onValueChange={(v) => setErrorLevel(v as "L" | "M" | "Q" | "H")}
              >
                <SelectTrigger className="bg-muted border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="L">L — Low (7%)</SelectItem>
                  <SelectItem value="M">M — Medium (15%)</SelectItem>
                  <SelectItem value="Q">Q — Quartile (25%)</SelectItem>
                  <SelectItem value="H">H — High (30%)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-foreground">Margin</Label>
              <span className="text-sm text-muted-foreground font-mono">
                {margin}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={10}
              value={margin}
              onChange={(e) => setMargin(Number(e.target.value))}
              className="w-full accent-primary h-2 rounded-full bg-muted cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-foreground">Format Download</Label>
            <Select
              value={format}
              onValueChange={(v) => setFormat(v as "png" | "jpeg" | "svg")}
            >
              <SelectTrigger className="bg-muted border-border text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="png">PNG</SelectItem>
                <SelectItem value="jpeg">JPEG</SelectItem>
                <SelectItem value="svg">SVG</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleDownload}
            disabled={!text.trim()}
            className="w-full gap-2"
          >
            <Download className="w-4 h-4" />
            Download {format.toUpperCase()}
          </Button>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card className="border-border bg-card flex items-center justify-center">
        <CardContent className="p-6 flex flex-col items-center gap-4">
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <QrCode className="w-4 h-4" />
            Preview
          </div>
          <div className="rounded-xl overflow-hidden border border-border shadow-lg shadow-primary/5">
            <canvas ref={canvasRef} className="block max-w-full h-auto" />
          </div>
          {text.trim() && (
            <p className="text-xs text-muted-foreground max-w-[200px] truncate text-center">
              {text}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default QRCodeGenerator;
