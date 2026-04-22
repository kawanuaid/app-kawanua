import { SslItem, ScanResults } from "@/types/securityscan";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle2,
  FileCheck,
  KeyRound,
  Lock,
  MinusCircle,
  RefreshCw,
  Shield,
  XCircle,
} from "lucide-react";

// ─── Build SslItem[] from API data ───────────────────────────────────────────

function buildSslItems(r: ScanResults): SslItem[] {
  const cv = r.certificateValidity;

  const certValidityStatus = (): SslItem["status"] => {
    if (cv === null) return "warning";
    if (cv.daysRemaining <= 0) return "fail";
    if (cv.daysRemaining <= 14) return "warning";
    return "pass";
  };

  const certValidityValue = () => {
    if (cv === null) return "Certificate info unavailable";
    // Gunakan validTo raw dari API — tidak di-parse ulang karena formatnya non-ISO
    return `Valid · Expires ${cv.validTo} (${cv.daysRemaining} days remaining)`;
  };

  return [
    {
      label: "TLS Version",
      status:
        r.tlsVersion === "TLSv1.3" || r.tlsVersion === "TLSv1.2"
          ? "pass"
          : "warning",
      value: r.tlsVersion ?? "Unknown",
      description:
        r.tlsVersion === "TLSv1.3"
          ? "TLS 1.3 detected — the most secure version. No deprecated protocols enabled."
          : "TLS 1.0 and 1.1 are deprecated. Only TLS 1.2+ should be enabled.",
    },
    {
      label: "Certificate Validity",
      status: certValidityStatus(),
      value: certValidityValue(),
      description:
        cv !== null
          ? "Certificate is currently valid and issued by a trusted CA."
          : "Certificate validity data could not be retrieved for this domain.",
    },
    {
      label: "Certificate Authority",
      status: r.certificateAuthority ? "pass" : "warning",
      value: r.certificateAuthority ?? "Unknown",
      description:
        "Certificate is issued by a recognized and trusted certificate authority.",
    },
    {
      label: "HSTS Enabled",
      status: r.hstsEnabled ? "pass" : "fail",
      value: r.hstsEnabled ? "Enabled" : "Not configured",
      description: r.hstsEnabled
        ? "HTTP Strict Transport Security is active."
        : "HSTS is not configured. Clients may connect over insecure HTTP.",
    },
    {
      label: "HSTS Preload",
      status: r.hstsPreload ? "pass" : "warning",
      value: r.hstsPreload ? "In preload list" : "Not in preload list",
      description: r.hstsPreload
        ? "Domain is enrolled in the HSTS preload list."
        : "Not enrolled in the HSTS preload list. Submit at hstspreload.org.",
    },
    {
      label: "Certificate Transparency",
      status:
        r.certificateTransparency || r.advancedCertDetails?.hasSCT
          ? "pass"
          : "warning",
      value: r.certificateTransparency
        ? "SCT present"
        : r.advancedCertDetails?.hasSCT
          ? "SCT present (via advanced check)"
          : "Not logged",
      description:
        r.certificateTransparency || r.advancedCertDetails?.hasSCT
          ? "Certificate is logged in public CT logs, ensuring auditability."
          : "Certificate transparency log not detected. This may reduce trust.",
    },
    {
      label: "Cipher Suite",
      status:
        r.cipherSuite?.includes("AES_128_GCM") ||
        r.cipherSuite?.includes("AES_256_GCM")
          ? "pass"
          : "warning",
      value: r.cipherSuite ?? "Unknown",
      description: "The negotiated cipher suite for this TLS connection.",
    },
    {
      label: "OCSP Stapling",
      status: r.ocspStapling ? "pass" : "fail",
      value: r.ocspStapling ? "Enabled" : "Not configured",
      description: r.ocspStapling
        ? "OCSP stapling is enabled. Revocation checks are efficient."
        : "OCSP stapling is not enabled. This delays revocation checks for clients.",
    },
    {
      label: "Perfect Forward Secrecy",
      status: r.perfectForwardSecrecy ? "pass" : "warning",
      value: r.perfectForwardSecrecy ? "Enabled" : "Not detected",
      description: r.perfectForwardSecrecy
        ? "PFS is active. Session keys are ephemeral and cannot be retroactively decrypted."
        : "Perfect Forward Secrecy not detected. Past sessions may be decryptable if key is compromised.",
    },
  ];
}

// ─── Visual maps ──────────────────────────────────────────────────────────────

const SSL_STATUS_ICON = {
  pass: <CheckCircle2 size={16} className="text-success shrink-0 mt-0.5" />,
  warning: <AlertTriangle size={16} className="text-warning shrink-0 mt-0.5" />,
  fail: <XCircle size={16} className="text-destructive shrink-0 mt-0.5" />,
};

const SSL_LABEL_ICON: Record<string, React.ReactNode> = {
  "TLS Version": <RefreshCw size={13} className="text-muted-foreground" />,
  "Certificate Validity": (
    <FileCheck size={13} className="text-muted-foreground" />
  ),
  "Certificate Authority": (
    <Shield size={13} className="text-muted-foreground" />
  ),
  "HSTS Enabled": <Lock size={13} className="text-muted-foreground" />,
  "HSTS Preload": <Lock size={13} className="text-muted-foreground" />,
  "Certificate Transparency": (
    <FileCheck size={13} className="text-muted-foreground" />
  ),
  "Cipher Suite": <KeyRound size={13} className="text-muted-foreground" />,
  "OCSP Stapling": <MinusCircle size={13} className="text-muted-foreground" />,
  "Perfect Forward Secrecy": (
    <KeyRound size={13} className="text-muted-foreground" />
  ),
};

const SSL_ROW_BG: Record<SslItem["status"], string> = {
  pass: "",
  warning: "bg-amber-50/40",
  fail: "bg-red-50/40",
};

const EASE = [0.25, 0.1, 0.25, 1] as const;

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  data: ScanResults;
}

export default function SslSection({ data }: Props) {
  const sslItems = buildSslItems(data);

  const passCount = sslItems.filter((s) => s.status === "pass").length;
  const warnCount = sslItems.filter((s) => s.status === "warning").length;
  const failCount = sslItems.filter((s) => s.status === "fail").length;

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.12, ease: EASE }}
      className="bg-card shadow-card-md rounded-xl overflow-hidden border border-border/50"
    >
      <div className="px-6 py-4 border-b border-border/60 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-semibold text-sm flex items-center gap-2">
          <Lock size={16} className="text-primary" />
          SSL / TLS Configuration
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold px-2 py-0.5 bg-green-50 text-success border border-green-100 rounded">
            {passCount} Pass
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-100 rounded">
            {warnCount} Warning
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 bg-red-50 text-destructive border border-red-100 rounded">
            {failCount} Fail
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-6 pt-4 pb-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
          <span>Coverage</span>
          <span className="font-semibold tabular-nums text-foreground">
            {passCount}/{sslItems.length} configurations
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden flex">
          <div
            className="h-full bg-success rounded-l-full transition-all duration-700"
            style={{ width: `${(passCount / sslItems.length) * 100}%` }}
          />
          <div
            className="h-full bg-warning transition-all duration-700"
            style={{
              width: `${(warnCount / sslItems.length) * 100}%`,
            }}
          />
          <div
            className="h-full bg-destructive rounded-r-full transition-all duration-700"
            style={{
              width: `${(failCount / sslItems.length) * 100}%`,
            }}
          />
        </div>
      </div>

      <div className="divide-y divide-border/40">
        {sslItems.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.15 + i * 0.04, ease: EASE }}
            className={`px-6 py-3.5 hover:bg-muted/30 transition-colors duration-150 flex items-start gap-3 ${SSL_ROW_BG[item.status]}`}
          >
            {SSL_STATUS_ICON[item.status]}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-0.5">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                  {SSL_LABEL_ICON[item.label]}
                  {item.label}
                </span>
              </div>
              <p className="text-[11px] font-mono text-muted-foreground bg-muted/60 rounded px-2 py-0.5 mb-1 inline-block">
                {item.value}
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>
            {item.status === "fail" && (
              <span className="text-[9px] font-bold text-destructive bg-red-50 border border-red-100 px-1.5 py-0.5 rounded uppercase whitespace-nowrap shrink-0 mt-0.5">
                Action Required
              </span>
            )}
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
