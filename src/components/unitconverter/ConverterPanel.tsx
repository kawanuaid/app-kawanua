import { useState, useCallback, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  HardDrive,
  Clock,
  Wifi,
  Ruler,
  ArrowLeftRight,
  ArrowUpDown,
  ArrowRightLeft,
  Sparkles,
  MoveHorizontal,
  Droplets,
  Grid3x3,
  Scale,
  Thermometer,
  Zap,
  Flame,
  Gauge,
  CircleDot,
} from "lucide-react";
import { categories, convert, formatNumber } from "@/lib/unitConverters";

export const iconMapLg: Record<string, React.ReactNode> = {
  "hard-drive": <HardDrive className="size-5" />,
  clock: <Clock className="size-5" />,
  wifi: <Wifi className="size-5" />,
  ruler: <Ruler className="size-5" />,
  "move-horizontal": <MoveHorizontal className="size-5" />,
  repeat: <ArrowLeftRight className="size-5" />,
  droplets: <Droplets className="size-5" />,
  grid: <Grid3x3 className="size-5" />,
  scale: <Scale className="size-5" />,
  thermometer: <Thermometer className="size-5" />,
  zap: <Zap className="size-5" />,
  flame: <Flame className="size-5" />,
  gauge: <Gauge className="size-5" />,
  "gauge-circle": <CircleDot className="size-5" />,
};

export const iconMapSm: Record<string, React.ReactNode> = {
  "hard-drive": <HardDrive className="size-4" />,
  clock: <Clock className="size-4" />,
  wifi: <Wifi className="size-4" />,
  ruler: <Ruler className="size-4" />,
  "move-horizontal": <MoveHorizontal className="size-4" />,
  repeat: <ArrowLeftRight className="size-4" />,
  droplets: <Droplets className="size-4" />,
  grid: <Grid3x3 className="size-4" />,
  scale: <Scale className="size-4" />,
  thermometer: <Thermometer className="size-4" />,
  zap: <Zap className="size-4" />,
  flame: <Flame className="size-4" />,
  gauge: <Gauge className="size-4" />,
  "gauge-circle": <CircleDot className="size-4" />,
};

export default function ConverterPanel({
  categoryIndex,
}: {
  categoryIndex: number;
}) {
  const category = categories[categoryIndex];
  const [fromUnitId, setFromUnitId] = useState(
    category.units[1]?.id ?? category.units[0].id,
  );
  const [toUnitId, setToUnitId] = useState(
    category.units[2]?.id ?? category.units[1]?.id ?? category.units[0].id,
  );
  const [inputValue, setInputValue] = useState("1");
  const [isFromInput, setIsFromInput] = useState(true);

  const fromUnit = useMemo(
    () => category.units.find((u) => u.id === fromUnitId) ?? category.units[0],
    [category.units, fromUnitId],
  );
  const toUnit = useMemo(
    () =>
      category.units.find((u) => u.id === toUnitId) ??
      category.units[1] ??
      category.units[0],
    [category.units, toUnitId],
  );

  const computedFromValue = useMemo(() => {
    if (isFromInput) return parseFloat(inputValue) || 0;
    const val = parseFloat(inputValue) || 0;
    const result = convert(val, toUnit, fromUnit);
    return result;
  }, [inputValue, isFromInput, fromUnit, toUnit]);

  const computedToValue = useMemo(() => {
    if (!isFromInput) return parseFloat(inputValue) || 0;
    const val = parseFloat(inputValue) || 0;
    const result = convert(val, fromUnit, toUnit);
    return result;
  }, [inputValue, isFromInput, fromUnit, toUnit]);

  const handleSwap = useCallback(() => {
    setFromUnitId(toUnitId);
    setToUnitId(fromUnitId);
    const newVal = isFromInput ? computedToValue : computedFromValue;
    setInputValue(formatNumber(newVal));
    setIsFromInput(true);
  }, [fromUnitId, toUnitId, isFromInput, computedToValue, computedFromValue]);

  const handleFromInputChange = useCallback((val: string) => {
    setInputValue(val);
    setIsFromInput(true);
  }, []);

  const handleToInputChange = useCallback((val: string) => {
    setInputValue(val);
    setIsFromInput(false);
  }, []);

  const quickConversions = useMemo(() => {
    const value = computedFromValue || 1;
    const otherUnits = category.units.filter(
      (u) => u.id !== fromUnitId && u.id !== toUnitId,
    );
    return otherUnits.slice(0, 5).map((unit) => ({
      unit,
      value: convert(value, fromUnit, unit),
    }));
  }, [computedFromValue, fromUnit, fromUnitId, toUnitId, category.units]);

  return (
    <div className="space-y-6">
      {/* Main converter card */}
      <Card className="overflow-hidden border-2 border-primary/10 shadow-lg">
        <CardHeader className="pb-2 bg-gradient-to-r from-primary/5 to-primary/10">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center size-8 rounded-lg bg-primary/10 text-primary">
              {iconMapSm[category.icon]}
            </div>
            <div>
              <CardTitle className="text-lg">{category.label}</CardTitle>
              <CardDescription>
                {category.units.length} units available
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* From section */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              From
            </label>
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  type="text"
                  inputMode="decimal"
                  value={
                    isFromInput ? inputValue : formatNumber(computedFromValue)
                  }
                  onChange={(e) => handleFromInputChange(e.target.value)}
                  className="h-12 text-lg font-mono font-semibold tabular-nums"
                  placeholder="Enter value..."
                />
              </div>
              <Select value={fromUnitId} onValueChange={setFromUnitId}>
                <SelectTrigger className="w-[180px] h-12 font-medium">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {category.units.map((unit) => (
                    <SelectItem key={unit.id} value={unit.id}>
                      <span className="font-mono font-bold text-primary mr-2">
                        {unit.shortLabel}
                      </span>
                      {unit.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Swap button */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="icon"
              onClick={handleSwap}
              className="rounded-full size-10 border-2 border-primary/20 hover:border-primary hover:bg-primary/10 hover:text-primary transition-all rotate-90"
            >
              <ArrowUpDown className="size-4" />
            </Button>
          </div>

          {/* To section */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              To
            </label>
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  type="text"
                  inputMode="decimal"
                  value={
                    !isFromInput ? inputValue : formatNumber(computedToValue)
                  }
                  onChange={(e) => handleToInputChange(e.target.value)}
                  className="h-12 text-lg font-mono font-semibold tabular-nums"
                  placeholder="Result..."
                />
              </div>
              <Select value={toUnitId} onValueChange={setToUnitId}>
                <SelectTrigger className="w-[180px] h-12 font-medium">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {category.units.map((unit) => (
                    <SelectItem key={unit.id} value={unit.id}>
                      <span className="font-mono font-bold text-primary mr-2">
                        {unit.shortLabel}
                      </span>
                      {unit.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Result summary */}
          <div className="rounded-xl bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 p-4 text-center border border-primary/10">
            <p className="text-sm text-muted-foreground mb-1">Result</p>
            <p className="text-xl font-bold text-foreground">
              <span className="font-mono tabular-nums">
                {formatNumber(computedFromValue)}
              </span>{" "}
              <span className="text-primary">{fromUnit.shortLabel}</span>
              <span className="mx-3 text-muted-foreground">=</span>
              <span className="font-mono tabular-nums">
                {formatNumber(computedToValue)}
              </span>{" "}
              <span className="text-primary">{toUnit.shortLabel}</span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Quick reference card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Sparkles className="size-4 text-primary" />
            Quick Reference
          </CardTitle>
          <CardDescription>1 {fromUnit.label} equals...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-1">
            {category.units
              .filter((u) => u.id !== fromUnitId)
              .map((unit) => {
                const val = convert(1, fromUnit, unit);
                return (
                  <div
                    key={unit.id}
                    className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <span className="text-sm text-muted-foreground">
                      1 {fromUnit.shortLabel}
                    </span>
                    <span className="text-sm font-mono font-semibold tabular-nums">
                      {formatNumber(val)}{" "}
                      <span className="text-primary font-bold">
                        {unit.shortLabel}
                      </span>
                    </span>
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>

      {/* Other conversions based on current value */}
      {quickConversions.length > 0 && computedFromValue > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <ArrowRightLeft className="size-4 text-primary" />
              Also equivalent to
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-1">
              {quickConversions.map(({ unit, value }) => (
                <div
                  key={unit.id}
                  className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <span className="text-sm font-medium">{unit.label}</span>
                  <span className="text-sm font-mono font-semibold tabular-nums">
                    {formatNumber(value)}{" "}
                    <span className="text-primary font-bold">
                      {unit.shortLabel}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
