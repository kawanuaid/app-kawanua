import ImageOptimizer from "@/components/shrimg/ImageOptimizer";
import { ImageDown } from "lucide-react";

const ImageOptimizerPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(160_80%_45%/0.08),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,hsl(200_80%_40%/0.05),transparent_50%)]" />
      <div className="container max-w-3xl mx-auto px-4 py-12 md:py-20">
        {/* Header */}
        <div className="text-center mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-2">
            <ImageDown className="w-4 h-4" />
            Image Optimizer
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            Kompres Gambar Tanpa
            <span className="text-primary"> Kehilangan Kualitas</span>
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Kurangi ukuran file gambar secara instan langsung di browser.
            Gratis, cepat, dan tanpa upload ke server.
          </p>
        </div>

        <ImageOptimizer />

        <p className="text-center text-xs text-muted-foreground mt-12">
          Semua proses dilakukan di browser Anda. Gambar tidak dikirim ke server
          manapun.
        </p>
      </div>
    </div>
  );
};

export default ImageOptimizerPage;
