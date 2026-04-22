import type { HttpSecurityHeaders, ScanResults } from "@/types/securityscan";

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface VtScoreInput {
  malicious: number;
  suspicious: number;
}

export interface ScoreBreakdown {
  /** Skor akhir gabungan 0–100 (dibulatkan) */
  total: number;

  /** Rincian per kategori (raw, belum dibulatkan) */
  headers: number;   // max 40
  ssl: number;       // max 40
  vt: number;        // max 20

  /** Statistik untuk badge counts di ScoreSummaryCard */
  passCount: number;
  warnCount: number;
  failCount: number;
}

// ─── HTTP Headers score (max 40 pts) ─────────────────────────────────────────

/**
 * Bobot per header berdasarkan risk level dari HEADER_META.
 * Critical=8, High=6, Medium=4, Low=2 → total = 8+6+4+4+4+2+2+6 = 36 → normalised ke 40
 */
const HEADER_WEIGHTS: Record<keyof HttpSecurityHeaders, number> = {
  contentSecurityPolicy:     8, // Critical
  strictTransportSecurity:   6, // High
  xFrameOptions:             4, // Medium
  xContentTypeOptions:       4, // Medium
  permissionsPolicy:         4, // Medium
  referrerPolicy:            2, // Low
  xXssProtection:            2, // Low
  crossOriginOpenerPolicy:   6, // High
};

const HEADER_TOTAL_WEIGHT = Object.values(HEADER_WEIGHTS).reduce(
  (a, b) => a + b,
  0,
); // 36

function scoreHeaders(headers: HttpSecurityHeaders): number {
  let earned = 0;

  for (const key of Object.keys(HEADER_WEIGHTS) as (keyof HttpSecurityHeaders)[]) {
    const weight = HEADER_WEIGHTS[key];
    const value = headers[key];

    if (value !== null && value !== undefined) {
      // present — nilai string berarti ada
      earned += weight;
    }
    // missing → +0
  }

  // Normalise ke max 40
  return (earned / HEADER_TOTAL_WEIGHT) * 40;
}

// ─── SSL / TLS score (max 40 pts) ────────────────────────────────────────────

/**
 * Bobot per SSL item; total = 8+6+4+6+3+4+4+5+4 = 44 → normalised ke 40
 * Urutan sama dengan buildSslItems() di SslSection.tsx
 */
const SSL_ITEM_WEIGHTS = {
  tlsVersion:               8,
  certificateValidity:      6,
  certificateAuthority:     4,
  hstsEnabled:              6,
  hstsPreload:              3,
  certificateTransparency:  4,
  cipherSuite:              4,
  ocspStapling:             5,
  perfectForwardSecrecy:    4,
} as const;

type SslKey = keyof typeof SSL_ITEM_WEIGHTS;

const SSL_TOTAL_WEIGHT = Object.values(SSL_ITEM_WEIGHTS).reduce(
  (a, b) => a + b,
  0,
); // 44

function sslItemStatus(
  key: SslKey,
  r: ScanResults,
): "pass" | "warning" | "fail" {
  const cv = r.certificateValidity;

  switch (key) {
    case "tlsVersion":
      return r.tlsVersion === "TLSv1.3" || r.tlsVersion === "TLSv1.2"
        ? "pass"
        : "warning";

    case "certificateValidity":
      if (cv === null) return "warning";
      if (cv.daysRemaining <= 0) return "fail";
      if (cv.daysRemaining <= 14) return "warning";
      return "pass";

    case "certificateAuthority":
      return r.certificateAuthority ? "pass" : "warning";

    case "hstsEnabled":
      return r.hstsEnabled ? "pass" : "fail";

    case "hstsPreload":
      return r.hstsPreload ? "pass" : "warning";

    case "certificateTransparency":
      return r.certificateTransparency || r.advancedCertDetails?.hasSCT ? "pass" : "warning";

    case "cipherSuite":
      return r.cipherSuite?.includes("AES_128_GCM") ||
        r.cipherSuite?.includes("AES_256_GCM")
        ? "pass"
        : "warning";

    case "ocspStapling":
      return r.ocspStapling ? "pass" : "fail";

    case "perfectForwardSecrecy":
      return r.perfectForwardSecrecy ? "pass" : "warning";
  }
}

/** Multiplier: pass=1.0, warning=0.5, fail=0.0 */
const STATUS_MULT: Record<"pass" | "warning" | "fail", number> = {
  pass: 1.0,
  warning: 0.5,
  fail: 0.0,
};

function scoreSSL(r: ScanResults): number {
  let earned = 0;

  for (const key of Object.keys(SSL_ITEM_WEIGHTS) as SslKey[]) {
    const status = sslItemStatus(key, r);
    earned += SSL_ITEM_WEIGHTS[key] * STATUS_MULT[status];
  }

  // Normalise ke max 40
  return (earned / SSL_TOTAL_WEIGHT) * 40;
}

// ─── VirusTotal score (max 20 pts) ────────────────────────────────────────────

/**
 * - jika malicious === 0 akan menambah poin 10
 * - jika suspicious === 0 akan menambah poin 10
 * - jika malicious > 0 akan mengurangi poin 10
 * - jika suspicious > 0 akan mengurangi poin 10
 * - jika datanya null poin tetap kosong dianggap tidak terdeteksi
 */
function scoreVT(vt: VtScoreInput | null): number {
  if (vt === null) return 0;

  let score = 0;

  if (vt.malicious === 0) score += 10;
  if (vt.malicious > 0) score -= 10;

  if (vt.suspicious === 0) score += 10;
  if (vt.suspicious > 0) score -= 10;

  return score;
}

// ─── Count pass / warn / fail across all items ────────────────────────────────

function countStatuses(
  headers: HttpSecurityHeaders,
  r: ScanResults,
): Pick<ScoreBreakdown, "passCount" | "warnCount" | "failCount"> {
  let passCount = 0;
  let warnCount = 0;
  let failCount = 0;

  // --- HTTP headers ---
  for (const key of Object.keys(HEADER_WEIGHTS) as (keyof HttpSecurityHeaders)[]) {
    const value = headers[key];
    if (value !== null && value !== undefined) {
      passCount++;
    } else {
      failCount++; // missing = fail
    }
  }

  // --- SSL items ---
  for (const key of Object.keys(SSL_ITEM_WEIGHTS) as SslKey[]) {
    const status = sslItemStatus(key, r);
    if (status === "pass") passCount++;
    else if (status === "warning") warnCount++;
    else failCount++;
  }

  return { passCount, warnCount, failCount };
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Hitung total skor keamanan dari ketiga sumber.
 *
 * @param headers  Data dari `scanData.results.httpSecurityHeaders`
 * @param ssl      Data dari `scanData.results`
 * @param vt       Data dari VirusTotalCard (null = belum tersedia)
 */
export function computeSecurityScore(
  headers: HttpSecurityHeaders,
  ssl: ScanResults,
  vt: VtScoreInput | null,
): ScoreBreakdown {
  const headersScore = scoreHeaders(headers);
  const sslScore = scoreSSL(ssl);
  const vtScore = scoreVT(vt);

  const total = Math.round(headersScore + sslScore + vtScore);
  const { passCount, warnCount, failCount } = countStatuses(headers, ssl);

  return {
    total: Math.min(100, Math.max(0, total)),
    headers: headersScore,
    ssl: sslScore,
    vt: vtScore,
    passCount,
    warnCount,
    failCount,
  };
}
