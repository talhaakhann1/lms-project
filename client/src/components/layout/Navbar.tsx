"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  type Variants,
} from "framer-motion"
import { useTheme } from "next-themes"
import {
  Award,
  GraduationCap,
  LibraryBig,
  Menu,
  Moon,
  Route,
  Sun,
  Users,
  type LucideIcon,
} from "lucide-react"

import { cn } from "@/src/lib/utils"
import { Button } from "../../components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../../components/ui/navigation-menu"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../components/ui/sheet"

interface NavLink {
  label: string
  href: string
}

interface NavMenuItem extends NavLink {
  description: string
  icon: LucideIcon
}

const CATALOG_MENU: NavMenuItem[] = [
  {
    label: "Browse catalog",
    href: "/courses",
    description: "Every course across all tracks",
    icon: LibraryBig,
  },
  {
    label: "Learning paths",
    href: "/paths",
    description: "Guided sequences that build real skills",
    icon: Route,
  },
  {
    label: "Instructors",
    href: "/instructors",
    description: "The people teaching on the platform",
    icon: Users,
  },
  {
    label: "Certifications",
    href: "/certifications",
    description: "Credentials you can share and verify",
    icon: Award,
  },
]

const NAV_LINKS: NavLink[] = [
  { label: "Pricing", href: "/pricing" },
  { label: "For teams", href: "/teams" },
  { label: "Resources", href: "/resources" },
  { label: "Support", href: "/support" },
]

const ICON_STROKE = 1.75
const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"

function Logo() {
  return (
    <Link
      href="/"
      aria-label="Home"
      className={cn("group inline-flex items-center gap-2.5 rounded-lg", FOCUS_RING)}
    >
      <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm transition-transform duration-200 group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100">
        <GraduationCap className="size-5" strokeWidth={ICON_STROKE} aria-hidden="true" />
      </span>
      <span className="text-lg font-bold tracking-tight text-foreground">Lumen</span>
    </Link>
  )
}

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle theme"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="relative size-11 rounded-lg"
    >
      <Sun
        className="size-5 rotate-0 scale-100 transition-transform duration-300 dark:-rotate-90 dark:scale-0 motion-reduce:transition-none"
        strokeWidth={ICON_STROKE}
        aria-hidden="true"
      />
      <Moon
        className="absolute size-5 rotate-90 scale-0 transition-transform duration-300 dark:rotate-0 dark:scale-100 motion-reduce:transition-none"
        strokeWidth={ICON_STROKE}
        aria-hidden="true"
      />
    </Button>
  )
}

export function Navbar() {
  const pathname = usePathname()
  const prefersReducedMotion = useReducedMotion()
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = React.useState(false)
  const [mobileOpen, setMobileOpen] = React.useState(false)

  useMotionValueEvent(scrollY, "change", (latest) => setScrolled(latest > 8))

  React.useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const listVariants: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
  }

  const itemVariants: Variants = prefersReducedMotion
    ? {
      hidden: { opacity: 0 },
      show: { opacity: 1, transition: { duration: 0.2, ease: "easeOut" } },
    }
    : {
      hidden: { opacity: 0, y: 8 },
      show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
    }

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  return (
    <motion.header
      initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-colors duration-300",
        scrolled
          ? "border-border bg-background/80 shadow-sm supports-[backdrop-filter]:bg-background/60 supports-[backdrop-filter]:backdrop-blur-lg"
          : "border-transparent bg-background"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-6 lg:h-18 lg:px-8 xl:px-10">
        <Logo />

        <NavigationMenu aria-label="Main" className="hidden lg:flex">
          <NavigationMenuList className="gap-1">
            <NavigationMenuItem>
              <NavigationMenuTrigger>Catalog</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-80 gap-1 p-2 sm:w-136 sm:grid-cols-2">
                  {CATALOG_MENU.map((item) => (
                    <li key={item.href}>
                      <NavigationMenuLink
                        render={<Link href={item.href} />}
                        aria-current={isActive(item.href) ? "page" : undefined}
                        className="h-full flex-col items-start gap-1 rounded-md p-3 aria-[current=page]:bg-muted"
                      >
                        <span className="flex items-center gap-2 font-semibold text-foreground">
                          <item.icon
                            className="size-4 text-muted-foreground"
                            strokeWidth={ICON_STROKE}
                            aria-hidden="true"
                          />
                          {item.label}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {item.description}
                        </span>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {NAV_LINKS.map((link) => (
              <NavigationMenuItem key={link.href}>
                <NavigationMenuLink
                  render={<Link href={link.href} />}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className="px-2.5 py-1.5 font-medium aria-[current=page]:bg-muted"
                >
                  {link.label}
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          <Button
            variant="ghost"
            render={<Link href="/sign-in" />}
            className="hidden h-11 px-4 text-sm font-semibold lg:inline-flex"
          >
            Sign in
          </Button>

          <motion.span
            className="hidden lg:inline-flex"
            whileHover={prefersReducedMotion ? undefined : { scale: 1.02 }}
            whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <Button
              render={<Link href="/sign-up" />}
              className="h-11 px-5 text-sm font-semibold"
            >
              Get started
            </Button>
          </motion.span>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Open navigation menu"
                  className="size-11 rounded-lg lg:hidden"
                />
              }
            >
              <Menu className="size-5" strokeWidth={ICON_STROKE} aria-hidden="true" />
            </SheetTrigger>

            <SheetContent side="right" className="w-full gap-0 p-0 sm:max-w-sm">
              <SheetHeader className="border-b border-border p-6">
                <SheetTitle>Menu</SheetTitle>
                <SheetDescription className="sr-only">
                  Site navigation and account links
                </SheetDescription>
              </SheetHeader>

              <motion.nav
                aria-label="Mobile"
                variants={listVariants}
                initial="hidden"
                animate="show"
                className="flex-1 overflow-y-auto p-6"
              >
                <motion.p
                  variants={itemVariants}
                  className="px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                >
                  Catalog
                </motion.p>
                <ul className="mt-3 space-y-1">
                  {CATALOG_MENU.map((item) => (
                    <motion.li key={item.href} variants={itemVariants}>
                      <SheetClose
                        render={<Link href={item.href} />}
                        aria-current={isActive(item.href) ? "page" : undefined}
                        className={cn(
                          "flex min-h-11 items-center gap-3 rounded-lg px-2 py-2.5 text-base font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground aria-[current=page]:bg-muted",
                          FOCUS_RING
                        )}
                      >
                        <item.icon
                          className="size-5 text-muted-foreground"
                          strokeWidth={ICON_STROKE}
                          aria-hidden="true"
                        />
                        {item.label}
                      </SheetClose>
                    </motion.li>
                  ))}
                </ul>

                <ul className="mt-6 space-y-1 border-t border-border pt-6">
                  {NAV_LINKS.map((link) => (
                    <motion.li key={link.href} variants={itemVariants}>
                      <SheetClose
                        render={<Link href={link.href} />}
                        aria-current={isActive(link.href) ? "page" : undefined}
                        className={cn(
                          "flex min-h-11 items-center rounded-lg px-2 py-2.5 text-base font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground aria-[current=page]:bg-muted",
                          FOCUS_RING
                        )}
                      >
                        {link.label}
                      </SheetClose>
                    </motion.li>
                  ))}
                </ul>
              </motion.nav>

              <SheetFooter className="gap-3 border-t border-border p-6">
                <SheetClose
                  render={
                    <Button variant="outline" render={<Link href="/login" />} />
                  }
                  className="h-11 w-full text-base font-semibold"
                >
                  Sign in
                </SheetClose>
                <SheetClose
                  render={<Button render={<Link href="/signup" />} />}
                  className="h-11 w-full text-base font-semibold"
                >
                  Get started
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  )
}

export default Navbar
