import Image from "next/image";
import type React from "react";

type LogoProps = Omit<
  React.ComponentProps<typeof Image>,
  "src" | "alt"
>;

export const Logo = ({ className, ...props }: LogoProps) => (
  <>
    {/* Light theme */}
    <Image
      src="/logo/edvra-dark.png"
      alt="Edvra"
      width={200}
      height={50}
      priority
      className={`block h-auto w-auto dark:hidden ${className ?? ""}`}
      {...props}
    />

    {/* Dark theme */}
    <Image
      src="/logo/edvra-light.png"
      alt="Edvra"
      width={200}
      height={50}
      priority
      className={`hidden h-auto w-auto dark:block ${className ?? ""}`}
      {...props}
    />
  </>
);