"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Loader2 } from "lucide-react";

import { cn } from "@/src/lib/utils";

const sizeMap = {
  sm: "size-4",
  md: "size-6",
  lg: "size-9",
  xl: "size-12",
} as const;

export type AppLoaderSize = keyof typeof sizeMap;

export interface AppLoaderProps {
  size?: AppLoaderSize;
  label?: string;
  centered?: boolean;
  className?: string;
}

export function AppLoader({
  size = "md",
  label,
  centered = true,
  className,
}: AppLoaderProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        "flex flex-col items-center gap-2.5",
        centered && "justify-center",
        className
      )}
    >
      <motion.span
        className="flex text-primary"
        animate={prefersReducedMotion ? undefined : { rotate: 360 }}
        transition={
          prefersReducedMotion
            ? undefined
            : { duration: 0.8, repeat: Infinity, ease: "linear" }
        }
      >
        <Loader2 className={sizeMap[size]} strokeWidth={2} />
      </motion.span>

      {label && (
        <span className="text-sm font-medium text-muted-foreground">
          {label}
        </span>
      )}

      <span className="sr-only">Loading</span>
    </div>
  );
}

export default AppLoader;