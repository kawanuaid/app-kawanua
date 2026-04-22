import { HttpHeader, HttpSecurityHeaders } from "@/types/securityscan";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Shield, XCircle } from "lucide-react";

// ─── Static metadata (descriptions, risks) ───────────────────────────────────

const HEADER_META: Record<
  keyof HttpSecurityHeaders,
  { label: string; description: string; risk: HttpHeader["risk"] }
> = {
  contentSecurityPolicy: {
    label: "Content-Security-Policy",
    description:
      "Prevents XSS and data injection attacks by controlling resource loading.",
    risk: "Critical",
  },
  strictTransportSecurity: {
    label: "Strict-Transport-Security",
    description:
      "Forces HTTPS connections, preventing protocol downgrade attacks.",
    risk: "High",
  },
  xFrameOptions: {
    label: "X-Frame-Options",
    description:
      "Protects against clickjacking by controlling iframe embedding.",
    risk: "Medium",
  },
  xContentTypeOptions: {
    label: "X-Content-Type-Options",
    description:
      "Prevents MIME-type sniffing, reducing exposure to drive-by attacks.",
    risk: "Medium",
  },
  permissionsPolicy: {
    label: "Permissions-Policy",
    description:
      "Controls browser feature access (camera, microphone, geolocation, etc.).",
    risk: "Medium",
  },
  referrerPolicy: {
    label: "Referrer-Policy",
    description:
      "Recommended: strict-origin-when-cross-origin to limit referrer leakage.",
    risk: "Low",
  },
  xXssProtection: {
    label: "X-XSS-Protection",
    description:
      "Legacy XSS filter for older browsers (superseded by CSP in modern browsers).",
    risk: "Low",
  },
  crossOriginOpenerPolicy: {
    label: "Cross-Origin-Opener-Policy",
    description:
      "Isolates browsing context to prevent cross-origin information leaks.",
    risk: "High",
  },
};

// ─── Derive HttpHeader[] from API data ────────────────────────────────────────

function buildHeaders(apiHeaders: HttpSecurityHeaders): HttpHeader[] {
  return (Object.keys(HEADER_META) as (keyof HttpSecurityHeaders)[]).map(
    (key) => {
      const value = apiHeaders[key];
      const meta = HEADER_META[key];
      return {
        name: meta.label,
        status: value === null ? "missing" : "present",
        value: value ?? undefined,
        description: meta.description,
        risk: meta.risk,
      };
    },
  );
}

// ─── Visual maps ──────────────────────────────────────────────────────────────

const HEADER_STATUS_ICON = {
  present: <CheckCircle2 size={16} className="text-success shrink-0 mt-0.5" />,
  missing: <XCircle size={16} className="text-destructive shrink-0 mt-0.5" />,
  misconfigured: (
    <AlertTriangle size={16} className="text-warning shrink-0 mt-0.5" />
  ),
};

const HEADER_STATUS_BADGE: Record<HttpHeader["status"], string> = {
  present: "bg-green-50 text-success border-green-100",
  missing: "bg-red-50 text-destructive border-red-100",
  misconfigured: "bg-amber-50 text-amber-700 border-amber-100",
};

const HEADER_RISK_CLASSES: Record<HttpHeader["risk"], string> = {
  Critical: "bg-red-50 text-red-700 border-red-100",
  High: "bg-orange-50 text-orange-700 border-orange-100",
  Medium: "bg-amber-50 text-amber-700 border-amber-100",
  Low: "bg-blue-50 text-blue-700 border-blue-100",
};

const EASE = [0.25, 0.1, 0.25, 1] as const;

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  data: HttpSecurityHeaders;
}

export default function HttpHeadersSection({ data }: Props) {
  const headers = buildHeaders(data);

  const presentCount = headers.filter((h) => h.status === "present").length;
  const missingCount = headers.filter((h) => h.status === "missing").length;
  const misconfiguredCount = headers.filter(
    (h) => h.status === "misconfigured",
  ).length;

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.08, ease: EASE }}
      className="bg-card shadow-card-md rounded-xl overflow-hidden border border-border/50"
    >
      <div className="px-6 py-4 border-b border-border/60 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-semibold text-sm flex items-center gap-2">
          <Shield size={16} className="text-primary" />
          HTTP Security Headers
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold px-2 py-0.5 bg-green-50 text-success border border-green-100 rounded">
            {presentCount} Present
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-100 rounded">
            {misconfiguredCount} Misconfigured
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 bg-red-50 text-destructive border border-red-100 rounded">
            {missingCount} Missing
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-6 pt-4 pb-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
          <span>Coverage</span>
          <span className="font-semibold tabular-nums text-foreground">
            {presentCount}/{headers.length} headers
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden flex">
          <div
            className="h-full bg-success rounded-l-full transition-all duration-700"
            style={{ width: `${(presentCount / headers.length) * 100}%` }}
          />
          <div
            className="h-full bg-warning transition-all duration-700"
            style={{
              width: `${(misconfiguredCount / headers.length) * 100}%`,
            }}
          />
          <div
            className="h-full bg-destructive rounded-r-full transition-all duration-700"
            style={{
              width: `${(missingCount / headers.length) * 100}%`,
            }}
          />
        </div>
      </div>

      <div className="divide-y divide-border/40">
        {headers.map((header, i) => (
          <motion.div
            key={header.name}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.12 + i * 0.04, ease: EASE }}
            className="px-6 py-3.5 hover:bg-muted/30 transition-colors duration-150 flex items-start gap-3"
          >
            {HEADER_STATUS_ICON[header.status]}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-0.5">
                <code className="text-xs font-mono font-semibold text-foreground">
                  {header.name}
                </code>
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded border leading-none uppercase ${HEADER_STATUS_BADGE[header.status]}`}
                >
                  {header.status}
                </span>
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded border leading-none ${HEADER_RISK_CLASSES[header.risk]}`}
                >
                  {header.risk}
                </span>
              </div>
              {header.value && (
                <p className="text-[11px] font-mono text-muted-foreground bg-muted/60 rounded px-2 py-0.5 mb-1 inline-block truncate max-w-full">
                  {header.value}
                </p>
              )}
              <p className="text-xs text-muted-foreground leading-relaxed">
                {header.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
