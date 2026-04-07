import AppHome from "../components/dash/AppHome";

export default function DashboardPage() {
  return (
    <div className="flex items-start justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      {/* <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(160_80%_45%/0.08),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,hsl(200_80%_40%/0.05),transparent_50%)]" /> */}
      <div className="w-full max-w-6xl space-y-6 py-10">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-foreground tracking-tight">
            Dashboard <span className="text-primary">Kawanua Apps</span>
          </h1>
          <p className="text-muted-foreground">
            Dashboard Kawanua Apps adalah kumpulan aplikasi untuk membantu Anda
            dalam berbagai hal.
          </p>
        </div>
        <AppHome />
      </div>
    </div>
  );
}
