import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  FileCode,
  ArrowRight,
  Activity,
  Gauge,
  Smartphone,
  Monitor,
} from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ScoreGauge from "@/components/pagespeed/ScoreGauge";
import MetricCard from "@/components/pagespeed/MetricCard";
import { analyzeUrl, type PageSpeedResults } from "@/lib/pagespeed";
import { toast } from "sonner";
import HeaderApp from "@/components/HeaderApp";

const PageSpeedPage = () => {
  const [url, setUrl] = useState("");
  const [strategy, setStrategy] = useState<"mobile" | "desktop">("mobile");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<PageSpeedResults | null>(null);

  const handleAnalyze = async () => {
    if (!url) return;
    setIsAnalyzing(true);
    setResults(null);
    try {
      const data = await analyzeUrl(url, strategy);
      setResults(data);
    } catch (err: any) {
      toast.error(err.message || "Failed to analyze URL");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background bg-grid relative">
      <HeaderApp
        title={"PageSpeed Checker"}
        description={
          "Analisis performa website Anda, aksesibilitas, dan SEO dalam hitungan detik."
        }
        icon={<Gauge className="size-10 text-white" />}
        customCss={""}
        clientSide={false}
      />

      <div className="absolute inset-0 bg-gradient-radial pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-16">
        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto mb-16"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="flex gap-3 w-full">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Enter website URL (e.g., https://example.com)"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                  className="pl-11 h-12 bg-card border-border/60 font-mono text-sm focus-visible:ring-primary/50 focus-visible:border-primary/50"
                />
              </div>
              <Button
                onClick={handleAnalyze}
                disabled={!url || isAnalyzing}
                className="h-12 px-6 bg-primary text-primary-foreground hover:bg-primary/90 glow-primary font-display font-semibold"
              >
                {isAnalyzing ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      repeat: Infinity,
                      duration: 1,
                      ease: "linear",
                    }}
                  >
                    <FileCode className="h-4 w-4" />
                  </motion.div>
                ) : (
                  <>
                    Analyze
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
            <ToggleGroup
              type="single"
              value={strategy}
              onValueChange={(v) => v && setStrategy(v as "mobile" | "desktop")}
              className="bg-card border border-border/60 rounded-lg p-1"
            >
              <ToggleGroupItem
                value="mobile"
                className="data-[state=on]:bg-primary/20 data-[state=on]:text-primary px-4 py-2 rounded-md text-sm font-mono gap-2"
              >
                <Smartphone className="h-4 w-4" />
                Mobile
              </ToggleGroupItem>
              <ToggleGroupItem
                value="desktop"
                className="data-[state=on]:bg-primary/20 data-[state=on]:text-primary px-4 py-2 rounded-md text-sm font-mono gap-2"
              >
                <Monitor className="h-4 w-4" />
                Desktop
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </motion.div>

        {/* Loading */}
        <AnimatePresence>
          {isAnalyzing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-border bg-card">
                <motion.div
                  className="h-2 w-2 rounded-full bg-primary"
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                />
                <span className="text-sm text-muted-foreground font-mono">
                  Analyzing {url}... (this may take 10-30s)
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {results && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Score Gauges */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-14">
                <ScoreGauge score={results.performance} label="Performance" />
                <ScoreGauge
                  score={results.accessibility}
                  label="Accessibility"
                />
                <ScoreGauge
                  score={results.bestPractices}
                  label="Best Practices"
                />
                <ScoreGauge score={results.seo} label="SEO" />
              </div>

              {/* Metrics */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-lg font-semibold font-display mb-5 flex items-center gap-2">
                  <Activity className="h-4 w-4 text-primary" />
                  Core Web Vitals & Metrics
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {results.metrics.map((metric, i) => (
                    <MetricCard key={metric.label} {...metric} delay={i} />
                  ))}
                </div>
              </motion.div>

              {/* Legend */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-10 flex items-center justify-center gap-6 text-xs text-muted-foreground"
              >
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-success" /> Good
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-warning" /> Needs
                  Improvement
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-destructive" /> Poor
                </span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PageSpeedPage;
