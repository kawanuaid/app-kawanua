import { useState, useEffect } from "react";
import { Clock, Calendar, RefreshCw, Copy, Check } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import HeaderApp from "@/components/HeaderApp";

type TimeUnit = "seconds" | "milliseconds";

const timeZones = [
  { value: "UTC", label: "UTC (Coordinated Universal Time)" },
  { value: "Asia/Jakarta", label: "WIB (Western Indonesia Time)" },
  { value: "Asia/Makassar", label: "WITA (Central Indonesia Time)" },
  { value: "Asia/Jayapura", label: "WIT (Eastern Indonesia Time)" },
  { value: "Asia/Singapore", label: "Singapore" },
  { value: "Asia/Kuala_Lumpur", label: "Malaysia (Kuala Lumpur)" },
  { value: "Asia/Hong_Kong", label: "Hong Kong" },
  { value: "Asia/Tokyo", label: "Japan (Tokyo)" },
  { value: "America/New_York", label: "New York (EST/EDT)" },
  { value: "America/Los_Angeles", label: "Los Angeles (PST/PDT)" },
  { value: "Europe/London", label: "London (GMT/BST)" },
  { value: "Europe/Paris", label: "Paris (CET/CEST)" },
  { value: "Australia/Sydney", label: "Sydney (AEST/AEDT)" },
];

const dateFormats = [
  { value: "iso", label: "ISO 8601" },
  { value: "readable", label: "Readable" },
  { value: "date", label: "Date Only" },
  { value: "time", label: "Time Only" },
  { value: "compact", label: "Compact" },
];

export default function TimestampPage() {
  const [unixInput, setUnixInput] = useState("");
  const [timeUnit, setTimeUnit] = useState<TimeUnit>("seconds");
  const [convertedResult, setConvertedResult] = useState("");
  const [copied, setCopied] = useState(false);

  const [dateInput, setDateInput] = useState("");
  const [timeInput, setTimeInput] = useState("");
  const [timezone, setTimezone] = useState("Asia/Jakarta");
  const [unixResult, setUnixResult] = useState("");
  const [copiedUnix, setCopiedUnix] = useState(false);

  const [outputFormat, setOutputFormat] = useState("readable");
  const [currentTimeUnix, setCurrentTimeUnix] = useState({
    seconds: "",
    milliseconds: "",
  });

  // Update current time every second
  useEffect(() => {
    const updateCurrentTime = () => {
      const now = new Date();
      setCurrentTimeUnix({
        seconds: Math.floor(now.getTime() / 1000).toString(),
        milliseconds: now.getTime().toString(),
      });
    };

    updateCurrentTime();
    const interval = setInterval(updateCurrentTime, 1000);

    return () => clearInterval(interval);
  }, []);

  // Convert Unix to Human Readable
  const convertUnixToReadable = () => {
    const value = parseInt(unixInput);
    if (isNaN(value)) {
      setConvertedResult("Invalid Unix Timestamp");
      return;
    }

    const timestamp = timeUnit === "milliseconds" ? value : value * 1000;
    const date = new Date(timestamp);

    if (isNaN(date.getTime())) {
      setConvertedResult("Invalid Unix Timestamp");
      return;
    }

    const formatted = formatDate(date, outputFormat, timezone);
    setConvertedResult(formatted);
  };

  // Convert Human Readable to Unix
  const convertReadableToUnix = () => {
    if (!dateInput || !timeInput) {
      setUnixResult("Please enter date and time");
      return;
    }

    const dateTime = new Date(`${dateInput}T${timeInput}`);
    if (isNaN(dateTime.getTime())) {
      setUnixResult("Invalid Date/Time");
      return;
    }

    const unixMs = dateTime.getTime();
    const unixSec = Math.floor(unixMs / 1000);
    setUnixResult(`Seconds: ${unixSec}\nMilliseconds: ${unixMs}`);
  };

  // Format date based on selected format
  const formatDate = (date: Date, formatType: string, tz: string) => {
    const options: Intl.DateTimeFormatOptions = {
      timeZone: tz,
    };

    switch (formatType) {
      case "iso":
        return date.toISOString();
      case "readable":
        return date.toLocaleString("id-ID", {
          ...options,
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZoneName: "short",
        });
      case "date":
        return date.toLocaleString("id-ID", {
          ...options,
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      case "time":
        return date.toLocaleString("id-ID", {
          ...options,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZoneName: "short",
        });
      case "compact":
        return date
          .toLocaleString("id-ID", {
            ...options,
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })
          .replace(
            /(\d+)\/(\d+)\/(\d+),\s+(\d+):(\d+):(\d+)/,
            "$3/$2/$1 $4:$5:$6",
          );
      default:
        return date.toLocaleString("id-ID", options);
    }
  };

  // Copy to clipboard
  const copyToClipboard = async (text: string, type: "result" | "unix") => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "result") {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        setCopiedUnix(true);
        setTimeout(() => setCopiedUnix(false), 2000);
      }
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // Set current timestamp
  const setCurrentTimestamp = (unit: TimeUnit) => {
    if (unit === "seconds") {
      setUnixInput(currentTimeUnix.seconds);
    } else {
      setUnixInput(currentTimeUnix.milliseconds);
    }
  };

  // Set current date/time
  const setCurrentDateTime = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    const localISOTime = new Date(now.getTime() - offset)
      .toISOString()
      .slice(0, 16);
    setDateInput(localISOTime.slice(0, 10));
    setTimeInput(localISOTime.slice(11, 16));
  };

  return (
    <div className="min-h-screen bg-background bg-grid relative">
      <HeaderApp
        title={"Timestamp Converter"}
        description={
          "Konversi Unix timestamp ke tanggal dan waktu yang mudah dibaca"
        }
        icon={<Clock className="h-8 w-8 text-white" />}
        customCss={""}
        clientSide={false}
      />
      <div className="absolute inset-0 bg-gradient-radial pointer-events-none" />

      <div className="max-w-5xl mx-auto space-y-6 px-6 py-12">
        {/* Current Time Display */}
        <Card className="border-violet-100 dark:border-violet-900/30 bg-gradient-to-r from-violet-50/50 to-indigo-50/50 dark:from-violet-950/20 dark:to-indigo-950/20">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-teal-500 flex items-center justify-center">
                  <RefreshCw className="h-5 w-5 text-white animate-spin-slow" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Waktu Unix Saat Ini
                  </p>
                  <div className="flex flex-col md:flex-row md:gap-4">
                    <span className="text-2xl font-bold text-slate-900 dark:text-slate-50 font-mono">
                      {currentTimeUnix.seconds}{" "}
                      <span className="text-sm font-normal text-slate-500">
                        (detik)
                      </span>
                    </span>
                    <span className="text-2xl font-bold text-slate-900 dark:text-slate-50 font-mono">
                      {currentTimeUnix.milliseconds}{" "}
                      <span className="text-sm font-normal text-slate-500">
                        (ms)
                      </span>
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Waktu Lokal
                </p>
                <p className="text-xl font-semibold text-slate-900 dark:text-slate-50">
                  {new Date().toLocaleString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Unix to Human Readable */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-teal-500" />
                Unix ke Human Readable
              </CardTitle>
              <CardDescription>
                Konversi Unix timestamp ke format tanggal yang mudah dibaca
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="unix-input">Unix Timestamp</Label>
                <div className="flex gap-2">
                  <Input
                    id="unix-input"
                    type="number"
                    placeholder="Masukkan Unix timestamp"
                    value={unixInput}
                    onChange={(e) => setUnixInput(e.target.value)}
                    className="font-mono"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentTimestamp(timeUnit)}
                    title="Gunakan timestamp saat ini"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="time-unit">Time Unit</Label>
                  <Select
                    value={timeUnit}
                    onValueChange={(v: TimeUnit) => setTimeUnit(v)}
                  >
                    <SelectTrigger id="time-unit">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="seconds">Detik</SelectItem>
                      <SelectItem value="milliseconds">Milidetik</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={timezone} onValueChange={setTimezone}>
                    <SelectTrigger id="timezone">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timeZones.map((tz) => (
                        <SelectItem key={tz.value} value={tz.value}>
                          {tz.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="output-format">Format Output</Label>
                <Select value={outputFormat} onValueChange={setOutputFormat}>
                  <SelectTrigger id="output-format">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {dateFormats.map((fmt) => (
                      <SelectItem key={fmt.value} value={fmt.value}>
                        {fmt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={convertUnixToReadable}
                className="w-full"
                size="lg"
              >
                <Clock className="h-4 w-4 mr-2" />
                Konversi ke Readable
              </Button>

              {convertedResult && (
                <div className="space-y-2">
                  <Label>Hasil</Label>
                  <div className="relative">
                    <div className="rounded-md border border-slate-200 bg-slate-50 p-4 font-mono text-sm dark:border-slate-800 dark:bg-slate-900">
                      {convertedResult}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-2 h-8 w-8"
                      onClick={() => copyToClipboard(convertedResult, "result")}
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Human Readable to Unix */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-teal-500" />
                Human Readable ke Unix
              </CardTitle>
              <CardDescription>
                Konversi tanggal dan waktu ke Unix timestamp
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="date-input">Tanggal</Label>
                <div className="flex gap-2">
                  <Input
                    id="date-input"
                    type="date"
                    value={dateInput}
                    onChange={(e) => setDateInput(e.target.value)}
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={setCurrentDateTime}
                    title="Use current date/time"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="time-input">Waktu</Label>
                <Input
                  id="time-input"
                  type="time"
                  value={timeInput}
                  onChange={(e) => setTimeInput(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone-2">Timezone</Label>
                <Select value={timezone} onValueChange={setTimezone}>
                  <SelectTrigger id="timezone-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timeZones.map((tz) => (
                      <SelectItem key={tz.value} value={tz.value}>
                        {tz.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={convertReadableToUnix}
                className="w-full"
                size="lg"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Konversi ke Unix
              </Button>

              {unixResult && (
                <div className="space-y-2">
                  <Label>Hasil</Label>
                  <div className="relative">
                    <div className="whitespace-pre-line rounded-md border border-slate-200 bg-slate-50 p-4 font-mono text-sm dark:border-slate-800 dark:bg-slate-900">
                      {unixResult}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-2 h-8 w-8"
                      onClick={() => copyToClipboard(unixResult, "unix")}
                    >
                      {copiedUnix ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Info Footer */}
        <Card className="bg-slate-50 dark:bg-slate-900/50">
          <CardContent className="p-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-900 dark:text-slate-50">
                Tentang Unix Timestamp
              </h3>
              <div className="grid md:grid-cols-2 gap-6 text-sm text-slate-600 dark:text-slate-400">
                <div className="space-y-2">
                  <p>
                    <strong className="text-slate-900 dark:text-slate-50">
                      Unix Timestamp (Detik):
                    </strong>{" "}
                    Jumlah detik yang telah berlalu sejak 1 Januari 1970 (UTC).
                  </p>
                  <p>
                    <strong className="text-slate-900 dark:text-slate-50">
                      Unix Timestamp (Milidetik):
                    </strong>{" "}
                    Jumlah milidetik yang telah berlalu sejak 1 Januari 1970
                    (UTC). Umumnya digunakan dalam pemrograman.
                  </p>
                </div>
                <div className="space-y-2">
                  <p>
                    <strong className="text-slate-900 dark:text-slate-50">
                      Contoh:
                    </strong>{" "}
                    1 Januari 2024 00:00:00 UTC
                  </p>
                  <p className="font-mono">
                    Detik: 1704067200
                    <br />
                    Milidetik: 1704067200000
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
