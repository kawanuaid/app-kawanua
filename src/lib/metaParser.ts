// Shape of the `data` object returned by the metatag API
interface MetaApiData {
  url: string;
  title: string;
  description: string | null;
  language: string | null;
  keywords: string | null;
  author: string | null;
  robots: string | null;
  canonical: string | null;
  favicon: string | null;
  viewport: string | null;
  "og:title": string | null;
  "og:description": string | null;
  "og:image": string | null;
  "og:type": string | null;
  "og:url": string | null;
  "og:site_name": string | null;
  "og:locale": string | null;
  "twitter:card": string | null;
  "twitter:title": string | null;
  "twitter:description": string | null;
  "twitter:image": string | null;
  "twitter:site": string | null;
}

interface MetaApiResponse {
  success: boolean;
  data: MetaApiData;
}

// Normalised interface used by the rest of the app
export interface MetaTagData {
  title: string;
  description: string;
  url: string;
  language: string;
  keywords: string;
  author: string;
  siteName: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogType: string;
  ogUrl: string;
  ogLocale: string;
  twitterCard: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  twitterSite: string;
  favicon: string;
  canonical: string;
  robots: string;
  viewport: string;
}

const API_ENDPOINTS = [
  "https://meta.fetch.pp.ua/scan",
  "https://metatag-api.erol.ovh/scan",
];

const REQUEST_TIMEOUT_MS = 5_000;

async function tryFetch(apiUrl: string): Promise<MetaApiResponse> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(apiUrl, { signal: controller.signal });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const json: MetaApiResponse = await response.json();
    if (!json.success) throw new Error("API returned success: false");

    return json;
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchMetaTags(url: string): Promise<MetaTagData> {
  let formattedUrl = url.trim();
  if (
    !formattedUrl.startsWith("http://") &&
    !formattedUrl.startsWith("https://")
  ) {
    formattedUrl = `https://${formattedUrl}`;
  }

  const encodedUrl = encodeURIComponent(formattedUrl);

  let lastError: unknown;
  for (const base of API_ENDPOINTS) {
    try {
      const json = await tryFetch(`${base}/${encodedUrl}`);
      const d = json.data;

      const str = (v: string | null | undefined): string => v ?? "";

      return {
        title: str(d.title),
        description: str(d.description),
        url: str(d.url),
        language: str(d.language),
        keywords: str(d.keywords),
        author: str(d.author),
        siteName: str(d["og:site_name"]),
        ogTitle: str(d["og:title"]),
        ogDescription: str(d["og:description"]),
        ogImage: str(d["og:image"]),
        ogType: str(d["og:type"]),
        ogUrl: str(d["og:url"]),
        ogLocale: str(d["og:locale"]),
        twitterCard: str(d["twitter:card"]),
        twitterTitle: str(d["twitter:title"]),
        twitterDescription: str(d["twitter:description"]),
        twitterImage: str(d["twitter:image"]),
        twitterSite: str(d["twitter:site"]),
        favicon: str(d.favicon),
        canonical: str(d.canonical),
        robots: str(d.robots),
        viewport: str(d.viewport),
      };
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError ?? new Error("All API endpoints failed");
}
