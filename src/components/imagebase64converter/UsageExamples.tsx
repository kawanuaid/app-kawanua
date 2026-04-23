import { useState, useCallback } from "react";
import {
  Check,
  ClipboardCopy,
  Code2,
  FileCode,
  Braces,
  Hash,
  Link,
  Palette,
  Globe,
  Layout,
  Image,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface UsageExamplesProps {
  dataUri: string;
}

interface ExampleItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  language: string;
  code: string;
}

function truncateBase64(str: string, maxLen = 60): string {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen) + "...";
}

function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = code;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  return (
    <div className="relative group rounded-lg overflow-hidden border border-border/40 bg-[#1e1e2e]">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#181825] border-b border-white/5">
        <span className="text-xs text-white/40 font-mono">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors cursor-pointer px-2 py-1 rounded hover:bg-white/10"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-green-400" />
              <span className="text-green-400">Tersalin!</span>
            </>
          ) : (
            <>
              <ClipboardCopy className="w-3.5 h-3.5" />
              <span>Salin</span>
            </>
          )}
        </button>
      </div>
      {/* Code content */}
      <pre className="p-4 overflow-x-auto text-sm leading-relaxed">
        <code className="text-[#cdd6f4] font-mono text-xs whitespace-pre-wrap break-all">
          {code}
        </code>
      </pre>
    </div>
  );
}

export default function UsageExamples({ dataUri }: UsageExamplesProps) {
  const shortB64 = truncateBase64(dataUri, 80);
  const mimeType = dataUri.match(/data:([^;]+)/)?.[1] || "image/png";
  const base64Raw = dataUri.split(",")[1] || "";

  const examples: ExampleItem[] = [
    {
      id: "html-img",
      title: "HTML <img> Tag",
      description: "Embed gambar dalam elemen HTML.",
      icon: <Image className="w-4 h-4" />,
      language: "HTML",
      code: `<img\n  src="${dataUri}"\n  alt="My Image"\n  width="300"\n/>`,
    },
    {
      id: "html-img-short",
      title: "HTML <img> (Responsive)",
      description: "Gambar responsif dengan max-width.",
      icon: <Image className="w-4 h-4" />,
      language: "HTML",
      code: `<img\n  src="${dataUri}"\n  alt="My Image"\n  style="max-width: 100%; height: auto;"\n/>`,
    },
    {
      id: "css-bg",
      title: "CSS Background Image",
      description: "Gunakan sebagai property CSS background-image.",
      icon: <Palette className="w-4 h-4" />,
      language: "CSS",
      code: `.my-element {\n  background-image: url("${dataUri}");\n  background-size: cover;\n  background-position: center;\n  background-repeat: no-repeat;\n  width: 300px;\n  height: 200px;\n}`,
    },
    {
      id: "css-bg-short",
      title: "CSS Background (Shorthand)",
      description: "Shorthand CSS background property.",
      icon: <Palette className="w-4 h-4" />,
      language: "CSS",
      code: `.hero-banner {\n  background: url("${dataUri}") center/cover no-repeat;\n  min-height: 400px;\n}`,
    },
    {
      id: "react-jsx",
      title: "React JSX",
      description: "Gunakan dalam React component.",
      icon: <Braces className="w-4 h-4" />,
      language: "JSX",
      code: `import React from "react";\n\nexport default function MyComponent() {\n  return (\n    <img\n      src="${dataUri}"\n      alt="My Image"\n      style={{ maxWidth: "100%", height: "auto" }}\n    />\n  );\n}`,
    },
    {
      id: "tailwind",
      title: "Tailwind CSS",
      description: "Gunakan dengan sintaks arbitrary value Tailwind.",
      icon: <Hash className="w-4 h-4" />,
      language: "HTML",
      code: `<div\n  class="w-[300px] h-[200px] bg-cover bg-center bg-no-repeat"\n  style="background-image: url('${dataUri}')"\n>\n  <!-- Your content here -->\n</div>`,
    },
    {
      id: "css-content",
      title: "CSS ::before / ::after",
      description: "Gunakan dalam elemen CSS pseudo dengan properti content.",
      icon: <FileCode className="w-4 h-4" />,
      language: "CSS",
      code: `.icon::before {\n  content: "";\n  display: inline-block;\n  width: 24px;\n  height: 24px;\n  background-image: url("${dataUri}");\n  background-size: contain;\n  background-repeat: no-repeat;\n  margin-right: 8px;\n  vertical-align: middle;\n}`,
    },
    {
      id: "favicon",
      title: "HTML Favicon",
      description: "Set sebagai icon tab browser.",
      icon: <Globe className="w-4 h-4" />,
      language: "HTML",
      code: `<link\n  rel="icon"\n  type="${mimeType}"\n  href="${dataUri}"\n/>`,
    },
    {
      id: "anchor-link",
      title: "HTML Download Link",
      description: "Buat link download yang bisa diklik.",
      icon: <Link className="w-4 h-4" />,
      language: "HTML",
      code: `<a\n  href="${dataUri}"\n  download="my-image.png"\n>\n  Klik untuk Download Gambar\n</a>`,
    },
    {
      id: "markdown",
      title: "Markdown",
      description: "Embed dalam file Markdown (README, docs, dll.).",
      icon: <Layout className="w-4 h-4" />,
      language: "Markdown",
      code: `![Alt text](${dataUri})`,
    },
    {
      id: "form-hidden",
      title: "HTML Hidden Input (Form)",
      description: "Kirim data gambar dalam form submission.",
      icon: <Code2 className="w-4 h-4" />,
      language: "HTML",
      code: `<form action="/upload" method="POST">\n  <input\n    type="hidden"\n    name="imageData"\n    value="${base64Raw.slice(0, 60)}..."\n  />\n  <button type="submit">Submit</button>\n</form>`,
    },
    {
      id: "svg-foreignobject",
      title: "SVG <image> Tag",
      description: "Embed dalam elemen gambar SVG.",
      icon: <FileCode className="w-4 h-4" />,
      language: "SVG",
      code: `<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">\n  <image\n    href="${dataUri}"\n    x="0"\n    y="0"\n    width="300"\n    height="200"\n  />\n</svg>`,
    },
  ];

  const [expandedExamples, setExpandedExamples] = useState<Set<string>>(
    new Set(),
  );

  const toggleExpand = (id: string) => {
    setExpandedExamples((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <Card className="border-border/50 bg-white/80 backdrop-blur-sm mt-6">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="text-lg">Contoh Penggunaan</CardTitle>
            <CardDescription>
              Cara menggunakan gambar Base64 Anda dalam berbagai konteks — klik
              untuk memperluas.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-muted/50 rounded-lg flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground font-medium">
            Pratinjau:
          </span>
          <Badge variant="secondary">{mimeType}</Badge>
          <Badge variant="secondary">
            {dataUri.length.toLocaleString()} karakter
          </Badge>
          <Badge variant="outline" className="font-mono text-[10px]">
            {shortB64}
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {examples.map((example) => {
            const isExpanded = expandedExamples.has(example.id);
            return (
              <div
                key={example.id}
                className={cn(
                  "rounded-lg border border-border/40 bg-muted/20 transition-all",
                  isExpanded && "sm:col-span-2",
                )}
              >
                {/* Collapsed header - always visible */}
                <button
                  onClick={() => toggleExpand(example.id)}
                  className="w-full flex items-center gap-3 p-3 text-left cursor-pointer hover:bg-muted/40 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    {example.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {example.title}
                      </span>
                      <Badge
                        variant="outline"
                        className="text-[10px] px-1.5 py-0"
                      >
                        {example.language}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {example.description}
                    </p>
                  </div>
                  <svg
                    className={cn(
                      "w-4 h-4 text-muted-foreground transition-transform shrink-0",
                      isExpanded && "rotate-180",
                    )}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Expanded code block */}
                {isExpanded && (
                  <div className="px-3 pb-3">
                    <CodeBlock
                      code={example.code}
                      language={example.language}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
