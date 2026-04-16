import { useState, useMemo, useCallback } from "react";
import {
  Image,
  Copy,
  Check,
  RefreshCw,
  Code2,
  Link,
  FileImage,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Maximize,
  Monitor,
  Smartphone,
  Tablet,
  Square,
  RectangleHorizontal,
  RectangleVertical,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import HeaderApp from "@/components/HeaderApp";
import { SubFooter } from "@/components/Footer";

type CodeTab = "html" | "markdown" | "css";

const PRESETS = [
  { label: "Avatar", width: 150, height: 150, icon: Square },
  { label: "Thumbnail", width: 300, height: 200, icon: RectangleHorizontal },
  { label: "Banner", width: 728, height: 90, icon: RectangleHorizontal },
  { label: "Hero Desktop", width: 1920, height: 1080, icon: Monitor },
  { label: "Hero Mobile", width: 750, height: 1334, icon: Smartphone },
  { label: "Tablet", width: 1024, height: 768, icon: Tablet },
  { label: "Card Image", width: 400, height: 300, icon: FileImage },
  { label: "Square MD", width: 500, height: 500, icon: Square },
  { label: "Wide", width: 1200, height: 630, icon: RectangleHorizontal },
  { label: "Tall", width: 400, height: 600, icon: RectangleVertical },
  { label: "OG Image", width: 1200, height: 630, icon: Link },
  { label: "Favicon", width: 32, height: 32, icon: StarIcon },
];

function StarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function ImagePlaceholderPage() {
  const [width, setWidth] = useState(640);
  const [height, setHeight] = useState(480);
  const [text, setText] = useState("");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showCodeSnippet, setShowCodeSnippet] = useState(false);
  const [codeTab, setCodeTab] = useState<CodeTab>("html");
  const [imageKey, setImageKey] = useState(0);

  const displayText = text || `i.kid.or.id`;
  const encodedText = encodeURIComponent(displayText);

  const imageUrl = useMemo(
    () => `https://i.kid.or.id/${width}/${height}/${encodedText}`,
    [width, height, encodedText],
  );

  const copyToClipboard = useCallback(async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    }
  }, []);

  const codeSnippets = useMemo(() => {
    switch (codeTab) {
      case "html":
        return `<img src="${imageUrl}" alt="${displayText}" width="${width}" height="${height}" />`;
      case "markdown":
        return `![${displayText}](${imageUrl})`;
      case "css":
        return `background-image: url('${imageUrl}');
background-size: cover;
width: ${width}px;
height: ${height}px;`;
    }
  }, [codeTab, imageUrl, displayText, width, height]);

  const handlePresetClick = useCallback((preset: (typeof PRESETS)[number]) => {
    setWidth(preset.width);
    setHeight(preset.height);
    setText("");
    setImageKey((k) => k + 1);
  }, []);

  const handleSwapDimensions = useCallback(() => {
    setHeight((h) => {
      setWidth(h);
      return width;
    });
    setImageKey((k) => k + 1);
  }, [width]);

  const handleRefresh = useCallback(() => {
    setImageKey((k) => k + 1);
  }, []);

  const aspectRatio = width / height;

  return (
    <div className="min-h-screen bg-background bg-grid relative">
      <HeaderApp
        title={"Image Placeholder"}
        description={
          "Buatkan image placeholder untuk mockups dan prototipe aplikasi Anda dengan mudah dan cepat."
        }
        icon={<Maximize className="size-10 text-white" />}
        customCss={""}
        clientSide={false}
      />
      <div className="absolute inset-0 bg-gradient-radial pointer-events-none" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 p-8 sm:p-12 text-white shadow-2xl shadow-blue-500/20">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40" />
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
              Fill the gap, instantly.
            </h2>
            <p className="text-blue-100 text-lg max-w-2xl">
              Generate beautiful placeholder images for your mockups and
              prototypes. Customize dimensions, add text, and copy the URL — all
              in seconds.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2.5 font-mono text-sm border border-white/20">
              <span className="text-blue-200">URL:</span>
              <span className="text-white font-semibold">
                https://i.kid.or.id/{"{width}"}/{"{height}"}/{"{text}"}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Configuration Panel */}
          <div className="lg:col-span-5 space-y-6">
            {/* Dimensions Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Maximize className="h-5 w-5 text-primary" />
                  Dimensions
                </CardTitle>
                <CardDescription>
                  Set the width and height for your placeholder image
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Width */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="width" className="text-sm font-medium">
                      Width
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="width"
                        type="number"
                        min={1}
                        max={3840}
                        value={width}
                        onChange={(e) => {
                          const v = Math.max(
                            1,
                            Math.min(3840, Number(e.target.value) || 1),
                          );
                          setWidth(v);
                          setImageKey((k) => k + 1);
                        }}
                        className="w-24 h-8 text-center text-sm"
                      />
                      <span className="text-xs text-muted-foreground">px</span>
                    </div>
                  </div>
                  <Slider
                    value={[width]}
                    onValueChange={(v) => {
                      setWidth(v[0]);
                      setImageKey((k) => k + 1);
                    }}
                    min={1}
                    max={3840}
                    step={1}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>1px</span>
                    <span>3840px</span>
                  </div>
                </div>

                {/* Swap Button */}
                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleSwapDimensions}
                    className="rounded-full h-9 w-9"
                    title="Swap dimensions"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>

                {/* Height */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="height" className="text-sm font-medium">
                      Height
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="height"
                        type="number"
                        min={1}
                        max={2160}
                        value={height}
                        onChange={(e) => {
                          const v = Math.max(
                            1,
                            Math.min(2160, Number(e.target.value) || 1),
                          );
                          setHeight(v);
                          setImageKey((k) => k + 1);
                        }}
                        className="w-24 h-8 text-center text-sm"
                      />
                      <span className="text-xs text-muted-foreground">px</span>
                    </div>
                  </div>
                  <Slider
                    value={[height]}
                    onValueChange={(v) => {
                      setHeight(v[0]);
                      setImageKey((k) => k + 1);
                    }}
                    min={1}
                    max={2160}
                    step={1}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>1px</span>
                    <span>2160px</span>
                  </div>
                </div>

                {/* Info */}
                <div className="flex items-center justify-between rounded-lg bg-muted/60 px-4 py-2.5">
                  <span className="text-sm text-muted-foreground">
                    Aspect Ratio
                  </span>
                  <Badge variant="secondary" className="font-mono">
                    {aspectRatio >= 1
                      ? `${aspectRatio.toFixed(2)}:1`
                      : `1:${(1 / aspectRatio).toFixed(2)}`}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Text Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Code2 className="h-5 w-5 text-primary" />
                  Custom Text
                </CardTitle>
                <CardDescription>
                  Add custom text to display on the placeholder
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Input
                    placeholder="i.kid.or.id"
                    value={text}
                    onChange={(e) => {
                      setText(e.target.value);
                      setImageKey((k) => k + 1);
                    }}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    Leave empty to use "i.kid.or.id" as default text
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Presets Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Monitor className="h-5 w-5 text-primary" />
                  Quick Presets
                </CardTitle>
                <CardDescription>
                  Common image sizes for various use cases
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {PRESETS.map((preset) => {
                    const Icon = preset.icon;
                    const isActive =
                      width === preset.width &&
                      height === preset.height &&
                      text === "";
                    return (
                      <button
                        key={preset.label}
                        onClick={() => handlePresetClick(preset)}
                        className={cn(
                          "flex items-center gap-2.5 rounded-lg border px-3 py-2.5 text-sm transition-all cursor-pointer",
                          isActive
                            ? "border-primary bg-primary/5 text-primary shadow-sm"
                            : "border-border hover:border-primary/50 hover:bg-muted/50 text-foreground",
                        )}
                      >
                        <Icon
                          className={cn(
                            "h-4 w-4 shrink-0",
                            isActive ? "text-primary" : "text-muted-foreground",
                          )}
                        />
                        <div className="text-left">
                          <div className="font-medium text-xs">
                            {preset.label}
                          </div>
                          <div className="text-[10px] text-muted-foreground">
                            {preset.width}×{preset.height}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview & Output Panel */}
          <div className="lg:col-span-7 space-y-6">
            {/* Preview Card */}
            <Card className="overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FileImage className="h-5 w-5 text-primary" />
                    Preview
                  </CardTitle>
                  <CardDescription className="mt-1.5">
                    {width} × {height} pixels • {displayText}
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={handleRefresh}>
                  <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                  Refresh
                </Button>
              </CardHeader>
              <CardContent>
                <div className="relative rounded-xl border-2 border-dashed border-muted-foreground/20 bg-[repeating-conic-gradient(#f1f5f9_0%_25%,#fff_0%_50%)] bg-[length:20px_20px] flex items-center justify-center min-h-[300px] max-h-[500px] overflow-auto p-4">
                  <img
                    key={imageKey}
                    src={imageUrl}
                    alt={`Placeholder ${displayText}`}
                    className="max-w-full h-auto shadow-lg rounded-md"
                    style={{
                      maxHeight: "460px",
                      objectFit: "contain",
                    }}
                    loading="eager"
                  />
                </div>
              </CardContent>
            </Card>

            {/* URL Output Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Link className="h-5 w-5 text-primary" />
                  Generated URL
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="flex-1 rounded-lg bg-muted/80 px-4 py-3 font-mono text-sm break-all select-all border">
                    {imageUrl}
                  </div>
                  <Button
                    variant={copiedField === "url" ? "default" : "outline"}
                    size="icon"
                    onClick={() => copyToClipboard(imageUrl, "url")}
                    className="shrink-0"
                  >
                    {copiedField === "url" ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Code Snippets Card */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Code2 className="h-5 w-5 text-primary" />
                    Code Snippets
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowCodeSnippet(!showCodeSnippet)}
                  >
                    {showCodeSnippet ? (
                      <ChevronUp className="h-4 w-4 mr-1" />
                    ) : (
                      <ChevronDown className="h-4 w-4 mr-1" />
                    )}
                    {showCodeSnippet ? "Hide" : "Show"}
                  </Button>
                </div>
              </CardHeader>
              {showCodeSnippet && (
                <CardContent className="space-y-4">
                  {/* Tabs */}
                  <div className="flex gap-1 rounded-lg bg-muted p-1 w-fit">
                    {(["html", "markdown", "css"] as CodeTab[]).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setCodeTab(tab)}
                        className={cn(
                          "px-4 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer",
                          codeTab === tab
                            ? "bg-background text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground",
                        )}
                      >
                        {tab === "html"
                          ? "HTML"
                          : tab === "markdown"
                            ? "Markdown"
                            : "CSS"}
                      </button>
                    ))}
                  </div>

                  {/* Code Block */}
                  <div className="relative">
                    <pre className="rounded-lg bg-zinc-900 text-zinc-100 p-4 text-sm overflow-x-auto font-mono leading-relaxed">
                      <code>{codeSnippets}</code>
                    </pre>
                    <Button
                      variant={copiedField === "code" ? "default" : "secondary"}
                      size="sm"
                      onClick={() => copyToClipboard(codeSnippets, "code")}
                      className="absolute top-3 right-3 bg-white/10 hover:bg-white/20 text-white border-0"
                    >
                      {copiedField === "code" ? (
                        <>
                          <Check className="h-3.5 w-3.5 mr-1" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5 mr-1" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <SubFooter>
        Powered by{" "}
        <a
          href="https://kid.or.id"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline font-medium"
        >
          KawanuaDev
        </a>
      </SubFooter>
    </div>
  );
}

export default ImagePlaceholderPage;
