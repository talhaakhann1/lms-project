import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile | Edvra",
  description:
    "Manage your profile, account details, and learning preferences on Edvra.",
};

export default function ExploreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}