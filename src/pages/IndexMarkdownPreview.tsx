"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Copy,
  Download,
  RefreshCw,
  Eye,
  Pencil,
  FileSearch,
} from "lucide-react";
import EditorPane from "@/components/markdown/EditorPane";
import PreviewPane from "@/components/markdown/PreviewPane";
import { HeaderHorizontal } from "@/components/HeaderApp";

// Default text untuk inisialisasi
const DEFAULT_MARKDOWN = `# Halo Dunia! 👋

Selamat datang di ~MD Editor~ **Markdown Previewer** yang dipersembahkan oleh _KawanuaDev_ dan disponsori oleh Kawanua ID.

## Fitur:
- [x] Real-time preview
- [x] Dukungan GitHub Flavored Markdown (GFM)
- [x] Syntax highlighting code block
- [ ] Export ke file .md

### Contoh Code:
\`\`\`javascript
function greet(name) {
  console.log(\`Hello, \${name}!\`);
}
\`\`\`

> "Simplicity is the ultimate sophistication." 
> — Leonardo da Vinci

Silakan ketik di sebelah kiri (atau tab Edit di mobile)!
`;

export default function MarkdownPreviewPage() {
  const [markdown, setMarkdown] = useState<string>(DEFAULT_MARKDOWN);
  const [wordCount, setWordCount] = useState<number>(0);

  // Hitung kata sederhana
  useEffect(() => {
    const words = markdown
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0);
    setWordCount(words.length);
  }, [markdown]);

  const handleCopy = () => {
    navigator.clipboard.writeText(markdown);
    alert("Markdown disalin ke clipboard!");
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([markdown], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "document.md";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleClear = () => {
    if (window.confirm("Yakin ingin menghapus semua konten?")) {
      setMarkdown("");
    }
  };

  return (
    <div className="min-h-screen bg-background bg-grid relative">
      {/* Header */}
      <HeaderHorizontal
        title={"Markdown Previewer"}
        description={"Tampilkan hasil markdown secara real-time."}
        icon={<FileSearch className="w-5 h-5 text-white" />}
      >
        <span className="text-xs font-mono bg-secondary px-2 py-1 rounded text-secondary-foreground mr-2 hidden sm:inline-block">
          {wordCount} words
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          title="Copy Markdown"
        >
          <Copy className="w-4 h-4" /> Salin
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDownload}
          title="Download .md"
        >
          <Download className="w-4 h-4" /> Simpan
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={handleClear}
          title="Clear All"
        >
          <RefreshCw className="w-4 h-4" /> Hapus
        </Button>
      </HeaderHorizontal>

      <div className="absolute inset-0 bg-gradient-radial pointer-events-none" />

      {/* Main Content Area */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-180px)] min-h-[500px] mt-10 px-4">
        {/* Mobile Tabs Wrapper */}
        <div className="lg:hidden">
          <Tabs defaultValue="edit" className="w-full h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="edit">
                <Pencil className="w-4 h-4 mr-2" /> Edit
              </TabsTrigger>
              <TabsTrigger value="preview">
                <Eye className="w-4 h-4 mr-2" /> Preview
              </TabsTrigger>
            </TabsList>

            <TabsContent value="edit" className="flex-1 mt-2 h-full">
              <EditorPane markdown={markdown} setMarkdown={setMarkdown} />
            </TabsContent>

            <TabsContent
              value="preview"
              className="flex-1 mt-2 h-full overflow-auto"
            >
              <PreviewPane markdown={markdown} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Desktop Split View (Hidden on Mobile) */}
        <div className="hidden lg:flex flex-col h-full gap-4">
          <div className="flex-1 relative group">
            <div className="absolute -top-2 left-2 bg-background px-2 text-xs font-semibold text-muted-foreground z-10">
              EDITOR
            </div>
            <EditorPane markdown={markdown} setMarkdown={setMarkdown} />
          </div>
        </div>

        <div className="hidden lg:flex flex-col h-full gap-4">
          <div className="flex-1 relative">
            <div className="absolute -top-2 left-2 bg-background px-2 text-xs font-semibold text-muted-foreground z-10">
              PREVIEW
            </div>
            <PreviewPane markdown={markdown} />
          </div>
        </div>
      </main>
    </div>
  );
}
