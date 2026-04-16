import { useEffect } from "react";
import { createBrowserRouter, Outlet, useMatches } from "react-router-dom";
import Page from "@/pages/Index.tsx";
import NotFound from "@/pages/NotFound.tsx";
import ImageOptimizerPage from "@/pages/IndexShrimg.tsx";
import QrCodePage from "@/pages/IndexQrCode.tsx";
import PassGenPage from "@/pages/IndexPassGen.tsx";
import UrlScannerPage from "@/pages/IndexUrlScanner.tsx";
import WhoisPage from "@/pages/IndexWhois.tsx";
import DashboardPage from "@/pages/IndexDashboard.tsx";
import PassCheckPage from "@/pages/IndexPassCheck.tsx";
import ColorConverterPage from "@/pages/IndexColorConverter.tsx";
import BmiCalculatorPage from "@/pages/IndexBmiCalculator.tsx";
import MetaTagReviewPage from "@/pages/IndexMetaTagReview.tsx";
import Base64Page from "@/pages/IndexBase64.tsx";
import HashGenPage from "@/pages/IndexHashGen.tsx";
import UuidGenPage from "@/pages/IndexUuidGen.tsx";
import JwtDecoderPage from "@/pages/IndexJwtDecoder.tsx";
import PageSpeedPage from "@/pages/IndexPageSpeed.tsx";
import DomainLookupPage from "@/pages/IndexDomainLookup.tsx";
import TimestampPage from "@/pages/IndexTimestamp.tsx";
import FileChecksumPage from "@/pages/IndexFileChecksum.tsx";
import JsonCsvPage from "@/pages/IndexJsonCsv.tsx";
import RegexTesterPage from "@/pages/IndexRegexTester.tsx";
import MarkdownPreviewPage from "@/pages/IndexMarkdownPreview.tsx";
import ColorPaletteGeneratorPage from "@/pages/IndexColorPaletteGenerator.tsx";
import FaviconGenPage from "@/pages/IndexFaviconGen.tsx";
import SeoMetatagGenPage from "@/pages/IndexSeoMetaTag.tsx";
import UnitConverterPage from "@/pages/IndexUnitConverter";
import { data } from "@/lib/data.ts";
import TailwindColorPage from "@/pages/IndexTailwindColor";
import ImagePlaceholderPage from "@/pages/IndexImagePlaceholder";

// Create a lookup map for app metadata from data.ts
const appLookup = new Map(
  data.navMain
    .flatMap((group) => group.items || [])
    .map((item) => [item.url.replace(/^\//, ""), item]),
);

/**
 * Helper to get metadata for a route handle from the central data.ts
 */
const getMeta = (path: string) => {
  const item = appLookup.get(path);
  if (!item) return {};
  return {
    title: item.title,
    description: item.description,
    keywords: item.keywords,
  };
};

function RootMetaLayout() {
  const matches = useMatches();

  useEffect(() => {
    // Get the last matched route that has a handle with title/description
    const activeRoute = matches[matches.length - 1];

    // Update a <meta name="..."> tag (e.g. description, twitter:title)
    const updateMetaByName = (name: string, content: string) => {
      let el = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("name", name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    // Update a <meta property="..."> tag (e.g. og:title, og:description)
    const updateMetaByProperty = (property: string, content: string) => {
      let el = document.querySelector<HTMLMetaElement>(
        `meta[property="${property}"]`,
      );
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("property", property);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    // Update canonical link
    const updateCanonical = (url: string) => {
      let el = document.querySelector<HTMLLinkElement>(`link[rel="canonical"]`);
      if (!el) {
        el = document.createElement("link");
        el.setAttribute("rel", "canonical");
        document.head.appendChild(el);
      }
      el.setAttribute("href", url);
    };

    // Update robots meta (noindex for 404, index for everything else)
    const updateRobots = (content: string) => {
      updateMetaByName("robots", content);
    };

    // Build canonical URL from current path (no query string, no hash)
    const currentUrl = `https://app.kawanua.id${window.location.pathname}`;
    updateCanonical(currentUrl);
    updateMetaByProperty("og:url", currentUrl);

    const is404 = (activeRoute?.handle as { is404?: boolean })?.is404;
    updateRobots(is404 ? "noindex, follow" : "index, follow");

    if (activeRoute?.handle) {
      const { title, description, keywords } = activeRoute.handle as {
        title?: string;
        description?: string;
        keywords?: string;
      };

      if (title) {
        const fullTitle = `${title} - App Kawanua`;
        document.title = fullTitle;
        updateMetaByName("title", fullTitle);
        updateMetaByProperty("og:title", fullTitle);
        updateMetaByName("twitter:title", fullTitle);
      }

      if (description) {
        updateMetaByName("description", description);
        updateMetaByProperty("og:description", description);
        updateMetaByName("twitter:description", description);
      }

      if (keywords) {
        updateMetaByName("keywords", keywords);
      }
    } else {
      // Fallback defaults (e.g. root layout without handle)
      const defaultTitle = "App Kawanua";
      const defaultDesc =
        "Aplikasi Kawanua terbaik untuk kebutuhan Anda dari Kawanua Indo Digital.";
      const defaultKeywords =
        "app kawanua, tools kawanua, aplikasi utilitas, web tools";

      document.title = defaultTitle;
      updateMetaByName("title", defaultTitle);
      updateMetaByProperty("og:title", defaultTitle);
      updateMetaByName("twitter:title", defaultTitle);

      updateMetaByName("description", defaultDesc);
      updateMetaByProperty("og:description", defaultDesc);
      updateMetaByName("twitter:description", defaultDesc);

      updateMetaByName("keywords", defaultKeywords);
    }
  }, [matches]);

  return <Outlet />;
}

export const router = createBrowserRouter([
  {
    element: <RootMetaLayout />,
    children: [
      {
        path: "/",
        element: <Page />,
        children: [
          {
            index: true,
            element: <DashboardPage />,
            handle: {
              title: "Home",
              description:
                "Kawanua ID Apps adalah kumpulan aplikasi untuk membantu Anda dalam berbagai hal.",
              keywords:
                "kawanua id, aplikasi kawanua, kumpulan aplikasi, tools, utilitas",
            },
          },
          {
            path: "image-optimizer",
            element: <ImageOptimizerPage />,
            handle: getMeta("image-optimizer"),
          },
          {
            path: "qrcode",
            element: <QrCodePage />,
            handle: getMeta("qrcode"),
          },
          {
            path: "passgen",
            element: <PassGenPage />,
            handle: getMeta("passgen"),
          },
          {
            path: "urlscanner",
            element: <UrlScannerPage />,
            handle: getMeta("urlscanner"),
          },
          // {
          //   path: "whois",
          //   element: <WhoisPage />,
          //   handle: getMeta("whois"),
          // },
          {
            path: "passcheck",
            element: <PassCheckPage />,
            handle: getMeta("passcheck"),
          },
          {
            path: "color-converter",
            element: <ColorConverterPage />,
            handle: getMeta("color-converter"),
          },
          {
            path: "bmi-calculator",
            element: <BmiCalculatorPage />,
            handle: getMeta("bmi-calculator"),
          },
          {
            path: "meta-tag-preview",
            element: <MetaTagReviewPage />,
            handle: getMeta("meta-tag-preview"),
          },
          {
            path: "base64",
            element: <Base64Page />,
            handle: getMeta("base64"),
          },
          {
            path: "hashgen",
            element: <HashGenPage />,
            handle: getMeta("hashgen"),
          },
          {
            path: "uuidgen",
            element: <UuidGenPage />,
            handle: getMeta("uuidgen"),
          },
          {
            path: "jwtdecoder",
            element: <JwtDecoderPage />,
            handle: getMeta("jwtdecoder"),
          },
          {
            path: "pagespeed",
            element: <PageSpeedPage />,
            handle: getMeta("pagespeed"),
          },
          {
            path: "domainlookup",
            element: <DomainLookupPage />,
            handle: getMeta("domainlookup"),
          },
          {
            path: "timestamp",
            element: <TimestampPage />,
            handle: getMeta("timestamp"),
          },
          {
            path: "filechecksum",
            element: <FileChecksumPage />,
            handle: getMeta("filechecksum"),
          },
          {
            path: "jsoncsv",
            element: <JsonCsvPage />,
            handle: getMeta("jsoncsv"),
          },
          {
            path: "regex-tester",
            element: <RegexTesterPage />,
            handle: getMeta("regex-tester"),
          },
          {
            path: "markdown-preview",
            element: <MarkdownPreviewPage />,
            handle: getMeta("markdown-preview"),
          },
          {
            path: "favicon-generator",
            element: <FaviconGenPage />,
            handle: getMeta("favicon-generator"),
          },
          {
            path: "color-palette-picker",
            element: <ColorPaletteGeneratorPage />,
            handle: getMeta("color-palette-picker"),
          },
          {
            path: "seo-metatag-generator",
            element: <SeoMetatagGenPage />,
            handle: getMeta("seo-metatag-generator"),
          },
          {
            path: "unit-converters",
            element: <UnitConverterPage />,
            handle: getMeta("unit-converters"),
          },
          {
            path: "tailwindcss-color-converter",
            element: <TailwindColorPage />,
            handle: getMeta("tailwindcss-color-converter"),
          },
          {
            path: "image-placeholder",
            element: <ImagePlaceholderPage />,
            handle: getMeta("image-placeholder"),
          },
          {
            path: "*",
            element: <NotFound />,
            handle: {
              title: "404 Not Found",
              description: "Halaman tidak ditemukan.",
              keywords: "404, not found, halaman tidak ditemukan",
              is404: true,
            },
          },
        ],
      },
    ],
  },
]);
