import { useState } from "react";
import {
  Eye,
  EyeOff,
  Shield,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Lock,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert } from "@/components/passcheck/ui/alert";
import { Badge } from "@/components/passcheck/ui/badge";
import {
  checkPasswordStrength,
  checkPwnedPassword,
  getStrengthLabel,
  type PasswordStrength,
  type PwnedPasswordResult,
} from "@/lib/passwordChecker";

export function PasswordChecker() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState<PasswordStrength | null>(null);
  const [pwnedResult, setPwnedResult] = useState<PwnedPasswordResult | null>(
    null,
  );
  const [isChecking, setIsChecking] = useState(false);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    // Calculate strength on every change
    if (newPassword) {
      setStrength(checkPasswordStrength(newPassword));
      // Reset pwned result when password changes
      if (pwnedResult && !isChecking) {
        setPwnedResult(null);
      }
    } else {
      setStrength(null);
      setPwnedResult(null);
    }
  };

  const handleCheckPwned = async () => {
    if (!password) return;

    setIsChecking(true);
    setPwnedResult(null);

    try {
      const result = await checkPwnedPassword(password);
      setPwnedResult(result);
    } catch (error) {
      setPwnedResult({
        isPwned: false,
        count: 0,
        error: error instanceof Error ? error.message : "Terjadi kesalahan",
      });
    } finally {
      setIsChecking(false);
    }
  };

  const getScorePercentage = () => {
    if (!strength) return 0;
    // Map score (0-8) to percentage (0-100)
    return Math.min((strength.score / 8) * 100, 100);
  };

  return (
    <div className="container max-w-xl mx-auto px-4 py-8 space-y-6">
      {/* Main Card */}
      <Card>
        <CardHeader>
          <CardTitle>Masukkan Password</CardTitle>
          <CardDescription>
            Password Anda akan di-check secara lokal dan melalui API
            HaveIBeenPwned dengan metode k-Anonymity yang aman
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Password Input */}
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Masukkan password..."
              value={password}
              onChange={handlePasswordChange}
              className="pr-10"
              disabled={isChecking}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Password Strength */}
          {strength && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">
                  Kuatnya Password
                </span>
                <Badge
                  variant={
                    strength.level === "very-weak" || strength.level === "weak"
                      ? "destructive"
                      : strength.level === "fair"
                        ? "outline"
                        : "success"
                  }
                >
                  {getStrengthLabel(strength.level)}
                </Badge>
              </div>
              <Progress value={getScorePercentage()} />
            </div>
          )}

          {/* Feedback */}
          {strength && strength.feedback.length > 0 && (
            <div className="space-y-2">
              <span className="text-sm font-medium text-slate-700">
                Saran Perbaikan:
              </span>
              <ul className="space-y-1">
                {strength.feedback.map((item, index) => (
                  <li
                    key={index}
                    className="text-sm text-slate-600 flex items-start gap-2"
                  >
                    <span className="text-amber-500 mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleCheckPwned}
            disabled={!password || isChecking}
            className="w-full"
            size="lg"
          >
            {isChecking ? (
              <>
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                Mengecek...
              </>
            ) : (
              <>
                <Shield className="mr-2 h-4 w-4" />
                Cek di HaveIBeenPwned
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {/* Pwned Result */}
      {pwnedResult && !pwnedResult.error && (
        <Alert variant={pwnedResult.isPwned ? "destructive" : "success"}>
          {pwnedResult.isPwned ? (
            <>
              <div className="flex items-start gap-3">
                <div className="space-y-1">
                  <p className="font-semibold">Password Anda Tidak Aman!</p>
                  <p className="text-sm">
                    Password ini ditemukan dalam{" "}
                    <strong>{pwnedResult.count.toLocaleString()}</strong> data
                    breach.
                  </p>
                  <p className="text-sm mt-2">
                    Jangan menggunakan password ini dan segera ganti jika sedang
                    digunakan.
                  </p>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <p className="font-semibold">Password Anda Aman!</p>
                  <p className="text-sm">
                    Password ini tidak ditemukan dalam database HaveIBeenPwned.
                  </p>
                  <p className="text-sm mt-2">
                    Pastikan password tetap unik dan tidak digunakan di multiple
                    accounts.
                  </p>
                </div>
              </div>
            </>
          )}
        </Alert>
      )}

      {/* Error Alert */}
      {pwnedResult && pwnedResult.error && (
        <Alert variant="warning">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <p className="font-semibold">Terjadi Kesalahan</p>
              <p className="text-sm">{pwnedResult.error}</p>
            </div>
          </div>
        </Alert>
      )}

      {/* Info Box */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2">
        <div className="flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-slate-700">
              Bagaimana Cara Kerja Ini?
            </p>
            <p className="text-sm text-slate-600">
              Kami menggunakan metode <strong>k-Anonymity</strong> untuk menjaga
              privacy password Anda:
            </p>
            <ul className="text-sm text-slate-600 space-y-1 mt-2">
              <li>• Password Anda di-hash menggunakan SHA-1</li>
              <li>• Hanya 5 karakter pertama hash yang dikirim ke API</li>
              <li>• API mengembalikan semua hash dengan prefix yang sama</li>
              <li>• Pengecekan dilakukan secara lokal di browser Anda</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
