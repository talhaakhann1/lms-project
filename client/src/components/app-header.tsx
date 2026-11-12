"use client"

import { cn } from "@/src/lib/utils";
import { Button } from "../components/ui/button";
import { Separator } from "../components/ui/separator";
import { SidebarProvider, SidebarTrigger, useSidebar } from "../components/ui/sidebar";
import { AppBreadcrumbs } from "../components/app-breadcrumbs";
import { adminNavLinks, studentNavLinks } from "../components/app-shared";
import { SearchIcon, BellIcon, HeadsetIcon } from "lucide-react";
import { ThemeToggle } from "./motion/theme-toggle";
import BlurFadeThemeTransition from "@/components/ui/BlurFadeThemeTransition";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface AppHeaderProps {
	variant: "admin" | "student";
}


export function AppHeader({ variant }: AppHeaderProps) {
	const pathname = usePathname();

	const navLinks =
		variant === "admin" ? adminNavLinks : studentNavLinks;

	const rootRoute = variant === "admin" ? "/admin" : "/dashboard";

	const activeItem = navLinks.find((item) => {
		if (item.url === rootRoute) {
			return pathname === rootRoute;
		}

		return (
			pathname === item.url ||
			pathname.startsWith(`${item.url}/`)
		);
	});
	const { state, open } = useSidebar()
	return (
		<header
  className={cn(
    "sticky top-0 z-50 flex h-16 shrink-0 items-center justify-between gap-4",
    "border-b border-border bg-background/95 px-4 backdrop-blur-sm supports-[backdrop-filter]:bg-background/80 md:px-6"
  )}
>
  {/* ── Left: trigger + breadcrumb ── */}
  <div className="flex items-center gap-3">
    <SidebarTrigger className="size-8 shrink-0 rounded-xl border border-border bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground" />

    <Separator
      orientation="vertical"
      className="h-5 data-[orientation=vertical]:h-5 text-border md:hidden"
    />

    <AppBreadcrumbs
      page={
        activeItem
          ? { title: activeItem.title, icon: activeItem.icon }
          : { title: "Dashboard" }
      }
    />
  </div>

  {/* ── Right: actions ── */}
  <div className="flex items-center gap-1.5">
    <ThemeToggle
      variant="rectangle"
      start="bottom-up"
      className="size-8 shrink-0 rounded-xl border border-border bg-transparent p-2"
      iconClassName="h-4 w-4"
    />

    <Button
      aria-label="Search"
      size="icon"
      variant="ghost"
      className="size-8 rounded-xl border border-transparent text-muted-foreground hover:border-border hover:bg-muted hover:text-foreground"
    >
      <SearchIcon className="size-4" />
    </Button>

    <Button
      aria-label="Support"
      size="icon"
      variant="ghost"
      className="size-8 rounded-xl border border-transparent text-muted-foreground hover:border-border hover:bg-muted hover:text-foreground"
    >
      <Link href="/contact">
        <HeadsetIcon className="size-4" />
      </Link>
    </Button>
  </div>
</header>
	);
}
