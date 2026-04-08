import { Badge } from "./ui/badge";

export default function HeaderApp({
  title,
  description,
  icon,
  customCss,
  clientSide,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  customCss: string;
  clientSide?: boolean;
}) {
  return (
    <header className="border-b border-slate-200/80 bg-white/70 backdrop-blur-md sticky top-0 z-40">
      <div
        className={`mx-auto px-4 sm:px-6 py-4 flex items-center justify-center ${customCss}`}
      >
        <div className="text-center space-y-2">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-green-600 shadow-lg shadow-teal-200 mb-4">
            {icon}
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            {title}
          </h1>
          <p className="text-slate-500">{description}</p>
          {clientSide && (
            <Badge variant="secondary" className="hidden sm:inline-flex gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Client-side only — no data sent
            </Badge>
          )}
        </div>
      </div>
    </header>
  );
}
