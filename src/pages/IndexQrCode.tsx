import HeaderApp from "@/components/HeaderApp";
import QRCodeGenerator from "@/components/qrcode/QRCodeGenerator";
import { QrCode, Shield } from "lucide-react";

const QrCodePage = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeaderApp
        title="QR Code Generator"
        description="Buat QR code kustom dengan warna, ukuran, dan format yang kamu inginkan"
        icon={<QrCode className="size-10 text-white" />}
        customCss=""
        clientSide={false}
      />
      <QRCodeGenerator />
    </div>
  );
};

export default QrCodePage;
