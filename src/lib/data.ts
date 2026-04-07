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
    // {
    //   title: "Build Your Application",
    //   url: "#",
    //   items: [
    //     {
    //       title: "Routing",
    //       url: "#",
    //     },
    //     {
    //       title: "Data Fetching",
    //       url: "#",
    //       isActive: true,
    //     },
    //     {
    //       title: "Rendering",
    //       url: "#",
    //     },
    //     {
    //       title: "Caching",
    //       url: "#",
    //     },
    //     {
    //       title: "Styling",
    //       url: "#",
    //     },
    //     {
    //       title: "Optimizing",
    //       url: "#",
    //     },
    //     {
    //       title: "Configuring",
    //       url: "#",
    //     },
    //     {
    //       title: "Testing",
    //       url: "#",
    //     },
    //     {
    //       title: "Authentication",
    //       url: "#",
    //     },
    //     {
    //       title: "Deploying",
    //       url: "#",
    //     },
    //     {
    //       title: "Upgrading",
    //       url: "#",
    //     },
    //     {
    //       title: "Examples",
    //       url: "#",
    //     },
    //   ],
    // },
    // {
    //   title: "API Reference",
    //   url: "#",
    //   items: [
    //     {
    //       title: "Components",
    //       url: "#",
    //     },
    //     {
    //       title: "File Conventions",
    //       url: "#",
    //     },
    //     {
    //       title: "Functions",
    //       url: "#",
    //     },
    //     {
    //       title: "next.config.js Options",
    //       url: "#",
    //     },
    //     {
    //       title: "CLI",
    //       url: "#",
    //     },
    //     {
    //       title: "Edge Runtime",
    //       url: "#",
    //     },
    //   ],
    // },
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
