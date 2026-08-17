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
  const router = useRouter()
  const logoutHandler = async () => {
    setIsLoading(true)
    try {

      await authService.logout()
      dispatch(logOut())
      showInfo("Logout Successfully")
    } catch (error) {
      const AxiosError = error as AxiosError<ApiResponse<unknown>>

      let errorMessage = AxiosError.response?.data.message
      console.log(errorMessage);

      showError("Something went wrong", errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full border-b border-transparent",
        scrolled &&
        "border-border bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/50"
      )}
    >
      <nav className="mx-auto grid h-20 w-full max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 sm:px-6">
        {/* Left */}
        <div className="min-w-0">
          <Link
            href="/"
            className="inline-flex max-w-full shrink-0 items-center rounded-md p-2 hover:bg-muted dark:hover:bg-muted/50"
          >
            <Logo className="block h-4 max-w-full w-auto" />
          </Link>
        </div>

        {/* Center */}
        <div className="hidden items-center justify-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "h-11 whitespace-nowrap px-4 text-sm lg:px-5 lg:text-base"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right */}
        <div className="hidden min-w-0 items-center justify-end gap-4 md:flex">
          <ThemeToggle
            variant="rectangle"
            start="bottom-up"
            className="size-10 shrink-0 rounded-xl border border-border bg-transparent p-2.5"
            iconClassName="h-4 w-5"
          />

          {user?.isLoggedIn ? (
            <Button
              disabled={isLoading}
              onClick={logoutHandler}
              className="h-10 shrink-0 px-4 text-md"
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
                  "h-10 shrink-0 px-3 text-md"
                )}
              >
                Sign In
              </Link>

              <Link
                href="/sign-up"
                className={cn(
                  buttonVariants(),
                  "h-10 shrink-0 px-3 text-md"
                )}
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile */}
        <div className="flex justify-end md:hidden">
          <MobileNav />
        </div>
      </nav>
    </header>
  );
}