import {
  GitBranch,
  GitFork,
  FileText,
  QrCode,
  Palette,
  Image,
  Tag,
  Hash,
  Asterisk,
  Gauge,
  Globe,
  Clock,
  Weight,
  Regex,
  Binary,
  RectangleEllipsis,
  FileDigit,
  FileSearch,
  FileCog,
  Braces,
  Radar,
  Pipette,
  BookImage,
  Tags,
} from "lucide-react";

export const data = {
  navMain: [
    {
      title: "Visual",
      url: "#",
      items: [
        {
          title: "Image Optimizer",
          url: "/image-optimizer",
          isActive: false,
          icon: Image,
        },
        {
          title: "Color Converter",
          url: "/color-converter",
          isActive: false,
          icon: Palette,
        },
        {
          title: "Color Palette Picker",
          url: "/color-palette-picker",
          isActive: false,
          icon: Pipette,
        },
      ],
    },
    {
      title: "Security",
      url: "#",
      items: [
        // {
        //   title: "URL + IP Checker",
        //   url: "/urlscanner",
        // },
        {
          title: "Password Generator",
          url: "/passgen",
          icon: RectangleEllipsis,
        },
        {
          title: "Password Checker",
          url: "/passcheck",
          icon: Radar,
        },
        {
          title: "JWT Decoder",
          url: "/jwtdecoder",
          icon: Binary,
        },
      ],
    },
    {
      title: "Web & Dev",
      url: "#",
      items: [
        {
          title: "Meta Tag Preview",
          url: "/meta-tag-preview",
          icon: Tag,
        },
        {
          title: "PageSpeed Insights",
          url: "/pagespeed",
          icon: Gauge,
        },
        {
          title: "Domain Lookup",
          url: "/domainlookup",
          icon: Globe,
        },
        {
          title: "Favicon Generator",
          url: "/favicon-generator",
          icon: BookImage,
        },
        {
          title: "SEO Meta Tag Generator",
          url: "/seo-metatag-generator",
          icon: Tags,
        },
      ],
    },
    {
      title: "Health",
      url: "#",
      items: [
        {
          title: "BMI Calculator",
          url: "/bmi-calculator",
          icon: Weight,
        },
      ],
    },
    {
      title: "Utilities",
      url: "#",
      items: [
        // {
        //   title: "WHOIS + DNS Lookup",
        //   url: "/whois",
        // },
        {
          title: "Timestamp Converter",
          url: "/timestamp",
          icon: Clock,
        },
        {
          title: "File Checksum Generator",
          url: "/filechecksum",
          icon: FileDigit,
        },
        {
          title: "JSON ↔ CSV Converter",
          url: "/jsoncsv",
          icon: FileCog,
        },
        {
          title: "QR Code Generator",
          url: "/qrcode",
          icon: QrCode,
        },
        {
          title: "Base64 Studio",
          url: "/base64",
          icon: Braces,
        },
        {
          title: "Hash Generator",
          url: "/hashgen",
          icon: Hash,
        },
        {
          title: "UUID Generator",
          url: "/uuidgen",
          icon: Asterisk,
        },
        {
          title: "Regex Tester",
          url: "/regex-tester",
          icon: Regex,
        },
        {
          title: "Markdown Preview",
          url: "/markdown-preview",
          icon: FileSearch,
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Source Code",
      url: "https://github.com/KawanuaDev/app-kawanua",
      icon: GitBranch,
    },
    {
      title: "Berkontribusi",
      url: "https://github.com/KawanuaDev/app-kawanua/blob/main/CONTRIBUTING.md",
      icon: GitFork,
    },
    {
      title: "License",
      url: "https://github.com/KawanuaDev/app-kawanua/blob/main/LICENSE",
      icon: FileText,
    },
  ],
};
