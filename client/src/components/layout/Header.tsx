"use client";

import Link from "next/link";
import { cn } from "@/src/lib/utils";
import { useScroll } from "@/src/hooks/use-scroll";
import { useAppDispatch, useAppSelector } from "@/src/store/hook";

import { Logo } from "../../components/ui/logo";
import { Button, buttonVariants } from "../../components/ui/button";
import { MobileNav } from "../../components/layout/Mobile-nav";
import { ThemeToggle } from "../motion/theme-toggle";
import { useRouter } from "next/navigation";
import { authService } from "@/src/services/auth.service";
import { logOut } from "@/src/store/authSlice";
import { showError, showInfo, showSuccess } from "../ui/toaster";
import { useState } from "react";
import { AxiosError } from "axios";
import ApiResponse from "@/src/utils/ApiResponse";
import { Loader2 } from "lucide-react";

export const navLinks = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Courses",
    href: "/courses",
  },
  {
    label: "About",
    href: "/about",
  },
  {
    label: "Contact Us",
    href: "/contact",
  },
];

export function Header() {
  const scrolled = useScroll(10);
  const user = useAppSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const dispatch = useAppDispatch();

  const logoutHandler = async () => {
    setIsLoading(true)
    try {

      await authService.logout()
      dispatch(logOut())
      showInfo("You have been signed out successfully.");
    } catch (error) {
      const AxiosError = error as AxiosError<ApiResponse<unknown>>

      let errorMessage = AxiosError.response?.data.message ?? "Something went wrong"
      showError("Logout failed", "Please try again.");
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full border-b border-border",
        scrolled &&
        "border-border bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/50"
      )}
    >
      <nav
        className="
    mx-auto flex h-16 w-full max-w-7xl items-center justify-between
    px-4 sm:px-6
    lg:grid lg:h-18 lg:grid-cols-[1fr_auto_1fr] lg:justify-normal
  "
      >
        {/* Left */}
        <div className="min-w-0 lg:pl-3">
          <Link href="/" className="inline-flex p-1">
            <Logo
              className="
          h-auto
          w-[120px]
          sm:w-[135px]
          lg:w-[150px]
          xl:w-[160px]
        "
            />
          </Link>
        </div>

        {/* Center */}
        <div className="hidden items-center justify-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "h-10 whitespace-nowrap px-3 text-sm xl:px-5 xl:text-base"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right */}
        <div className="hidden min-w-0 items-center justify-end gap-3 lg:flex">
          <ThemeToggle
            variant="rectangle"
            start="bottom-up"
            className="size-8 shrink-0 rounded-xl border border-border bg-transparent p-2.5"
            iconClassName="h-4 w-5"
          />

          {user?.isLoggedIn ? (
            <Button
              disabled={isLoading}
              onClick={logoutHandler}
              className="h-10 shrink-0 px-4 text-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging out...
                </>
              ) : (
                "Logout"
              )}
            </Button>
          ) : (
            <>
              <Link
                href="/sign-in"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "h-10 shrink-0 px-3 text-base"
                )}
              >
                Sign In
              </Link>

              <Link
                href="/sign-up"
                className={cn(
                  buttonVariants(),
                  "h-10 shrink-0 px-3 text-base"
                )}
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile + tablet */}
        <div className="flex items-center justify-end gap-2 lg:hidden">
          <ThemeToggle
            variant="rectangle"
            start="bottom-up"
            className="size-8 shrink-0 rounded-xl border border-border bg-transparent p-2.5"
            iconClassName="h-4 w-5"
          />

          <MobileNav
            isLoading={isLoading}
            onLogout={logoutHandler}
            isLoggedIn={user.isLoggedIn}
          />
        </div>
      </nav>
    </header>
  );
}