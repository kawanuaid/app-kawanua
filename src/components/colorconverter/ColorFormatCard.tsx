import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { ColorFormats, formatColorString } from "@/lib/colorUtils";

interface Props {
  format: keyof ColorFormats;
  label: string;
  formats: ColorFormats;
}

export function ColorFormatCard({ format, label, formats }: Props) {
  const [copied, setCopied] = useState(false);
  const value = formatColorString(format, formats);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="group rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/40">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <button
          onClick={handleCopy}
          className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          title="Copy"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-primary" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </button>
      </div>
      <code className="block font-mono text-sm text-foreground break-all leading-relaxed">
        {value}
      </code>
    </div>
  );
}
