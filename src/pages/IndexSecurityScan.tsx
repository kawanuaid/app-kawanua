import { useState, useRef } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  ShieldAlert,
  ExternalLink,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Search,
  Zap,
  Clock,
  Globe,
  Info,
  Shield,
  XCircle,
  KeyRound,
  Server,
  Loader2,
  Moon,
  Sun,
  Printer,
  RotateCcw,
  ShieldEllipsis,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HeaderHorizontal } from "@/components/HeaderApp";
import HttpHeadersSection from "@/components/securityscan/HttpHeadersSection";
import SslSection from "@/components/securityscan/SslSection";
import ScoreSummaryCard from "@/components/securityscan/ScoreSummaryCard";
import VirusTotalCard from "@/components/securityscan/VirusTotalCard";
import { ScanData, ScanApiResponse } from "@/types/securityscan";
import { fetchSecurityScan } from "@/lib/securityScanApi";
import { computeSecurityScore } from "@/lib/computeScore";
import type { VtScoreInput } from "@/lib/computeScore";
import { SubFooter } from "@/components/Footer";
import RecommendationsSection from "@/components/securityscan/RecommendedSection";

// ─── Constants ────────────────────────────────────────────────────────────────

const EASE = [0.25, 0.1, 0.25, 1] as const;

// ─── Sub-components ───────────────────────────────────────────────────────────

function MetaItem({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex justify-between items-center text-sm py-2.5 border-b border-border/50 last:border-0">
      <span className="text-muted-foreground flex items-center gap-1.5">
        {icon}
        {label}
      </span>
      <span className="font-medium text-foreground tabular-nums">{value}</span>
    </div>
  );
}

// ─── Skeleton loader ──────────────────────────────────────────────────────────

function SkeletonBlock({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-card shadow-card-md rounded-xl overflow-hidden border border-border/50 animate-pulse">
      <div className="px-6 py-4 border-b border-border/60">
        <div className="h-4 w-40 bg-muted rounded" />
      </div>
      <div className="divide-y divide-border/40">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="px-6 py-4 flex items-start gap-3">
            <div className="w-4 h-4 bg-muted rounded-full shrink-0 mt-0.5" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-32 bg-muted rounded" />
              <div className="h-2.5 w-48 bg-muted/70 rounded" />
              <div className="h-2.5 w-64 bg-muted/50 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Idle / initial prompt ────────────────────────────────────────────────────

function IdlePrompt() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4, ease: EASE }}
      className="flex flex-col items-center justify-center py-24 gap-4 text-muted-foreground col-span-full"
    >
      <div className="w-16 h-16 rounded-full bg-muted/60 border border-border flex items-center justify-center">
        <Shield size={28} className="text-primary/60" />
      </div>
      <div className="text-center space-y-1">
        <p className="text-sm font-medium text-foreground">
          Belum ada analisis
        </p>
        <p className="text-xs text-muted-foreground max-w-xs">
          Masukkan nama domain di atas lalu klik <strong>Scan</strong> untuk
          memulai pemindaian keamanan.
        </p>
      </div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

type ScanState = "idle" | "loading" | "done" | "error";

export default function SecurityScanPage() {
  const { theme, setTheme } = useTheme();

  const [domain, setDomain] = useState("");
  const [scanState, setScanState] = useState<ScanState>("idle");
  const [scanResponse, setScanResponse] = useState<ScanApiResponse | null>(
    null,
  );
  const scanData = scanResponse?.data || null;
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [vtData, setVtData] = useState<VtScoreInput | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handlePrint = () => window.print();
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const handleScan = async () => {
    if (!domain.trim()) {
      inputRef.current?.focus();
      return;
    }

    setScanState("loading");
    setScanResponse(null);
    setErrorMsg(null);
    setVtData(null); // reset VT saat scan baru

    try {
      const response = await fetchSecurityScan(domain.trim());
      setScanResponse(response);
      setScanState("done");
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan tidak diketahui.",
      );
      setScanState("error");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleScan();
  };

  const scoreBreakdown = scanData
    ? computeSecurityScore(
        scanData.results.httpSecurityHeaders,
        scanData.results,
        vtData,
      )
    : null;

  const isPassed = scoreBreakdown ? scoreBreakdown.total >= 80 : false;
  const scanDate = scanData
    ? new Date(scanData.scannedAt).toLocaleString("id-ID", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "—";

  return (
    <div className="min-h-screen bg-background bg-grid relative">
      {/* Top nav bar */}
      <HeaderHorizontal
        title={"Security Scan"}
        description={"Pemindaian kerentanan keamanan situs web Anda."}
        icon={<ShieldEllipsis size={16} className="w-5 h-5 text-white" />}
      >
        {scanData && (
          <span className="text-xs text-muted-foreground hidden sm:block">
            {scanDate}
          </span>
        )}
        {scanData && (
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold border ${isPassed ? "bg-green-50 text-success border-green-200" : "bg-red-50 text-destructive border-red-200"}`}
          >
            {isPassed ? <CheckCircle2 size={12} /> : <ShieldAlert size={12} />}
            {isPassed ? "Passed" : "Failed"}
          </div>
        )}
        <Button
          onClick={handlePrint}
          variant="outline"
          size="sm"
          className="flex items-center gap-1.5 text-xs h-8"
        >
          <Printer size={13} />
          Export PDF
        </Button>
      </HeaderHorizontal>

      <div className="absolute inset-0 bg-gradient-radial pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Page Header & Reset Button */}
        {scanState === "done" && scanData && (
          <motion.header
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="flex flex-col sm:flex-row sm:items-start justify-between gap-4"
          >
            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight">
                Security Audit Report
                <span className="ml-2 text-muted-foreground font-normal">
                  — {scanData.domain}
                </span>
              </h1>
              <p className="text-sm text-muted-foreground">
                Automated vulnerability assessment powered by SSL/TLS and HTTP
                Security Headers analysis.
              </p>
            </div>
            <Button
              onClick={() => {
                setScanState("idle");
                setDomain("");
                setScanResponse(null);
                setVtData(null);
                setErrorMsg(null);
                setTimeout(() => inputRef.current?.focus(), 100);
              }}
              className="flex items-center gap-2 shrink-0"
            >
              <RotateCcw size={14} />
              Mulai Baru
            </Button>
          </motion.header>
        )}

        {/* ─── Domain Input ─────────────────────────────────────────────── */}
        {scanState !== "done" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05, ease: EASE }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-card border border-border/60 rounded-xl px-5 py-4 shadow-card-sm"
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Globe size={16} className="text-muted-foreground shrink-0" />
              <Input
                ref={inputRef}
                id="domain-input"
                type="text"
                placeholder="Masukkan domain, contoh: example.com"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={scanState === "loading"}
                className="border-0 shadow-none focus-visible:ring-offset-0 focus-visible:ring-0 bg-transparent px-0 text-sm h-8"
              />
            </div>
            <Button
              id="scan-button"
              onClick={handleScan}
              disabled={scanState === "loading" || !domain.trim()}
              size="sm"
              className="flex items-center gap-2 shrink-0"
            >
              {scanState === "loading" ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Scanning…
                </>
              ) : (
                <>
                  <Search size={14} />
                  Scan Domain
                </>
              )}
            </Button>
          </motion.div>
        )}

        {/* ─── Error banner ─────────────────────────────────────────────── */}
        <AnimatePresence>
          {scanState === "error" && errorMsg && (
            <motion.div
              key="error-banner"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-3 bg-red-50 border border-red-200 text-destructive text-sm rounded-xl px-5 py-3.5"
            >
              <AlertTriangle size={16} className="shrink-0" />
              <span>{errorMsg}</span>
            </motion.div>
          )}
          {scanState === "done" && scanData?.error && (
            <motion.div
              key="data-error-banner"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-3 bg-red-50 border border-red-200 text-destructive text-sm rounded-xl px-5 py-3.5"
            >
              <AlertTriangle size={16} className="shrink-0" />
              <span>{scanData.error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── Main content ─────────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          {scanState === "idle" && <IdlePrompt key="idle" />}

          {scanState === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              <div className="lg:col-span-2 space-y-6">
                <SkeletonBlock rows={8} />
                <SkeletonBlock rows={9} />
              </div>
              <div className="space-y-5">
                <SkeletonBlock rows={3} />
                <SkeletonBlock rows={4} />
              </div>
            </motion.div>
          )}

          {scanState === "done" && scanData && (
            <motion.div
              key="done"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Left: HTTP Headers + SSL */}
              <div className="lg:col-span-2 space-y-6">
                <HttpHeadersSection
                  data={scanData.results.httpSecurityHeaders}
                />
                <SslSection data={scanData.results} />
                <RecommendationsSection 
                  headers={scanData.results.httpSecurityHeaders} 
                  sslResults={scanData.results}
                />
              </div>

              {/* Right sidebar */}
              <div className="space-y-5">
                <ScoreSummaryCard breakdown={scoreBreakdown!} />
                <VirusTotalCard domain={scanData.domain} onResult={setVtData} />

                {/* Audit Metadata */}
                <motion.section
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2, ease: EASE }}
                  className="bg-card shadow-card-sm rounded-xl p-5 border border-border/50"
                >
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
                    Audit Metadata
                  </h3>
                  {scanResponse?.scan_id && (
                    <MetaItem
                      label="Scan ID"
                      value={String(scanResponse.scan_id)}
                      icon={<ShieldCheck size={12} />}
                    />
                  )}
                  <MetaItem
                    label="Scan Engine"
                    value={String(scanResponse?.version || "AltorScan")}
                    icon={<Tag size={12} />}
                  />
                  <MetaItem
                    label="Domain"
                    value={scanData.domain}
                    icon={<Globe size={12} />}
                  />
                  <MetaItem
                    label="Scanned At"
                    value={scanDate}
                    icon={<Clock size={12} />}
                  />
                  <MetaItem
                    label="TLS Version"
                    value={scanData.results.tlsVersion ?? "Unknown"}
                    icon={<KeyRound size={12} />}
                  />
                  <MetaItem
                    label="Certificate Authority"
                    value={scanData.results.certificateAuthority ?? "Unknown"}
                    icon={<Server size={12} />}
                  />
                  <MetaItem
                    label="Days Until Expiry"
                    value={
                      scanData.results.certificateValidity != null
                        ? `${scanData.results.certificateValidity.daysRemaining} days`
                        : "N/A"
                    }
                    icon={<Lock size={12} />}
                  />
                  <MetaItem
                    label="Cipher Suite"
                    value={scanData.results.cipherSuite ?? "Unknown"}
                    icon={<Info size={12} />}
                  />
                  <MetaItem
                    label="HSTS"
                    value={
                      scanData.results.hstsEnabled ? "Enabled" : "Disabled"
                    }
                    icon={<Zap size={12} />}
                  />
                </motion.section>

                {/* Legend */}
                <div className="bg-muted/50 rounded-xl p-4 border border-border/40 space-y-2.5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Status Legend
                  </p>
                  <div className="space-y-2">
                    {[
                      {
                        icon: (
                          <CheckCircle2 size={14} className="text-success" />
                        ),
                        label: "Pass",
                        desc: "No issues detected",
                      },
                      {
                        icon: (
                          <AlertTriangle size={14} className="text-warning" />
                        ),
                        label: "Warning",
                        desc: "Review recommended",
                      },
                      {
                        icon: (
                          <ShieldAlert size={14} className="text-destructive" />
                        ),
                        label: "Fail",
                        desc: "Immediate action required",
                      },
                      {
                        icon: (
                          <XCircle size={14} className="text-destructive" />
                        ),
                        label: "Missing",
                        desc: "Header not present",
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="flex items-center gap-2.5 text-xs"
                      >
                        {item.icon}
                        <span className="font-medium text-foreground">
                          {item.label}
                        </span>
                        <span className="text-muted-foreground">
                          — {item.desc}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* error state still shows input, no report */}
          {scanState === "error" && (
            <motion.div
              key="error-idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <IdlePrompt />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        {scanState === "done" && scanData && (
          <footer className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground print:hidden">
            <div className="flex items-center gap-4">
              <span>
                {scanResponse?.version || "AltorScan"} by{" "}
                <a
                  href="https://labs.kawanua.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-foreground transition-colors"
                >
                  Kawanua Labs
                </a>
              </span>
              <span>·</span>
              <span>{scanData ? `Scanned ${scanDate}` : "Siap memindai"}</span>
            </div>
            <div className="flex items-center gap-4">
              <span>SSL/TLS Analysis</span>
              <span>·</span>
              <span>HTTP Headers Check</span>
              <span>·</span>
              <span>VirusTotal Check</span>
            </div>
          </footer>
        )}

        {/* Print-only header */}
        <div className="hidden print:flex print:items-center print:justify-between print:border-b print:border-border/60 print:pb-4 print:mb-2">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-primary" />
            <span className="font-bold text-base">
              AltorScan Lite by Kawanua Labs — Security Audit Report
            </span>
          </div>
          <div className="text-xs text-muted-foreground">
            {scanData?.domain ?? ""} · {scanDate}
          </div>
        </div>
      </div>
    </div>
  );
}
