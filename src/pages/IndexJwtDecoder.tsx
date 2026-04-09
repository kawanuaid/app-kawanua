import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/jwtdecoder/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import {
  parseJWT,
  formatJSON,
  isTokenExpired,
  formatExpirationTime,
  formatIssuedAtTime,
  getTimeUntilExpiration,
} from "@/lib/jwt";
import {
  Clock,
  AlertCircle,
  CheckCircle,
  Copy,
  Trash2,
  Zap,
  Binary,
} from "lucide-react";
import HeaderApp from "@/components/HeaderApp";

export default function JwtDecoderPage() {
  const [token, setToken] = useState("");
  const [decoded, setDecoded] = useState<ReturnType<typeof parseJWT>>(
    parseJWT(""),
  );
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  useEffect(() => {
    setDecoded(parseJWT(token));
  }, [token]);

  const copyToClipboard = async (text: string, section: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSection(section);
      setTimeout(() => setCopiedSection(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const exampleToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-zinc-100">
      <HeaderApp
        title={"JWT Decoder"}
        description={"Decode, analisis dan verifikasi JSON Web Tokens"}
        icon={<Binary className="size-10 text-white" />}
        customCss={""}
        clientSide
      />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column - Input */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Input JWT Token
                </CardTitle>
                <CardDescription>
                  Masukkan JWT Token Anda untuk decode dan analisis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="token-input">Token</Label>
                  <Textarea
                    id="token-input"
                    placeholder="Masukkan JWT Token Anda..."
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    className="font-mono text-sm min-h-[150px]"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setToken(exampleToken)}
                    className="flex-1"
                  >
                    <Zap className="h-4 w-4" />
                    Muat Contoh JWT
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setToken("")}
                    disabled={!token}
                  >
                    <Trash2 className="h-4 w-4" />
                    Hapus
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Status Card */}
            {(decoded.valid || decoded.error || token) && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Status Token</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {decoded.valid ? (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-700">
                          Validitas
                        </span>
                        <Badge variant="success" className="gap-1.5">
                          <CheckCircle className="h-3 w-3" />
                          Format Valid
                        </Badge>
                      </div>

                      {decoded.payload.exp && (
                        <>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-700">
                              Kedaluwarsa
                            </span>
                            {isTokenExpired(decoded) ? (
                              <Badge variant="destructive" className="gap-1.5">
                                <AlertCircle className="h-3 w-3" />
                                Kedaluwarsa
                              </Badge>
                            ) : (
                              <Badge variant="success" className="gap-1.5">
                                <Clock className="h-3 w-3" />
                                Aktif
                              </Badge>
                            )}
                          </div>

                          <div className="space-y-1.5 pt-2 border-t border-slate-100">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-slate-600">Issued At</span>
                              <span className="font-mono text-slate-900">
                                {decoded.payload.iat
                                  ? formatIssuedAtTime(
                                      decoded.payload.iat as number,
                                    )
                                  : "N/A"}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-slate-600">Expires At</span>
                              <span className="font-mono text-slate-900">
                                {formatExpirationTime(
                                  decoded.payload.exp as number,
                                )}
                              </span>
                            </div>
                            {!isTokenExpired(decoded) &&
                              decoded.payload.exp && (
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-slate-600">
                                    Sisa Waktu
                                  </span>
                                  <span className="font-mono text-amber-600 font-medium">
                                    {getTimeUntilExpiration(
                                      decoded.payload.exp as number,
                                    )}
                                  </span>
                                </div>
                              )}
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 text-red-800">
                      <AlertCircle className="h-5 w-5 flex-shrink-0" />
                      <p className="text-sm font-medium">
                        {decoded.error || "Token tidak valid"}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Decoded Output */}
          <div className="space-y-6">
            {decoded.valid && (
              <Card>
                <CardHeader>
                  <CardTitle>Token Hasil Decode</CardTitle>
                  <CardDescription>
                    Hasil decode token dan diformat sebagai JSON
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="header" className="w-full">
                    <TabsList className="w-full grid grid-cols-3">
                      <TabsTrigger value="header">Header</TabsTrigger>
                      <TabsTrigger value="payload">Payload</TabsTrigger>
                      <TabsTrigger value="signature">Signature</TabsTrigger>
                    </TabsList>

                    <TabsContent value="header" className="space-y-3">
                      <div className="relative">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="info">Header</Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              copyToClipboard(
                                formatJSON(decoded.header),
                                "header",
                              )
                            }
                            className="h-8 gap-1.5"
                          >
                            <Copy className="h-3.5 w-3.5" />
                            {copiedSection === "header" ? "Copied!" : "Copy"}
                          </Button>
                        </div>
                        <pre className="bg-slate-900 text-slate-50 p-4 rounded-lg text-sm font-mono overflow-x-auto">
                          <code>{formatJSON(decoded.header)}</code>
                        </pre>
                      </div>
                    </TabsContent>

                    <TabsContent value="payload" className="space-y-3">
                      <div className="space-y-4">
                        <div className="relative">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="secondary">Payload</Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                copyToClipboard(
                                  formatJSON(decoded.payload),
                                  "payload",
                                )
                              }
                              className="h-8 gap-1.5"
                            >
                              <Copy className="h-3.5 w-3.5" />
                              {copiedSection === "payload" ? "Copied!" : "Copy"}
                            </Button>
                          </div>
                          <pre className="bg-slate-900 text-slate-50 p-4 rounded-lg text-sm font-mono overflow-x-auto">
                            <code>{formatJSON(decoded.payload)}</code>
                          </pre>
                        </div>

                        {/* Common Claims */}
                        <div className="pt-2 border-t border-slate-100">
                          <h4 className="text-sm font-semibold text-slate-900 mb-3">
                            Common Claims
                          </h4>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            {"iss" in decoded.payload && (
                              <div className="p-2 rounded bg-slate-50">
                                <div className="text-xs text-slate-500 mb-1">
                                  Issuer (iss)
                                </div>
                                <div className="font-mono text-slate-900 truncate">
                                  {String(decoded.payload.iss)}
                                </div>
                              </div>
                            )}
                            {"sub" in decoded.payload && (
                              <div className="p-2 rounded bg-slate-50">
                                <div className="text-xs text-slate-500 mb-1">
                                  Subject (sub)
                                </div>
                                <div className="font-mono text-slate-900 truncate">
                                  {String(decoded.payload.sub)}
                                </div>
                              </div>
                            )}
                            {"aud" in decoded.payload && (
                              <div className="p-2 rounded bg-slate-50">
                                <div className="text-xs text-slate-500 mb-1">
                                  Audience (aud)
                                </div>
                                <div className="font-mono text-slate-900 truncate">
                                  {String(decoded.payload.aud)}
                                </div>
                              </div>
                            )}
                            {"jti" in decoded.payload && (
                              <div className="p-2 rounded bg-slate-50">
                                <div className="text-xs text-slate-500 mb-1">
                                  JWT ID (jti)
                                </div>
                                <div className="font-mono text-slate-900 truncate">
                                  {String(decoded.payload.jti)}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="signature" className="space-y-3">
                      <div className="relative">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline">Signature</Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              copyToClipboard(decoded.signature, "signature")
                            }
                            className="h-8 gap-1.5"
                          >
                            <Copy className="h-3.5 w-3.5" />
                            {copiedSection === "signature" ? "Copied!" : "Copy"}
                          </Button>
                        </div>
                        <div className="bg-slate-900 text-slate-50 p-4 rounded-lg text-sm font-mono break-all">
                          {decoded.signature}
                        </div>
                      </div>
                      <div className="p-3 rounded-lg bg-blue-50 text-blue-800 text-sm">
                        <p className="font-medium mb-1">ℹ️ Tentang Signature</p>
                        <p className="text-blue-700">
                          Signature digunakan untuk memverifikasi bahwa token
                          tidak diubah. Signature dibuat dengan menandatangani
                          header dan payload menggunakan algoritma yang
                          ditentukan.
                        </p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}

            {/* Visual Representation */}
            {decoded.valid && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Struktur Token</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    <div className="flex-shrink-0">
                      <div className="px-3 py-1.5 rounded-l-md bg-rose-500 text-white text-xs font-semibold mb-1">
                        HEADER
                      </div>
                      <div className="px-3 py-2 bg-rose-50 rounded-l-md border-2 border-rose-200 border-r-0">
                        <code className="text-xs font-mono text-rose-700 break-all max-w-[200px] block">
                          {atob(token.split(".")[0]).slice(0, 30)}...
                        </code>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <div className="px-3 py-1.5 bg-emerald-500 text-white text-xs font-semibold mb-1">
                        PAYLOAD
                      </div>
                      <div className="px-3 py-2 bg-emerald-50 border-2 border-emerald-200">
                        <code className="text-xs font-mono text-emerald-700 break-all max-w-[200px] block">
                          {atob(token.split(".")[1]).slice(0, 30)}...
                        </code>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <div className="px-3 py-1.5 bg-indigo-500 text-white text-xs font-semibold mb-1">
                        SIGNATURE
                      </div>
                      <div className="px-3 py-2 bg-indigo-50 rounded-r-md border-2 border-indigo-200 border-l-0">
                        <code className="text-xs font-mono text-indigo-700 break-all max-w-[200px] block">
                          {decoded.signature.slice(0, 30)}...
                        </code>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
