import { AppSidebar } from "@/components/dash/AppSidebar";
import Footer from "@/components/Footer";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { LogIn } from "lucide-react";
import { Link, Outlet } from "react-router-dom";

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                {/* <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem> */}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex items-center gap-2 px-4">
            <Link
              to="https://x.com/kawanua"
              target="_blank"
              className="flex items-center justify-center gap-2 bg-teal-700 hover:bg-teal-600 hover:shadow-lg transition-all duration-200 rounded-full p-2 text-white"
            >
              <img
                src="https://cdn.simpleicons.org/x/fff"
                alt="X"
                className="h-4 w-4"
              />
            </Link>
            <Link
              to="https://github.com/kawanuaid"
              target="_blank"
              className="flex items-center justify-center gap-2 bg-teal-700 hover:bg-teal-600 hover:shadow-lg transition-all duration-200 rounded-full p-2 text-white"
            >
              <img
                src="https://cdn.simpleicons.org/github/fff"
                alt="facebook"
                className="h-4 w-4"
              />
            </Link>
            <Link
              to="https://repo.kid.or.id/kawanua"
              target="_blank"
              className="flex items-center justify-center gap-2 bg-teal-700 hover:bg-teal-600 hover:shadow-lg transition-all duration-200 rounded-full p-2 text-white"
            >
              <img
                src="https://cdn.simpleicons.org/forgejo/fff"
                alt="forgejo"
                className="h-4 w-4"
              />
            </Link>
            <Link
              to="https://facebook.com/kawanuaco"
              target="_blank"
              className="flex items-center justify-center gap-2 bg-teal-700 hover:bg-teal-600 hover:shadow-lg transition-all duration-200 rounded-full p-2 text-white"
            >
              <img
                src="https://cdn.simpleicons.org/facebook/fff"
                alt="facebook"
                className="h-4 w-4"
              />
            </Link>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {/* <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
          </div> */}
          <div
            id="content"
            className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min"
          >
            <Outlet />
          </div>
        </div>
        <Footer />
      </SidebarInset>
    </SidebarProvider>
  );
}
