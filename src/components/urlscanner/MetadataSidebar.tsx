import { motion } from "framer-motion";
import { Globe, Lock, Server, CalendarDays, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import type { DnsRecord, HttpsCertificate, VirusTotalAttributes } from "@/types/virustotal";

interface MetadataSidebarProps {
  attrs: VirusTotalAttributes;
}

function parseWhois(whois: string) {
  const lines = whois.split("\n");
  const map: Record<string, string> = {};
  for (const line of lines) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim().toLowerCase();
    const val = line.slice(idx + 1).trim();
    if (val && val.length < 80) map[key] = val;
  }
  return map;
}

function SideCard({
  title,
  icon: Icon,
  children,
  delay = 0,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  delay?: number;
}) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + delay, duration: 0.4 }}
      className="rounded-xl border border-border bg-card"
    >
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors rounded-xl"
      >
        <div className="flex items-center gap-2">
          <Icon size={15} className="text-primary" />
          <h4 className="text-sm font-semibold font-display text-foreground">{title}</h4>
        </div>
        {collapsed ? <ChevronDown size={14} className="text-muted-foreground" /> : <ChevronUp size={14} className="text-muted-foreground" />}
      </button>
      {!collapsed && <div className="px-4 pb-4">{children}</div>}
    </motion.div>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 py-1.5 border-b border-border/50 last:border-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm text-foreground font-body break-all">{value}</span>
    </div>
  );
}

export default function MetadataSidebar({ attrs }: MetadataSidebarProps) {
  const whoisMap = attrs.whois ? parseWhois(attrs.whois) : {};

  const formatDate = (ts?: number) => {
    if (!ts) return "N/A";
    return new Date(ts * 1000).toLocaleDateString("en-US", {
      year: "numeric", month: "short", day: "numeric",
    });
  };

  return (
    <div className="flex flex-col gap-3">
      {/* WHOIS */}
      <SideCard title="WHOIS Info" icon={Globe} delay={0}>
        <div className="flex flex-col">
          {whoisMap["domain registrar url"] || whoisMap["domain registrar"] ? (
            <MetaRow
              label="Registrar"
              value={whoisMap["domain registrar url"]?.replace("https://", "") || whoisMap["domain registrar"] || "N/A"}
            />
          ) : null}
          {whoisMap["create date"] && (
            <MetaRow label="Registered" value={whoisMap["create date"]} />
          )}
          {whoisMap["expiry date"] && (
            <MetaRow label="Expires" value={whoisMap["expiry date"]} />
          )}
          {whoisMap["update date"] && (
            <MetaRow label="Last Updated" value={whoisMap["update date"]} />
          )}
          {whoisMap["administrative country"] && (
            <MetaRow label="Admin Country" value={whoisMap["administrative country"]} />
          )}
          {!whoisMap["create date"] && attrs.creation_date && (
            <MetaRow label="Created" value={formatDate(attrs.creation_date)} />
          )}

          {/* Raw WHOIS scrollable */}
          {attrs.whois && (
            <details className="mt-2">
              <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                View raw WHOIS
              </summary>
              <div className="mt-2 max-h-40 overflow-y-auto rounded-lg bg-muted p-2">
                <pre className="text-xs text-muted-foreground font-mono whitespace-pre-wrap break-all leading-relaxed">
                  {attrs.whois}
                </pre>
              </div>
            </details>
          )}
        </div>
      </SideCard>

      {/* HTTPS Certificate */}
      {attrs.last_https_certificate && (
        <SideCard title="HTTPS Certificate" icon={Lock} delay={0.1}>
          <div className="flex flex-col">
            <MetaRow
              label="Issuer"
              value={attrs.last_https_certificate.issuer.O || attrs.last_https_certificate.issuer.CN || "N/A"}
            />
            <MetaRow
              label="Issued To"
              value={attrs.last_https_certificate.subject.CN || "N/A"}
            />
            <MetaRow
              label="Valid From"
              value={attrs.last_https_certificate.validity.not_before}
            />
            <MetaRow
              label="Valid Until"
              value={attrs.last_https_certificate.validity.not_after}
            />
            <MetaRow
              label="Serial"
              value={attrs.last_https_certificate.serial_number.toUpperCase().slice(0, 16) + "..."}
            />

            {/* Expiry indicator */}
            {(() => {
              const expiry = new Date(attrs.last_https_certificate!.validity.not_after);
              const now = new Date();
              const daysLeft = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
              const isExpired = daysLeft < 0;
              const isSoon = daysLeft >= 0 && daysLeft < 30;
              return (
                <div
                  className={`mt-2 rounded-lg px-3 py-2 text-xs font-medium text-center ${
                    isExpired
                      ? "status-malicious"
                      : isSoon
                      ? "status-suspicious"
                      : "status-safe"
                  }`}
                  style={{
                    backgroundColor: `hsl(var(--status-${isExpired ? "malicious" : isSoon ? "suspicious" : "safe"}) / 0.1)`,
                    borderWidth: 1,
                    borderStyle: "solid",
                    borderColor: `hsl(var(--status-${isExpired ? "malicious" : isSoon ? "suspicious" : "safe"}) / 0.3)`,
                  }}
                >
                  {isExpired ? `Expired ${Math.abs(daysLeft)}d ago` : isSoon ? `Expires in ${daysLeft}d` : `Valid for ${daysLeft} days`}
                </div>
              );
            })()}
          </div>
        </SideCard>
      )}

      {/* DNS Records */}
      {attrs.last_dns_records && attrs.last_dns_records.length > 0 && (
        <SideCard title="DNS Records" icon={Server} delay={0.2}>
          <div className="flex flex-col gap-2">
            {attrs.last_dns_records.map((record, i) => (
              <div
                key={i}
                className="flex items-start gap-2 rounded-lg px-3 py-2 bg-muted"
              >
                <span
                  className="text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-primary/20 text-primary shrink-0"
                >
                  {record.type}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-foreground font-mono break-all">{record.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">TTL: {record.ttl}s</p>
                </div>
              </div>
            ))}
          </div>
        </SideCard>
      )}

      {/* Timeline */}
      <SideCard title="Activity Timeline" icon={CalendarDays} delay={0.3}>
        <div className="flex flex-col">
          {attrs.creation_date && (
            <MetaRow label="Domain Created" value={formatDate(attrs.creation_date)} />
          )}
          {attrs.last_update_date && (
            <MetaRow label="Registrar Update" value={formatDate(attrs.last_update_date)} />
          )}
          {attrs.last_analysis_date && (
            <MetaRow label="Last Scanned" value={formatDate(attrs.last_analysis_date)} />
          )}
          {attrs.last_modification_date && (
            <MetaRow label="VT Modified" value={formatDate(attrs.last_modification_date)} />
          )}
          {attrs.total_votes && (
            <div className="flex gap-3 mt-2 pt-2 border-t border-border/50">
              <div className="flex-1 text-center">
                <p className="text-lg font-bold font-display status-safe">{attrs.total_votes.harmless}</p>
                <p className="text-xs text-muted-foreground">Community Votes Safe</p>
              </div>
              <div className="flex-1 text-center">
                <p className="text-lg font-bold font-display status-malicious">{attrs.total_votes.malicious}</p>
                <p className="text-xs text-muted-foreground">Community Votes Unsafe</p>
              </div>
            </div>
          )}
        </div>
      </SideCard>
    </div>
  );
}
