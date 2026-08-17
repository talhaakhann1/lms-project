import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account | Edvra",
  description:
    "Create your Edvra account and start learning new skills today.",
};

export default function ExploreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}