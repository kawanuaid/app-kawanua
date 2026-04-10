import { useState, useCallback, useRef } from "react";
import JSZip from "jszip";

export interface FaviconSize {
  name: string;
  size: number;
  fileName: string;
  description: string;
  category: "standard" | "apple" | "android" | "ms";
}

export interface GeneratedFavicon {
  size: FaviconSize;
  blob: Blob;
  url: string;
}

const FAVICON_SIZES: FaviconSize[] = [
  {
    name: "16×16",
    size: 16,
    fileName: "favicon-16x16.png",
    description: "Browser tab (small)",
    category: "standard",
  },
  {
    name: "32×32",
    size: 32,
    fileName: "favicon-32x32.png",
    description: "Browser tab (standard)",
    category: "standard",
  },
  {
    name: "48×48",
    size: 48,
    fileName: "favicon-48x48.png",
    description: "Windows taskbar",
    category: "standard",
  },
  {
    name: "64×64",
    size: 64,
    fileName: "favicon-64x64.png",
    description: "Browser tab (large)",
    category: "standard",
  },
  {
    name: "180×180",
    size: 180,
    fileName: "apple-touch-icon.png",
    description: "Apple Touch Icon",
    category: "apple",
  },
  {
    name: "192×192",
    size: 192,
    fileName: "android-chrome-192x192.png",
    description: "Android Chrome",
    category: "android",
  },
  {
    name: "512×512",
    size: 512,
    fileName: "android-chrome-512x512.png",
    description: "Android Chrome (splash)",
    category: "android",
  },
  {
    name: "150×150",
    size: 150,
    fileName: "mstile-150x150.png",
    description: "Microsoft Tile",
    category: "ms",
  },
];

export function useFaviconGenerator() {
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [sourceFileName, setSourceFileName] = useState<string>("");
  const [generatedFavicons, setGeneratedFavicons] = useState<
    GeneratedFavicon[]
  >([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const handleFileUpload = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      return;
    }

    setSourceFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setSourceImage(dataUrl);

      const img = new Image();
      img.onload = () => {
        imageRef.current = img;
        generateAllSizes(img);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  }, []);

  const generateAllSizes = useCallback((img: HTMLImageElement) => {
    setIsGenerating(true);

    // Use requestAnimationFrame to not block the UI
    requestAnimationFrame(() => {
      const results: GeneratedFavicon[] = [];

      for (const faviconSize of FAVICON_SIZES) {
        const canvas = document.createElement("canvas");
        canvas.width = faviconSize.size;
        canvas.height = faviconSize.size;
        const ctx = canvas.getContext("2d")!;

        // Use high-quality downscaling
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        // Draw the image scaled to fit
        ctx.drawImage(img, 0, 0, faviconSize.size, faviconSize.size);

        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            results.push({
              size: faviconSize,
              blob,
              url,
            });
          }

          // Check if all sizes are generated
          if (results.length === FAVICON_SIZES.length) {
            // Sort by size
            results.sort((a, b) => a.size.size - b.size.size);
            setGeneratedFavicons(results);
            setIsGenerating(false);
          }
        }, "image/png");
      }
    });
  }, []);

  const downloadSingle = useCallback((favicon: GeneratedFavicon) => {
    const link = document.createElement("a");
    link.href = favicon.url;
    link.download = favicon.size.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  const downloadAll = useCallback(async () => {
    const zip = new JSZip();
    const folder = zip.folder("favicons")!;

    for (const favicon of generatedFavicons) {
      folder.file(favicon.size.fileName, favicon.blob);
    }

    // Add HTML snippet
    const htmlSnippet = generateHtmlSnippet();
    folder.file("html-snippet.txt", htmlSnippet);

    // Add web manifest
    const manifest = generateWebManifest();
    folder.file("site.webmanifest", manifest);

    const content = await zip.generateAsync({ type: "blob" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(content);
    link.download = "favicons.zip";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  }, [generatedFavicons]);

  const reset = useCallback(() => {
    setSourceImage(null);
    setSourceFileName("");
    for (const favicon of generatedFavicons) {
      URL.revokeObjectURL(favicon.url);
    }
    setGeneratedFavicons([]);
    imageRef.current = null;
  }, [generatedFavicons]);

  return {
    sourceImage,
    sourceFileName,
    generatedFavicons,
    isGenerating,
    handleFileUpload,
    downloadSingle,
    downloadAll,
    reset,
    FAVICON_SIZES,
  };
}

function generateHtmlSnippet(): string {
  return `<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png">
<link rel="icon" type="image/png" sizes="64x64" href="/favicon-64x64.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="msapplication-TileImage" content="/mstile-150x150.png">`;
}

function generateWebManifest(): string {
  return JSON.stringify(
    {
      name: "",
      short_name: "",
      icons: [
        {
          src: "/android-chrome-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "/android-chrome-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
      theme_color: "#ffffff",
      background_color: "#ffffff",
      display: "standalone",
    },
    null,
    2,
  );
}
