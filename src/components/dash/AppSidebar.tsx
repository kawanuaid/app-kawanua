"use client";

import * as React from "react";
import { Command } from "lucide-react";

import { NavSecondary } from "@/components/dash/NavSecondary";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarGroup,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import { data } from "@/lib/data";
import { APP_VERSION } from "@/lib/vars";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const filteredData = data.navMain
    .map((group) => ({
      ...group,
      items: group.items
        ? [...group.items].sort((a, b) => a.title.localeCompare(b.title))
        : [],
    }))
    .sort((a, b) => a.title.localeCompare(b.title));
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/">
                <img
                  src="/assets/imgs/favicon.svg"
                  alt=""
                  className="size-8 rounded-sm"
                />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-bold">Kawanua ID Apps</span>
                  <span className="truncate text-xs">v{APP_VERSION}</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="gap-2">
            {filteredData.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild className="text-[10px]">
                  <span className="text-muted-foreground uppercase">
                    <span className="font-bold">{item.title}</span> (
                    {item.items?.length})
                  </span>
                </SidebarMenuButton>
                {item.items?.length ? (
                  <SidebarMenuSub className="ml-0 border-l-0 px-1.5">
                    {item.items.map((item) => (
                      <SidebarMenuSubItem key={item.title}>
                        <SidebarMenuSubButton asChild>
                          <Link to={item.url} className="flex items-center">
                            <span className="text-teal-500/60">
                              <item.icon className="size-4" />
                            </span>{" "}
                            <span className="text-xs">{item.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                ) : null}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      {/* <SidebarFooter>
        <div className="p-1">
        </div>
      </SidebarFooter> */}
      {/* <SidebarRail /> */}
    </Sidebar>
  );
}
