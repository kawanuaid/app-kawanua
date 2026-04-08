import PasswordGenerator from "@/components/passgen/PasswordGenerator";
import HeaderApp from "@/components/HeaderApp";
import { Shield } from "lucide-react";

const PassGenPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeaderApp
        title="Password Generator"
        description="Buat password yang kuat dan aman"
        icon={<Shield className="h-8 w-8 text-white" />}
        customCss=""
        clientSide
      />
      <PasswordGenerator />
    </div>
  );
};

export default PassGenPage;
