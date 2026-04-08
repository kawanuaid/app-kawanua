import { useState, useCallback } from "react";
import {
  Hash,
  Copy,
  Check,
  FileText,
  RefreshCw,
  Trash2,
  Download,
  Lock,
} from "lucide-react";
import CryptoJS from "crypto-js";
import { Badge } from "@/components/ui/badge";
import HeaderApp from "@/components/HeaderApp";

type HashAlgorithm =
  | "md5"
  | "sha1"
  | "sha256"
  | "sha384"
  | "sha512"
  | "ripemd160";
type HashResult = {
  algorithm: string;
  hash: string;
  label: string;
};

const hashAlgorithms: { value: HashAlgorithm; label: string; icon: string }[] =
  [
    { value: "md5", label: "MD5", icon: "🔐" },
    { value: "sha1", label: "SHA-1", icon: "🔑" },
    { value: "sha256", label: "SHA-256", icon: "🛡️" },
    { value: "sha384", label: "SHA-384", icon: "🔒" },
    { value: "sha512", label: "SHA-512", icon: "🗝️" },
    { value: "ripemd160", label: "RIPEMD-160", icon: "💎" },
  ];

function generateHash(text: string, algorithm: HashAlgorithm): string {
  if (!text) return "";

  switch (algorithm) {
    case "md5":
      return CryptoJS.MD5(text).toString();
    case "sha1":
      return CryptoJS.SHA1(text).toString();
    case "sha256":
      return CryptoJS.SHA256(text).toString();
    case "sha384":
      return CryptoJS.SHA384(text).toString();
    case "sha512":
      return CryptoJS.SHA512(text).toString();
    case "ripemd160":
      return CryptoJS.RIPEMD160(text).toString();
    default:
      return "";
  }
}

export default function HashGenPage() {
  const [inputText, setInputText] = useState("");
  const [selectedAlgorithm, setSelectedAlgorithm] =
    useState<HashAlgorithm>("sha256");
  const [uppercase, setUppercase] = useState(false);
  const [allHashes, setAllHashes] = useState<HashResult[]>([]);
  const [copied, setCopied] = useState<string | null>(null);

  const currentHash = generateHash(inputText, selectedAlgorithm);
  const displayHash = uppercase ? currentHash.toUpperCase() : currentHash;

  const copyToClipboard = useCallback(async (text: string, id: string) => {
    if (text) {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    }
  }, []);

  const generateAllHashes = useCallback(() => {
    if (!inputText) return;

    const results: HashResult[] = hashAlgorithms.map((algo) => ({
      algorithm: algo.value,
      hash: uppercase
        ? generateHash(inputText, algo.value).toUpperCase()
        : generateHash(inputText, algo.value),
      label: algo.label,
    }));
    setAllHashes(results);
  }, [inputText, uppercase]);

  const downloadAll = () => {
    if (allHashes.length === 0) return;

    const content = allHashes.map((h) => `${h.label}: ${h.hash}`).join("\n");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "hashes.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-indigo-50/50">
      {/* Header */}
      <HeaderApp
        title="Hash Generator"
        description="Generate hash dari teks dengan mudah dan cepat"
        icon={<Hash className="h-8 w-8 text-white" />}
        customCss=""
        clientSide
      />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Input Section */}
        <div className="mb-8 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <label className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-700">
              <FileText className="h-4 w-4" />
              Input Text
            </label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter text to generate hash..."
              className="w-full min-h-[120px] rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
            />
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                {inputText.length} character{inputText.length !== 1 ? "s" : ""}
              </span>
              {inputText && (
                <button
                  onClick={() => {
                    setInputText("");
                    setAllHashes([]);
                  }}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Options */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-slate-700">
                Algorithm:
              </label>
              <select
                value={selectedAlgorithm}
                onChange={(e) =>
                  setSelectedAlgorithm(e.target.value as HashAlgorithm)
                }
                className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 focus:border-indigo-500 focus:bg-white focus:outline-none transition-all cursor-pointer"
              >
                {hashAlgorithms.map((algo) => (
                  <option key={algo.value} value={algo.value}>
                    {algo.icon} {algo.label}
                  </option>
                ))}
              </select>
            </div>

            <label className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={uppercase}
                onChange={(e) => setUppercase(e.target.checked)}
                className="peer h-4.5 w-4.5 rounded border border-slate-300 text-indigo-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0 transition-all"
              />
              <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
                Uppercase Output
              </span>
            </label>

            {inputText && (
              <button
                onClick={generateAllHashes}
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-500 to-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-200 transition-all"
              >
                <RefreshCw className="h-4 w-4" />
                Generate All Hashes
              </button>
            )}
          </div>

          {/* Current Hash Output */}
          {inputText && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Lock className="h-4 w-4" />
                  {
                    hashAlgorithms.find((a) => a.value === selectedAlgorithm)
                      ?.icon
                  }{" "}
                  {
                    hashAlgorithms.find((a) => a.value === selectedAlgorithm)
                      ?.label
                  }{" "}
                  Hash
                </label>
                <button
                  onClick={() => copyToClipboard(displayHash, "current")}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  {copied === "current" ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      Copy
                    </>
                  )}
                </button>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-slate-50 to-zinc-50 border border-slate-100 p-4">
                <code className="break-all text-sm font-mono text-indigo-700">
                  {displayHash || "Hash will appear here..."}
                </code>
              </div>
              <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
                <span>Length: {displayHash.length} characters</span>
                <span>Algorithm: {selectedAlgorithm.toUpperCase()}</span>
              </div>
            </div>
          )}
        </div>

        {/* All Hashes Section */}
        {allHashes.length > 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">
                All Generated Hashes
              </h2>
              <button
                onClick={downloadAll}
                className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors border border-slate-200"
              >
                <Download className="h-4 w-4" />
                Download All
              </button>
            </div>

            <div className="space-y-3">
              {allHashes.map((result, index) => (
                <div
                  key={result.algorithm}
                  className="group rounded-xl border border-slate-200 bg-slate-50/50 p-4 hover:bg-slate-50 hover:border-slate-300 transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="inline-flex items-center rounded-lg bg-indigo-100 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                          {result.label}
                        </span>
                        <span className="text-xs text-slate-500">
                          {result.hash.length} chars
                        </span>
                      </div>
                      <code className="block break-all text-sm font-mono text-slate-700">
                        {result.hash}
                      </code>
                    </div>
                    <button
                      onClick={() =>
                        copyToClipboard(result.hash, `hash-${index}`)
                      }
                      className="flex-shrink-0 flex items-center gap-1.5 rounded-lg p-2 text-slate-500 hover:bg-white hover:text-indigo-600 transition-all shadow-sm hover:shadow"
                    >
                      {copied === `hash-${index}` ? (
                        <Check className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Algorithm Info */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            About Hash Algorithms
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {hashAlgorithms.map((algo) => (
              <div
                key={algo.value}
                className={`rounded-xl border p-4 transition-all ${
                  selectedAlgorithm === algo.value
                    ? "border-indigo-300 bg-indigo-50/50 shadow-sm"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{algo.icon}</span>
                  <span className="font-semibold text-slate-900">
                    {algo.label}
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  {algo.value === "md5" &&
                    "128-bit hash function. Fast but not cryptographically secure."}
                  {algo.value === "sha1" &&
                    "160-bit hash function. Deprecated for security purposes."}
                  {algo.value === "sha256" &&
                    "256-bit hash function. Widely used and recommended."}
                  {algo.value === "sha384" &&
                    "384-bit hash function. Intermediate security level."}
                  {algo.value === "sha512" &&
                    "512-bit hash function. Highest security level."}
                  {algo.value === "ripemd160" &&
                    "160-bit hash function. Alternative to SHA-1."}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-slate-400 py-6 mt-4 border-t border-slate-200/60">
        All encoding/decoding happens locally in your browser. No data is
        transmitted.
      </footer>
    </div>
  );
}
