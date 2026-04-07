import { motion } from "framer-motion";
import { Shield, ShieldAlert, ShieldX, AlertTriangle, Clock } from "lucide-react";
import type { LastAnalysisStats } from "@/types/virustotal";

interface VerdictCardProps {
  domain: string;
  stats: LastAnalysisStats;
  reputationScore?: number;
  lastAnalysisDate?: number;
}

export default function VerdictCard({
  domain,
  stats,
  reputationScore,
  lastAnalysisDate,
}: VerdictCardProps) {
  const total = stats.harmless + stats.malicious + stats.suspicious + stats.undetected + stats.timeout;

  let verdict: "clean" | "malicious" | "suspicious";
  if (stats.malicious > 0) verdict = "malicious";
  else if (stats.suspicious > 0) verdict = "suspicious";
  else verdict = "clean";

  const config = {
    clean: {
      label: "Clean",
      sublabel: "No threats detected",
      Icon: Shield,
      colorClass: "status-safe",
      borderClass: "border-status-safe",
      bgClass: "bg-status-safe",
      glowClass: "glow-safe",
      textGradient: "from-safe to-safe/70",
    },
    malicious: {
      label: "Malicious",
      sublabel: `Flagged by ${stats.malicious} security vendor${stats.malicious > 1 ? "s" : ""}`,
      Icon: ShieldX,
      colorClass: "status-malicious",
      borderClass: "border-status-malicious",
      bgClass: "bg-status-malicious",
      glowClass: "glow-malicious",
      textGradient: "from-malicious to-malicious/70",
    },
    suspicious: {
      label: "Suspicious",
      sublabel: `Flagged suspicious by ${stats.suspicious} vendor${stats.suspicious > 1 ? "s" : ""}`,
      Icon: ShieldAlert,
      colorClass: "status-suspicious",
      borderClass: "border-status-suspicious",
      bgClass: "bg-status-suspicious",
      glowClass: "",
      textGradient: "from-suspicious to-suspicious/70",
    },
  }[verdict];

  const { Icon } = config;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`relative w-full rounded-2xl border-2 bg-card p-6 md:p-8 overflow-hidden ${config.borderClass} ${config.glowClass}`}
    >
      {/* Background glow blob */}
      <div
        className={`absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-10 ${config.bgClass} blur-3xl pointer-events-none`}
      />

      <div className="relative flex flex-col md:flex-row items-center md:items-start gap-6">
        {/* Icon */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="relative shrink-0"
        >
          {verdict !== "clean" && (
            <div
              className={`absolute inset-0 rounded-full ${config.bgClass} pulse-ring`}
            />
          )}
          <div
            className={`relative w-20 h-20 rounded-full flex items-center justify-center ${config.bgClass} border-2 ${config.borderClass}`}
            style={{ backgroundColor: `hsl(var(--status-${verdict === "clean" ? "safe" : verdict}) / 0.15)` }}
          >
            <Icon
              size={40}
              className={config.colorClass}
            />
          </div>
        </motion.div>

        {/* Verdict text */}
        <div className="flex-1 text-center md:text-left">
          <p className="text-sm text-muted-foreground font-body mb-1">Scanning result for</p>
          <h2 className="text-2xl md:text-3xl font-bold font-display text-foreground mb-2 break-all">
            {domain}
          </h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`text-4xl md:text-5xl font-bold font-display ${config.colorClass} mb-1`}
          >
            {config.label}
          </motion.p>
          <p className="text-muted-foreground text-sm font-body">{config.sublabel}</p>

          {lastAnalysisDate && (
            <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground justify-center md:justify-start">
              <Clock size={12} />
              Last analyzed: {new Date(lastAnalysisDate * 1000).toLocaleDateString("en-US", {
                year: "numeric", month: "short", day: "numeric"
              })}
            </div>
          )}
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3 shrink-0">
          <StatBadge label="Clean" value={stats.harmless} color="safe" />
          <StatBadge label="Malicious" value={stats.malicious} color="malicious" />
          <StatBadge label="Suspicious" value={stats.suspicious} color="suspicious" />
          <StatBadge label="Undetected" value={stats.undetected} color="undetected" />
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-6 flex rounded-full overflow-hidden h-2 bg-muted gap-0.5">
        {stats.harmless > 0 && (
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${(stats.harmless / total) * 100}%`, backgroundColor: "hsl(var(--status-safe))" }}
          />
        )}
        {stats.suspicious > 0 && (
          <div
            className="h-full transition-all"
            style={{ width: `${(stats.suspicious / total) * 100}%`, backgroundColor: "hsl(var(--status-suspicious))" }}
          />
        )}
        {stats.malicious > 0 && (
          <div
            className="h-full transition-all"
            style={{ width: `${(stats.malicious / total) * 100}%`, backgroundColor: "hsl(var(--status-malicious))" }}
          />
        )}
        {stats.undetected > 0 && (
          <div
            className="h-full flex-1 transition-all"
            style={{ backgroundColor: "hsl(var(--status-undetected))" }}
          />
        )}
      </div>
      <div className="flex justify-between mt-1 text-xs text-muted-foreground">
        <span>{total} vendors scanned</span>
        {reputationScore !== undefined && <span>Reputation: {reputationScore}</span>}
      </div>
    </motion.div>
  );
}

function StatBadge({ label, value, color }: { label: string; value: number; color: string }) {
  const colorMap: Record<string, { text: string; bg: string }> = {
    safe: { text: "status-safe", bg: "bg-status-safe" },
    malicious: { text: "status-malicious", bg: "bg-status-malicious" },
    suspicious: { text: "status-suspicious", bg: "bg-status-suspicious" },
    undetected: { text: "status-undetected", bg: "bg-status-undetected" },
  };
  const { text, bg } = colorMap[color];

  return (
    <div className={`rounded-lg px-3 py-2 text-center ${bg}`} style={{ backgroundColor: `hsl(var(--status-${color === "safe" ? "safe" : color}) / 0.12)` }}>
      <p className={`text-lg font-bold font-display ${text}`}>{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
