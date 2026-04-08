import HeaderApp from "@/components/HeaderApp";
import ImageOptimizer from "@/components/shrimg/ImageOptimizer";
import { ImageDown } from "lucide-react";

const ImageOptimizerPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-indigo-50/50">
      <HeaderApp
        title="Image Optimizer"
        description="Kurangi ukuran file gambar secara instan langsung di browser. Gratis, cepat, dan tanpa upload ke server."
        icon={<ImageDown className="h-8 w-8 text-white" />}
        customCss=""
        clientSide
      />
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
