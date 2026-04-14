import CopyButton from "./CopyButton";

export default function FormatRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg bg-zinc-50 px-4 py-3 border border-zinc-100">
      <div className="flex flex-col items-start gap-1 min-w-0">
        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 w-16 shrink-0">
          {label}
        </span>
        <span className="text-sm break-all font-mono text-zinc-800">
          {value}
        </span>
      </div>
      <CopyButton text={value} />
    </div>
  );
}
