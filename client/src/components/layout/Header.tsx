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
     <header className="relative z-50 h-16 border-b border-b-border bg-background lg:h-22">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6 lg:px-8">
 
        {/* Logo */}
        <Link href="/" className="inline-flex shrink-0 items-center gap-2">
          <Logo className="h-auto w-[120px] sm:w-[135px] lg:w-[150px] xl:w-[160px]" />
        </Link>
 
        {/* Desktop nav */}
        <nav aria-label="Main" className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="p-2 text-sm font-medium text-foreground hover:text-muted-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
 
        {/* Right actions */}
        <div className="flex items-center gap-2.5">
          <ThemeToggle
            variant="rectangle"
            start="bottom-up"
            className="size-8 shrink-0 rounded-full border border-border bg-background p-2"
            iconClassName="h-4 w-4"
          />
 
          {user?.isLoggedIn ? (
            <Button
              disabled={isLoading}
              onClick={logoutHandler}
              className="hidden lg:inline-flex h-10 rounded-xl px-4 text-sm font-semibold"
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
                  "hidden lg:inline-flex items-center justify-center",
                  "h-10 rounded-xl border border-border bg-background px-4 text-sm font-semibold",
                  "transition-colors hover:bg-accent"
                )}
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className={cn(
                  "hidden lg:inline-flex items-center justify-center",
                  "h-10 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground",
                  "transition-colors hover:bg-primary/90"
                )}
              >
                Get Started
              </Link>
            </>
          )}
 
          <div className="flex items-center gap-2 lg:hidden">
            <MobileNav
              isLoading={isLoading}
              onLogout={logoutHandler}
              isLoggedIn={user.isLoggedIn}
            />
          </div>
        </div>
      </div>
    </header>
  );
}