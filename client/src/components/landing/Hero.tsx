"use client"
import Image from "next/image"
import Link from "next/link"
import { motion, useReducedMotion, type Variants } from "framer-motion"
import {
  ArrowRight,
  BadgeCheck,
  PlayCircle,
  Sparkles,
  Star,
  Users,
  type LucideIcon,
} from "lucide-react"

import { Button } from "../../components/ui/button"
import { useAppSelector } from "@/src/store/hook"
import heroImage from "@/public/images/illustrations/hero-home.webp";


interface TrustIndicator {
  label: string
  icon: LucideIcon
}

const TRUST_INDICATORS: TrustIndicator[] = [
  { label: "500+ active learners", icon: Users },
  { label: "4.8 average course rating", icon: Star },
  { label: "Verified certificates", icon: BadgeCheck },
];

const ICON_STROKE = 1.75

export function Hero() {
  const prefersReducedMotion = useReducedMotion()

  const containerVariants: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
  }

  const itemVariants: Variants = prefersReducedMotion
    ? {
      hidden: { opacity: 0 },
      show: { opacity: 1, transition: { duration: 0.3, ease: "easeOut" } },
    }
    : {
      hidden: { opacity: 0, y: 16 },
      show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
    }

  const previewVariants: Variants = prefersReducedMotion
    ? {
      hidden: { opacity: 0 },
      show: { opacity: 1, transition: { duration: 0.3, ease: "easeOut", delay: 0.2 } },
    }
    : {
      hidden: { opacity: 0, y: 24 },
      show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut", delay: 0.35 },
      },
    }

  const user = useAppSelector((state) => state.auth)
  const role = user?.user?.role
  const isLoggedIn = user.isLoggedIn

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden bg-background"
    >
      {/* Right-side background panel — bleeds to viewport right edge */}
      <div
        aria-hidden="true"
        className="absolute inset-y-0 right-0 z-0 hidden bg-primary lg:block"
        style={{
          left: "max(0px, calc((100vw - 1280px) / 2 + 760px))",
        }}
      />
 
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid py-16 lg:grid-cols-[minmax(0,1fr)_clamp(400px,38vw,520px)] lg:gap-16 lg:py-24"
        >
          {/* ── Left column ── */}
          <div className="flex flex-col justify-between gap-8 pb-6">
            <div className="flex flex-col gap-8">
 
              {/* Badge + headline + description — gap-4 matches Zippay's inner spacing */}
              <div className="flex flex-col items-start gap-4">
                <motion.span
                  variants={itemVariants}
                  className="inline-flex h-8 items-center gap-2 rounded-[10px] border border-border bg-card px-3 text-xs font-medium text-muted-foreground shadow-sm"
                >
                  <span className="relative flex size-1.5" aria-hidden="true">
                    <span className="absolute inline-flex size-full rounded-full bg-primary opacity-60" />
                    <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
                  </span>
                  Built for modern learning teams
                </motion.span>
 
                <motion.h1
                  variants={itemVariants}
                  id="hero-heading"
                  className="text-[40px] font-bold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-[68px] lg:leading-[125%]"
                >
                  Skills That Drive Growth
                </motion.h1>
 
                <motion.p
                  variants={itemVariants}
                  className="max-w-xl text-base leading-relaxed text-muted-foreground"
                >
                  Publish courses, track every learner&apos;s progress, and
                  issue certificates from a single workspace built for
                  instructors, students, and administrators alike.
                </motion.p>
              </div>
 
              {/* CTA buttons — h-[52px] rounded-[16px] matches Zippay exactly */}
              <motion.div
                variants={itemVariants}
                className="flex flex-col gap-3 sm:flex-row sm:gap-4"
              >
                {isLoggedIn ? (
                  <Button
                    render={
                      <Link
                        href={
                          role === "admin" || role === "instructor"
                            ? "/admin"
                            : "/dashboard"
                        }
                      />
                    }
                    className="h-[52px] w-full rounded-[16px] px-6 text-sm font-semibold sm:w-auto"
                  >
                    Go to dashboard
                    <ArrowRight className="size-4" strokeWidth={ICON_STROKE} aria-hidden="true" />
                  </Button>
                ) : (
                  <>
                    <Button
                      render={<Link href="/sign-up" />}
                      className="h-[52px] w-full rounded-[16px] px-6 text-sm font-semibold sm:w-auto"
                    >
                      Start learning free
                      <ArrowRight className="size-4" strokeWidth={ICON_STROKE} aria-hidden="true" />
                    </Button>
 
                    <Button
                      variant="outline"
                      render={<Link href="/courses" />}
                      className="h-[52px] w-full rounded-[16px] border-border px-6 text-sm font-semibold sm:w-auto"
                    >
                      <PlayCircle className="size-4" strokeWidth={ICON_STROKE} aria-hidden="true" />
                      Browse the catalog
                    </Button>
                  </>
                )}
              </motion.div>
            </div>
 
            {/* Trust indicators */}
            <motion.div variants={itemVariants} className="flex flex-col gap-4">
              <p className="text-sm text-muted-foreground">
                Trusted by teams at every stage
              </p>
              <ul className="flex flex-wrap items-center gap-x-6 gap-y-3">
                {TRUST_INDICATORS.map((indicator) => (
                  <li
                    key={indicator.label}
                    className="flex items-center gap-2 text-sm font-medium text-foreground"
                  >
                    <indicator.icon
                      className="size-4 text-muted-foreground"
                      strokeWidth={ICON_STROKE}
                      aria-hidden="true"
                    />
                    {indicator.label}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
 
          {/* ── Right column — image panel ── */}
          <div className="min-w-0">
            <div className="relative h-full">
              {/* Mobile full-bleed strip behind image */}
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-1/2 z-0 w-screen -translate-x-1/2 lg:hidden"
              />
 
              <motion.div
                variants={previewVariants}
                className="relative z-10 flex w-full justify-center py-6 lg:justify-start lg:py-0"
              >
                <div className="overflow-hidden rounded-2xl border border-border bg-background p-2 shadow-sm w-full">
                  <Image
                    src={heroImage}
                    alt="Course dashboard showing enrolled courses, lesson progress, and completion certificates"
                    width={1080}
                    height={720}
                    priority
                    fetchPriority="high"
                    sizes="(min-width: 1024px) 520px, 100vw"
                    className="h-auto w-full rounded-xl"
                  />
                </div>
              </motion.div>
            </div>
          </div>
 
        </motion.div>
      </div>
    </section>
  )
}

export default Hero
