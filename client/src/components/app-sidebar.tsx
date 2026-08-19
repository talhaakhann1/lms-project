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

interface AppSidebarProps {
	variant: "admin" | "student";
}

export function AppSidebar({ variant }: AppSidebarProps) {
	const groupsToRender =
		variant === "admin" ? adminNavGroups : studentNavGroups;
	return (
		<Sidebar
			className="
			static min-h-full 
			*:data-[slot=sidebar-inner]:bg-background"
			collapsible="offcanvas"
		>
			<SidebarHeader className="relative h-14 px-2 py-2 pt-3">
				<a
					href={variant === "admin" ? "/admin" : "/dashboard"}
					className="flex h-10 max-w-full items-center justify-center rounded-3xl px-3 hover:bg-muted dark:hover:bg-muted/50"
				>
					 <Logo className="h-7" />
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
							{group.items.map((item) => (
								<SidebarMenuItem key={item.title}>
									<Link
										href={item.url}
										className="flex items-center gap-2 rounded-md px-2 py-2 hover:bg-accent"
									>
										{item.icon}
										<span>{item.title}</span>
									</Link>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroup>
				))}

			</SidebarContent>
			<SidebarFooter className="gap-0 p-0">
				<SidebarMenu className="border-t p-2">
					{footerNavLinks.map((item) => (
						<SidebarMenuItem key={item.title}>
							<Link
								href={item.url}
								className={`flex items-center gap-2 rounded-md px-2 py-2 text-muted-foreground hover:bg-accent ${item.isActive ? "bg-accent" : ""
									}`}
							>
								{item.icon}
								<span>{item.title}</span>
							</Link>
						</SidebarMenuItem>
					))}
				</SidebarMenu>
				<NavUser />
			</SidebarFooter>
		</Sidebar>
	);
}
