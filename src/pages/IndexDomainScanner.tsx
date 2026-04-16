import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ScannerInput from "@/components/urlscanner/ScannerInput";
import VerdictCard from "@/components/urlscanner/VerdictCard";
import VendorList from "@/components/urlscanner/VendorList";
import MetadataSidebar from "@/components/urlscanner/MetadataSidebar";
import type { VirusTotalResponse } from "@/types/virustotal";
import HeaderApp from "@/components/HeaderApp";
import { SubFooter } from "@/components/Footer";

const API_KEY = import.meta.env.VITE_VIRUSTOTAL_API_KEY as string;

// Access the proxy URL and Bearer Token from environment variables
const VT_BASE = import.meta.env.VITE_VT_PROXY_BASE as string;
const VT_PROXY_KEY = import.meta.env.VITE_VT_PROXY_BASE_KEY as string;

function extractTarget(input: string): {
  target: string;
  type: "domain" | "url";
} {
  try {
    const url = input.startsWith("http")
      ? new URL(input)
      : new URL("https://" + input);
    const hostname = url.hostname;
    if (url.pathname && url.pathname !== "/" && url.pathname.length > 1) {
      return {
        target: input.startsWith("http") ? input : "https://" + input,
        type: "url",
      };
    }
    return { target: hostname, type: "domain" };
  } catch {
    return { target: input, type: "domain" };
  }
}

async function scanWithVirusTotal(input: string): Promise<VirusTotalResponse> {
  const { target, type } = extractTarget(input);

  let endpoint: string;
  if (type === "url") {
    const encoded = btoa(target)
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "");
    endpoint = `${VT_BASE}/urls/${encoded}`;
  } else {
    endpoint = `${VT_BASE}/domains/${target}`;
  }

  const headers: Record<string, string> = { "x-apikey": API_KEY };
  if (VT_PROXY_KEY) {
    headers["Authorization"] = `Bearer ${VT_PROXY_KEY}`;
  }

  const res = await fetch(endpoint, { headers });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const msg =
      (err as { error?: { message?: string } })?.error?.message ||
      `HTTP ${res.status}`;
    throw new Error(msg);
  }

  return res.json() as Promise<VirusTotalResponse>;
}

export default function UrlScannerPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<VirusTotalResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scannedInput, setScannedInput] = useState("");
  const navigate = useNavigate();

  const handleScan = async (url: string) => {
    setIsScanning(true);
    setError(null);
    setResult(null);
    setScannedInput(url);

    try {
      const data = await scanWithVirusTotal(url);
      setResult(data);
      // Store in sessionStorage keyed by the domain/id for the report page
      sessionStorage.setItem(`vt_result_${data.data.id}`, JSON.stringify(data));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="min-h-screen bg-background bg-grid relative flex flex-col justify-between">
      <HeaderApp
        title={"Domain Scanner"}
        description={
          "Periksa domain atau URL terhadap 90+ vendor keamanan secara instan."
        }
        icon={<Shield className="h-8 w-8 text-white" />}
        customCss={""}
        clientSide={false}
      />
      <div className="absolute inset-0 bg-gradient-radial pointer-events-none" />

      <main className="w-full max-w-7xl mx-auto px-4 py-10 md:py-16 z-50">
        {/* Scanner input */}
        <div className="mb-8">
          <ScannerInput onScan={handleScan} isScanning={isScanning} />
        </div>

        {/* Scanning animation */}
        <AnimatePresence>
          {isScanning && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center gap-4 py-16"
            >
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
                <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary radar-sweep" />
                <div className="absolute inset-2 rounded-full border border-primary/10 pulse-ring" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Shield size={24} className="text-primary" />
                </div>
              </div>
              <div className="text-center">
                <p className="text-foreground font-semibold font-display">
                  Scanning...
                </p>
                <p className="text-muted-foreground text-sm mt-1">
                  Querying security vendors for{" "}
                  <span className="text-primary">{scannedInput}</span>
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error */}
        <AnimatePresence>
          {error && !isScanning && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 max-w-3xl mx-auto"
            >
              <AlertCircle
                size={18}
                className="text-destructive shrink-0 mt-0.5"
              />
              <div>
                <p className="text-sm font-semibold text-destructive">
                  Scan failed
                </p>
                <p className="text-sm text-muted-foreground mt-0.5">{error}</p>
                {error.includes("401") ||
                error.toLowerCase().includes("key") ||
                error.toLowerCase().includes("auth") ? (
                  <p className="text-xs text-muted-foreground mt-1">
                    Check that your VITE_VIRUSTOTAL_API_KEY environment variable
                    is set correctly.
                  </p>
                ) : null}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {result && !isScanning && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col gap-6"
            >
              {/* Share report button */}
              {/* <div className="flex justify-end">
                <button
                  onClick={() => navigate(`/report/${result.data.id}`)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-xs text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all"
                >
                  <Shield size={13} className="text-primary" />
                  View Full Report
                </button>
              </div> */}

              {/* Verdict */}
              <VerdictCard
                domain={result.data.id}
                stats={result.data.attributes.last_analysis_stats}
                reputationScore={result.data.attributes.reputation}
                lastAnalysisDate={result.data.attributes.last_analysis_date}
              />

              {/* Two-column layout */}
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
                <VendorList
                  results={result.data.attributes.last_analysis_results}
                />
                <MetadataSidebar attrs={result.data.attributes} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty state */}
        {!result && !isScanning && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center gap-3 py-16 text-center"
          >
            <div className="w-14 h-14 rounded-2xl bg-muted border border-border flex items-center justify-center">
              <Shield size={24} className="text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-sm max-w-xs">
              Enter a domain like{" "}
              <span className="text-foreground font-mono">example.com</span> or
              a full URL to check its security status.
            </p>
          </motion.div>
        )}
      </main>

      <SubFooter>
        <span>
          Powered by{" "}
          <a
            href="https://www.virustotal.com/gui/home/url"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            VirusTotal
          </a>
          .
        </span>
      </SubFooter>
    </div>
  );
}
