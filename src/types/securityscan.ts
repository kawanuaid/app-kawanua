export interface CveLink {
  id: string;
  url: string;
  description: string;
}

export interface OwaspDetail {
  cves: CveLink[];
  remediationCode: { lang: string; code: string };
  references: { label: string; url: string }[];
}

export interface OwaspItem {
  id: string;
  category: string;
  status: "pass" | "fail" | "warning";
  description: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  cwe?: string;
  detail?: OwaspDetail;
}

export interface RecommendationItem {
  title: string;
  description: string;
  impact: "Critical" | "High" | "Medium" | "Low";
  effort: "High" | "Medium" | "Low";
  reference: string;
  source: string;
}

export interface HttpHeader {
  name: string;
  status: "present" | "missing" | "misconfigured";
  value?: string;
  description: string;
  risk: "Critical" | "High" | "Medium" | "Low";
}

export interface SslItem {
  label: string;
  status: "pass" | "fail" | "warning";
  value: string;
  description: string;
}

// ─── API Response Types ───────────────────────────────────────────────────────

export interface HttpSecurityHeaders {
  contentSecurityPolicy: string | null;
  strictTransportSecurity: string | null;
  xFrameOptions: string | null;
  xContentTypeOptions: string | null;
  permissionsPolicy: string | null;
  referrerPolicy: string | null;
  xXssProtection: string | null;
  crossOriginOpenerPolicy: string | null;
}

export interface CertificateValidity {
  validFrom: string;
  validTo: string;
  daysRemaining: number;
}

export interface AdvancedCertDetails {
  ocspMustStaple: boolean;
  ocspUrl: string | null;
  hasSCT: boolean;
}

export interface ScanResults {
  tlsVersion: string | null;
  certificateValidity: CertificateValidity | null;
  certificateAuthority: string | null;
  hstsEnabled: boolean;
  hstsPreload: boolean;
  certificateTransparency: boolean;
  cipherSuite: string | null;
  ocspStapling: boolean;
  perfectForwardSecrecy: boolean;
  httpSecurityHeaders: HttpSecurityHeaders;
  advancedCertDetails: AdvancedCertDetails;
}

export interface ScanData {
  domain: string;
  scannedAt: string;
  results: ScanResults;
  error?: string;
}

export interface ScanApiResponse {
  status: "success" | "error";
  scan_id: number;
  version: string;
  data: ScanData;
}
