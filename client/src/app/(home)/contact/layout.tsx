import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Edvra",
  description:
    "Have a question or need help? Get in touch with the Edvra team.",
};

export default function ExploreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}