"use client";

import * as React from "react";
import { Command, Star } from "lucide-react";

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
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import { data } from "@/lib/data";
import { APP_VERSION } from "@/lib/vars";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation();
  const filteredData = data.navMain
    .map((group) => ({
      ...group,
      items: group.items
        ? [...group.items].sort((a, b) => a.title.localeCompare(b.title))
        : [],
    }))
    .sort((a, b) => a.title.localeCompare(b.title));
  return (
    <Sidebar variant="inset" collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/">
                <img
                  src="/assets/imgs/favicon-192x192.png"
                  alt=""
                  className="size-8 rounded-sm"
                />
                <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="truncate font-bold">Kawanua ID Apps</span>
                  <span className="truncate text-xs">v{APP_VERSION}</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {filteredData.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel className="text-[10px] text-muted-foreground uppercase font-bold group-data-[collapsible=icon]:hidden">
              {group.title} ({group.items?.length})
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items?.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname === item.url && item.url !== "/"}
                      tooltip={item.title}
                    >
                      <Link to={item.url}>
                        <item.icon className="text-primary shrink-0" />
                        <span className="truncate text-xs flex-1">{item.title}</span>
                        <div className="flex items-center gap-1 group-data-[collapsible=icon]:hidden ml-auto">
                          {item.isHighlight && (
                            <Star className="w-3 h-3 text-amber-500 shrink-0" />
                          )}
                          {item.isPromoted && (
                            <Star className="w-3 h-3 text-teal-500 shrink-0" />
                          )}
                        </div>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      {/* <SidebarFooter>
        <div className="p-1">
        </div>
      </SidebarFooter> */}
      {/* <SidebarRail /> */}
    </Sidebar>
  );
}
