import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Separator } from "../../components/ui/separator"
import Link from "next/link"

export default function Footer() {
  const footerLinks = [
    { label: "Home", href: "/" },
    { label: "Explore Courses", href: "/courses" },
    { label: "Testimonials", href: "/#testimonials" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "FAQs", href: "/#faqs" },
    { label: "Sign In", href: "/sign-in" },
    { label: "Create Account", href: "/sign-up" },
  ];

  return (
    <footer className="bg-primary">
  <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-24 lg:px-8">

    {/* Main Footer */}
    <div className="grid grid-cols-12 gap-6 mb-8">
      <div className="col-span-12 animate-in fade-in slide-in-from-bottom-10 fill-mode-both duration-1000 delay-100 ease-in-out md:col-span-7">
        <h2 className="mb-6 text-3xl font-semibold text-primary-foreground sm:text-5xl">
          Start learning today and build skills that shape your future.
        </h2>

       <Button
  variant="outline"
  className="h-auto rounded-full border-white/20 bg-white/10 px-6 py-3.5 text-white hover:bg-white/20 hover:text-white"
>
  <Link href="/courses">Browse Courses</Link>
</Button>
      </div>

      <div className="md:col-span-1" />

      <div className="col-span-12 animate-in fade-in slide-in-from-bottom-10 fill-mode-both duration-1000 delay-100 ease-in-out md:col-span-2">
        <div className="flex flex-col gap-4">
          {footerLinks.slice(0, 4).map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-base text-primary-foreground transition-colors hover:text-primary-foreground/60"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="col-span-12 animate-in fade-in slide-in-from-bottom-10 fill-mode-both duration-1000 delay-200 ease-in-out md:col-span-2">
        <div className="flex flex-col gap-4">
          {footerLinks.slice(4).map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-base text-primary-foreground transition-colors hover:text-primary-foreground/60"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>

    {/* Bottom */}
    <div className="flex flex-col gap-12">
      <Separator className="bg-primary-foreground/20" />

      <div className="flex flex-col items-center justify-between gap-4 text-sm text-primary-foreground/70 md:flex-row">
        <p>
          © {new Date().getFullYear()} Edvra. All rights reserved.
        </p>
        <div className="flex items-center gap-6">
          <Link
            href="/privacy"
            className="transition-colors hover:text-primary-foreground"
          >
            Privacy
          </Link>

          <Link
            href="/terms"
            className="transition-colors hover:text-primary-foreground"
          >
            Terms
          </Link>

          <Link
            href="/contact"
            className="transition-colors hover:text-primary-foreground"
          >
            Contact
          </Link>
        </div>
      </div>
    </div>

  </div>
</footer>
  )
}