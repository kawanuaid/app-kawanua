import { MetaData } from "@/types/seometatag";

export default function generateMetaTags(meta: MetaData): string {
  const lines: string[] = [];

  lines.push(`<!-- Primary Meta Tags -->`);
  if (meta.charset) {
    lines.push(`<meta charset="${meta.charset}" />`);
  }
  if (meta.viewport) {
    lines.push(`<meta name="viewport" content="${meta.viewport}" />`);
  }
  if (meta.title) {
    lines.push(`<title>${meta.title}</title>`);
  }
  if (meta.description) {
    lines.push(`<meta name="description" content="${meta.description}" />`);
  }
  if (meta.keywords) {
    lines.push(`<meta name="keywords" content="${meta.keywords}" />`);
  }
  if (meta.author) {
    lines.push(`<meta name="author" content="${meta.author}" />`);
  }
  if (meta.robots) {
    lines.push(`<meta name="robots" content="${meta.robots}" />`);
  }
  if (meta.contentType) {
    lines.push(
      `<meta http-equiv="Content-Type" content="text/html; charset=${meta.charset || "UTF-8"}" />`,
    );
  }
  if (meta.generator) {
    lines.push(`<meta name="generator" content="${meta.generator}" />`);
  }
  if (meta.canonicalUrl) {
    lines.push(`<link rel="canonical" href="${meta.canonicalUrl}" />`);
  }
  if (meta.pageLanguage) {
    lines.push(
      `<meta http-equiv="content-language" content="${meta.pageLanguage}" />`,
    );
  }

  // Favicon
  if (meta.faviconUrl) {
    lines.push(``);
    lines.push(`<!-- Favicon -->`);
    lines.push(
      `<link rel="icon" type="image/x-icon" href="${meta.faviconUrl}" />`,
    );
  }
  if (meta.appleTouchIcon) {
    lines.push(`<link rel="apple-touch-icon" href="${meta.appleTouchIcon}" />`);
  }

  // Theme Color
  if (meta.themeColor) {
    lines.push(``);
    lines.push(`<!-- Theme Color -->`);
    lines.push(`<meta name="theme-color" content="${meta.themeColor}" />`);
  }

  // Open Graph
  const hasOg =
    meta.ogTitle ||
    meta.ogDescription ||
    meta.ogImage ||
    meta.ogUrl ||
    meta.ogType ||
    meta.ogSiteName;
  if (hasOg) {
    lines.push(``);
    lines.push(`<!-- Open Graph / Facebook -->`);
    if (meta.ogType) {
      lines.push(`<meta property="og:type" content="${meta.ogType}" />`);
    }
    if (meta.ogTitle) {
      lines.push(`<meta property="og:title" content="${meta.ogTitle}" />`);
    }
    if (meta.ogDescription) {
      lines.push(
        `<meta property="og:description" content="${meta.ogDescription}" />`,
      );
    }
    if (meta.ogUrl) {
      lines.push(`<meta property="og:url" content="${meta.ogUrl}" />`);
    }
    if (meta.ogImage) {
      lines.push(`<meta property="og:image" content="${meta.ogImage}" />`);
    }
    if (meta.ogSiteName) {
      lines.push(
        `<meta property="og:site_name" content="${meta.ogSiteName}" />`,
      );
    }
    if (meta.ogLocale) {
      lines.push(`<meta property="og:locale" content="${meta.ogLocale}" />`);
    }
  }

  // Twitter
  const hasTwitter =
    meta.twitterCard ||
    meta.twitterTitle ||
    meta.twitterDescription ||
    meta.twitterImage ||
    meta.twitterSite ||
    meta.twitterCreator;
  if (hasTwitter) {
    lines.push(``);
    lines.push(`<!-- Twitter -->`);
    if (meta.twitterCard) {
      lines.push(`<meta name="twitter:card" content="${meta.twitterCard}" />`);
    }
    if (meta.twitterTitle) {
      lines.push(
        `<meta name="twitter:title" content="${meta.twitterTitle}" />`,
      );
    }
    if (meta.twitterDescription) {
      lines.push(
        `<meta name="twitter:description" content="${meta.twitterDescription}" />`,
      );
    }
    if (meta.twitterImage) {
      lines.push(
        `<meta name="twitter:image" content="${meta.twitterImage}" />`,
      );
    }
    if (meta.twitterSite) {
      lines.push(`<meta name="twitter:site" content="${meta.twitterSite}" />`);
    }
    if (meta.twitterCreator) {
      lines.push(
        `<meta name="twitter:creator" content="${meta.twitterCreator}" />`,
      );
    }
  }

  return lines.join("\n");
}
