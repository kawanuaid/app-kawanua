"use client";

import * as React from "react";
import {
  ArrowDown,
  ArrowUp,
  Bell,
  Bug,
  Copy,
  CornerUpLeft,
  CornerUpRight,
  FileText,
  FolderGit,
  GalleryVerticalEnd,
  GitBranch,
  GitFork,
  GitPullRequest,
  LineChart,
  MoreHorizontal,
  Settings2,
  Star,
  Trash,
  Trash2,
  Moon,
  Sun,
} from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import BlueskyIcon from "./icons/Bluesky";
import GithubIcon from "./icons/Github";
import ForgejoIcon from "./icons/Forgejo";
import XIcon from "./icons/X";
import FacebookIcon from "./icons/Facebook";

const data = [
  //   [
  //     {
  //       label: "Customize Page",
  //       icon: Settings2,
  //     },
  //     {
  //       label: "Turn into wiki",
  //       icon: FileText,
  //     },
  //   ],
  [
    {
      label: "Tentang Project Ini",
      url: "https://github.com/KawanuaDev/app-kawanua/blob/main/README.md",
      icon: <FolderGit className="size-4 text-primary" />,
    },
    {
      label: "Cara Kontribusi",
      url: "https://github.com/KawanuaDev/app-kawanua/blob/main/CONTRIBUTING.md",
      icon: <GitFork className="size-4 text-primary" />,
    },
    {
      label: "Lapor Bug/Celah",
      url: "https://github.com/KawanuaDev/app-kawanua/issues/new",
      icon: <Bug className="size-4 text-primary" />,
    },
    {
      label: "Ajukan Fitur",
      url: "https://github.com/KawanuaDev/app-kawanua/issues/new",
      icon: <GitBranch className="size-4 text-primary" />,
    },
    {
      label: "Lisensi",
      url: "https://github.com/KawanuaDev/app-kawanua/blob/main/LICENSE",
      icon: <FileText className="size-4 text-primary" />,
    },
  ],
  [
    {
      label: "Github",
      url: "https://github.com/kawanuaid",
      icon: <GithubIcon className="size-4 text-primary" />,
    },
    {
      label: "Forgejo",
      url: "https://repo.kid.or.id/kawanua",
      icon: <ForgejoIcon className="size-4 text-primary" />,
    },
    {
      label: "X",
      url: "https://x.com/kawanua",
      icon: <XIcon className="size-4 text-primary" />,
    },
    {
      label: "Bluesky",
      url: "https://bsky.app/profile/kawanua.id",
      icon: <BlueskyIcon className="size-4 text-primary" />,
    },
    {
      label: "Facebook",
      url: "https://facebook.com/kawanuaco",
      icon: <FacebookIcon className="size-4 text-primary" />,
    },
  ],
  //   [
  //     {
  //       label: "Import",
  //       icon: ArrowUp,
  //     },
  //     {
  //       label: "Export",
  //       icon: ArrowDown,
  //     },
  //   ],
];

export function NavActions() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    setIsOpen(true);
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    if (root.classList.contains("dark")) {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  return (
    <div className="flex items-center gap-2 text-sm">
      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={toggleTheme}>
        {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
      </Button>
      {/* <Button variant="ghost" size="icon" className="h-7 w-7">
        <Star />
      </Button> */}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 data-[state=open]:bg-primary data-[state=open]:text-white hover:bg-primary hover:text-white"
          >
            <MoreHorizontal />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-56 overflow-hidden rounded-lg p-0"
          align="end"
        >
          <Sidebar collapsible="none" className="bg-transparent">
            <SidebarContent>
              {data.map((group, index) => (
                <SidebarGroup key={index} className="border-b last:border-none">
                  <SidebarGroupContent className="gap-0">
                    <SidebarMenu>
                      {group.map((item, index) => (
                        <Link key={index} to={item.url} target="_blank">
                          <SidebarMenuItem>
                            <SidebarMenuButton>
                              {item.icon as React.ReactNode}{" "}
                              <span>{item.label}</span>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        </Link>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              ))}
            </SidebarContent>
          </Sidebar>
        </PopoverContent>
      </Popover>
    </div>
  );
}
