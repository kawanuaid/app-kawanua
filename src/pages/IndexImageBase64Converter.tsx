import { useState, useCallback, useRef, useEffect } from "react";
import {
  ImageIcon,
  Code2,
  Upload,
  ClipboardCopy,
  Check,
  Download,
  X,
  FileImage,
  ArrowRightLeft,
  Sparkles,
  Image as ImageIconLucide,
  Trash2,
  AlertCircle,
  ZoomIn,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/imagebase64converter/ui/badge";
import { cn } from "@/lib/utils";
import UsageExamples from "@/components/imagebase64converter/UsageExamples";
import HeaderApp from "@/components/HeaderApp";
import formatFileSize from "@/hooks/useFormatSize";
import Features from "@/components/imagebase64converter/Features";

interface FileInfo {
  name: string;
  size: number;
  type: string;
  width: number;
  height: number;
}

export default function ImageBase64ConverterPage() {
  const [activeTab, setActiveTab] = useState("img-to-base64");

  // Image to Base64 state
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [base64Output, setBase64Output] = useState<string>("");
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [copied, setCopied] = useState(false);
  const [includeDataUri, setIncludeDataUri] = useState(true);
  const [imageZoomed, setImageZoomed] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Base64 to Image state
  const [base64Input, setBase64Input] = useState<string>("");
  const [decodedImage, setDecodedImage] = useState<string | null>(null);
  const [decodeError, setDecodeError] = useState<string>("");
  const [decodedFileInfo, setDecodedFileInfo] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [decodedZoomed, setDecodedZoomed] = useState(false);

  // Image to Base64 conversion
  const handleImageUpload = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) {
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setImagePreview(dataUrl);

        // Get image dimensions
        const img = new Image();
        img.onload = () => {
          setFileInfo({
            name: file.name,
            size: file.size,
            type: file.type,
            width: img.width,
            height: img.height,
          });
        };
        img.src = dataUrl;

        // Convert to base64
        if (includeDataUri) {
          setBase64Output(dataUrl);
        } else {
          setBase64Output(dataUrl.split(",")[1] || "");
        }
      };
      reader.readAsDataURL(file);
    },
    [includeDataUri],
  );

  // Update base64 output when data URI toggle changes
  useEffect(() => {
    if (imagePreview) {
      if (includeDataUri) {
        setBase64Output(imagePreview);
      } else {
        setBase64Output(imagePreview.split(",")[1] || "");
      }
    }
  }, [includeDataUri, imagePreview]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleImageUpload(file);
    },
    [handleImageUpload],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleImageUpload(file);
    },
    [handleImageUpload],
  );

  const clearImage = useCallback(() => {
    setImagePreview(null);
    setBase64Output("");
    setFileInfo(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(base64Output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement("textarea");
      textarea.value = base64Output;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [base64Output]);

  // Base64 to Image conversion
  const handleBase64Input = useCallback((value: string) => {
    setBase64Input(value);
    setDecodeError("");

    if (!value.trim()) {
      setDecodedImage(null);
      setDecodedFileInfo(null);
      return;
    }

    let imageData = value.trim();

    // If it doesn't start with data:, try to detect format and prepend
    if (!imageData.startsWith("data:")) {
      // Try to detect image format from base64 header
      if (imageData.startsWith("/9j/")) {
        imageData = "data:image/jpeg;base64," + imageData;
      } else if (imageData.startsWith("iVBOR")) {
        imageData = "data:image/png;base64," + imageData;
      } else if (imageData.startsWith("R0lGOD")) {
        imageData = "data:image/gif;base64," + imageData;
      } else if (imageData.startsWith("UklGR")) {
        imageData = "data:image/webp;base64," + imageData;
      } else if (imageData.startsWith("PHN2Zy")) {
        imageData = "data:image/svg+xml;base64," + imageData;
      } else {
        // Default to PNG
        imageData = "data:image/png;base64," + imageData;
      }
    }

    const img = new Image();
    img.onload = () => {
      setDecodedImage(imageData);
      setDecodedFileInfo({ width: img.width, height: img.height });
      setDecodeError("");
    };
    img.onerror = () => {
      setDecodedImage(null);
      setDecodedFileInfo(null);
      setDecodeError("Invalid Base64 string. Please check your input.");
    };
    img.src = imageData;
  }, []);

  const downloadImage = useCallback(() => {
    if (!decodedImage) return;
    const link = document.createElement("a");
    link.href = decodedImage;
    link.download = "decoded-image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [decodedImage]);

  const clearBase64 = useCallback(() => {
    setBase64Input("");
    setDecodedImage(null);
    setDecodeError("");
    setDecodedFileInfo(null);
  }, []);

  return (
    <main className="min-h-screen bg-background bg-grid relative">
      {/* Header */}
      <HeaderApp
        title={"Image ↔ Base64 Converter"}
        description={
          "Konversi gambar ke Base64 dan sebaliknya dengan mudah. Mendukung semua format gambar utama."
        }
        icon={<Code2 className="size-10 text-white" />}
        customCss=""
      />
      <div className="absolute inset-0 bg-gradient-radial pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-center mb-0">
            <TabsList className="bg-white/80 backdrop-blur-sm border border-border/50 shadow-sm">
              <TabsTrigger value="img-to-base64" className="gap-2">
                <ImageIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Image ke Base64</span>
                <span className="sm:hidden">Img → B64</span>
              </TabsTrigger>
              <TabsTrigger value="base64-to-img" className="gap-2">
                <Code2 className="w-4 h-4" />
                <span className="hidden sm:inline">Base64 ke Image</span>
                <span className="sm:hidden">B64 → Img</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Image to Base64 Tab */}
          <TabsContent value="img-to-base64">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Upload Section */}
              <Card className="border-border/50 bg-white/80 backdrop-blur-sm flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Upload className="w-5 h-5 text-primary" />
                    Unggah gambar
                  </CardTitle>
                  <CardDescription>
                    Drag & drop atau pilih gambar untuk diubah ke Base64.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!imagePreview ? (
                    <div
                      className={cn(
                        "relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer",
                        "hover:border-primary/50 hover:bg-primary/5",
                        isDragging
                          ? "border-primary bg-primary/10 scale-[1.02]"
                          : "border-border/60",
                      )}
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <div className="flex flex-col items-center gap-3">
                        <div
                          className={cn(
                            "w-16 h-16 rounded-full flex items-center justify-center transition-colors",
                            isDragging
                              ? "bg-primary/20 text-primary"
                              : "bg-muted text-muted-foreground",
                          )}
                        >
                          <FileImage className="w-8 h-8" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            Drop gambar di sini
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            PNG, JPG, GIF, SVG, WebP — maksimal 10MB.
                          </p>
                        </div>
                        <Button variant="outline" size="sm" type="button">
                          <Upload className="w-3.5 h-3.5" />
                          Pilih file
                        </Button>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="relative group rounded-xl overflow-hidden border border-border/50 bg-muted/30">
                        <img
                          src={imagePreview}
                          alt="Uploaded"
                          className="w-full max-h-64 object-contain cursor-zoom-in"
                          onClick={() => setImageZoomed(true)}
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8"
                          onClick={clearImage}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                        <div
                          className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          onClick={() => setImageZoomed(true)}
                        >
                          <div className="bg-black/60 text-white rounded-md p-1.5">
                            <ZoomIn className="w-4 h-4" />
                          </div>
                        </div>
                      </div>

                      {/* File Info */}
                      {fileInfo && (
                        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                          <div className="flex items-center gap-2 mb-3">
                            <ImageIconLucide className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium">
                              Informasi File
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-muted-foreground">
                                Nama:
                              </span>
                              <p
                                className="font-medium truncate"
                                title={fileInfo.name}
                              >
                                {fileInfo.name}
                              </p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">
                                Ukuran:
                              </span>
                              <p className="font-medium">
                                {formatFileSize(fileInfo.size)}
                              </p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">
                                Tipe:
                              </span>
                              <p className="font-medium">{fileInfo.type}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">
                                Dimensi:
                              </span>
                              <p className="font-medium">
                                {fileInfo.width} × {fileInfo.height}px
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-3">
                            <Badge variant="success">
                              {fileInfo.type.split("/")[1].toUpperCase()}
                            </Badge>
                            <Badge variant="secondary">
                              {fileInfo.width}×{fileInfo.height}
                            </Badge>
                            <Badge variant="secondary">
                              {formatFileSize(fileInfo.size)}
                            </Badge>
                          </div>
                        </div>
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="w-3.5 h-3.5" />
                        Upload gambar berbeda
                      </Button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Base64 Output */}
              <Card className="border-border/50 bg-white/80 backdrop-blur-sm flex flex-col">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Code2 className="w-5 h-5 text-primary" />
                        Base64 Output
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {base64Output
                          ? `${base64Output.length.toLocaleString()} karakter`
                          : "Upload gambar untuk melihat output Base64."}
                      </CardDescription>
                    </div>
                    {base64Output && (
                      <div className="flex items-center gap-2">
                        <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
                          <input
                            type="checkbox"
                            checked={includeDataUri}
                            onChange={(e) =>
                              setIncludeDataUri(e.target.checked)
                            }
                            className="rounded border-input"
                          />
                          Data URI
                        </label>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  {base64Output ? (
                    <div className="flex-1 flex flex-col gap-3 min-h-0">
                      <div className="relative flex-1 min-h-0">
                        <Textarea
                          value={base64Output}
                          readOnly
                          className="font-mono text-xs leading-relaxed h-full bg-muted/30 resize-none"
                        />
                        <div className="absolute top-2 right-2 flex flex-col gap-1">
                          <Button
                            variant={copied ? "default" : "secondary"}
                            size="sm"
                            onClick={copyToClipboard}
                            className="h-7 px-2 text-xs"
                          >
                            {copied ? (
                              <>
                                <Check className="w-3 h-3" />
                                Tersalin!
                              </>
                            ) : (
                              <>
                                <ClipboardCopy className="w-3 h-3" />
                                Salin
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-lg p-3">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>
                          {includeDataUri
                            ? "Termasuk prefiks data URI (siap digunakan di atribut src HTML/CSS)."
                            : "String Base64 mentah tanpa prefiks data URI."}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
                      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                        <ArrowRightLeft className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        String Base64 Anda akan muncul di sini.
                      </p>
                      <p className="text-xs text-muted-foreground/70 mt-1">
                        Upload gambar di sebelah kiri untuk memulai.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Usage Examples - only shown when image is converted */}
            {imagePreview && base64Output && (
              <UsageExamples dataUri={imagePreview} />
            )}
          </TabsContent>

          {/* Base64 to Image Tab */}
          <TabsContent value="base64-to-img">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Base64 Input */}
              <Card className="border-border/50 bg-white/80 backdrop-blur-sm flex flex-col">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Code2 className="w-5 h-5 text-primary" />
                        Masukan Base64
                      </CardTitle>
                      <CardDescription className="mt-1">
                        Tempel string Base64 gambar yang valid.
                      </CardDescription>
                    </div>
                    {base64Input && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={clearBase64}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col min-h-0">
                  <Textarea
                    value={base64Input}
                    onChange={(e) => handleBase64Input(e.target.value)}
                    placeholder={`Paste your Base64 string here...\n\nExamples:\n• data:image/png;base64,iVBORw0KGgo...\n• iVBORw0KGgo... (raw base64)\n• /9j/4AAQ... (JPEG)`}
                    className="font-mono text-xs leading-relaxed flex-1 bg-muted/30 resize-none"
                  />
                  {base64Input && (
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-muted-foreground">
                        {base64Input.length.toLocaleString()} karakter
                      </span>
                      <Badge
                        variant={
                          decodeError
                            ? "destructive"
                            : decodedImage
                              ? "success"
                              : "secondary"
                        }
                      >
                        {decodeError
                          ? "Tidak valid"
                          : decodedImage
                            ? "Valid"
                            : "Memproses..."}
                      </Badge>
                    </div>
                  )}
                  {decodeError && (
                    <div className="flex items-start gap-2 mt-3 p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{decodeError}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Decoded Image Preview */}
              <Card className="border-border/50 bg-white/80 backdrop-blur-sm flex flex-col">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <ImageIcon className="w-5 h-5 text-primary" />
                        Hasil decode gambar
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {decodedImage
                          ? "Gambar berhasil di-decode."
                          : "Tempel string Base64 yang valid di sebelah kiri."}
                      </CardDescription>
                    </div>
                    {decodedImage && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={downloadImage}
                      >
                        <Download className="w-3.5 h-3.5" />
                        Unduh
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  {decodedImage ? (
                    <div className="space-y-4">
                      <div className="relative group rounded-xl overflow-hidden border border-border/50 bg-muted/30">
                        <img
                          src={decodedImage}
                          alt="Decoded from Base64"
                          className="w-full max-h-72 object-contain cursor-zoom-in"
                          onClick={() => setDecodedZoomed(true)}
                        />
                        <div
                          className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          onClick={() => setDecodedZoomed(true)}
                        >
                          <div className="bg-black/60 text-white rounded-md p-1.5">
                            <ZoomIn className="w-4 h-4" />
                          </div>
                        </div>
                      </div>

                      {decodedFileInfo && (
                        <div className="bg-muted/50 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <ImageIconLucide className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium">
                              Informasi Gambar
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="success">Ter-decode</Badge>
                            <Badge variant="secondary">
                              {decodedFileInfo.width}×{decodedFileInfo.height}px
                            </Badge>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
                      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                        <ImageIcon className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Gambar yang telah di-decode akan muncul di sini.
                      </p>
                      <p className="text-xs text-muted-foreground/70 mt-1">
                        Tempel string Base64 yang valid di sebelah kiri.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <Features />
      </div>

      {/* Image Zoom Modal */}
      {(imageZoomed || decodedZoomed) && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => {
            setImageZoomed(false);
            setDecodedZoomed(false);
          }}
        >
          <img
            src={imageZoomed ? imagePreview! : decodedImage!}
            alt="Zoomed preview"
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
          />
          <button className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-colors cursor-pointer">
            <X className="w-6 h-6" />
          </button>
        </div>
      )}
    </main>
  );
}
