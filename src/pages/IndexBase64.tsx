import { useState, useCallback, useRef } from "react";
import {
  Lock,
  Unlock,
  Copy,
  Trash2,
  ArrowLeftRight,
  Download,
  Upload,
  CheckCheck,
  AlertCircle,
  Info,
  FileText,
  RefreshCw,
  Braces,
} from "lucide-react";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/base64/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  encodeBase64,
  decodeBase64,
  encodeFileToBase64,
  isValidBase64,
  calcEfficiency,
  formatBytes,
  type EncodingMode,
} from "@/lib/base64";
import HeaderApp from "@/components/HeaderApp";
import { Disclaimer, SubFooter } from "@/components/Footer";

type ActiveTab = "encode" | "decode";

export default function Base64Page() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("encode");

  // Encode state
  const [encodeInput, setEncodeInput] = useState("");
  const [encodeOutput, setEncodeOutput] = useState("");
  const [encodeMode, setEncodeMode] = useState<EncodingMode>("standard");
  const [encodeCopied, setEncodeCopied] = useState(false);
  const [autoEncode, setAutoEncode] = useState(true);

  // Decode state
  const [decodeInput, setDecodeInput] = useState("");
  const [decodeOutput, setDecodeOutput] = useState("");
  const [decodeMode, setDecodeMode] = useState<EncodingMode>("standard");
  const [decodeCopied, setDecodeCopied] = useState(false);
  const [decodeError, setDecodeError] = useState<string | null>(null);
  const [autoDecode, setAutoDecode] = useState(true);

  // File upload
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ─── Encode handlers ───────────────────────────────────────────────────────

  const handleEncodeInput = useCallback(
    (value: string) => {
      setEncodeInput(value);
      if (autoEncode) {
        const result = encodeBase64(value, encodeMode);
        setEncodeOutput(result.output);
      }
    },
    [autoEncode, encodeMode],
  );

  const handleEncodeNow = useCallback(() => {
    const result = encodeBase64(encodeInput, encodeMode);
    setEncodeOutput(result.output);
  }, [encodeInput, encodeMode]);

  const handleEncodeModeChange = useCallback(
    (mode: EncodingMode) => {
      setEncodeMode(mode);
      if (encodeInput) {
        const result = encodeBase64(encodeInput, mode);
        setEncodeOutput(result.output);
      }
    },
    [encodeInput],
  );

  const handleCopyEncode = useCallback(async () => {
    if (!encodeOutput) return;
    await navigator.clipboard.writeText(encodeOutput);
    setEncodeCopied(true);
    setTimeout(() => setEncodeCopied(false), 2000);
  }, [encodeOutput]);

  const handleClearEncode = useCallback(() => {
    setEncodeInput("");
    setEncodeOutput("");
    setFileName(null);
  }, []);

  const handleSwapToDecoder = useCallback(() => {
    setDecodeInput(encodeOutput);
    const result = decodeBase64(encodeOutput, decodeMode);
    setDecodeOutput(result.output);
    setDecodeError(result.error);
    setActiveTab("decode");
  }, [encodeOutput, decodeMode]);

  const handleDownloadEncoded = useCallback(() => {
    if (!encodeOutput) return;
    const blob = new Blob([encodeOutput], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "encoded.b64";
    a.click();
    URL.revokeObjectURL(url);
  }, [encodeOutput]);

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (ev) => {
        const buffer = ev.target?.result as ArrayBuffer;
        const b64 = encodeFileToBase64(buffer, encodeMode);
        setEncodeInput(`[Binary file: ${file.name}]`);
        setEncodeOutput(b64);
      };
      reader.readAsArrayBuffer(file);
      // reset input so same file can be re-selected
      e.target.value = "";
    },
    [encodeMode],
  );

  // ─── Decode handlers ───────────────────────────────────────────────────────

  const handleDecodeInput = useCallback(
    (value: string) => {
      setDecodeInput(value);
      if (autoDecode) {
        const result = decodeBase64(value, decodeMode);
        setDecodeOutput(result.output);
        setDecodeError(result.error);
      }
    },
    [autoDecode, decodeMode],
  );

  const handleDecodeNow = useCallback(() => {
    const result = decodeBase64(decodeInput, decodeMode);
    setDecodeOutput(result.output);
    setDecodeError(result.error);
  }, [decodeInput, decodeMode]);

  const handleDecodeModeChange = useCallback(
    (mode: EncodingMode) => {
      setDecodeMode(mode);
      if (decodeInput) {
        const result = decodeBase64(decodeInput, mode);
        setDecodeOutput(result.output);
        setDecodeError(result.error);
      }
    },
    [decodeInput],
  );

  const handleCopyDecode = useCallback(async () => {
    if (!decodeOutput) return;
    await navigator.clipboard.writeText(decodeOutput);
    setDecodeCopied(true);
    setTimeout(() => setDecodeCopied(false), 2000);
  }, [decodeOutput]);

  const handleClearDecode = useCallback(() => {
    setDecodeInput("");
    setDecodeOutput("");
    setDecodeError(null);
  }, []);

  const handleSwapToEncoder = useCallback(() => {
    setEncodeInput(decodeOutput);
    const result = encodeBase64(decodeOutput, encodeMode);
    setEncodeOutput(result.output);
    setActiveTab("encode");
  }, [decodeOutput, encodeMode]);

  const handleDownloadDecoded = useCallback(() => {
    if (!decodeOutput) return;
    const blob = new Blob([decodeOutput], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "decoded.txt";
    a.click();
    URL.revokeObjectURL(url);
  }, [decodeOutput]);

  // ─── Computed stats ─────────────────────────────────────────────────────────

  const encodeResult = encodeInput
    ? encodeBase64(encodeInput, encodeMode)
    : null;
  const decodeResult = decodeInput
    ? decodeBase64(decodeInput, decodeMode)
    : null;

  const decodeValid = decodeInput
    ? isValidBase64(decodeInput, decodeMode)
    : null;

  return (
    <TooltipProvider delayDuration={300}>
      <div className="min-h-screen bg-background bg-grid relative flex flex-col justify-between">
        <HeaderApp
          title="Base64 Encoder / Decoder"
          description="Encode dan decode data dengan Base64 dengan mudah dan cepat"
          icon={<Braces className="size-10 text-white" />}
          customCss=""
          clientSide
        />

        {/* ── Main ── */}
        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as ActiveTab)}
          >
            {/* Tab bar */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
              <TabsList className="w-full sm:w-auto">
                <TabsTrigger
                  value="encode"
                  className="flex-1 sm:flex-none gap-2"
                >
                  <Lock className="h-3.5 w-3.5" />
                  Encode
                </TabsTrigger>
                <TabsTrigger
                  value="decode"
                  className="flex-1 sm:flex-none gap-2"
                >
                  <Unlock className="h-3.5 w-3.5" />
                  Decode
                </TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-2 sm:ml-auto">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-violet-50 border border-violet-100 rounded-full px-3 py-1.5">
                      <Info className="h-3 w-3 text-violet-400" />
                      <span>RFC 4648 compliant</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    Supports Standard, URL-safe, and MIME encoding variants
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>

            {/* ══════════════════════════════════════════════
                ENCODE TAB
            ══════════════════════════════════════════════ */}
            <TabsContent value="encode">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Input panel */}
                <Panel
                  title="Plain Text"
                  subtitle="Input"
                  icon={<FileText className="h-4 w-4 text-slate-400" />}
                  badge={
                    encodeInput ? (
                      <Badge variant="secondary">
                        {encodeInput.length.toLocaleString()} chars
                      </Badge>
                    ) : null
                  }
                  actions={
                    <>
                      {/* File upload */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                            className="gap-1.5"
                          >
                            <Upload className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">File</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Upload a file to encode</TooltipContent>
                      </Tooltip>
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleFileUpload}
                      />

                      {/* Clear */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleClearEncode}
                            disabled={!encodeInput}
                          >
                            <Trash2 className="h-3.5 w-3.5 text-slate-400" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Clear all</TooltipContent>
                      </Tooltip>
                    </>
                  }
                >
                  <Textarea
                    placeholder="Type or paste your text here…"
                    value={encodeInput}
                    onChange={(e) => handleEncodeInput(e.target.value)}
                    className="h-56 lg:h-64"
                  />
                  {fileName && (
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-violet-600 bg-violet-50 rounded-md px-2 py-1.5">
                      <FileText className="h-3 w-3" />
                      <span className="font-medium">{fileName}</span>
                      <span className="text-violet-400">(binary encoded)</span>
                    </div>
                  )}
                </Panel>

                {/* Output panel */}
                <Panel
                  title="Base64"
                  subtitle="Output"
                  icon={<Lock className="h-4 w-4 text-violet-400" />}
                  badge={
                    encodeOutput ? (
                      <Badge variant="default">
                        {encodeOutput.length.toLocaleString()} chars
                      </Badge>
                    ) : null
                  }
                  actions={
                    <>
                      {/* Swap to decoder */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleSwapToDecoder}
                            disabled={!encodeOutput}
                            className="gap-1.5"
                          >
                            <ArrowLeftRight className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Decode</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Send output to Decoder</TooltipContent>
                      </Tooltip>

                      {/* Download */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleDownloadEncoded}
                            disabled={!encodeOutput}
                          >
                            <Download className="h-3.5 w-3.5 text-slate-400" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Download as .b64</TooltipContent>
                      </Tooltip>

                      {/* Copy */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant={encodeCopied ? "secondary" : "default"}
                            size="sm"
                            onClick={handleCopyEncode}
                            disabled={!encodeOutput}
                            className="gap-1.5 min-w-[80px]"
                          >
                            {encodeCopied ? (
                              <>
                                <CheckCheck className="h-3.5 w-3.5" />
                                Copied!
                              </>
                            ) : (
                              <>
                                <Copy className="h-3.5 w-3.5" />
                                Copy
                              </>
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Copy to clipboard</TooltipContent>
                      </Tooltip>
                    </>
                  }
                >
                  <Textarea
                    placeholder="Encoded Base64 will appear here…"
                    value={encodeOutput}
                    readOnly
                    className="h-56 lg:h-64 bg-slate-50 text-violet-700"
                  />
                </Panel>
              </div>

              {/* Controls bar */}
              <ControlsBar>
                {/* Mode selector */}
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <Label className="text-xs shrink-0">Mode</Label>
                  <Select
                    value={encodeMode}
                    onValueChange={(v) =>
                      handleEncodeModeChange(v as EncodingMode)
                    }
                  >
                    <SelectTrigger className="h-8 text-xs w-44">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">
                        Standard (RFC 4648)
                      </SelectItem>
                      <SelectItem value="url-safe">
                        URL-safe (no padding)
                      </SelectItem>
                      <SelectItem value="mime">MIME (76-char lines)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Auto encode toggle */}
                <div className="flex items-center gap-2">
                  <Switch
                    id="auto-encode"
                    checked={autoEncode}
                    onCheckedChange={setAutoEncode}
                  />
                  <Label
                    htmlFor="auto-encode"
                    className="text-xs cursor-pointer"
                  >
                    Auto-encode
                  </Label>
                </div>

                {/* Manual encode button */}
                {!autoEncode && (
                  <Button
                    size="sm"
                    onClick={handleEncodeNow}
                    disabled={!encodeInput}
                    className="gap-1.5"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Encode Now
                  </Button>
                )}

                {/* Stats */}
                {encodeResult && encodeResult.byteSize > 0 && (
                  <div className="flex items-center gap-3 ml-auto text-xs text-slate-500 shrink-0 flex-wrap">
                    <StatItem
                      label="Original"
                      value={formatBytes(encodeResult.byteSize)}
                    />
                    <StatItem
                      label="Encoded"
                      value={formatBytes(encodeResult.charCount)}
                    />
                    <StatItem
                      label="Overhead"
                      value={calcEfficiency(
                        encodeResult.byteSize,
                        encodeResult.charCount,
                      )}
                      highlight
                    />
                  </div>
                )}
              </ControlsBar>
            </TabsContent>

            {/* ══════════════════════════════════════════════
                DECODE TAB
            ══════════════════════════════════════════════ */}
            <TabsContent value="decode">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Input panel */}
                <Panel
                  title="Base64"
                  subtitle="Input"
                  icon={<Lock className="h-4 w-4 text-violet-400" />}
                  badge={
                    decodeInput ? (
                      <Badge variant={decodeValid ? "success" : "destructive"}>
                        {decodeValid ? "✓ Valid" : "✗ Invalid"}
                      </Badge>
                    ) : null
                  }
                  actions={
                    <>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleClearDecode}
                            disabled={!decodeInput}
                          >
                            <Trash2 className="h-3.5 w-3.5 text-slate-400" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Clear all</TooltipContent>
                      </Tooltip>
                    </>
                  }
                >
                  <Textarea
                    placeholder="Paste your Base64 encoded string here…"
                    value={decodeInput}
                    onChange={(e) => handleDecodeInput(e.target.value)}
                    className={`h-56 lg:h-64 ${
                      decodeInput && !decodeValid
                        ? "border-red-300 focus-visible:ring-red-400"
                        : ""
                    }`}
                  />
                </Panel>

                {/* Output panel */}
                <Panel
                  title="Plain Text"
                  subtitle="Output"
                  icon={<Unlock className="h-4 w-4 text-emerald-500" />}
                  badge={
                    decodeOutput ? (
                      <Badge variant="success">
                        {decodeOutput.length.toLocaleString()} chars
                      </Badge>
                    ) : null
                  }
                  actions={
                    <>
                      {/* Swap to encoder */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleSwapToEncoder}
                            disabled={!decodeOutput}
                            className="gap-1.5"
                          >
                            <ArrowLeftRight className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Encode</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Send output to Encoder</TooltipContent>
                      </Tooltip>

                      {/* Download */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleDownloadDecoded}
                            disabled={!decodeOutput}
                          >
                            <Download className="h-3.5 w-3.5 text-slate-400" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Download as .txt</TooltipContent>
                      </Tooltip>

                      {/* Copy */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant={decodeCopied ? "secondary" : "default"}
                            size="sm"
                            onClick={handleCopyDecode}
                            disabled={!decodeOutput}
                            className="gap-1.5 min-w-[80px]"
                          >
                            {decodeCopied ? (
                              <>
                                <CheckCheck className="h-3.5 w-3.5" />
                                Copied!
                              </>
                            ) : (
                              <>
                                <Copy className="h-3.5 w-3.5" />
                                Copy
                              </>
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Copy to clipboard</TooltipContent>
                      </Tooltip>
                    </>
                  }
                >
                  {decodeError ? (
                    <div className="h-56 lg:h-64 flex flex-col items-center justify-center gap-3 rounded-lg border border-red-200 bg-red-50 px-6 text-center">
                      <AlertCircle className="h-8 w-8 text-red-400" />
                      <div>
                        <p className="text-sm font-semibold text-red-700">
                          Decoding Failed
                        </p>
                        <p className="text-xs text-red-500 mt-1">
                          {decodeError}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <Textarea
                      placeholder="Decoded text will appear here…"
                      value={decodeOutput}
                      readOnly
                      className="h-56 lg:h-64 bg-slate-50 text-emerald-700"
                    />
                  )}
                </Panel>
              </div>

              {/* Controls bar */}
              <ControlsBar>
                {/* Mode selector */}
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <Label className="text-xs shrink-0">Mode</Label>
                  <Select
                    value={decodeMode}
                    onValueChange={(v) =>
                      handleDecodeModeChange(v as EncodingMode)
                    }
                  >
                    <SelectTrigger className="h-8 text-xs w-44">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">
                        Standard (RFC 4648)
                      </SelectItem>
                      <SelectItem value="url-safe">
                        URL-safe (no padding)
                      </SelectItem>
                      <SelectItem value="mime">MIME (76-char lines)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Auto decode toggle */}
                <div className="flex items-center gap-2">
                  <Switch
                    id="auto-decode"
                    checked={autoDecode}
                    onCheckedChange={setAutoDecode}
                  />
                  <Label
                    htmlFor="auto-decode"
                    className="text-xs cursor-pointer"
                  >
                    Auto-decode
                  </Label>
                </div>

                {/* Manual decode button */}
                {!autoDecode && (
                  <Button
                    size="sm"
                    onClick={handleDecodeNow}
                    disabled={!decodeInput}
                    className="gap-1.5"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Decode Now
                  </Button>
                )}

                {/* Stats */}
                {decodeResult &&
                  !decodeResult.error &&
                  decodeResult.byteSize > 0 && (
                    <div className="flex items-center gap-3 ml-auto text-xs text-slate-500 shrink-0 flex-wrap">
                      <StatItem
                        label="Encoded"
                        value={formatBytes(decodeInput.length)}
                      />
                      <StatItem
                        label="Decoded"
                        value={formatBytes(decodeResult.byteSize)}
                      />
                      <StatItem
                        label="Saved"
                        value={calcEfficiency(
                          decodeResult.byteSize,
                          decodeInput.length,
                        )}
                        highlight
                      />
                    </div>
                  )}
              </ControlsBar>
            </TabsContent>
          </Tabs>

          {/* ── Info cards ── */}
          <section className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <InfoCard
              icon="🔒"
              title="Standard Base64"
              desc="Uses A–Z, a–z, 0–9, +, / and = padding. The default RFC 4648 variant."
            />
            <InfoCard
              icon="🔗"
              title="URL-safe Base64"
              desc="Replaces + with -, / with _, and strips padding — safe for URLs and filenames."
            />
            <InfoCard
              icon="📧"
              title="MIME Base64"
              desc="Breaks encoded output into 76-character lines separated by CRLF, used in emails."
            />
          </section>
        </main>

        {/* Footer */}
        <SubFooter>
          <Disclaimer />
        </SubFooter>
      </div>
    </TooltipProvider>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function Panel({
  title,
  subtitle,
  icon,
  badge,
  actions,
  children,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col">
      {/* Panel header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100 bg-slate-50/60">
        {icon}
        <div className="flex flex-col leading-tight">
          <span className="text-xs font-semibold text-slate-700">{title}</span>
          <span className="text-[10px] text-slate-400 uppercase tracking-wide">
            {subtitle}
          </span>
        </div>
        {badge && <div className="ml-2">{badge}</div>}
        <div className="ml-auto flex items-center gap-1.5">{actions}</div>
      </div>

      {/* Panel body */}
      <div className="p-3 flex-1">{children}</div>
    </div>
  );
}

function ControlsBar({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-3 flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      {children}
    </div>
  );
}

function StatItem({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-[10px] uppercase tracking-wide text-slate-400">
        {label}
      </span>
      <span
        className={`font-semibold tabular-nums ${
          highlight ? "text-violet-600" : "text-slate-700"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function InfoCard({
  icon,
  title,
  desc,
}: {
  icon: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">{icon}</span>
        <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
      </div>
      <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
    </div>
  );
}
