import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/domainlookup/ui/badge";
import { Alert, AlertDescription } from "@/components/domainlookup/ui/alert";
import { WhoisIcon } from "@/components/domainlookup/WhoisIcon";
import { SearchIcon } from "@/components/domainlookup/SearchIcon";
import { LoaderIcon } from "@/components/domainlookup/LoaderIcon";
import { lookupDomain, WhoisData, SUPPORTED_TLDS } from "@/lib/domain";
import HeaderApp from "@/components/HeaderApp";
import { formatDate, formatDateTime } from "@/hooks/formatDate";

export default function DomainLookupPage() {
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<WhoisData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showSupported, setShowSupported] = useState(false);

  const handleSearch = async () => {
    if (!domain.trim()) {
      setError("Please enter a domain name");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await lookupDomain(domain.trim());
      setResult(data);
      setSearchHistory((prev) => {
        const filtered = prev.filter((d) => d !== domain.trim());
        return [domain.trim(), ...filtered].slice(0, 5);
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to lookup domain");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const getStatusBadge = (status: string, available?: boolean) => {
    if (available) {
      return <Badge variant="success">Available</Badge>;
    }
    if (status === "registered") {
      return <Badge variant="default">Registered</Badge>;
    }
    return <Badge variant="secondary">{status}</Badge>;
  };

  const getAvailabilityMessage = (available?: boolean) => {
    if (available) {
      return (
        <Alert variant="success">
          <div className="flex-1">
            <AlertDescription className="font-medium">
              ✓ This domain is available for registration!
            </AlertDescription>
          </div>
        </Alert>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-background bg-grid relative">
      <HeaderApp
        title={"Domain Lookup"}
        description={"Cek ketersediaan domain dan informasi registrar"}
        icon={<WhoisIcon className="h-5 w-5 text-white" />}
        customCss={""}
      />
      <div className="absolute inset-0 bg-gradient-radial pointer-events-none" />

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Search Section */}
        <div className="mb-10">
          <div className="text-center mb-8">
            {/* <h2 className="text-4xl font-bold tracking-tight text-slate-900 mb-3">
              Domain Lookup
            </h2> */}
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              Masukkan nama domain untuk memeriksa ketersediaannya dan
              mendapatkan informasi registrar, tanggal pembuatan, dan tanggal
              kedaluwarsa.
            </p>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <WhoisIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    type="text"
                    placeholder="example.com"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="pl-12"
                  />
                </div>
                <Button
                  onClick={handleSearch}
                  disabled={loading}
                  size="lg"
                  className="sm:w-auto"
                >
                  {loading ? (
                    <>
                      <LoaderIcon className="h-5 w-5 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <SearchIcon className="h-5 w-5" />
                      Lookup
                    </>
                  )}
                </Button>
              </div>

              {searchHistory.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="text-xs text-slate-500 mb-1 block w-full">
                    Recent searches:
                  </span>
                  {searchHistory.map((item) => (
                    <button
                      key={item}
                      onClick={() => {
                        setDomain(item);
                        handleSearch();
                      }}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 transition-all"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}

              <div className="mt-6 pt-4 border-t border-slate-100">
                <button
                  onClick={() => setShowSupported(!showSupported)}
                  className="w-full flex items-center justify-between text-xs font-medium text-slate-500 hover:text-slate-700 transition-colors"
                >
                  <span>Supported Extensions ({SUPPORTED_TLDS.length})</span>
                  <span>{showSupported ? "▲" : "▼"}</span>
                </button>
                {showSupported && (
                  <div className="flex flex-wrap gap-1.5 mt-3 max-h-40 overflow-y-auto pr-2 pb-2 custom-scrollbar">
                    {SUPPORTED_TLDS.sort().map((tld) => (
                      <span
                        key={tld}
                        className="px-2 py-1 text-[11px] font-medium rounded-md bg-slate-100 text-slate-600 border border-slate-200"
                      >
                        .{tld}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="error" className="mb-8">
            <div className="flex-1">
              <AlertDescription>
                <strong>Error:</strong> {error}
              </AlertDescription>
            </div>
          </Alert>
        )}

        {/* Results Section */}
        {result && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {getAvailabilityMessage(result.available)}

            <Card>
              <CardHeader>
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div>
                    <CardTitle className="text-2xl mb-2">
                      {result.domain}
                    </CardTitle>
                    <CardDescription>
                      {result.available
                        ? "This domain is not registered and may be available"
                        : "Domain registration and ownership information"}
                    </CardDescription>
                  </div>
                  {getStatusBadge(result.status, result.available)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  {/* Status */}
                  <div className="rounded-xl border-2 border-slate-200 bg-slate-50 p-5">
                    <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                      <WhoisIcon className="h-4 w-4" />
                      Domain Status
                    </h3>
                    <div className="text-lg font-medium text-slate-700">
                      {result.available
                        ? "Available for registration"
                        : result.status}
                    </div>
                    {result.available && (
                      <p className="text-sm text-slate-500 mt-2">
                        You can register this domain through any accredited
                        domain registrar.
                      </p>
                    )}
                  </div>

                  {!result.available && (
                    <>
                      {/* Key Dates */}
                      <div className="rounded-xl border-2 border-slate-200 bg-slate-50 p-5">
                        <h3 className="text-sm font-semibold text-slate-900 mb-4">
                          Key Dates
                        </h3>
                        <div className="grid sm:grid-cols-3 gap-4">
                          {result.createdDate && (
                            <div>
                              <div className="text-xs text-slate-500 mb-1">
                                Created
                              </div>
                              <div className="text-sm font-medium text-slate-700">
                                {formatDate(result.createdDate)}
                              </div>
                            </div>
                          )}
                          {result.updatedDate && (
                            <div>
                              <div className="text-xs text-slate-500 mb-1">
                                Last Updated
                              </div>
                              <div className="text-sm font-medium text-slate-700">
                                {formatDate(result.updatedDate)}
                              </div>
                            </div>
                          )}
                          {result.expiryDate && (
                            <div>
                              <div className="text-xs text-slate-500 mb-1">
                                Expires
                              </div>
                              <div
                                className={`text-sm font-medium ${
                                  new Date(result.expiryDate) <
                                  new Date(
                                    Date.now() + 30 * 24 * 60 * 60 * 1000,
                                  )
                                    ? "text-red-600"
                                    : "text-slate-700"
                                }`}
                              >
                                {formatDateTime(result.expiryDate)}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Registrar */}
                      {result.registrar && (
                        <div className="rounded-xl border-2 border-slate-200 bg-slate-50 p-5">
                          <h3 className="text-sm font-semibold text-slate-900 mb-3">
                            Registrar
                          </h3>
                          <div className="text-sm font-medium text-slate-700">
                            {result.registrar}
                          </div>
                        </div>
                      )}

                      {/* Name Servers */}
                      {result.nameServers && result.nameServers.length > 0 && (
                        <div className="rounded-xl border-2 border-slate-200 bg-slate-50 p-5">
                          <h3 className="text-sm font-semibold text-slate-900 mb-3">
                            Name Servers
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {result.nameServers.map((ns, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="font-mono"
                              >
                                {ns}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Registrant Info */}
                      {result.registrant &&
                        Object.keys(result.registrant).length > 0 && (
                          <div className="rounded-xl border-2 border-slate-200 bg-slate-50 p-5">
                            <h3 className="text-sm font-semibold text-slate-900 mb-3">
                              Registrant Information
                            </h3>
                            <div className="space-y-2">
                              {result.registrant.name && (
                                <div>
                                  <span className="text-xs text-slate-500">
                                    Name:
                                  </span>{" "}
                                  <span className="text-sm text-slate-700">
                                    {result.registrant.name}
                                  </span>
                                </div>
                              )}
                              {result.registrant.organization && (
                                <div>
                                  <span className="text-xs text-slate-500">
                                    Organization:
                                  </span>{" "}
                                  <span className="text-sm text-slate-700">
                                    {result.registrant.organization}
                                  </span>
                                </div>
                              )}
                              {result.registrant.country && (
                                <div>
                                  <span className="text-xs text-slate-500">
                                    Country:
                                  </span>{" "}
                                  <span className="text-sm text-slate-700">
                                    {result.registrant.country}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                    </>
                  )}

                  {/* Raw Data */}
                  {result.raw && result.raw.length > 0 && (
                    <div className="rounded-xl border-2 border-slate-200 bg-slate-50 p-5">
                      <h3 className="text-sm font-semibold text-slate-900 mb-3">
                        Raw Information
                      </h3>
                      <div className="space-y-1 font-mono text-sm text-slate-600">
                        {result.raw.map((line, index) => (
                          <div key={index}>{line}</div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex flex-col items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <WhoisIcon className="h-4 w-4" />
              <span>Powered by RDAP (Registration Data Access Protocol)</span>
            </div>
            <div className="text-sm text-slate-500">
              Data may not be 100% accurate. Verify through official sources.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
