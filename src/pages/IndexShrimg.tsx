import { Disclaimer, SubFooter } from "@/components/Footer";
import HeaderApp from "@/components/HeaderApp";
import ImageOptimizer from "@/components/shrimg/ImageOptimizer";
import { ImageDown } from "lucide-react";

const ImageOptimizerPage = () => {
  return (
    <div className="min-h-screen bg-background bg-grid relative flex flex-col justify-between">
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
      </div>

      {/* Footer Info */}
      <SubFooter>
        <Disclaimer />
      </SubFooter>
    </div>
  );
};

export default ImageOptimizerPage;
