import AppHome from "../components/dash/AppHome";

export default function DashboardPage() {
  return (
    <div className="bg-background bg-grid flex items-start justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(200_80%_55%/0.10),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,hsl(200_80%_40%/0.08),transparent_50%)]" />

      <div className="w-full max-w-6xl space-y-6 py-10 z-10">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-foreground tracking-tight">
            <span className="text-blue-700/60">Kawanua ID</span> Apps
          </h1>
          <p className="text-muted-foreground">
            Kawanua ID Apps adalah kumpulan aplikasi untuk membantu Anda dalam
            berbagai hal.
          </p>
        </div>
        <AppHome />
      </div>
    </div>
  );
}
