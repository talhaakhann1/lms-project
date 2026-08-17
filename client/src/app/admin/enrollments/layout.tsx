import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Enrollments | Edvra",
  description:
    "View and manage course enrollments across the Edvra learning platform.",
};

export default function ExploreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}