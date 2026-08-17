import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | Edvra",
  description:
    "Sign in to your Edvra account and continue your learning journey.",
};

export default function ExploreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}