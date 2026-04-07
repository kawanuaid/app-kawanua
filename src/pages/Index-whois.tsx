import { useState } from "react";
import WhoisSearch from "@/components/whois/WhoisSearch";
import WhoisResult, { type WhoisData } from "@/components/whois/WhoisResult";
import DnsResult, { type DnsData } from "@/components/whois/DnsResult";
import { fetchDnsRecords } from "@/lib/dns-api";
import { Globe } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

// Mock WHOIS data
const mockWhoisData: Record<string, WhoisData> = {
  "google.com": {
    domainName: "google.com",
    registrar: "MarkMonitor Inc.",
    registrant: "Google LLC",
    organization: "Google LLC",
    email: "abusecomplaints@markmonitor.com",
    createdDate: "1997-09-15",
    expiryDate: "2028-09-14",
    updatedDate: "2019-09-09",
    status: [
      "clientDeleteProhibited",
      "clientTransferProhibited",
      "clientUpdateProhibited",
      "serverDeleteProhibited",
      "serverTransferProhibited",
      "serverUpdateProhibited",
    ],
    nameServers: [
      "ns1.google.com",
      "ns2.google.com",
      "ns3.google.com",
      "ns4.google.com",
    ],
    dnssec: "unsigned",
    country: "US",
  },
};

const generateMockWhois = (domain: string): WhoisData => {
  if (mockWhoisData[domain.toLowerCase()])
    return mockWhoisData[domain.toLowerCase()];
  const tld = domain.split(".").pop() || "com";
  return {
    domainName: domain.toLowerCase(),
    registrar: "Example Registrar, Inc.",
    registrant: "REDACTED FOR PRIVACY",
    organization: "Privacy Protection Service",
    email: "contact@privacyprotect.org",
    createdDate: "2020-03-15",
    expiryDate: "2025-03-15",
    updatedDate: "2024-01-10",
    status: ["clientTransferProhibited"],
    nameServers: [`ns1.example-dns.${tld}`, `ns2.example-dns.${tld}`],
    dnssec: "unsigned",
    country: "US",
  };
};

type LookupType = "whois" | "dns";

const WhoisPage = () => {
  const [whoisResult, setWhoisResult] = useState<WhoisData | null>(null);
  const [dnsResult, setDnsResult] = useState<DnsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<LookupType>("whois");

  const handleSearch = async (domain: string) => {
    setIsLoading(true);
    setWhoisResult(null);
    setDnsResult(null);

    try {
      // WHOIS: mock data
      const whois = generateMockWhois(domain);
      setWhoisResult(whois);

      // DNS: real data from Google DoH
      const dns = await fetchDnsRecords(domain);
      setDnsResult(dns);

      if (dns.records.length === 0) {
        toast.info("Tidak ditemukan DNS records untuk domain ini");
      }
    } catch (err) {
      console.error("DNS lookup failed:", err);
      toast.error("Gagal mengambil DNS records. Coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const hasResults = whoisResult || dnsResult;

  return (
    <div className="min-h-screen bg-background">
      <main className="container max-w-5xl mx-auto px-4 pb-16">
        <WhoisSearch onSearch={handleSearch} isLoading={isLoading} />

        {hasResults && (
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as LookupType)}
            className="space-y-6"
          >
            <TabsList className="bg-secondary border border-border">
              <TabsTrigger
                value="whois"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                WHOIS
              </TabsTrigger>
              <TabsTrigger
                value="dns"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                DNS Records
              </TabsTrigger>
            </TabsList>

            <TabsContent value="whois">
              {whoisResult && <WhoisResult data={whoisResult} />}
            </TabsContent>

            <TabsContent value="dns">
              {dnsResult && <DnsResult data={dnsResult} />}
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
};

export default WhoisPage;
