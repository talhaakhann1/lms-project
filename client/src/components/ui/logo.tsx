import Image from "next/image";
import type React from "react";
import { cn } from "../../lib/utils";

type LogoProps = Omit<React.ComponentProps<typeof Image>, "src" | "alt">;

export const Logo = ({ className, ...props }: LogoProps) => (
  <>
    {/* Dark text logo — light mode */}
    <Image
      src="/logo/edvra-dark.png"
      alt="Edvra"
      width={200}
      height={50}
      priority
      className={cn("object-contain block dark:hidden", className)}
      {...props}
    />

    {/* White text logo — dark mode */}
    <Image
      src="/logo/edvra-light.png"
      alt="Edvra"
      width={200}
      height={50}
      priority
      className={cn("object-contain hidden dark:block", className)}
      {...props}
    />
  </>
);