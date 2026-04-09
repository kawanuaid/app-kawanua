"use client";

import * as React from "react";
import {
  ArrowDown,
  ArrowUp,
  Bell,
  Copy,
  CornerUpLeft,
  CornerUpRight,
  FileText,
  GalleryVerticalEnd,
  GitBranch,
  GitFork,
  LineChart,
  Link,
  MoreHorizontal,
  Settings2,
  Star,
  Trash,
  Trash2,
} from "lucide-react";

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
      label: "Source Code",
      url: "https://github.com/KawanuaDev/app-kawanua",
      icon: <GitBranch />,
    },
    {
      label: "Ikut Kontribusi",
      url: "https://github.com/KawanuaDev/app-kawanua/blob/main/CONTRIBUTING.md",
      icon: <GitFork />,
    },
    {
      label: "License",
      url: "https://github.com/KawanuaDev/app-kawanua/blob/main/LICENSE",
      icon: <FileText />,
    },
  ],
  [
    {
      label: "Github",
      url: "https://github.com/kawanuaid",
      icon: (
        <img
          src="https://cdn.simpleicons.org/github"
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
          src="https://cdn.simpleicons.org/forgejo"
          alt=""
          className="size-4"
        />
      ),
    },
    {
      label: "X",
      url: "https://x.com/kawanua",
      icon: (
        <img src="https://cdn.simpleicons.org/x" alt="" className="size-4" />
      ),
    },
    {
      label: "Bluesky",
      url: "https://bsky.app/profile/kawanua.id",
      icon: (
        <img
          src="https://cdn.simpleicons.org/bluesky"
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
          src="https://cdn.simpleicons.org/facebook"
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
                        <SidebarMenuItem key={index}>
                          <SidebarMenuButton>
                            {item.icon as React.ReactNode}{" "}
                            <span>{item.label}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
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
