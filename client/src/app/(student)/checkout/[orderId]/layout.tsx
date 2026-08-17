import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout | Edvra",
  description:
    "Review your course and complete your purchase securely with Edvra.",
};

export default function ExploreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}