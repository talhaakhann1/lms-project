import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Orders | Edvra",
  description:
    "View and manage course orders and purchase activity on Edvra.",
};

export default function ExploreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}