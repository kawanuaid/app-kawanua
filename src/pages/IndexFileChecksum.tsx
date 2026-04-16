import { useState, useCallback, useRef } from "react";
import {
  FileIcon,
  Upload,
  X,
  Check,
  AlertCircle,
  Copy,
  Check as CheckIcon,
  Hash,
  Shield,
  FileText,
  FileDigit,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/checksum/ui/badge";
import { Tooltip } from "@/components/checksum/ui/tooltip";
import {
  generateChecksums,
  formatFileSize,
  validateFileSize,
  MAX_FILE_SIZE,
  type HashAlgorithm,
  type ChecksumResult,
} from "@/lib/checksum";
import HeaderApp from "@/components/HeaderApp";
import { Disclaimer, SubFooter } from "@/components/Footer";

type ChecksumState = {
  results: ChecksumResult[];
  progress: number;
  isCalculating: boolean;
  completed: boolean;
};

const AVAILABLE_ALGORITHMS: HashAlgorithm[] = [
  "MD5",
  "SHA-1",
  "SHA-256",
  "SHA-384",
  "SHA-512",
];

const ALGORITHM_COLORS: Record<HashAlgorithm, { bg: string; text: string }> = {
  MD5: {
    bg: "bg-amber-100 dark:bg-amber-900",
    text: "text-amber-700 dark:text-amber-300",
  },
  "SHA-1": {
    bg: "bg-orange-100 dark:bg-orange-900",
    text: "text-orange-700 dark:text-orange-300",
  },
  "SHA-256": {
    bg: "bg-blue-100 dark:bg-blue-900",
    text: "text-blue-700 dark:text-blue-300",
  },
  "SHA-384": {
    bg: "bg-purple-100 dark:bg-purple-900",
    text: "text-purple-700 dark:text-purple-300",
  },
  "SHA-512": {
    bg: "bg-green-100 dark:bg-green-900",
    text: "text-green-700 dark:text-green-300",
  },
};

export default function FileChecksumPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedAlgorithms, setSelectedAlgorithms] = useState<HashAlgorithm[]>(
    ["SHA-256", "SHA-512"],
  );
  const [checksumState, setChecksumState] = useState<ChecksumState>({
    results: [],
    progress: 0,
    isCalculating: false,
    completed: false,
  });
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((file: File | null) => {
    if (!file) {
      setSelectedFile(null);
      setError(null);
      return;
    }

    const validation = validateFileSize(file);
    if (!validation.valid) {
      setError(validation.error ?? "File validation failed");
      setSelectedFile(null);
      return;
    }

    setError(null);
    setSelectedFile(file);
    setChecksumState({
      results: [],
      progress: 0,
      isCalculating: false,
      completed: false,
    });
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleFileSelect(file);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(false);

      const file = e.dataTransfer.files[0];
      handleFileSelect(file);
    },
    [handleFileSelect],
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const toggleAlgorithm = (algorithm: HashAlgorithm) => {
    setSelectedAlgorithms((prev) => {
      if (prev.includes(algorithm)) {
        if (prev.length === 1) return prev; // Don't deselect the last one
        return prev.filter((a) => a !== algorithm);
      }
      return [...prev, algorithm];
    });
  };

  const selectAllAlgorithms = () => {
    setSelectedAlgorithms(AVAILABLE_ALGORITHMS);
  };

  const clearAllAlgorithms = () => {
    setSelectedAlgorithms(["SHA-256"]); // Keep at least one selected
  };

  const calculateChecksums = async () => {
    if (!selectedFile || selectedAlgorithms.length === 0) return;

    setChecksumState({
      results: [],
      progress: 0,
      isCalculating: true,
      completed: false,
    });

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setChecksumState((prev) => {
          if (prev.progress >= 90) return prev;
          return { ...prev, progress: prev.progress + 10 };
        });
      }, 100);

      const results = await generateChecksums(selectedFile, selectedAlgorithms);

      clearInterval(progressInterval);

      setChecksumState({
        results,
        progress: 100,
        isCalculating: false,
        completed: true,
      });
    } catch (err) {
      setChecksumState({
        results: [],
        progress: 0,
        isCalculating: false,
        completed: false,
      });
      setError(
        err instanceof Error
          ? (err.message ?? "Failed to calculate checksums")
          : "Failed to calculate checksums",
      );
    }
  };

  const copyToClipboard = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const clearFile = () => {
    setSelectedFile(null);
    setError(null);
    setChecksumState({
      results: [],
      progress: 0,
      isCalculating: false,
      completed: false,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const resetResults = () => {
    setChecksumState({
      results: [],
      progress: 0,
      isCalculating: false,
      completed: false,
    });
  };

  return (
    <div className="min-h-screen bg-background bg-grid relative flex flex-col justify-between">
      <HeaderApp
        title={"File Checksum Generator"}
        description={"Generate MD5, SHA-1, SHA-256, SHA-384, SHA-512 hash"}
        icon={<FileDigit className="size-10 text-white" />}
        customCss={""}
        clientSide
      />
      <div className="absolute inset-0 bg-gradient-radial pointer-events-none" />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          {/* Description Card */}
          <Card className="border-indigo-100 bg-gradient-to-r from-indigo-50/50 to-violet-50/50 dark:from-indigo-950/20 dark:to-violet-950/20">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-indigo-600 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-medium text-slate-900">
                    Verifikasi Integritas File
                  </h3>
                  <p className="text-sm text-slate-600 mt-1">
                    Unggah file apapun untuk menghasilkan checksum kriptografi.
                    Sempurna untuk memverifikasi integritas dan keamanan file.
                    Ukuran file maksimum:{" "}
                    <span className="font-semibold">
                      {formatFileSize(MAX_FILE_SIZE)}
                    </span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* File Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Unggah File
              </CardTitle>
              <CardDescription>
                Pilih file untuk menghitung checksum menggunakan berbagai
                algoritma hash
              </CardDescription>
            </CardHeader>
            <CardContent>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                className="hidden"
              />

              {!selectedFile ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  className={`
                    relative flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed p-12 transition-all cursor-pointer
                    ${
                      isDragOver
                        ? "border-teal-500 bg-indigo-50 dark:bg-indigo-950/20"
                        : "border-slate-300 hover:border-teal-400 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800/50"
                    }
                  `}
                >
                  <div
                    className={`
                    flex h-16 w-16 items-center justify-center rounded-full transition-all
                    ${isDragOver ? "bg-teal-100 scale-110" : "bg-slate-100 dark:bg-slate-800"}
                  `}
                  >
                    <Upload className="h-8 w-8 text-slate-500 dark:text-slate-400" />
                  </div>
                  <div className="text-center space-y-1">
                    <p className="font-medium text-slate-900">
                      {isDragOver
                        ? "Drop file Anda di sini"
                        : "Klik atau seret untuk mengunggah"}
                    </p>
                    <p className="text-sm text-slate-500">
                      Mendukung semua jenis file (maks{" "}
                      {formatFileSize(MAX_FILE_SIZE)})
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                    <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-teal-100 dark:bg-teal-900">
                      <FileIcon className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 truncate">
                        {selectedFile.name}
                      </p>
                      <p className="text-sm text-slate-500">
                        {formatFileSize(selectedFile.size)} •{" "}
                        {selectedFile.type || "Unknown type"}
                      </p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={clearFile}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {!checksumState.completed && (
                    <Button
                      onClick={calculateChecksums}
                      disabled={selectedAlgorithms.length === 0}
                      className="w-full"
                      size="lg"
                    >
                      <Hash className="mr-2 h-4 w-4" />
                      Hitung Checksum
                    </Button>
                  )}
                </div>
              )}

              {error && (
                <div className="mt-4 flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900">
                  <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 flex-shrink-0" />
                  <p className="text-sm text-red-700 dark:text-red-300">
                    {error}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Algorithm Selection */}
          <Card
            className={`transition-all ${checksumState.completed ? "opacity-50" : ""}`}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Algoritma Hash
                  </CardTitle>
                  <CardDescription>
                    Pilih algoritma checksum yang akan digunakan
                    {checksumState.completed &&
                      " (read-only after calculation)"}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearAllAlgorithms}
                    disabled={checksumState.completed}
                  >
                    Min
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={selectAllAlgorithms}
                    disabled={checksumState.completed}
                  >
                    All
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {AVAILABLE_ALGORITHMS.map((algorithm) => {
                  const isSelected = selectedAlgorithms.includes(algorithm);
                  const colors = ALGORITHM_COLORS[algorithm];
                  return (
                    <button
                      key={algorithm}
                      onClick={() => toggleAlgorithm(algorithm)}
                      disabled={checksumState.completed}
                      className={`
                        px-4 py-2 rounded-lg font-medium text-sm transition-all
                        ${
                          isSelected
                            ? `${colors.bg} ${colors.text} border-2 border-current shadow-sm`
                            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                        }
                        ${checksumState.completed ? "cursor-not-allowed opacity-60" : "cursor-pointer"}
                      `}
                    >
                      {algorithm}
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-slate-500 mt-3">
                Terpilih: {selectedAlgorithms.length} algoritma
              </p>
            </CardContent>
          </Card>

          {/* Progress Section */}
          {checksumState.isCalculating && (
            <Card>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-900">
                      Menghitung checksum...
                    </span>
                    <span className="text-sm text-slate-500">
                      {checksumState.progress}%
                    </span>
                  </div>
                  <Progress value={checksumState.progress} />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Results Section */}
          {checksumState.results.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-600" />
                      Hasil Checksum
                    </CardTitle>
                    <CardDescription>
                      Hash kriptografi untuk:{" "}
                      <span className="font-medium text-slate-900">
                        {selectedFile?.name}
                      </span>
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={resetResults}>
                    Hapus
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {checksumState.results.map((result) => (
                  <div
                    key={result.algorithm}
                    className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <Badge
                        variant="outline"
                        className={`${ALGORITHM_COLORS[result.algorithm].bg} ${ALGORITHM_COLORS[result.algorithm].text} border-0`}
                      >
                        {result.algorithm}
                      </Badge>
                      {result.error ? (
                        <Badge variant="destructive">Error</Badge>
                      ) : (
                        <Badge
                          variant="success"
                          className="bg-green-500 text-white border-0"
                        >
                          Berhasil
                        </Badge>
                      )}
                    </div>
                    {result.error ? (
                      <p className="text-sm text-red-600 dark:text-red-400">
                        {result.error}
                      </p>
                    ) : (
                      <div className="flex items-start gap-2">
                        <code className="flex-1 font-mono text-xs break-all p-3 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                          {result.hash}
                        </code>
                        <Tooltip content="Salin ke clipboard">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => copyToClipboard(result.hash)}
                            className="flex-shrink-0"
                          >
                            {copiedHash === result.hash ? (
                              <CheckIcon className="h-4 w-4 text-green-600" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </Tooltip>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      {/* Footer Info */}
      <SubFooter>
        <Disclaimer />
      </SubFooter>
    </div>
  );
}
