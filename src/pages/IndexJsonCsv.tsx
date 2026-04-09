import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import JsonToCsv from "@/components/jsoncsv/JsonToCsv";
import CsvToJson from "@/components/jsoncsv/CsvToJson";
import { FileJson, FileSpreadsheet, FileCog } from "lucide-react";
import HeaderApp from "@/components/HeaderApp";

export default function JsonCsvPage() {
  const [activeTab, setActiveTab] = useState("json-to-csv");

  return (
    <div className="min-h-screen bg-background bg-grid relative">
      <HeaderApp
        title={"JSON ↔ CSV Converter"}
        description={"Konversi file JSON dan CSV dengan mudah"}
        icon={<FileCog className="size-10 text-white" />}
        customCss={""}
      />
      <div className="absolute inset-0 bg-gradient-radial pointer-events-none" />

      {/* Hero section */}
      <section className="mx-auto px-4 pt-10 pb-4 sm:px-6">
        <div className="mb-8 text-center">
          <p className="mx-auto max-w-2xl text-slate-600 dark:text-slate-400">
            Konverter JSON dan CSV yang mudah digunakan dengan{" "}
            <em>smart type inference</em>, <em>nested object flattening</em>,{" "}
            <em>custom delimiters</em>, serta pengunduhan file yang cepat.
          </p>
        </div>

        {/* Feature pills */}
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          <div className="text-sm">Fitur:</div>
          {[
            "Nested object flattening",
            "Smart type inference",
            "Custom delimiters",
            "File upload & download",
            "Auto delimiter detection",
            "Quote control",
          ].map((feature) => (
            <Badge
              key={feature}
              variant="secondary"
              className="rounded-full text-xs"
            >
              {feature}
            </Badge>
          ))}
        </div>

        {/* Main converter card */}
        <div className="rounded-2xl border border-slate-200 bg-white/90 shadow-xl shadow-slate-200/50 backdrop-blur dark:border-slate-700/50 dark:bg-slate-900/90 dark:shadow-slate-900/50">
          {/* Card header with tabs */}
          <div className="border-b border-slate-200 px-6 pt-6 pb-0 dark:border-slate-700">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="h-12 gap-1 bg-slate-100 p-1 dark:bg-slate-800">
                <TabsTrigger
                  value="json-to-csv"
                  className="flex h-10 items-center gap-2 px-5 text-sm"
                >
                  <FileJson className="size-4" />
                  JSON → CSV
                </TabsTrigger>
                <TabsTrigger
                  value="csv-to-json"
                  className="flex h-10 items-center gap-2 px-5 text-sm"
                >
                  <FileSpreadsheet className="size-4" />
                  CSV → JSON
                </TabsTrigger>
              </TabsList>

              {/* Tab content inside the card */}
              <div className="p-6">
                <TabsContent value="json-to-csv">
                  <JsonToCsv />
                </TabsContent>
                <TabsContent value="csv-to-json">
                  <CsvToJson />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </section>

      {/* How-to section */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <h3 className="mb-6 text-center text-lg font-semibold text-slate-800 dark:text-slate-200">
          Cara Menggunakan
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            {
              step: "1",
              title: "Salin dari clipboard atau unggah",
              desc: "Salin data Anda langsung ke editor atau unggah file dari perangkat Anda.",
              icon: "📋",
              color: "from-teal-200 to-emerald-300",
            },
            {
              step: "2",
              title: "Pilih pengaturan",
              desc: "Pilih delimiter, menyertakan baris header, dan pengaturan hasil output.",
              icon: "⚙️",
              color: "from-emerald-200 to-green-300",
            },
            {
              step: "3",
              title: "Konversi & unduh",
              desc: "Klik konversi, lalu salin ke clipboard atau unduh hasilnya secara instan.",
              icon: "✨",
              color: "from-green-200 to-lime-300",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="flex gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900"
            >
              <div
                className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${item.color} text-4xl`}
              >
                {item.icon}
              </div>
              <div>
                <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Langkah {item.step}
                </div>
                <h4 className="mb-1 font-semibold text-slate-900 dark:text-white">
                  {item.title}
                </h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
