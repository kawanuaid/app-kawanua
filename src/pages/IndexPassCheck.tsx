import { PasswordChecker } from "@/components/passcheck/PasswordChecker";
import HeaderApp from "@/components/HeaderApp";
import { Lock } from "lucide-react";

export default function PassCheckPage() {
  return (
    <div className="min-h-screen bg-background">
      <HeaderApp
        title="Password Checker"
        description="Cek keamanan password Anda"
        icon={<Lock className="h-8 w-8 text-white" />}
        customCss=""
        clientSide={false}
      />
      <PasswordChecker />
    </div>
  );
}
