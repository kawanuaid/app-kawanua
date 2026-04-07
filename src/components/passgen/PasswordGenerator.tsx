import { useState, useCallback } from "react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Copy, Check, RefreshCw, Shield, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AMBIGUOUS_CHARS = "0O1lI|`";

const generatePassword = (
  length: number,
  options: {
    uppercase: boolean;
    lowercase: boolean;
    numbers: boolean;
    symbols: boolean;
    excludeAmbiguous: boolean;
  },
) => {
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const nums = "0123456789";
  const syms = "!@#$%^&*()_+-=[]{}|;:',.<>?/~`";

  let chars = "";
  if (options.uppercase) chars += upper;
  if (options.lowercase) chars += lower;
  if (options.numbers) chars += nums;
  if (options.symbols) chars += syms;

  if (!chars) chars = lower;

  if (options.excludeAmbiguous) {
    chars = chars
      .split("")
      .filter((c) => !AMBIGUOUS_CHARS.includes(c))
      .join("");
  }

  let password = "";
  const array = new Uint32Array(length);
  crypto.getRandomValues(array);
  for (let i = 0; i < length; i++) {
    password += chars[array[i] % chars.length];
  }
  return password;
};

const getStrength = (
  length: number,
  options: {
    uppercase: boolean;
    lowercase: boolean;
    numbers: boolean;
    symbols: boolean;
  },
): { label: string; score: number } => {
  let poolSize = 0;
  if (options.uppercase) poolSize += 26;
  if (options.lowercase) poolSize += 26;
  if (options.numbers) poolSize += 10;
  if (options.symbols) poolSize += 29;
  if (poolSize === 0) poolSize = 26;

  const entropy = length * Math.log2(poolSize);
  if (entropy < 30) return { label: "Sangat Lemah", score: 1 };
  if (entropy < 50) return { label: "Lemah", score: 2 };
  if (entropy < 70) return { label: "Sedang", score: 3 };
  if (entropy < 90) return { label: "Kuat", score: 4 };
  return { label: "Sangat Kuat", score: 5 };
};

const strengthColors: Record<number, string> = {
  1: "bg-destructive",
  2: "bg-orange-500",
  3: "bg-yellow-500",
  4: "bg-primary",
  5: "bg-primary glow-primary",
};

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: false,
    excludeAmbiguous: false,
  });
  const [password, setPassword] = useState(() =>
    generatePassword(16, {
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols: false,
      excludeAmbiguous: false,
    }),
  );
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const strength = getStrength(length, options);

  const generate = useCallback(() => {
    setPassword(generatePassword(length, options));
    setCopied(false);
  }, [length, options]);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(password);
    setCopied(true);
    toast({
      title: "Tersalin!",
      description: "Password berhasil disalin ke clipboard.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleOption = (key: keyof typeof options) => {
    const newOptions = { ...options, [key]: !options[key] };
    if (key !== "excludeAmbiguous") {
      const { excludeAmbiguous, ...charOptions } = newOptions;
      const anyEnabled = Object.values(charOptions).some(Boolean);
      if (!anyEnabled) return;
    }
    setOptions(newOptions);
    setPassword(generatePassword(length, newOptions));
    setCopied(false);
  };

  const handleLengthChange = (val: number[]) => {
    setLength(val[0]);
    setPassword(generatePassword(val[0], options));
    setCopied(false);
  };

  const optionItems = [
    { key: "uppercase" as const, label: "Huruf Besar", desc: "A-Z" },
    { key: "lowercase" as const, label: "Huruf Kecil", desc: "a-z" },
    { key: "numbers" as const, label: "Angka", desc: "0-9" },
    { key: "symbols" as const, label: "Simbol", desc: "!@#$%&*" },
    {
      key: "excludeAmbiguous" as const,
      label: "Exclude Mirip",
      desc: "0O1lI|`",
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(160_80%_45%/0.08),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,hsl(200_80%_40%/0.05),transparent_50%)]" />

      <div className="w-full max-w-lg relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <Shield className="w-8 h-8 text-primary text-glow" />
            <h1 className="text-3xl font-bold font-display tracking-tight text-foreground">
              Pass<span className="text-primary text-glow">Gen</span>
            </h1>
          </div>
          <p className="text-muted-foreground text-sm">
            Buat password yang kuat dan aman
          </p>
        </div>

        {/* Main card */}
        <div className="bg-card border border-border rounded-2xl p-6 space-y-6 glow-primary">
          {/* Password display */}
          <div className="bg-background border border-border rounded-xl p-4 flex items-center gap-3">
            <code className="font-mono text-lg flex-1 text-primary break-all leading-relaxed tracking-wide">
              {password}
            </code>
            <div className="flex gap-1 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={copyToClipboard}
                className="text-muted-foreground hover:text-primary"
              >
                {copied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={generate}
                className="text-muted-foreground hover:text-primary"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Strength indicator */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                Kekuatan
              </span>
              <span className="text-foreground font-medium">
                {strength.label}
              </span>
            </div>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                    i <= strength.score
                      ? strengthColors[strength.score]
                      : "bg-secondary"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Length slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm text-muted-foreground">Panjang</label>
              <span className="font-mono text-sm text-primary font-semibold bg-secondary px-2.5 py-0.5 rounded-md">
                {length}
              </span>
            </div>
            <Slider
              value={[length]}
              onValueChange={handleLengthChange}
              min={4}
              max={64}
              step={1}
              className="cursor-pointer"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>4</span>
              <span>64</span>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-1">
            {optionItems.map(({ key, label, desc }) => (
              <div
                key={key}
                className="flex items-center justify-between py-3 px-1 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer"
                onClick={() => toggleOption(key)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm text-foreground">{label}</span>
                  <span className="font-mono text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                    {desc}
                  </span>
                </div>
                <Switch
                  checked={options[key]}
                  onCheckedChange={() => toggleOption(key)}
                />
              </div>
            ))}
          </div>

          {/* Generate button */}
          <Button
            onClick={generate}
            className="w-full h-12 text-base font-semibold glow-primary hover:glow-strong transition-shadow"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Generate Password
          </Button>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4">
          Password dibuat secara lokal di browser Anda
        </p>
      </div>
    </div>
  );
}
