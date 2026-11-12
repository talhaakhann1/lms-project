"use client";

import { Logo } from "../components/ui/logo";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "../components/ui/sidebar";
import { footerNavLinks, adminNavGroups, studentNavGroups } from "../components/app-shared";
import { NavUser } from "../components/ui/nav-user";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, ArrowRight } from "lucide-react";
import { useAppSelector } from "../store/hook";

interface AppSidebarProps {
	variant: "admin" | "student";
}

export function AppSidebar({ variant }: AppSidebarProps) {
	const groupsToRender =
		variant === "admin" ? adminNavGroups : studentNavGroups;
	const pathname = usePathname();

	const isActiveRoute = (url: string) => {
		const rootRoute = variant === "admin" ? "/admin" : "/dashboard";

		if (url === rootRoute) {
			return pathname === rootRoute;
		}

		return pathname === url || pathname.startsWith(`${url}/`);
	};
	// If your auth slice already stores user enrollment info
	const hasEnrolled = useAppSelector((state) => state.enrollment.hasEnrolled)
	return (
		<Sidebar
			className="min-h-full *:data-[slot=sidebar-inner]:bg-background"
			collapsible="offcanvas"
		>
			<SidebarHeader className="relative h-14 px-2 py-2 pt-3">
				<a
					href={variant === "admin" ? "/admin" : "/dashboard"}
					className="flex h-10 max-w-full items-center justify-center rounded-3xl px-3 hover:bg-muted dark:hover:bg-muted/50"
				>
					<Logo className="h-8" />
					<span className="sr-only">Edvra</span>
				</a>
			</SidebarHeader>

			<SidebarContent>
				{groupsToRender.map((group, index) => (
					<SidebarGroup key={`sidebar-group-${index}`}>
						{group.label && (
							<SidebarGroupLabel className="font-normal">
								{group.label}
							</SidebarGroupLabel>
						)}
						<SidebarMenu>
							{group.items.map((item) => {
								const isActive = isActiveRoute(item.url);
								return (
									<SidebarMenuItem key={item.title}>
										<Link
											href={item.url}
											className={`
                    flex items-center gap-2 rounded-md px-2 py-2
                    transition-colors hover:bg-accent
                    ${isActive
													? "bg-accent font-medium text-accent-foreground"
													: "text-muted-foreground"
												}
                  `}
										>
											{item.icon}
											<span>{item.title}</span>
										</Link>
									</SidebarMenuItem>
								);
							})}
						</SidebarMenu>
					</SidebarGroup>
				))}

				{/* ── CTA banner — fills empty space ── */}
				<SidebarGroup className="mt-auto">
					<div className="mx-2 overflow-hidden rounded-xl border border-border bg-muted/60 p-4">
						{/* Icon */}
						<div className="mb-3 flex size-9 items-center justify-center rounded-lg border border-border bg-background shadow-sm">
							<Sparkles className="size-4 text-primary" strokeWidth={1.5} />
						</div>

						{/* Copy */}
						<p className="text-sm font-semibold text-foreground">
							{hasEnrolled ? "Keep the momentum" : "Start your journey"}
						</p>
						<p className="mt-1 text-xs leading-relaxed text-muted-foreground">
							{hasEnrolled
								? "You're making great progress. Explore more courses to keep growing."
								: "Browse our catalog and enroll in your first course today."}
						</p>

						{/* CTA button */}
						<Link
							href="/dashboard/courses"
							className="mt-3 flex h-8 w-full items-center justify-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
						>
							Explore Courses
							<ArrowRight className="size-3" strokeWidth={2} />
						</Link>
					</div>
				</SidebarGroup>
			</SidebarContent>

			<SidebarFooter className="gap-0 p-0">
				<SidebarMenu className="border-t p-2">
					{footerNavLinks.map((item) => {
						const isActive = isActiveRoute(item.url);
						return (
							<SidebarMenuItem key={item.title}>
								<Link
									href={item.url}
									className={`
                flex items-center gap-2 rounded-md px-2 py-2
                transition-colors hover:bg-accent
                ${isActive
											? "bg-accent font-medium text-accent-foreground"
											: "text-muted-foreground"
										}
              `}
								>
									{item.icon}
									<span>{item.title}</span>
								</Link>
							</SidebarMenuItem>
						);
					})}
				</SidebarMenu>
				<NavUser />
			</SidebarFooter>
		</Sidebar>
	);
}
