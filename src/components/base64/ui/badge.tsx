import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?:
    | "default"
    | "secondary"
    | "destructive"
    | "outline"
    | "success"
    | "warning";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
        {
          "bg-violet-100 text-violet-700": variant === "default",
          "bg-slate-100 text-slate-600": variant === "secondary",
          "bg-red-100 text-red-700": variant === "destructive",
          "border border-slate-200 text-slate-600": variant === "outline",
          "bg-emerald-100 text-emerald-700": variant === "success",
          "bg-amber-100 text-amber-700": variant === "warning",
        },
        className,
      )}
      {...props}
    />
  );
}

export { Badge };
