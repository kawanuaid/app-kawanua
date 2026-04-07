import QRCodeGenerator from "@/components/qrcode/QRCodeGenerator";

const QrCodePage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(160_80%_45%/0.08),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,hsl(200_80%_40%/0.05),transparent_50%)]" />
      <div className="w-full max-w-4xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-foreground tracking-tight">
            QR Code <span className="text-primary">Generator</span>
          </h1>
          <p className="text-muted-foreground">
            Buat QR code kustom dengan warna, ukuran, dan format yang kamu
            inginkan
          </p>
        </div>
        <QRCodeGenerator />
      </div>
    </div>
  );
};

export default QrCodePage;
