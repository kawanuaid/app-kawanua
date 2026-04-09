import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  description: string;
  status: "good" | "needs-improvement" | "poor";
  delay?: number;
}

const statusStyles = {
  good: "border-success/20 bg-success/5",
  "needs-improvement": "border-warning/20 bg-warning/5",
  poor: "border-destructive/20 bg-destructive/5",
};

const statusDot = {
  good: "bg-success",
  "needs-improvement": "bg-warning",
  poor: "bg-destructive",
};

const MetricCard = ({
  icon: Icon,
  label,
  value,
  description,
  status,
  delay = 0,
}: MetricCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 + delay * 0.1 }}
      className={`rounded-xl border p-5 transition-all hover:scale-[1.02] ${statusStyles[status]}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <Icon className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">
            {label}
          </span>
        </div>
        <div className={`h-2.5 w-2.5 rounded-full ${statusDot[status]}`} />
      </div>
      <p className="text-2xl font-bold font-mono text-foreground mb-1">
        {value}
      </p>
      <p className="text-xs text-muted-foreground">{description}</p>
    </motion.div>
  );
};

export default MetricCard;
