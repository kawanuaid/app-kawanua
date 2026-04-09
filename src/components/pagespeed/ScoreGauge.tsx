import { motion } from "framer-motion";

interface ScoreGaugeProps {
  score: number;
  label: string;
  size?: number;
}

const getScoreColor = (score: number) => {
  if (score >= 90) return "text-success";
  if (score >= 50) return "text-warning";
  return "text-destructive";
};

const getStrokeColor = (score: number) => {
  if (score >= 90) return "hsl(160, 84%, 50%)";
  if (score >= 50) return "hsl(38, 92%, 55%)";
  return "hsl(0, 72%, 55%)";
};

const getTrailColor = (score: number) => {
  if (score >= 90) return "hsl(160, 84%, 50%, 0.15)";
  if (score >= 50) return "hsl(38, 92%, 55%, 0.15)";
  return "hsl(0, 72%, 55%, 0.15)";
};

const ScoreGauge = ({ score, label, size = 140 }: ScoreGaugeProps) => {
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={getTrailColor(score)}
            strokeWidth={strokeWidth}
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={getStrokeColor(score)}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            className={`text-3xl font-bold font-mono ${getScoreColor(score)}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {score}
          </motion.span>
        </div>
      </div>
      <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
};

export default ScoreGauge;
