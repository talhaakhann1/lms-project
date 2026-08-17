import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Edvra | Edvra",
  description:
    "Learn more about Edvra and our mission to make online learning simple, engaging, and accessible.",
};

export default function ExploreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}