import { useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import { categories } from "@/lib/unitConverters";
import ConverterPanel, {
  iconMapLg,
} from "@/components/unitconverter/ConverterPanel";
import HeaderApp from "@/components/HeaderApp";

function UnitConverterPage() {
  const [activeCategory, setActiveCategory] = useState(categories[0].id);

  const activeIndex = categories.findIndex((c) => c.id === activeCategory);

  return (
    <div className="min-h-screen bg-background bg-grid relative">
      <HeaderApp
        title={"Unit Converter"}
        description={"Konversi berbagai jenis satuan dalam satu platform."}
        icon={<ArrowLeftRight className="h-8 w-8 text-white" />}
        customCss={""}
        clientSide={false}
      />
      <div className="absolute inset-0 bg-gradient-radial pointer-events-none" />

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Category Card Toggles */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`
                  group relative flex flex-col items-center gap-1.5 rounded-2xl p-3 text-center
                  transition-all duration-200 ease-out border-2 cursor-pointer
                  ${
                    isActive
                      ? "border-primary bg-primary shadow-lg shadow-primary/10 scale-[1.02]"
                      : "border-border bg-card hover:border-primary hover:bg-white hover:shadow-md"
                  }
                `}
              >
                {/* Active indicator dot */}
                {isActive && (
                  <span className="absolute top-2 right-2 flex size-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-200 opacity-75" />
                    <span className="relative inline-flex rounded-full size-2 bg-cyan-300" />
                  </span>
                )}

                {/* Icon */}
                <div
                  className={`
                    flex items-center justify-center size-10 rounded-xl transition-colors duration-200
                    ${
                      isActive
                        ? "bg-white text-primary shadow-md"
                        : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                    }
                  `}
                >
                  {iconMapLg[cat.icon]}
                </div>

                {/* Label */}
                <div>
                  <p
                    className={`text-sm font-semibold leading-tight transition-colors ${
                      isActive
                        ? "text-primary-foreground"
                        : "text-foreground group-hover:text-primary"
                    }`}
                  >
                    {cat.label}
                  </p>
                  <p
                    className={`text-[11px] mt-0.5 ${
                      isActive
                        ? "text-primary-foreground"
                        : "text-muted-foreground group-hover:text-primary"
                    }`}
                  >
                    {cat.units.length} units
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active converter panel */}
        {activeIndex >= 0 && <ConverterPanel categoryIndex={activeIndex} />}
      </main>
    </div>
  );
}

export default UnitConverterPage;
