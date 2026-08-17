import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Users | Edvra",
  description:
    "Manage students, administrators, and user accounts across the Edvra platform.",
};

export default function ExploreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}