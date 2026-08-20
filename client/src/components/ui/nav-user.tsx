"use client";

import { useAppDispatch, useAppSelector } from "@/src/store/hook";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "./avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "./dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "./sidebar";
import { ChevronsUpDownIcon, SparklesIcon, UserIcon, BellIcon, CreditCardIcon, SettingsIcon, LifeBuoyIcon, LogOutIcon, Loader2 } from "lucide-react";
import { authService } from "@/src/services/auth.service";
import { useRouter } from "next/navigation";
import { logOut } from "@/src/store/authSlice";
import { showError, showInfo, showSuccess } from "./toaster";
import { AxiosError } from "axios";
import ApiResponse from "@/src/utils/ApiResponse";
import { useState } from "react";

type UserType = {
	name: string;
	email: string;
	avatar: string;
};



export function NavUser() {
	const { isMobile } = useSidebar();
	const [isLoggingOut, setIsLoggingOut] = useState(false);
	const user = useAppSelector((state) => state.auth.user)
	const fullName = user?.fullName

	const dispatch = useAppDispatch();
	const router = useRouter()

	const logoutHandler = async () => {
		if (isLoggingOut) return;

		setIsLoggingOut(true);

		try {
			await authService.logout();

			dispatch(logOut());

			showInfo("You have been signed out successfully.");

			window.location.replace("/");
		} catch (error) {
			showError("Logout failed", "Please try again.");
		} finally {
			setIsLoggingOut(false);
		}
	};
	const profileHandler = () => {
		if (user?.role === "student") {
			router.push("/dashboard/profile");
		} else if (
			user?.role === "admin" ||
			user?.role === "instructor"
		) {
			router.push("/admin/profile");
		}
	};
	return (
		<SidebarMenu className="border-t p-2">
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger render={
						<SidebarMenuButton className="text-muted-foreground" />
					}>
						<Avatar className="size-8">
							<AvatarImage alt={user?.fullName} src={user?.avatar.url} />
							<AvatarFallback>
								{user?.fullName?.charAt(0)?.toUpperCase() ?? "U"}
							</AvatarFallback>
						</Avatar>
						<div className="flex flex-col">

							<span className="font-medium text-sm">
								{fullName ? fullName.charAt(0).toUpperCase() + fullName.slice(1) : ""}
							</span>
							<span className="text-xs capitalize text-muted-foreground">
								{user?.role}
							</span>
						</div>
						<ChevronsUpDownIcon className="ml-auto size-3!" />
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuItem onClick={() => profileHandler()}>
							<UserIcon
							/>
							View
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem variant="destructive" onClick={() => logoutHandler()}>
							{isLoggingOut ? (
								<Loader2 className="animate-spin" />
							) : (
								<LogOutIcon />
							)}

							{isLoggingOut ? "Logging out..." : "Log out"}
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
