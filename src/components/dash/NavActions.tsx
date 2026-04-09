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
      icon: <FolderGit className="size-4 text-[#00b058]" />,
    },
    {
      label: "Cara Kontribusi",
      url: "https://github.com/KawanuaDev/app-kawanua/blob/main/CONTRIBUTING.md",
      icon: <GitFork className="size-4 text-[#00b058]" />,
    },
    {
      label: "Lapor Bug/Celah",
      url: "https://github.com/KawanuaDev/app-kawanua/issues/new",
      icon: <Bug className="size-4 text-[#00b058]" />,
    },
    {
      label: "Ajukan Fitur",
      url: "https://github.com/KawanuaDev/app-kawanua/issues/new",
      icon: <GitBranch className="size-4 text-[#00b058]" />,
    },
    {
      label: "Lisensi",
      url: "https://github.com/KawanuaDev/app-kawanua/blob/main/LICENSE",
      icon: <FileText className="size-4 text-[#00b058]" />,
    },
  ],
  [
    {
      label: "Github",
      url: "https://github.com/kawanuaid",
      icon: (
        <img
          src="https://cdn.simpleicons.org/github/00b058"
          alt=""
          className="size-4"
        />
      ),
    },
    {
      label: "Forgejo",
      url: "https://repo.kid.or.id/kawanua",
      icon: (
        <img
          src="https://cdn.simpleicons.org/forgejo/00b058"
          alt=""
          className="size-4"
        />
      ),
    },
    {
      label: "X",
      url: "https://x.com/kawanua",
      icon: (
        <img
          src="https://cdn.simpleicons.org/x/00b058"
          alt=""
          className="size-4"
        />
      ),
    },
    {
      label: "Bluesky",
      url: "https://bsky.app/profile/kawanua.id",
      icon: (
        <img
          src="https://cdn.simpleicons.org/bluesky/00b058"
          alt=""
          className="size-4"
        />
      ),
    },
    {
      label: "Facebook",
      url: "https://facebook.com/kawanuaco",
      icon: (
        <img
          src="https://cdn.simpleicons.org/facebook/00b058"
          alt=""
          className="size-4"
        />
      ),
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

  React.useEffect(() => {
    setIsOpen(true);
  }, []);

  return (
    <div className="flex items-center gap-2 text-sm">
      {/* <div className="hidden font-medium text-muted-foreground md:inline-block">
        Edit Oct 08
      </div> */}
      {/* <Button variant="ghost" size="icon" className="h-7 w-7">
        <Star />
      </Button> */}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 data-[state=open]:bg-accent"
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
