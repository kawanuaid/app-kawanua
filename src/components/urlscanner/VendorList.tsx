import { useState } from "react";
import { motion } from "framer-motion";
import { Search, CheckCircle2, XCircle, AlertCircle, Circle } from "lucide-react";
import type { AnalysisResult } from "@/types/virustotal";

interface VendorListProps {
  results: Record<string, AnalysisResult>;
}

const categoryConfig = {
  harmless: {
    label: "Clean",
    Icon: CheckCircle2,
    textClass: "status-safe",
    bgStyle: "hsl(var(--status-safe) / 0.12)",
    borderStyle: "hsl(var(--status-safe) / 0.3)",
  },
  malicious: {
    label: "Malicious",
    Icon: XCircle,
    textClass: "status-malicious",
    bgStyle: "hsl(var(--status-malicious) / 0.12)",
    borderStyle: "hsl(var(--status-malicious) / 0.3)",
  },
  suspicious: {
    label: "Suspicious",
    Icon: AlertCircle,
    textClass: "status-suspicious",
    bgStyle: "hsl(var(--status-suspicious) / 0.12)",
    borderStyle: "hsl(var(--status-suspicious) / 0.3)",
  },
  undetected: {
    label: "Unrated",
    Icon: Circle,
    textClass: "status-undetected",
    bgStyle: "hsl(var(--status-undetected) / 0.08)",
    borderStyle: "hsl(var(--status-undetected) / 0.2)",
  },
  timeout: {
    label: "Timeout",
    Icon: Circle,
    textClass: "status-undetected",
    bgStyle: "hsl(var(--status-undetected) / 0.08)",
    borderStyle: "hsl(var(--status-undetected) / 0.2)",
  },
};

export default function VendorList({ results }: VendorListProps) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("all");

  const entries = Object.values(results);
  const filtered = entries.filter((r) => {
    const matchSearch = r.engine_name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || r.category === filter;
    return matchSearch && matchFilter;
  });

  // Sort: malicious first, then suspicious, then harmless, then undetected
  const order = { malicious: 0, suspicious: 1, harmless: 2, undetected: 3, timeout: 4 };
  filtered.sort((a, b) => (order[a.category] ?? 5) - (order[b.category] ?? 5));

  const counts = {
    all: entries.length,
    malicious: entries.filter((r) => r.category === "malicious").length,
    suspicious: entries.filter((r) => r.category === "suspicious").length,
    harmless: entries.filter((r) => r.category === "harmless").length,
    undetected: entries.filter((r) => r.category === "undetected").length,
  };

  const filterTabs = [
    { key: "all", label: "All" },
    { key: "malicious", label: "Malicious" },
    { key: "suspicious", label: "Suspicious" },
    { key: "harmless", label: "Clean" },
    { key: "undetected", label: "Unrated" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
      className="rounded-xl border border-border bg-card flex flex-col h-full"
    >
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold font-display text-foreground mb-3">Security Vendor Results</h3>

        {/* Search */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-muted mb-3">
          <Search size={14} className="text-muted-foreground shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter vendors..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1.5 flex-wrap">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                filter === tab.key
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
              <span className={`ml-1.5 ${filter === tab.key ? "opacity-80" : "opacity-50"}`}>
                {counts[tab.key as keyof typeof counts]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="overflow-y-auto flex-1 max-h-[480px]">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-sm">No vendors found</div>
        ) : (
          <div className="divide-y divide-border/50">
            {filtered.map((result, idx) => {
              const cat = categoryConfig[result.category] ?? categoryConfig.undetected;
              const { Icon } = cat;
              return (
                <motion.div
                  key={result.engine_name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.01 }}
                  className="flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors"
                >
                  <span className="text-sm text-foreground font-body">{result.engine_name}</span>
                  <span
                    className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${cat.textClass}`}
                    style={{
                      backgroundColor: cat.bgStyle,
                      borderColor: cat.borderStyle,
                    }}
                  >
                    <Icon size={11} />
                    {cat.label}
                  </span>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      <div className="px-4 py-2 border-t border-border text-xs text-muted-foreground">
        Showing {filtered.length} of {entries.length} vendors
      </div>
    </motion.div>
  );
}
