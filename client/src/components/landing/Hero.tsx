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
      className="relative overflow-hidden bg-background mt-6"
    >
      <div
        aria-hidden="true"
       className="pointer-events-none absolute inset-y-0 top-12 right-0 hidden w-1/3 bg-footer lg:block"
      />

      <div className="relative mx-auto max-w-7xl px-6 py-16 md:py-20 lg:px-8 lg:py-24 xl:px-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16"
        >
          <div className="lg:col-span-7">
            <motion.span
              variants={itemVariants}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium text-muted-foreground shadow-sm"
            >

              <span className="relative flex size-2" aria-hidden="true">
                <span className="absolute inline-flex size-full rounded-full bg-primary opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-primary" />
              </span>
              Built for modern learning teams
            </motion.span>

            <motion.h1
              variants={itemVariants}
              id="hero-heading"
              className="mt-6 text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl"
            >
              Teach, learn, and grow on one platform
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8"
            >
              Publish courses, track every learner&apos;s progress, and issue
              certificates from a single workspace built for instructors,
              students, and administrators alike.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4"
            >
              {isLoggedIn ? (
                <Button
                  render={<Link
                    href={
                      role === "admin" || role === "instructor"
                        ? "/admin"
                        : "/dashboard"
                    }
                  />}
                  className="h-12 w-full px-6 text-base font-semibold sm:w-auto"
                >
                  Go to dashboard
                  <ArrowRight
                    className="size-5"
                    strokeWidth={ICON_STROKE}
                    aria-hidden="true"
                  />
                </Button>
              ) : (
                <>
                  <Button
                    render={<Link href="/sign-up" />}
                    className="h-12 w-full px-6 text-base font-semibold sm:w-auto"
                  >
                    Start learning free
                    <ArrowRight
                      className="size-5"
                      strokeWidth={ICON_STROKE}
                      aria-hidden="true"
                    />
                  </Button>

                  <Button
                    variant="outline"
                    render={<Link href="/courses" />}
                    className="h-12 w-full px-6 text-base font-semibold sm:w-auto"
                  >
                    <PlayCircle
                      className="size-5"
                      strokeWidth={ICON_STROKE}
                      aria-hidden="true"
                    />
                    Browse the catalog
                  </Button>
                </>
              )}
            </motion.div>

            <motion.div variants={itemVariants} className="mt-8">
              <p className="text-sm text-muted-foreground">
                Trusted by teams at every stage
              </p>
              <ul className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3">
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

          <motion.div
            variants={previewVariants}
            className="lg:col-span-5 "
          >
            <div className="overflow-hidden rounded-2xl border border-border bg-background p-2 shadow-sm ">
              <Image
                src={heroImage}
                alt="Course dashboard showing enrolled courses, lesson progress, and completion certificates"
                width={1080}
                height={720}
                priority
                 fetchPriority="high"  
                sizes="(min-width: 1024px) 800px, 100vw"
                className="h-auto w-full rounded-xl"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero
