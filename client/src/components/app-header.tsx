import { cn } from "@/src/lib/utils";
import { Button } from "../components/ui/button";
import { Separator } from "../components/ui/separator";
import { SidebarTrigger } from "../components/ui/sidebar";
import { AppBreadcrumbs } from "../components/app-breadcrumbs";
import { adminNavGroups,studentNavGroups } from "../components/app-shared";
import { SearchIcon, BellIcon, HeadsetIcon } from "lucide-react";
import { ThemeToggle } from "./motion/theme-toggle";
import Link from "next/link";

interface AppHeaderProps {
  variant: "admin" | "student";
}


export function AppHeader({ variant }: AppHeaderProps) {
	return (
		<header
			className={cn(
				"sticky top-0 z-50 flex h-14 shrink-0 items-center justify-between gap-2 bg-background px-4 md:px-6"
			)}
		>
			<div className="flex items-center gap-2">
				<SidebarTrigger className="md:hidden" />
				<Separator
					className="mr-2 data-[orientation=vertical]:h-4 md:hidden"
					orientation="vertical"
				/>
				{/* <AppBreadcrumbs page={activeItem} /> */}
			</div>
			<div className="flex items-center gap-2">
				<ThemeToggle
                        variant="rectangle"
                        start="bottom-up"
                        className="rounded-xl border border-border bg-transparent p-2.5"
                        iconClassName="h-4 w-5"
                    />
				<Button aria-label="Search" size="icon" variant="ghost">
					<SearchIcon
					/>
				</Button>
				<Button aria-label="Support" size="icon" variant="ghost">
					<Link href={"/contact"}>
					<HeadsetIcon
					/>
					</Link>
				</Button>
			</div>
		</header>
	);
}
