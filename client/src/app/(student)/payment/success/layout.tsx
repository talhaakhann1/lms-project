import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment | Edvra",
  description:
    "Complete your payment securely and get access to your Edvra course.",
};


export default function ExploreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}