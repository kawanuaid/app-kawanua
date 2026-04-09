import { Zap, Clock, Activity, BarChart3, Globe, Image } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const API_URL = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";
const DEFAULT_API_KEY = import.meta.env.VITE_PAGESPEED_API_KEY as string | undefined;

export interface MetricData {
  icon: LucideIcon;
  label: string;
  value: string;
  description: string;
  status: "good" | "needs-improvement" | "poor";
}

export interface PageSpeedResults {
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
  metrics: MetricData[];
}

function getMetricStatus(
  id: string,
  numericValue: number,
): "good" | "needs-improvement" | "poor" {
  const thresholds: Record<string, [number, number]> = {
    "first-contentful-paint": [1800, 3000],
    "largest-contentful-paint": [2500, 4000],
    "total-blocking-time": [200, 600],
    "cumulative-layout-shift": [0.1, 0.25],
    "speed-index": [3400, 5800],
    interactive: [3800, 7300],
  };
  const t = thresholds[id];
  if (!t) return "good";
  if (numericValue <= t[0]) return "good";
  if (numericValue <= t[1]) return "needs-improvement";
  return "poor";
}

function formatValue(id: string, numericValue: number): string {
  if (id === "cumulative-layout-shift") return numericValue.toFixed(2);
  if (numericValue >= 1000) return (numericValue / 1000).toFixed(1) + "s";
  return Math.round(numericValue) + "ms";
}

const metricConfig: Record<string, { icon: LucideIcon; description: string }> =
  {
    "first-contentful-paint": {
      icon: Zap,
      description: "Time until first content appears",
    },
    "largest-contentful-paint": {
      icon: Clock,
      description: "Time until largest element loads",
    },
    "total-blocking-time": {
      icon: Activity,
      description: "Sum of blocking time after FCP",
    },
    "cumulative-layout-shift": {
      icon: BarChart3,
      description: "Visual stability score",
    },
    "speed-index": {
      icon: Globe,
      description: "How quickly content is visible",
    },
    interactive: { icon: Image, description: "Time until fully interactive" },
  };

const metricIds = [
  "first-contentful-paint",
  "largest-contentful-paint",
  "total-blocking-time",
  "cumulative-layout-shift",
  "speed-index",
  "interactive",
];

export async function analyzeUrl(
  url: string,
  strategy: "mobile" | "desktop" = "mobile",
  apiKey?: string,
): Promise<PageSpeedResults> {
  const key = apiKey || DEFAULT_API_KEY;
  if (!key) {
    throw new Error(
      "Google PageSpeed API key is required. Set VITE_PAGESPEED_API_KEY in your .env or pass it as a parameter.",
    );
  }

  const normalizedUrl = url.startsWith("http") ? url : `https://${url}`;
  const apiUrl =
    `${API_URL}` +
    `?url=${encodeURIComponent(normalizedUrl)}` +
    `&strategy=${strategy}` +
    `&category=performance` +
    `&category=accessibility` +
    `&category=best-practices` +
    `&category=seo` +
    `&key=${encodeURIComponent(key)}`;

  const response = await fetch(apiUrl);
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error?.error?.message || `API error: ${response.status}`);
  }

  const data = await response.json();
  const categories = data.lighthouseResult?.categories || {};
  const audits = data.lighthouseResult?.audits || {};

  const metrics: MetricData[] = metricIds
    .filter((id) => audits[id])
    .map((id) => {
      const audit = audits[id];
      const numericValue = audit.numericValue ?? 0;
      const config = metricConfig[id];
      return {
        icon: config.icon,
        label: audit.title || id,
        value: formatValue(id, numericValue),
        description: config.description,
        status: getMetricStatus(id, numericValue),
      };
    });

  return {
    performance: Math.round((categories.performance?.score ?? 0) * 100),
    accessibility: Math.round((categories.accessibility?.score ?? 0) * 100),
    bestPractices: Math.round((categories["best-practices"]?.score ?? 0) * 100),
    seo: Math.round((categories.seo?.score ?? 0) * 100),
    metrics,
  };
}
