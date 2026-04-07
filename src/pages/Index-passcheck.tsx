import { PasswordChecker } from "@/components/passcheck/PasswordChecker";

export default function PassCheckPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-purple-50 p-4 sm:p-8">
      <PasswordChecker />
    </div>
  );
}
