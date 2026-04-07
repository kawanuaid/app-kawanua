import type { ColorFormats } from "@/lib/colorUtils";

interface Props {
  formats: ColorFormats;
}

export function ColorPreview({ formats }: Props) {
  const { r, g, b } = formats.rgb;
  const bgColor = `rgb(${r}, ${g}, ${b})`;
  // determine if text should be light or dark
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  const textColor = luminance > 0.5 ? "#000" : "#fff";

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <div
        className="flex h-40 items-end p-4 transition-colors"
        style={{ backgroundColor: bgColor }}
      >
        <span
          className="font-mono text-lg font-semibold"
          style={{ color: textColor }}
        >
          {formats.hex.toUpperCase()}
        </span>
      </div>
      {/* Checkerboard for transparency reference */}
      <div className="flex gap-0">
        {[0.25, 0.5, 0.75, 1].map((a) => (
          <div
            key={a}
            className="h-8 flex-1"
            style={{
              backgroundColor: `rgba(${r}, ${g}, ${b}, ${a})`,
              backgroundImage:
                a < 1
                  ? "linear-gradient(45deg, hsl(var(--secondary)) 25%, transparent 25%, transparent 75%, hsl(var(--secondary)) 75%), linear-gradient(45deg, hsl(var(--secondary)) 25%, transparent 25%, transparent 75%, hsl(var(--secondary)) 75%)"
                  : undefined,
              backgroundSize: "8px 8px",
              backgroundPosition: "0 0, 4px 4px",
            }}
          />
        ))}
      </div>
    </div>
  );
}
