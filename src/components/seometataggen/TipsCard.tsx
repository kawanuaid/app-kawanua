import { Sparkles } from "lucide-react";
import { Card, CardContent } from "../ui/card";

export default function TipsCard() {
  return (
    <Card className="border-border/50 bg-gradient-to-br from-primary/5 to-indigo-50/50">
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">SEO Best Practices</h4>
            <ul className="text-xs text-muted-foreground space-y-1.5">
              <li className="flex items-start gap-1.5">
                <span className="text-primary mt-0.5">•</span>
                Keep your title tag under{" "}
                <strong className="text-foreground">60 characters</strong> to
                avoid truncation in search results
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-primary mt-0.5">•</span>
                Meta descriptions should be{" "}
                <strong className="text-foreground">
                  150-160 characters
                </strong>{" "}
                for optimal display
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-primary mt-0.5">•</span>
                Always include a{" "}
                <strong className="text-foreground">canonical URL</strong> to
                prevent duplicate content issues
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-primary mt-0.5">•</span>
                Use{" "}
                <strong className="text-foreground">
                  Open Graph images
                </strong>{" "}
                at 1200×630px for best social sharing results
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-primary mt-0.5">•</span>
                Each page should have a{" "}
                <strong className="text-foreground">
                  unique title and description
                </strong>
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
