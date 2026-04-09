export interface WhoisData {
  domain: string;
  status: string;
  available?: boolean;
  registrar?: string;
  createdDate?: string;
  updatedDate?: string;
  expiryDate?: string;
  nameServers?: string[];
  registrant?: {
    name?: string;
    organization?: string;
    country?: string;
  };
  admin?: {
    name?: string;
    organization?: string;
  };
  raw?: string[];
}

export interface DomainInfo {
  handle?: string;
  ldhName?: string;
  status?: string[];
  entities?: Array<{
    roles?: string[];
    vcardArray?: any[][];
  }>;
  events?: Array<{
    eventAction: string;
    eventDate: string;
  }>;
  nameservers?: Array<{
    ldhName: string;
  }>;
}

export const rdapServers: Record<string, string> = {
  // Existing and common ccTLDs
  com: "https://rdap.verisign.com/com/v1/domain/",
  net: "https://rdap.verisign.com/net/v1/domain/",
  org: "https://rdap.publicinterestregistry.org/rdap/domain/",
  info: "https://rdap.identitydigital.services/rdap/domain/",
  biz: "https://rdap.nic.biz/domain/",
  me: "https://rdap.nic.me/v1/domain/",
  tv: "https://rdap.nic.tv/domain/",
  us: "https://rdap.nic.us/v1/domain/",
  ca: "https://rdap.ca.fury.ca/rdap/domain/",
  eu: "https://rdap.eu/v1/domain/",
  uk: "https://rdap.nominet.uk/uk/domain/",
  de: "https://rdap.denic.de/v1/domain/",
  fr: "https://rdap.nic.fr/domain/",
  nl: "https://rdap.sidn.nl/domain/",
  be: "https://rdap.dns.be/v1/domain/",
  au: "https://rdap.cctld.au/rdap/domain/",
  jp: "https://rdap.jprs.jp/v1/domain/",
  in: "https://rdap.nixiregistry.in/rdap/domain/",
  cn: "https://rdap.verisign.cn/v1/domain/",
  ru: "https://rdap.tcinet.ru/v1/domain/",
  br: "https://rdap.registro.br/domain/",
  mx: "https://rdap.mx/v1/domain/",
  es: "https://rdap.red.es/v1/domain/",
  it: "https://rdap.nic.it/v1/domain/",
  se: "https://rdap.iis.se/v1/domain/",
  no: "https://rdap.norid.no/domain/",
  dk: "https://rdap.dk-hostmaster.dk/v1/domain/",
  fi: "https://rdap.fi/rdap/rdap/domain/",
  pl: "https://rdap.dns.pl/domain/",
  ch: "https://rdap.switch.ch/v1/domain/",
  at: "https://rdap.nic.at/v1/domain/",
  nz: "https://rdap.nzrs.net.nz/v1/domain/",
  sg: "https://rdap.sgnic.sg/rdap/domain/",
  hk: "https://rdap.hkirc.hk/v1/domain/",
  id: "https://rdap.pandi.id/rdap/domain/",
  io: "https://rdap.nic.io/v1/domain/",
  co: "https://rdap.nic.co/v1/domain/",
  ovh: "https://rdap.nic.ovh/domain/",
  cc: "https://tld-rdap.verisign.com/cc/v1/domain/",
  tw: "https://ccrdap.twnic.tw/tw/domain/",
  th: "https://rdap.thains.co.th/domain/",
  xyz: "https://rdap.centralnic.com/xyz/domain/",
  tech: "https://rdap.radix.host/rdap/domain/",
  online: "https://rdap.radix.host/rdap/domain/",
  site: "https://rdap.radix.host/rdap/domain/",
  store: "https://rdap.radix.host/rdap/domain/",
  app: "https://pubapi.registry.google/rdap/domain/",
  dev: "https://pubapi.registry.google/rdap/domain/",
  pro: "https://rdap.identitydigital.services/rdap/domain/",
  top: "https://rdap.zdnsgtld.com/top/domain/",
  vip: "https://rdap.nic.vip/domain/",
  cloud: "https://rdap.registry.cloud/rdap/domain/",
  club: "https://rdap.nic.club/domain/",
  design: "https://rdap.nic.design/domain/",
  host: "https://rdap.radix.host/rdap/domain/",
  space: "https://rdap.radix.host/rdap/domain/",
  website: "https://rdap.radix.host/rdap/domain/",
  agency: "https://rdap.identitydigital.services/rdap/domain/",
  link: "https://rdap.tucowsregistry.net/rdap/domain/",
  name: "https://tld-rdap.verisign.com/name/v1/domain/",
  mobi: "https://rdap.identitydigital.services/rdap/domain/",
  asia: "https://rdap.identitydigital.services/rdap/domain/",
  tel: "https://rdap.nic.tel/domain/",
  coop: "https://rdap.registry.coop/rdap/domain/",
  aero: "https://rdap.identitydigital.services/rdap/domain/",
  ai: "https://rdap.identitydigital.services/rdap/domain/",
  pw: "https://rdap.radix.host/rdap/domain/",
  fm: "https://rdap.centralnic.com/fm/domain/",
};

export const SUPPORTED_TLDS = Object.keys(rdapServers);

export async function lookupDomain(domain: string): Promise<WhoisData> {
  const cleanDomain = domain
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "");

  const tld = cleanDomain.split(".").pop();
  const domainName = cleanDomain.replace(/\.[^.]+$/, "");

  if (!tld || !domainName) {
    throw new Error("Invalid domain format");
  }

  const rdapUrl = rdapServers[tld] || `https://rdap.org/domain/${cleanDomain}/`;

  try {
    const response = await fetch(`${rdapUrl}${cleanDomain}`);

    if (!response.ok) {
      if (response.status === 404) {
        return {
          domain: cleanDomain,
          status: "available",
          available: true,
          raw: ["Domain is available for registration"],
        };
      }
      if (response.status === 429) {
        throw new Error("Rate limit exceeded. Please try again later.");
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data: DomainInfo = await response.json();

    return parseRDAPResponse(data, cleanDomain);
  } catch (error) {
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error("Network error. Please check your connection.");
    }
    throw error;
  }
}

function parseRDAPResponse(data: DomainInfo, domain: string): WhoisData {
  const result: WhoisData = {
    domain: domain,
    status: "registered",
    available: false,
  };

  result.status = data.status?.[0] || "registered";

  if (data.events) {
    for (const event of data.events) {
      switch (event.eventAction) {
        case "registration":
        case "created":
          result.createdDate = event.eventDate;
          break;
        case "last changed":
        case "updated":
          result.updatedDate = event.eventDate;
          break;
        case "expiration":
        case "expiry":
          result.expiryDate = event.eventDate;
          break;
      }
    }
  }

  if (data.nameservers) {
    result.nameServers = data.nameservers
      .map((ns) => ns.ldhName)
      .filter(Boolean);
  }

  if (data.entities) {
    for (const entity of data.entities) {
      if (!entity.vcardArray) continue;

      const vcardData = entity.vcardArray[1];
      const parsed: any = {};

      for (const item of vcardData) {
        if (item[0] === "fn") parsed.name = item[3];
        if (item[0] === "org") parsed.organization = item[3];
        if (item[0] === "adr") parsed.country = item[3]?.[item[3].length - 1];
      }

      if (entity.roles?.includes("registrar")) {
        result.registrar = parsed.name || parsed.organization;
      }
      if (entity.roles?.includes("registrant")) {
        result.registrant = parsed;
      }
      if (entity.roles?.includes("admin")) {
        result.admin = parsed;
      }
    }
  }

  result.raw = [
    `Domain: ${domain}`,
    result.registrar && `Registrar: ${result.registrar}`,
    result.createdDate && `Created: ${formatDate(result.createdDate)}`,
    result.updatedDate && `Updated: ${formatDate(result.updatedDate)}`,
    result.expiryDate && `Expires: ${formatDate(result.expiryDate)}`,
    result.nameServers?.length &&
      `Name Servers: ${result.nameServers.join(", ")}`,
    result.status && `Status: ${result.status}`,
  ].filter(Boolean) as string[];

  return result;
}

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    });
  } catch {
    return dateString;
  }
}
