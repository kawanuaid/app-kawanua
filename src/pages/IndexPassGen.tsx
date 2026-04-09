import PasswordGenerator from "@/components/passgen/PasswordGenerator";
import HeaderApp from "@/components/HeaderApp";
import { RectangleEllipsis } from "lucide-react";

const PassGenPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeaderApp
        title="Password Generator"
        description="Buat password yang kuat dan aman"
        icon={<RectangleEllipsis className="size-10 text-white" />}
        customCss=""
        clientSide
      />
      <PasswordGenerator />
    </div>
  );
};

export default PassGenPage;
