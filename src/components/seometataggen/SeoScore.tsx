import { useState, useMemo, useCallback } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ChevronDown,
  ShieldCheck,
  TrendingUp,
  Lightbulb,
  FileText,
  Globe,
  Wrench,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import TwitterIcon from "./TwitterIcon";

// ---------- MetaData Interface (mirrors App.tsx) ----------
interface MetaData {
  title: string;
  description: string;
  keywords: string;
  author: string;
  canonicalUrl: string;
  robots: string;
  contentType: string;
  pageLanguage: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogUrl: string;
  ogType: string;
  ogSiteName: string;
  ogLocale: string;
  twitterCard: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  twitterSite: string;
  twitterCreator: string;
  themeColor: string;
  faviconUrl: string;
  appleTouchIcon: string;
  viewport: string;
  charset: string;
  generator: string;
}

// ---------- Types ----------
type CheckStatus = "pass" | "warning" | "fail";

interface SEOCheck {
  id: string;
  label: string;
  category: "basic" | "opengraph" | "twitter" | "technical";
  status: CheckStatus;
  weight: number;
  priority: "critical" | "important" | "optional";
  tip: string;
  recommendation: string;
  howToFix: string;
  impact: string;
}

interface CategoryMeta {
  label: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
}

const CATEGORY_META: Record<string, CategoryMeta> = {
  basic: {
    label: "Basic Meta Tags",
    icon: <FileText className="w-4 h-4" />,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  opengraph: {
    label: "Open Graph / Social",
    icon: <Globe className="w-4 h-4" />,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-200",
  },
  twitter: {
    label: "Twitter / X Card",
    icon: <TwitterIcon className="w-4 h-4" />,
    color: "text-sky-600",
    bgColor: "bg-sky-50",
    borderColor: "border-sky-200",
  },
  technical: {
    label: "Technical SEO",
    icon: <Wrench className="w-4 h-4" />,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
  },
};

// ---------- Helper ----------
function isValidUrl(s: string): boolean {
  try {
    new URL(s);
    return true;
  } catch {
    return false;
  }
}

// ---------- Evaluate SEO ----------
function evaluateSEO(meta: MetaData): SEOCheck[] {
  const checks: SEOCheck[] = [];

  // ===== BASIC =====

  // 1. Page Title — exists
  if (!meta.title.trim()) {
    checks.push({
      id: "title-exists",
      label: "Page Title",
      category: "basic",
      status: "fail",
      weight: 3,
      priority: "critical",
      tip: "Tag Title tidak ada",
      recommendation:
        "The <title> tag is the single most important on-page SEO element. It tells search engines and users what your page is about. Without it, Google will generate a title from your page content, which is often not optimal.",
      howToFix:
        'Enter a descriptive, keyword-rich title in the "Page Title" field under the Basic tab. Place your primary keyword near the beginning.',
      impact:
        "Pages with optimized title tags get significantly higher CTR from search results. Missing titles can severely harm rankings.",
    });
  } else if (meta.title.length < 30) {
    checks.push({
      id: "title-short",
      label: "Panjang Page Title",
      category: "basic",
      status: "warning",
      weight: 3,
      priority: "important",
      tip: `Title is too short (${meta.title.length} chars — aim for 30–60)`,
      recommendation:
        "Titles under 30 characters waste valuable space in search results. You're missing an opportunity to include additional keywords and make the title more compelling.",
      howToFix:
        "Expand your title to 30–60 characters. Add descriptive words, your brand name, or secondary keywords. Example: 'Best Coffee Machines 2024 — Top 10 Reviews & Buying Guide'",
      impact:
        "Optimal title length can improve CTR by up to 20-30% compared to very short titles.",
    });
  } else if (meta.title.length > 60) {
    checks.push({
      id: "title-long",
      label: "Page Title Length",
      category: "basic",
      status: "warning",
      weight: 3,
      priority: "important",
      tip: `Title may be truncated in search results (${meta.title.length}/60 chars)`,
      recommendation:
        "Google typically shows 50–60 characters of a title tag. Anything beyond that gets cut off with '...', potentially losing important information and reducing click-through rates.",
      howToFix:
        "Shorten your title to under 60 characters. Put the most important keywords first. Move your brand name to the end if needed.",
      impact:
        "Truncated titles can reduce CTR by 10-15%. Users may skip results where they can't read the full title.",
    });
  } else {
    checks.push({
      id: "title-good",
      label: "Page Title Length",
      category: "basic",
      status: "pass",
      weight: 3,
      priority: "critical",
      tip: `Excellent title length (${meta.title.length} chars)`,
      recommendation:
        "Your title length is within the optimal 30–60 character range. Make sure it includes your primary keyword, is compelling, and accurately describes the page content.",
      howToFix:
        "Consider A/B testing different title variations to find the one with highest CTR. Use emotionally engaging words, numbers, or questions.",
      impact:
        "A well-crafted title in the optimal length range maximizes your search result visibility and click-through rate.",
    });
  }

  // 2. Meta Description
  if (!meta.description.trim()) {
    checks.push({
      id: "desc-exists",
      label: "Meta Description",
      category: "basic",
      status: "fail",
      weight: 3,
      priority: "critical",
      tip: "Meta description is missing",
      recommendation:
        "The meta description is your 'ad copy' in search results. Without it, Google will auto-generate a snippet from your page content, which may not be compelling or relevant. A well-written description can significantly increase click-through rates.",
      howToFix:
        'Write a compelling 150-160 character description in the "Meta Description" field. Include your primary keyword, a clear value proposition, and a call-to-action.',
      impact:
        "Pages with custom meta descriptions can see 5-30% higher CTR compared to auto-generated snippets.",
    });
  } else if (meta.description.length < 120) {
    checks.push({
      id: "desc-short",
      label: "Meta Description Length",
      category: "basic",
      status: "warning",
      weight: 3,
      priority: "important",
      tip: `Description is too short (${meta.description.length} chars — aim for 120–160)`,
      recommendation:
        "Short descriptions under 120 characters don't take full advantage of the space Google provides. You're missing an opportunity to persuade users to click.",
      howToFix:
        "Expand your description to 150-160 characters. Add more detail about what users will find, include a call-to-action like 'Learn more' or 'Get started today'.",
      impact:
        "Fully utilizing the description space gives users more reasons to click, potentially increasing CTR by 15-20%.",
    });
  } else if (meta.description.length > 160) {
    checks.push({
      id: "desc-long",
      label: "Meta Description Length",
      category: "basic",
      status: "warning",
      weight: 3,
      priority: "important",
      tip: `Description may be truncated (${meta.description.length}/160 chars)`,
      recommendation:
        "Google truncates descriptions over 155-160 characters with '...'. Your carefully crafted CTA or key information at the end may not be visible.",
      howToFix:
        "Trim your description to 150-160 characters. Put the most important information and your call-to-action within the first 150 characters.",
      impact:
        "Truncated descriptions lose their ending, which is often where the CTA sits. This can reduce CTR by 5-10%.",
    });
  } else {
    checks.push({
      id: "desc-good",
      label: "Meta Description Length",
      category: "basic",
      status: "pass",
      weight: 3,
      priority: "critical",
      tip: `Perfect description length (${meta.description.length} chars)`,
      recommendation:
        "Your description is in the sweet spot. Make sure it includes your primary keyword naturally, clearly describes the page content, and entices users to click.",
      howToFix:
        "Consider testing different phrasing to improve CTR. Use action verbs, unique selling points, and emotional triggers.",
      impact:
        "An optimized description fully utilizes the available space, maximizing your chance of earning the click.",
    });
  }

  // 3. Canonical URL
  if (!meta.canonicalUrl.trim()) {
    checks.push({
      id: "canonical",
      label: "Canonical URL",
      category: "basic",
      status: "fail",
      weight: 2,
      priority: "important",
      tip: "Canonical URL is not set",
      recommendation:
        "The canonical tag tells search engines which version of a URL is the 'master' copy. Without it, search engines may index multiple versions of the same page (http vs https, www vs non-www, with/without trailing slash), causing duplicate content issues that dilute your ranking power.",
      howToFix:
        'Enter the preferred, full URL of your page (including https://) in the "Canonical URL" field under the Basic tab.',
      impact:
        "Proper canonicalization consolidates link equity and prevents duplicate content penalties.",
    });
  } else if (!isValidUrl(meta.canonicalUrl)) {
    checks.push({
      id: "canonical-invalid",
      label: "Canonical URL Format",
      category: "basic",
      status: "warning",
      weight: 2,
      priority: "important",
      tip: "Canonical URL doesn't appear to be a valid URL",
      recommendation:
        "The canonical URL must be a fully qualified, absolute URL including the protocol (https://). Invalid URLs are ignored by search engines.",
      howToFix:
        'Make sure your canonical URL starts with "https://" and is a valid, complete URL.',
      impact:
        "An invalid canonical URL provides no benefit and may cause search engines to ignore it entirely.",
    });
  } else {
    checks.push({
      id: "canonical-good",
      label: "Canonical URL",
      category: "basic",
      status: "pass",
      weight: 2,
      priority: "important",
      tip: "Canonical URL is set",
      recommendation:
        "Your canonical URL is properly set. Make sure it matches the page's preferred URL exactly (including www vs non-www, http vs https).",
      howToFix:
        "Verify the canonical URL matches your actual live page URL and uses HTTPS.",
      impact:
        "Proper canonicalization prevents duplicate content issues and consolidates ranking signals.",
    });
  }

  // 4. Keywords
  if (!meta.keywords.trim()) {
    checks.push({
      id: "keywords",
      label: "Meta Keywords",
      category: "basic",
      status: "warning",
      weight: 1,
      priority: "optional",
      tip: "Keywords meta tag is empty",
      recommendation:
        "While Google officially ignores the meta keywords tag (since 2009), some search engines like Bing, Yahoo, and Yandex may still reference it. It's a low-effort addition that won't hurt and might provide marginal benefit. More importantly, defining your keywords helps you stay focused on your page's topic.",
      howToFix:
        'Enter 5-10 relevant keywords in the "Keywords" field, separated by commas. Focus on terms users actually search for.',
      impact:
        "Low direct impact on Google rankings, but useful for content focus and potentially beneficial on other search engines.",
    });
  } else {
    const kwCount = meta.keywords.split(",").filter((k) => k.trim()).length;
    checks.push({
      id: "keywords-good",
      label: "Meta Keywords",
      category: "basic",
      status: "pass",
      weight: 1,
      priority: "optional",
      tip: `${kwCount} keywords defined`,
      recommendation:
        kwCount > 10
          ? "You have more than 10 keywords. Consider focusing on 5-10 most relevant ones to avoid keyword dilution."
          : "Good keyword count. Make sure they are relevant to your page content and match what users search for.",
      howToFix:
        kwCount > 10
          ? "Remove less relevant keywords and focus on the top 5-10 that best represent your page."
          : "Consider using Google Search Console or keyword research tools to refine your keyword list.",
      impact:
        "Low direct SEO impact on Google, but helpful for content strategy and non-Google search engines.",
    });
  }

  // 5. Robots
  if (meta.robots.includes("noindex")) {
    checks.push({
      id: "robots-noindex",
      label: "Robots Directive",
      category: "basic",
      status: "warning",
      weight: 2,
      priority: "critical",
      tip: "⚠️ Page is set to 'noindex' — it won't appear in search results!",
      recommendation:
        "The noindex directive tells search engines NOT to include this page in their index. This means the page will not appear in any search results. This is intentional for pages like thank-you pages, admin areas, or staging sites, but a disaster if set accidentally on content you want found.",
      howToFix:
        'If this page should be findable in search, change the Robots setting to "Index, Follow" under the Basic tab.',
      impact:
        "A noindex tag will completely remove this page from search engine results. Verify this is intentional!",
    });
  } else {
    checks.push({
      id: "robots-good",
      label: "Robots Directive",
      category: "basic",
      status: "pass",
      weight: 2,
      priority: "important",
      tip: `Robots is set to "${meta.robots}"`,
      recommendation:
        "Your robots directive allows search engines to index and follow links on this page.",
      howToFix:
        "No action needed. Keep this setting unless you specifically want to block indexing.",
      impact:
        "Proper robots directives ensure search engines can crawl and index your content as intended.",
    });
  }

  // 6. Author
  if (!meta.author.trim()) {
    checks.push({
      id: "author",
      label: "Author Meta Tag",
      category: "basic",
      status: "warning",
      weight: 1,
      priority: "optional",
      tip: "Author tag is empty",
      recommendation:
        "The author meta tag helps establish content ownership and can contribute to E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) signals that Google evaluates. For articles and blog posts, this is especially valuable.",
      howToFix:
        'Enter the author\'s name or organization in the "Author" field under the Basic tab.',
      impact:
        "Indirect SEO benefit through E-E-A-T signals, especially for YMYL (Your Money Your Life) content.",
    });
  } else {
    checks.push({
      id: "author-good",
      label: "Author Meta Tag",
      category: "basic",
      status: "pass",
      weight: 1,
      priority: "optional",
      tip: `Author set: "${meta.author}"`,
      recommendation:
        "Good practice. Consider also adding structured data (Schema.org) author markup for enhanced search features.",
      howToFix:
        "Consider implementing Article schema markup with author information for even better SEO.",
      impact:
        "Contributes to trust signals and E-E-A-T, which can improve rankings for author-sensitive content.",
    });
  }

  // ===== OPEN GRAPH =====

  // 7. OG Title
  if (!meta.ogTitle.trim()) {
    checks.push({
      id: "og-title",
      label: "OG Title",
      category: "opengraph",
      status: "fail",
      weight: 2,
      priority: "important",
      tip: "OG Title is missing — social shares may not display a proper title",
      recommendation:
        "Without og:title, Facebook, LinkedIn, and other platforms will try to guess the title from your page content. This often results in incorrect or unappealing titles when your content is shared. A strong OG title can significantly increase engagement on social media.",
      howToFix:
        'Enter a title for social sharing in the "OG Title" field, or use the "Auto-fill OG & Twitter" button to copy your page title.',
      impact:
        "Pages with proper OG titles get 2-3x more engagement on social media compared to those without.",
    });
  } else {
    checks.push({
      id: "og-title-good",
      label: "OG Title",
      category: "opengraph",
      status: "pass",
      weight: 2,
      priority: "important",
      tip: `OG Title set (${meta.ogTitle.length} chars)`,
      recommendation:
        "Your OG title is set. Consider making it slightly different from your page title to be more engaging for social media audiences.",
      howToFix:
        "Test your URL with the Facebook Sharing Debugger to verify it renders correctly.",
      impact:
        "Proper OG titles ensure your content looks professional when shared on social platforms.",
    });
  }

  // 8. OG Description
  if (!meta.ogDescription.trim()) {
    checks.push({
      id: "og-desc",
      label: "OG Description",
      category: "opengraph",
      status: "fail",
      weight: 2,
      priority: "important",
      tip: "OG Description is missing — social shares won't show your intended description",
      recommendation:
        "Without og:description, social platforms will pull text from your page content, which may not be the most compelling or relevant text. You lose control over your content's first impression on social media.",
      howToFix:
        'Write a social-friendly description in the "OG Description" field, or use "Auto-fill OG & Twitter" to copy your meta description.',
      impact:
        "OG descriptions give you full control over how your content appears when shared on Facebook, LinkedIn, and other platforms.",
    });
  } else {
    checks.push({
      id: "og-desc-good",
      label: "OG Description",
      category: "opengraph",
      status: "pass",
      weight: 2,
      priority: "important",
      tip: `OG Description set (${meta.ogDescription.length} chars)`,
      recommendation:
        "Good. Craft your OG description to be more emotionally engaging than your meta description, as social media users have different intent than searchers.",
      howToFix:
        "Consider adding emojis or more casual language for social-friendly descriptions.",
      impact:
        "Proper OG descriptions increase click-through rates when content is shared on social media.",
    });
  }

  // 9. OG Image
  if (!meta.ogImage.trim()) {
    checks.push({
      id: "og-image",
      label: "OG Image",
      category: "opengraph",
      status: "fail",
      weight: 3,
      priority: "critical",
      tip: "OG Image is missing — social shares will have no visual preview!",
      recommendation:
        "This is one of the most impactful social meta tags. Posts with images get 2-3x more engagement than those without. Without an OG image, your content will appear as a plain text link when shared on Facebook, LinkedIn, Slack, Discord, and other platforms — drastically reducing visibility and click-through rates.",
      howToFix:
        'Upload a 1200×630px image to your server and enter the full URL in the "OG Image" field. Use an absolute URL (starting with https://).',
      impact:
        "Content with OG images gets up to 200-300% more engagement on social media. This is a critical social SEO element.",
    });
  } else if (!isValidUrl(meta.ogImage)) {
    checks.push({
      id: "og-image-url",
      label: "OG Image URL",
      category: "opengraph",
      status: "warning",
      weight: 3,
      priority: "critical",
      tip: "OG Image URL doesn't appear to be a valid URL",
      recommendation:
        "The OG image must be a fully qualified absolute URL. Relative URLs won't work for social media crawlers.",
      howToFix:
        'Make sure your OG image URL starts with "https://" and points directly to an image file (.jpg, .png, .webp).',
      impact: "Invalid image URLs result in broken previews on social media.",
    });
  } else {
    checks.push({
      id: "og-image-good",
      label: "OG Image",
      category: "opengraph",
      status: "pass",
      weight: 3,
      priority: "critical",
      tip: "OG Image URL is set",
      recommendation:
        "Your OG image is configured. For best results, use a 1200×630px image (1.91:1 aspect ratio) under 5MB. Facebook, LinkedIn, and Twitter all recommend this size. Use high-contrast, visually striking images with minimal text.",
      howToFix:
        "Test your URL with Facebook Sharing Debugger (developers.facebook.com/tools/debug/) and Twitter Card Validator to confirm the image renders correctly.",
      impact:
        "A properly configured OG image ensures maximum visual impact and engagement when your content is shared.",
    });
  }

  // 10. OG URL
  if (!meta.ogUrl.trim()) {
    checks.push({
      id: "og-url",
      label: "OG URL",
      category: "opengraph",
      status: "warning",
      weight: 1,
      priority: "optional",
      tip: "OG URL is not set",
      recommendation:
        "og:url helps social platforms identify the canonical URL of your content. It's especially useful if the same content can be accessed from multiple URLs (e.g., with different UTM parameters).",
      howToFix:
        'Set the OG URL to your page\'s canonical URL. You can use the "Auto-fill" button to copy it from the Basic tab.',
      impact:
        "Helps consolidate social engagement metrics (likes, shares, comments) to a single URL.",
    });
  } else {
    checks.push({
      id: "og-url-good",
      label: "OG URL",
      category: "opengraph",
      status: "pass",
      weight: 1,
      priority: "optional",
      tip: "OG URL is set",
      recommendation:
        "Good. Make sure the OG URL matches your canonical URL for consistency.",
      howToFix: "No action needed.",
      impact: "Ensures social engagement metrics are properly consolidated.",
    });
  }

  // 11. OG Site Name
  if (!meta.ogSiteName.trim()) {
    checks.push({
      id: "og-sitename",
      label: "OG Site Name",
      category: "opengraph",
      status: "warning",
      weight: 1,
      priority: "optional",
      tip: "OG Site Name is not set",
      recommendation:
        "og:site_name shows your brand/website name alongside shared content on Facebook and other platforms. It helps users identify the source and builds brand recognition.",
      howToFix:
        'Enter your website or brand name in the "OG Site Name" field, or use the Auto-fill button.',
      impact:
        "Builds brand recognition and trust when content is shared on social media.",
    });
  } else {
    checks.push({
      id: "og-sitename-good",
      label: "OG Site Name",
      category: "opengraph",
      status: "pass",
      weight: 1,
      priority: "optional",
      tip: `OG Site Name: "${meta.ogSiteName}"`,
      recommendation:
        "Good. Consistent branding across all OG tags reinforces brand recognition.",
      howToFix: "No action needed.",
      impact: "Consistent branding builds trust and recognition over time.",
    });
  }

  // ===== TWITTER =====

  // 12. Twitter Title
  if (!meta.twitterTitle.trim()) {
    checks.push({
      id: "tw-title",
      label: "Twitter Title",
      category: "twitter",
      status: "warning",
      weight: 2,
      priority: "important",
      tip: "Twitter Card title is missing — will fall back to OG or page title",
      recommendation:
        "While Twitter falls back to og:title and then <title>, having an explicit twitter:title gives you control over exactly what appears in Twitter/X feeds. You may want different phrasing for Twitter's audience.",
      howToFix:
        'Enter a title optimized for Twitter/X in the "Twitter Title" field, or use the Auto-fill button.',
      impact:
        "Explicit Twitter titles ensure your content looks perfect in Twitter/X feeds.",
    });
  } else {
    checks.push({
      id: "tw-title-good",
      label: "Twitter Title",
      category: "twitter",
      status: "pass",
      weight: 2,
      priority: "important",
      tip: `Twitter Card title set (${meta.twitterTitle.length} chars)`,
      recommendation:
        "Good. Twitter displays titles prominently, so keep them concise and attention-grabbing.",
      howToFix: "Test with Twitter Card Validator to confirm appearance.",
      impact:
        "Properly formatted Twitter cards get more engagement and retweets.",
    });
  }

  // 13. Twitter Description
  if (!meta.twitterDescription.trim()) {
    checks.push({
      id: "tw-desc",
      label: "Twitter Description",
      category: "twitter",
      status: "warning",
      weight: 2,
      priority: "important",
      tip: "Twitter Card description is missing",
      recommendation:
        "Without twitter:description, Twitter/X will use og:description or meta description as fallback. Having explicit Twitter descriptions ensures the exact text you want is displayed in card previews.",
      howToFix:
        'Enter a Twitter-optimized description in the "Twitter Description" field, or use Auto-fill.',
      impact:
        "Explicit descriptions give you full control over your content's appearance in Twitter feeds.",
    });
  } else {
    checks.push({
      id: "tw-desc-good",
      label: "Twitter Description",
      category: "twitter",
      status: "pass",
      weight: 2,
      priority: "important",
      tip: `Twitter description set (${meta.twitterDescription.length} chars)`,
      recommendation:
        "Good. Keep Twitter descriptions concise and engaging. Use hashtags sparingly in the card description.",
      howToFix: "No action needed.",
      impact:
        "Well-crafted Twitter descriptions increase engagement and click-through from Twitter/X.",
    });
  }

  // 14. Twitter Image
  if (!meta.twitterImage.trim() && !meta.ogImage.trim()) {
    checks.push({
      id: "tw-image",
      label: "Twitter Card Image",
      category: "twitter",
      status: "fail",
      weight: 2,
      priority: "important",
      tip: "No image set for Twitter Card — card will have no visual preview",
      recommendation:
        "Twitter/X cards without images are much less engaging. The large_image card type needs a 1200×600px+ image for best display. Without an image, your tweet with a link will look like plain text, dramatically reducing engagement.",
      howToFix:
        'Add an image URL in the "Twitter Image" field, or set an OG Image (Twitter falls back to it). Use 1200×600px for summary_large_image.',
      impact:
        "Tweets with image cards get 150%+ more engagement than plain text links.",
    });
  } else if (!meta.twitterImage.trim() && meta.ogImage.trim()) {
    checks.push({
      id: "tw-image-fallback",
      label: "Twitter Card Image",
      category: "twitter",
      status: "pass",
      weight: 2,
      priority: "important",
      tip: "Using OG Image as fallback for Twitter",
      recommendation:
        "Twitter will use your OG image, which works fine. However, note that Twitter large_image cards prefer 2:1 aspect ratio (1200×600px), while OG uses 1.91:1 (1200×630px). If pixel-perfect display matters, set a dedicated Twitter image.",
      howToFix:
        "For optimal display, consider adding a dedicated Twitter image with exact 1200×600px dimensions.",
      impact:
        "The OG fallback works, but a dedicated Twitter-optimized image ensures perfect display.",
    });
  } else {
    checks.push({
      id: "tw-image-good",
      label: "Twitter Card Image",
      category: "twitter",
      status: "pass",
      weight: 2,
      priority: "important",
      tip: "Twitter Card image is set",
      recommendation:
        "Your Twitter image is configured. For summary_large_image cards, the recommended size is 1200×600px (2:1 ratio). Files must be under 5MB.",
      howToFix:
        "Test with Twitter Card Validator to verify the image renders correctly.",
      impact:
        "A proper Twitter image card dramatically increases visual appeal and engagement on Twitter/X.",
    });
  }

  // 15. Twitter Site
  if (!meta.twitterSite.trim()) {
    checks.push({
      id: "tw-site",
      label: "Twitter Site Handle",
      category: "twitter",
      status: "warning",
      weight: 1,
      priority: "optional",
      tip: "Twitter site handle (@username) is not set",
      recommendation:
        "The twitter:site tag associates your content with your brand's Twitter account. When someone shares your URL, Twitter may display this account as the source. It also helps Twitter attribute content correctly.",
      howToFix:
        'Enter your brand\'s Twitter handle (e.g., @yoursite) in the "Twitter Site" field under the Twitter tab.',
      impact:
        "Builds brand attribution and can increase Twitter followers when content is shared.",
    });
  } else {
    checks.push({
      id: "tw-site-good",
      label: "Twitter Site Handle",
      category: "twitter",
      status: "pass",
      weight: 1,
      priority: "optional",
      tip: `Site handle: ${meta.twitterSite}`,
      recommendation:
        "Good. Make sure the handle is active and represents the correct brand account.",
      howToFix: "No action needed.",
      impact: "Proper attribution increases brand visibility on Twitter/X.",
    });
  }

  // ===== TECHNICAL =====

  // 16. Favicon
  if (!meta.faviconUrl.trim()) {
    checks.push({
      id: "favicon",
      label: "Favicon",
      category: "technical",
      status: "warning",
      weight: 2,
      priority: "important",
      tip: "Favicon is not configured",
      recommendation:
        "A favicon is the small icon displayed in browser tabs, bookmarks, and history. Without it, browsers show a default generic icon, making your site look unprofessional. Favicons also appear in search results on mobile, helping users identify your site.",
      howToFix:
        'Create a favicon.ico file (32×32 or 16×16) and a favicon.png (32×32), upload it to your server, and enter the URL in the "Favicon URL" field.',
      impact:
        "Favicons improve brand recognition, professional appearance, and are a trust signal for users.",
    });
  } else {
    checks.push({
      id: "favicon-good",
      label: "Favicon",
      category: "technical",
      status: "pass",
      weight: 2,
      priority: "important",
      tip: "Favicon URL is set",
      recommendation:
        "Good. Modern best practice is to provide multiple sizes: favicon.ico (16×16, 32×32), favicon-32x32.png, favicon-16x16.png, and site.webmanifest for Android. Consider adding apple-touch-icon.png as well.",
      howToFix:
        "Consider using a favicon generator tool to create all required sizes from one source image.",
      impact:
        "A complete favicon setup ensures your brand looks great across all devices and browsers.",
    });
  }

  // 17. Apple Touch Icon
  if (!meta.appleTouchIcon.trim()) {
    checks.push({
      id: "apple-touch",
      label: "Apple Touch Icon",
      category: "technical",
      status: "warning",
      weight: 1,
      priority: "optional",
      tip: "Apple Touch Icon is not set",
      recommendation:
        "When iOS users add your website to their home screen, the Apple Touch Icon is used as the app icon. Without it, iOS generates a generic screenshot thumbnail, which looks unprofessional and is harder to identify.",
      howToFix:
        'Create a 180×180px PNG image and enter its URL in the "Apple Touch Icon" field under the Advanced tab.',
      impact:
        "Improves the experience for iOS users who bookmark your site to their home screen.",
    });
  } else {
    checks.push({
      id: "apple-touch-good",
      label: "Apple Touch Icon",
      category: "technical",
      status: "pass",
      weight: 1,
      priority: "optional",
      tip: "Apple Touch Icon is configured",
      recommendation:
        "Good. Make sure it's 180×180px for the best display on all iOS devices.",
      howToFix: "No action needed.",
      impact: "Provides a polished experience for iOS home screen bookmarks.",
    });
  }

  // 18. Viewport
  if (!meta.viewport.trim()) {
    checks.push({
      id: "viewport",
      label: "Viewport Meta",
      category: "technical",
      status: "fail",
      weight: 2,
      priority: "critical",
      tip: "Viewport meta tag is missing!",
      recommendation:
        "The viewport meta tag is essential for responsive design. Without it, mobile browsers render the page at desktop width and scale down, making text tiny and requiring pinch-to-zoom. Google uses mobile-first indexing, so this directly impacts your mobile rankings.",
      howToFix:
        'Set viewport to "width=device-width, initial-scale=1.0" in the Advanced tab. This is the standard setting that works for almost all websites.',
      impact:
        "Missing viewport tags cause a 'mobile-friendly' test failure, which can hurt mobile search rankings.",
    });
  } else if (!meta.viewport.includes("width=device-width")) {
    checks.push({
      id: "viewport-suboptimal",
      label: "Viewport Configuration",
      category: "technical",
      status: "warning",
      weight: 2,
      priority: "critical",
      tip: "Viewport may not be configured optimally for mobile",
      recommendation:
        "The standard viewport setting is 'width=device-width, initial-scale=1.0'. Non-standard configurations may cause unexpected behavior on mobile devices.",
      howToFix:
        'Use "width=device-width, initial-scale=1.0" unless you have a specific reason for a custom configuration.',
      impact:
        "Proper viewport configuration is required for Google's mobile-first indexing.",
    });
  } else {
    checks.push({
      id: "viewport-good",
      label: "Viewport Meta",
      category: "technical",
      status: "pass",
      weight: 2,
      priority: "critical",
      tip: "Viewport is properly configured for responsive design",
      recommendation:
        "Your viewport is set to the standard configuration. This ensures your page renders correctly on all devices.",
      howToFix: "No action needed.",
      impact:
        "Proper viewport setup is a prerequisite for passing Google's mobile-friendly test.",
    });
  }

  // 19. Charset
  if (!meta.charset.trim()) {
    checks.push({
      id: "charset",
      label: "Character Encoding",
      category: "technical",
      status: "warning",
      weight: 1,
      priority: "important",
      tip: "Charset declaration is missing",
      recommendation:
        "The charset declaration tells browsers how to interpret the characters on your page. Without it, special characters (é, ü, 中文字, emoji) may display incorrectly. UTF-8 supports virtually all characters and is the web standard.",
      howToFix:
        'Set charset to "UTF-8" in the Advanced tab. This is the recommended encoding for all websites.',
      impact:
        "Missing charset can cause garbled text, especially for non-English content and emoji.",
    });
  } else {
    checks.push({
      id: "charset-good",
      label: "Character Encoding",
      category: "technical",
      status: "pass",
      weight: 1,
      priority: "important",
      tip: `Charset set to ${meta.charset}`,
      recommendation:
        meta.charset === "UTF-8"
          ? "UTF-8 is the recommended encoding. It supports all languages and special characters."
          : "Consider using UTF-8 for maximum compatibility with all characters and languages.",
      howToFix:
        meta.charset === "UTF-8"
          ? "No action needed."
          : "Switch to UTF-8 for best compatibility.",
      impact:
        "Proper charset ensures all text renders correctly across all browsers and devices.",
    });
  }

  // 20. Theme Color
  if (!meta.themeColor.trim()) {
    checks.push({
      id: "theme-color",
      label: "Theme Color",
      category: "technical",
      status: "warning",
      weight: 1,
      priority: "optional",
      tip: "Theme color is not set",
      recommendation:
        "The theme-color meta tag controls the color of the browser address bar on mobile Chrome (Android) and Safari (iOS). It provides a more app-like experience and reinforces your brand identity.",
      howToFix:
        'Set your brand\'s primary color in the "Theme Color" field under the Advanced tab. Use a hex color code (e.g., #6366f1).',
      impact:
        "Theme color improves the perceived quality of your site on mobile browsers.",
    });
  } else {
    checks.push({
      id: "theme-color-good",
      label: "Theme Color",
      category: "technical",
      status: "pass",
      weight: 1,
      priority: "optional",
      tip: `Theme color: ${meta.themeColor}`,
      recommendation:
        "Good. Use your primary brand color for consistency across all touchpoints.",
      howToFix: "No action needed.",
      impact:
        "Creates a cohesive, branded experience for mobile browser users.",
    });
  }

  return checks;
}

// ---------- Score Ring Component ----------
function ScoreRing({
  score,
  grade,
  totalChecks,
  passedChecks,
  failedChecks,
  warningChecks,
}: {
  score: number;
  grade: string;
  totalChecks: number;
  passedChecks: number;
  failedChecks: number;
  warningChecks: number;
}) {
  const radius = 58;
  const stroke = 8;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const colorMap: Record<
    string,
    { stroke: string; text: string; bg: string; glow: string }
  > = {
    A: {
      stroke: "#22c55e",
      text: "text-green-700",
      bg: "bg-green-50",
      glow: "shadow-green-200",
    },
    B: {
      stroke: "#3b82f6",
      text: "text-blue-700",
      bg: "bg-blue-50",
      glow: "shadow-blue-200",
    },
    C: {
      stroke: "#f59e0b",
      text: "text-amber-700",
      bg: "bg-amber-50",
      glow: "shadow-amber-200",
    },
    D: {
      stroke: "#f97316",
      text: "text-orange-700",
      bg: "bg-orange-50",
      glow: "shadow-orange-200",
    },
    F: {
      stroke: "#ef4444",
      text: "text-red-700",
      bg: "bg-red-50",
      glow: "shadow-red-200",
    },
  };

  const colors = colorMap[grade] || colorMap.F;

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg height={radius * 2} width={radius * 2} className="-rotate-90">
          <circle
            stroke="#e5e7eb"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <circle
            stroke={colors.stroke}
            fill="transparent"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className="transition-all duration-700 ease-out"
            style={{ filter: `drop-shadow(0 0 6px ${colors.stroke}40)` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-3xl font-black ${colors.text}`}>{grade}</span>
          <span className="text-xs text-muted-foreground font-medium">
            {Math.round(score)}%
          </span>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-3 text-xs">
        <span className="flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-green-500" />
          {passedChecks}
        </span>
        <span className="flex items-center gap-1">
          <AlertTriangle className="w-3 h-3 text-amber-500" />
          {warningChecks}
        </span>
        <span className="flex items-center gap-1">
          <XCircle className="w-3 h-3 text-red-500" />
          {failedChecks}
        </span>
      </div>
      <p className="text-[10px] text-muted-foreground mt-1">
        {totalChecks} checks
      </p>
    </div>
  );
}

// ---------- Category Progress ----------
function CategoryProgress({
  label,
  icon,
  color,
  bgColor,
  passed,
  total,
}: {
  label: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  passed: number;
  total: number;
}) {
  const pct = total > 0 ? Math.round((passed / total) * 100) : 0;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div
          className={`flex items-center gap-1.5 text-xs font-medium ${color}`}
        >
          {icon}
          {label}
        </div>
        <span className="text-xs text-muted-foreground">
          {passed}/{total}
        </span>
      </div>
      <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${bgColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ---------- Checklist Item ----------
function ChecklistItem({ check }: { check: SEOCheck }) {
  const [open, setOpen] = useState(false);

  const statusConfig = {
    pass: {
      icon: <CheckCircle2 className="w-4 h-4" />,
      color: "text-green-500",
      bg: "bg-green-50",
      border: "border-green-200",
      badge: "bg-green-100 text-green-700",
    },
    warning: {
      icon: <AlertTriangle className="w-4 h-4" />,
      color: "text-amber-500",
      bg: "bg-amber-50",
      border: "border-amber-200",
      badge: "bg-amber-100 text-amber-700",
    },
    fail: {
      icon: <XCircle className="w-4 h-4" />,
      color: "text-red-500",
      bg: "bg-red-50",
      border: "border-red-200",
      badge: "bg-red-100 text-red-700",
    },
  };

  const priorityConfig = {
    critical: { label: "Critical", className: "bg-red-100 text-red-700" },
    important: { label: "Important", className: "bg-blue-100 text-blue-700" },
    optional: { label: "Optional", className: "bg-gray-100 text-gray-600" },
  };

  const s = statusConfig[check.status];
  const p = priorityConfig[check.priority];

  return (
    <div
      className={`rounded-lg border ${s.border} ${s.bg}/50 overflow-hidden transition-all`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-3 py-2.5 flex items-center gap-2.5 text-left hover:bg-black/[0.02] transition-colors"
      >
        <span className={`flex-shrink-0 ${s.color}`}>{s.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-foreground">
              {check.label}
            </span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${p.className}`}
            >
              {p.label}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 truncate">
            {check.tip}
          </p>
        </div>
        <span
          className={`flex-shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        >
          <ChevronDown className="w-4 h-4" />
        </span>
      </button>

      {open && (
        <div className="px-3 pb-3 pt-1 border-t border-border/50 space-y-3">
          {/* Why it matters */}
          <div className="rounded-md bg-white/80 p-3 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              Why It Matters
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {check.recommendation}
            </p>
          </div>

          {/* How to fix */}
          <div className="rounded-md bg-white/80 p-3 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
              <Wrench className="w-3.5 h-3.5 text-blue-500" />
              How to Fix
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {check.howToFix}
            </p>
          </div>

          {/* Impact */}
          <div className="rounded-md bg-white/80 p-3 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
              <TrendingUp className="w-3.5 h-3.5 text-green-500" />
              SEO Impact
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {check.impact}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- Main Component ----------
export default function SEOScore({ meta }: { meta: MetaData }) {
  const checks = useMemo(() => evaluateSEO(meta), [meta]);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(
    "basic",
  );

  const toggleCategory = useCallback((cat: string) => {
    setExpandedCategory((prev) => (prev === cat ? null : cat));
  }, []);

  // Compute score
  const { score, grade, passedChecks, failedChecks, warningChecks } =
    useMemo(() => {
      let totalWeight = 0;
      let earnedWeight = 0;
      let passed = 0;
      let failed = 0;
      let warned = 0;

      checks.forEach((c) => {
        totalWeight += c.weight;
        if (c.status === "pass") {
          earnedWeight += c.weight;
          passed++;
        } else if (c.status === "warning") {
          earnedWeight += c.weight * 0.5;
          warned++;
        } else {
          failed++;
        }
      });

      const s = totalWeight > 0 ? (earnedWeight / totalWeight) * 100 : 0;
      let g = "F";
      if (s >= 90) g = "A";
      else if (s >= 80) g = "B";
      else if (s >= 70) g = "C";
      else if (s >= 60) g = "D";

      return {
        score: s,
        grade: g,
        passedChecks: passed,
        failedChecks: failed,
        warningChecks: warned,
      };
    }, [checks]);

  // Category breakdown
  const categoryStats = useMemo(() => {
    const cats = ["basic", "opengraph", "twitter", "technical"] as const;
    return cats.map((cat) => {
      const catChecks = checks.filter((c) => c.category === cat);
      const passed = catChecks.filter((c) => c.status === "pass").length;
      return { key: cat, total: catChecks.length, passed };
    });
  }, [checks]);

  // Grade description
  const gradeDescriptions: Record<
    string,
    { label: string; desc: string; color: string }
  > = {
    A: {
      label: "Excellent",
      desc: "Your meta tags are well-optimized! Minor tweaks may still help.",
      color: "text-green-700",
    },
    B: {
      label: "Good",
      desc: "Solid foundation, but there's room for improvement. Check the warnings.",
      color: "text-blue-700",
    },
    C: {
      label: "Fair",
      desc: "Several important tags are missing or need optimization. See recommendations below.",
      color: "text-amber-700",
    },
    D: {
      label: "Poor",
      desc: "Many critical SEO elements are missing. Your page won't perform well in search.",
      color: "text-orange-700",
    },
    F: {
      label: "Critical",
      desc: "Essential meta tags are missing. Your SEO needs immediate attention!",
      color: "text-red-700",
    },
  };

  const gradeInfo = gradeDescriptions[grade] || gradeDescriptions.F;

  return (
    <Card className="border-border/50 shadow-lg shadow-black/[0.02] overflow-hidden">
      <CardHeader className="pb-4 border-b bg-gradient-to-r from-primary/5 via-transparent to-indigo-50/30">
        <CardTitle className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-indigo-400 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-white" />
          </div>
          SEO Score & Checklist
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {/* Top section: Score + Summary */}
        <div className="p-6">
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
            {/* Score Ring */}
            <ScoreRing
              score={score}
              grade={grade}
              totalChecks={checks.length}
              passedChecks={passedChecks}
              failedChecks={failedChecks}
              warningChecks={warningChecks}
            />

            {/* Summary */}
            <div className="flex-1 space-y-4 text-center sm:text-left">
              <div>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h3 className={`text-lg font-bold ${gradeInfo.color}`}>
                    {gradeInfo.label}
                  </h3>
                  <Badge variant="secondary" className="text-xs">
                    {Math.round(score)}/100
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {gradeInfo.desc}
                </p>
              </div>

              {/* Category Progress Bars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg">
                {categoryStats.map((cs) => {
                  const cm = CATEGORY_META[cs.key];
                  return (
                    <CategoryProgress
                      key={cs.key}
                      label={cm.label}
                      icon={cm.icon}
                      color={cm.color}
                      bgColor={cm.bgColor}
                      passed={cs.passed}
                      total={cs.total}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Detailed Checklist */}
        <div className="p-6 space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Detailed Recommendations
            </h4>
            <p className="text-xs text-muted-foreground">
              Click items to expand
            </p>
          </div>

          {(["basic", "opengraph", "twitter", "technical"] as const).map(
            (cat) => {
              const catChecks = checks.filter((c) => c.category === cat);
              const cm = CATEGORY_META[cat];
              const isExpanded = expandedCategory === cat;
              const catPassCount = catChecks.filter(
                (c) => c.status === "pass",
              ).length;

              return (
                <div key={cat} className="space-y-2">
                  <button
                    onClick={() => toggleCategory(cat)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border ${cm.borderColor} ${cm.bgColor}/50 hover:${cm.bgColor} transition-colors`}
                  >
                    <div
                      className={`flex items-center gap-2 text-sm font-medium ${cm.color}`}
                    >
                      {cm.icon}
                      {cm.label}
                      <span className="text-xs text-muted-foreground font-normal">
                        ({catPassCount}/{catChecks.length} passed)
                      </span>
                    </div>
                    <span
                      className={`text-muted-foreground transition-transform ${isExpanded ? "rotate-180" : ""}`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </span>
                  </button>

                  {isExpanded && (
                    <div className="space-y-2 pl-1">
                      {catChecks.map((check) => (
                        <ChecklistItem key={check.id} check={check} />
                      ))}
                    </div>
                  )}
                </div>
              );
            },
          )}
        </div>
      </CardContent>
    </Card>
  );
}
