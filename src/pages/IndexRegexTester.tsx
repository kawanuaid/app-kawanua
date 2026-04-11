import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  AlertCircle,
  CheckCircle2,
  Copy,
  RefreshCw,
  Regex,
  Trash2,
} from "lucide-react";
import { HeaderHorizontal } from "@/components/HeaderApp";

// Helper untuk highlight text
const HighlightedText = ({
  text,
  matches,
}: {
  text: string;
  matches: RegExpMatchArray[];
}) => {
  if (!matches || matches.length === 0) {
    return <span className="text-slate-600 dark:text-slate-400">{text}</span>;
  }

  const elements: React.ReactNode[] = [];
  let lastIndex = 0;

  matches.forEach((match, index) => {
    // Tambahkan teks sebelum match
    if (match.index !== undefined && match.index > lastIndex) {
      elements.push(
        <span
          key={`text-${index}`}
          className="text-slate-600 dark:text-slate-400"
        >
          {text.slice(lastIndex, match.index)}
        </span>,
      );
    }

    // Tambahkan bagian yang di-highlight
    if (match.index !== undefined) {
      elements.push(
        <mark
          key={`match-${index}`}
          className="bg-emerald-500/30 text-emerald-700 dark:text-emerald-300 rounded px-0.5 border-b-2 border-emerald-500"
        >
          {match[0]}
        </mark>,
      );
      lastIndex = match.index + match[0].length;
    }
  });

  // Sisa teks setelah match terakhir
  if (lastIndex < text.length) {
    elements.push(
      <span key="text-end" className="text-slate-600 dark:text-slate-400">
        {text.slice(lastIndex)}
      </span>,
    );
  }

  return <>{elements}</>;
};

export default function RegexTesterPage() {
  const [pattern, setPattern] = useState<string>("");
  const [flags, setFlags] = useState<string>("g");
  const [testString, setTestString] = useState<string>(
    "Halo dunia! Email saya adalah user@example.com dan nomor HP 0812-3456-7890.",
  );

  // State untuk error handling
  const [error, setError] = useState<string | null>(null);

  // Logika Regex menggunakan useMemo untuk performa
  const result = useMemo(() => {
    if (!pattern) {
      setError(null);
      return { matches: [], count: 0 };
    }

    try {
      const regex = new RegExp(pattern, flags);
      const matches = [...testString.matchAll(regex)];
      setError(null);
      return { matches, count: matches.length };
    } catch (err: any) {
      setError(err.message);
      return { matches: [], count: 0 };
    }
  }, [pattern, flags, testString]);

  const handleCopyMatches = () => {
    const text = result.matches.map((m) => m[0]).join("\n");
    navigator.clipboard.writeText(text);
  };

  const toggleFlag = (flag: string) => {
    setFlags((prev) =>
      prev.includes(flag) ? prev.replace(flag, "") : prev + flag,
    );
  };

  return (
    <div className="min-h-screen bg-background bg-grid relative">
      <HeaderHorizontal
        title={"Regex Tester"}
        description={"Uji ekspresi reguler Anda secara real-time."}
        icon={<Regex className="w-5 h-5 text-white" />}
      >
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setPattern("");
            setTestString("");
          }}
        >
          <Trash2 className="w-4 h-4 mr-2" /> Reset
        </Button>
      </HeaderHorizontal>

      <div className="absolute inset-0 bg-gradient-radial pointer-events-none" />

      <div className="max-w-5xl mx-auto space-y-6 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Kolom Kiri: Input Controls */}
          <div className="lg:col-span-5 space-y-6">
            {/* Pattern Input */}
            <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  Regular Expression
                </CardTitle>
                <CardDescription>
                  Masukkan pola regex Anda di sini.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pattern">
                    Pola (<code className="text-[10px]">/.../</code>)
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-slate-400 font-mono">
                      /
                    </span>
                    <Input
                      id="pattern"
                      value={pattern}
                      onChange={(e) => setPattern(e.target.value)}
                      placeholder="contoh: [a-z]+@[a-z]+\.[a-z]+"
                      className={`pl-7 font-mono text-base ${error ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                    />
                    <span className="absolute right-24 top-2 text-slate-400 font-mono">
                      /
                    </span>
                    <div className="absolute right-3 top-2.5 flex gap-1">
                      {["g", "i", "m"].map((f) => (
                        <button
                          key={f}
                          onClick={() => toggleFlag(f)}
                          className={`text-xs font-bold w-5 h-5 flex items-center justify-center rounded transition-colors ${
                            flags.includes(f)
                              ? "bg-teal-600 text-white"
                              : "bg-slate-200 dark:bg-slate-800 text-slate-500 hover:bg-slate-300"
                          }`}
                          title={`Toggle flag '${f}'`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>
                  {error && (
                    <div className="flex items-center gap-2 text-sm text-red-500 mt-2 animate-in slide-in-from-top-1">
                      <AlertCircle className="w-4 h-4" />
                      <span>{error}</span>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Flags Explanation */}
                <div className="text-xs text-slate-500 space-y-1">
                  <p>
                    <strong>Flags aktif:</strong> {flags || "Tidak ada"}
                  </p>
                  <ul className="list-disc pl-4 space-y-1 opacity-80">
                    <li>
                      <strong>g</strong>: Global (semua kemunculan)
                    </li>
                    <li>
                      <strong>i</strong>: Case Insensitive (abaikan besar/kecil)
                    </li>
                    <li>
                      <strong>m</strong>: Multiline
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Test String Input */}
            <Card className="border-slate-200 dark:border-slate-800 shadow-sm flex-1 flex flex-col">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Test String</CardTitle>
                <CardDescription>
                  Teks yang akan diuji terhadap pola.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 min-h-[200px]">
                <Textarea
                  value={testString}
                  onChange={(e) => setTestString(e.target.value)}
                  className="min-h-[200px] font-mono text-sm resize-none"
                  placeholder="Masukkan teks panjang di sini..."
                />
              </CardContent>
            </Card>
          </div>

          {/* Kolom Kanan: Results */}
          <div className="lg:col-span-7 space-y-6">
            <Card className="border-slate-200 dark:border-slate-800 shadow-sm h-full flex flex-col">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Hasil Match</CardTitle>
                  <CardDescription>
                    Ditemukan{" "}
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {result.count}
                    </span>{" "}
                    kecocokan.
                  </CardDescription>
                </div>
                {result.count > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopyMatches}
                    className="h-8 gap-2"
                  >
                    <Copy className="w-3 h-3" /> Salin Matches
                  </Button>
                )}
              </CardHeader>

              <CardContent className="flex-1 overflow-hidden flex flex-col">
                <div className="bg-slate-100 dark:bg-slate-900 rounded-md p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap break-all border border-slate-200 dark:border-slate-800 flex-1 overflow-y-auto custom-scrollbar">
                  {testString ? (
                    <HighlightedText
                      text={testString}
                      matches={result.matches}
                    />
                  ) : (
                    <span className="text-slate-400 italic">
                      Menunggu input...
                    </span>
                  )}
                </div>

                {/* Detail Groups (Jika ada capture groups) */}
                {result.count > 0 &&
                  result.matches.some((m) => m.length > 1) && (
                    <>
                      <Separator className="my-4" />
                      <div className="space-y-2">
                        <Label>Capture Groups Detail</Label>
                        <ScrollArea className="h-48 rounded-md border border-slate-200 dark:border-slate-800 p-2">
                          {result.matches.map((match, idx) => (
                            <div
                              key={idx}
                              className="mb-2 last:mb-0 p-2 bg-slate-50 dark:bg-slate-900/50 rounded text-xs font-mono"
                            >
                              <div className="flex gap-2 mb-1 text-slate-500">
                                <Badge
                                  variant="secondary"
                                  className="h-5 px-1.5"
                                >
                                  #{idx + 1}
                                </Badge>
                                <span>
                                  Full Match:{" "}
                                  <span className="text-slate-900 dark:text-slate-200 font-semibold">
                                    "{match[0]}"
                                  </span>
                                </span>
                              </div>
                              {match.slice(1).map(
                                (group, gIdx) =>
                                  group !== undefined && (
                                    <div
                                      key={gIdx}
                                      className="pl-4 border-l-2 border-slate-200 dark:border-slate-700 ml-1 py-0.5"
                                    >
                                      Group {gIdx + 1}:{" "}
                                      <span className="text-emerald-600 dark:text-emerald-400">
                                        "{group}"
                                      </span>
                                    </div>
                                  ),
                              )}
                            </div>
                          ))}
                        </ScrollArea>
                      </div>
                    </>
                  )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
