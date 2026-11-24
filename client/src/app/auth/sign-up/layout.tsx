import type { Metadata } from "next";
import AuthInitializer from "../../AuthInitializer";
import { Header } from "@/src/components/layout/Header";

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
  return <>
  {children}
  </>;
}