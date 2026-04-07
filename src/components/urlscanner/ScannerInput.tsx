import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Shield } from "lucide-react";

interface ScannerInputProps {
  onScan: (url: string) => void;
  isScanning: boolean;
}

export default function ScannerInput({
  onScan,
  isScanning,
}: ScannerInputProps) {
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    onScan(url.trim());
  };

  return (
    <div className="w-full max-w-3xl mx-auto z-50">
      <form onSubmit={handleSubmit}>
        {/* Main URL input */}
        <div
          className={`flex items-center gap-3 rounded-xl border px-5 py-4 transition-all duration-300 ${
            isScanning
              ? "border-primary scanning-glow bg-card"
              : "border-border bg-card hover:border-primary/50 focus-within:border-primary focus-within:glow-primary"
          }`}
        >
          <Search
            size={20}
            className={`shrink-0 transition-colors ${isScanning ? "text-primary" : "text-muted-foreground"}`}
          />
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter domain or URL to scan (e.g. example.com)"
            className="flex-1 bg-transparent text-base text-foreground placeholder:text-muted-foreground outline-none font-display"
            disabled={isScanning}
          />
          <motion.button
            type="submit"
            disabled={isScanning || !url.trim()}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm font-display disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:brightness-110"
          >
            {isScanning ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground radar-sweep" />
                Scanning...
              </>
            ) : (
              <>
                <Shield size={16} />
                Scan
              </>
            )}
          </motion.button>
        </div>
      </form>
    </div>
  );
}
