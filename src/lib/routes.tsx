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

    const is404 = activeRoute?.id === "0-1"; // the "*" route
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
            handle: {
              title: "Image Optimizer",
              description: "Kompres & optimalkan gambar langsung di browser.",
              keywords:
                "image optimizer, kompres gambar, compress image, optimize image, png, jpg, webp",
            },
          },
          {
            path: "qrcode",
            element: <QrCodePage />,
            handle: {
              title: "QR Code Generator",
              description: "Generate QR code dari teks atau URL apapun.",
              keywords: "qr code generator, buat qr code, qr code",
            },
          },
          {
            path: "passgen",
            element: <PassGenPage />,
            handle: {
              title: "Password Generator",
              description: "Buat password kuat & acak secara instan.",
              keywords:
                "password generator, random password, buat password kuat",
            },
          },
          {
            path: "urlscanner",
            element: <UrlScannerPage />,
            handle: {
              title: "URL Scanner",
              description: "Scan URL for potential web vulnerabilities.",
              keywords:
                "url scanner, scan url, cek url, web vulnerabilities, cek keamanan web",
            },
          },
          {
            path: "whois",
            element: <WhoisPage />,
            handle: {
              title: "WHOIS Lookup",
              description: "Cek ketersediaan domain dan informasi registrar.",
              keywords:
                "whois lookup, cek domain, domain info, whois, domain availability",
            },
          },
          {
            path: "passcheck",
            element: <PassCheckPage />,
            handle: {
              title: "Password Checker",
              description: "Cek apakah password kamu pernah bocor.",
              keywords:
                "password checker, cek bocor password, pwned, data breach",
            },
          },
          {
            path: "color-converter",
            element: <ColorConverterPage />,
            handle: {
              title: "Color Converter",
              description:
                "Konversi warna antara HEX, RGB, HSL, OKLCH, HWB, CMYK.",
              keywords:
                "color converter, hex, rgb, hsl, oklch, hwb, cmyk, konversi warna",
            },
          },
          {
            path: "bmi-calculator",
            element: <BmiCalculatorPage />,
            handle: {
              title: "BMI Calculator",
              description:
                "Kalkulator BMI untuk menghitung indeks massa tubuh.",
              keywords:
                "bmi calculator, kalkulator bmi, ideal weight, berat badan ideal",
            },
          },
          {
            path: "meta-tag-preview",
            element: <MetaTagReviewPage />,
            handle: {
              title: "Meta Tag Preview",
              description: "Review meta tag dari URL apapun.",
              keywords:
                "meta tag preview, seo, review meta tag, og tag, twitter card",
            },
          },
          {
            path: "base64",
            element: <Base64Page />,
            handle: {
              title: "Base64 Studio",
              description:
                "Encode dan decode base64 dari teks atau URL apapun.",
              keywords:
                "base64, encode base64, decode base64, base64 converter",
            },
          },
          {
            path: "hashgen",
            element: <HashGenPage />,
            handle: {
              title: "Hash Generator",
              description: "Generate hash dari teks atau URL apapun.",
              keywords:
                "hash generator, md5, sha1, sha256, sha512, bcrypt, pembuat hash",
            },
          },
          {
            path: "uuidgen",
            element: <UuidGenPage />,
            handle: {
              title: "UUID Generator",
              description: "Generate UUID dari teks atau URL apapun.",
              keywords: "uuid generator, guid, generate uuid, uuid v4",
            },
          },
          {
            path: "jwtdecoder",
            element: <JwtDecoderPage />,
            handle: {
              title: "JWT Decoder",
              description: "Decode, analisis dan verifikasi JSON Web Tokens.",
              keywords: "jwt decoder, json web token, jwt parser, verify jwt",
            },
          },
          {
            path: "pagespeed",
            element: <PageSpeedPage />,
            handle: {
              title: "PageSpeed Insights",
              description:
                "Analisis performa website Anda, aksesibilitas, dan SEO dalam hitungan detik.",
              keywords:
                "pagespeed insights, core web vitals, speed test, analisis performa website",
            },
          },
          {
            path: "domainlookup",
            element: <DomainLookupPage />,
            handle: {
              title: "Domain Lookup",
              description: "Cek ketersediaan domain dan informasi registrar.",
              keywords: "domain lookup, cek domain, registrar, rdap",
            },
          },
          {
            path: "timestamp",
            element: <TimestampPage />,
            handle: {
              title: "Timestamp Converter",
              description: "Konversi tanggal dan waktu ke format timestamp.",
              keywords:
                "timestamp converter, epoch, unix timestamp, konversi waktu",
            },
          },
          {
            path: "filechecksum",
            element: <FileChecksumPage />,
            handle: {
              title: "File Checksum",
              description: "Generate checksum dari file.",
              keywords: "file checksum, md5 file, sha256 file, verifikasi file",
            },
          },
          {
            path: "jsoncsv",
            element: <JsonCsvPage />,
            handle: {
              title: "JSON to CSV",
              description: "Konversi JSON ke CSV dan sebaliknya.",
              keywords:
                "json to csv, csv to json, json csv converter, konversi data",
            },
          },
          {
            path: "regex-tester",
            element: <RegexTesterPage />,
            handle: {
              title: "Regex Tester",
              description: "Uji ekspresi reguler Anda secara real-time.",
              keywords:
                "regex tester, regular expression, uji regex, regex parser",
            },
          },
          {
            path: "markdown-preview",
            element: <MarkdownPreviewPage />,
            handle: {
              title: "Markdown Preview",
              description: "Tampilkan hasil markdown secara real-time.",
              keywords: "markdown preview, markdown editor, real-time markdown",
            },
          },
          {
            path: "favicon-generator",
            element: <FaviconGenPage />,
            handle: {
              title: "Favicon Generator",
              description:
                "Buat favicon untuk website Anda dengan mudah dan cepat.",
              keywords: "favicon generator, buat favicon, ico, icon website",
            },
          },
          {
            path: "color-palette-picker",
            element: <ColorPaletteGeneratorPage />,
            handle: {
              title: "Color Palette Picker",
              description:
                "Ekstrak palette warna secara mudah dan cepat dari gambar.",
              keywords:
                "color palette picker, ekstrak warna dari gambar, image to palette",
            },
          },
          {
            path: "seo-metatag-generator",
            element: <SeoMetatagGenPage />,
            handle: {
              title: "SEO Meta Tag Generator",
              description:
                "Buat meta tag yang optimal untuk SEO website Anda dengan mudah dan cepat.",
              keywords:
                "seo meta tag generator, buat meta tag, meta description, seo tools",
            },
          },
          {
            path: "unit-converters",
            element: <UnitConverterPage />,
            handle: {
              title: "Unit Converters",
              description:
                "Konversi berbagai jenis satuan dalam satu platform.",
              keywords:
                "unit converter, konversi satuan, satuan, konversi, digital storage, time, data transfer rate, length metric, length imperial, area metric, area imperial, volume metric, volume imperial, mass metric, mass imperial, temperature, speed, pressure, energy, power, frequency, angle, currency",
            },
          },
        ],
      },
      {
        path: "*",
        element: <NotFound />,
        handle: {
          title: "404 Not Found",
          description: "Halaman tidak ditemukan.",
          keywords: "404, not found, halaman tidak ditemukan",
        },
      },
    ],
  },
]);
