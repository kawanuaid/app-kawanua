import HeaderApp from "@/components/HeaderApp";
import ImageOptimizer from "@/components/shrimg/ImageOptimizer";
import { ImageDown } from "lucide-react";

const ImageOptimizerPage = () => {
  return (
    <div className="min-h-screen bg-background bg-grid relative">
      <HeaderApp
        title="Image Optimizer"
        description="Kurangi ukuran file gambar secara instan langsung di browser. Gratis, cepat, dan tanpa upload ke server."
        icon={<ImageDown className="size-10 text-white" />}
        customCss=""
        clientSide
      />
      <div className="absolute inset-0 bg-gradient-radial pointer-events-none" />

      <div className="container max-w-3xl mx-auto px-4 pt-10">
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
