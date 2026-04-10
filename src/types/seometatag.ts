export interface MetaData {
  // Basic
  title: string;
  description: string;
  keywords: string;
  author: string;
  canonicalUrl: string;
  robots: string;
  contentType: string;
  pageLanguage: string;

  // Open Graph
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogUrl: string;
  ogType: string;
  ogSiteName: string;
  ogLocale: string;

  // Twitter
  twitterCard: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  twitterSite: string;
  twitterCreator: string;

  // Advanced
  themeColor: string;
  faviconUrl: string;
  appleTouchIcon: string;
  viewport: string;
  charset: string;
  generator: string;
}
