import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore Courses | Edvra",
  description:
    "Explore courses, discover new skills, and find your next learning opportunity with Edvra.",
};

export default function ExploreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}