import { Card, CardContent } from "../ui/card";
import { Check, ImageIcon, Sparkles } from "lucide-react";

export default function Features() {
  return (
    <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card className="border-border/30 bg-white/60 backdrop-blur-sm text-center">
        <CardContent className="pt-6">
          <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-sm mb-1">Konversi Cepat</h3>
          <p className="text-xs text-muted-foreground">
            Konversi waktu nyata saat Anda mengunggah atau menempel — tidak
            perlu menunggu.
          </p>
        </CardContent>
      </Card>
      <Card className="border-border/30 bg-white/60 backdrop-blur-sm text-center">
        <CardContent className="pt-6">
          <div className="w-10 h-10 rounded-lg bg-green-500/10 text-green-600 flex items-center justify-center mx-auto mb-3">
            <Check className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-sm mb-1">100% Private</h3>
          <p className="text-xs text-muted-foreground">
            Semuanya berjalan secara lokal di browser Anda — tidak ada data yang
            pernah meninggalkan perangkat Anda.
          </p>
        </CardContent>
      </Card>
      <Card className="border-border/30 bg-white/60 backdrop-blur-sm text-center">
        <CardContent className="pt-6">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center mx-auto mb-3">
            <ImageIcon className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-sm mb-1">Semua Format</h3>
          <p className="text-xs text-muted-foreground">
            Mendukung PNG, JPEG, GIF, SVG, WebP, dan semua format gambar yang
            didukung browser.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
