import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manage Courses | Edvra",
  description:
    "Create, edit, publish, and manage courses across the Edvra learning platform.",
};

export default function ExploreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}