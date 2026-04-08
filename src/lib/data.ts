import {
  LifeBuoy,
  Send,
  GitBranch,
  GitFork,
  FileText,
  QrCode,
  Key,
  Palette,
  Image,
  Scale,
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
          icon: Key,
        },
        {
          title: "Password Checker",
          url: "/passcheck",
          icon: Key,
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
          title: "QR Code Generator",
          url: "/qrcode",
          icon: QrCode,
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
          icon: Scale,
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
