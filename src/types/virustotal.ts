export interface AnalysisResult {
  method: string;
  engine_name: string;
  category: "harmless" | "malicious" | "suspicious" | "undetected" | "timeout";
  result: string;
}

export interface LastAnalysisStats {
  malicious: number;
  suspicious: number;
  undetected: number;
  harmless: number;
  timeout: number;
}

export interface DnsRecord {
  type: string;
  ttl: number;
  value: string;
  rname?: string;
  serial?: number;
}

export interface HttpsCertificate {
  validity: {
    not_after: string;
    not_before: string;
  };
  issuer: {
    C?: string;
    O?: string;
    CN?: string;
  };
  subject: {
    CN?: string;
  };
  serial_number: string;
}

export interface VirusTotalAttributes {
  last_analysis_stats: LastAnalysisStats;
  last_analysis_results: Record<string, AnalysisResult>;
  last_dns_records?: DnsRecord[];
  last_https_certificate?: HttpsCertificate;
  whois?: string;
  whois_date?: number;
  creation_date?: number;
  last_update_date?: number;
  last_modification_date?: number;
  reputation?: number;
  tld?: string;
  last_analysis_date?: number;
  total_votes?: { harmless: number; malicious: number };
}

export interface VirusTotalData {
  id: string;
  type: string;
  attributes: VirusTotalAttributes;
}

export interface VirusTotalResponse {
  data: VirusTotalData;
}
